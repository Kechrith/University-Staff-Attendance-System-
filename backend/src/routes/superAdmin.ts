import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ROLE_KEY } from "../roleMap.js";

export const superAdminRouter = Router();
superAdminRouter.use(requireAuth, requireRole("SUPER_ADMIN"));

async function logAction(actorId: string, action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT", target: string) {
  await prisma.auditLogEntry.create({ data: { actorId, action, target } });
}

// ---- Notifications ----
superAdminRouter.get("/notifications", async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    notifications.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      timestamp: n.createdAt.toLocaleString(),
      read: n.read,
    })),
  );
});

// ---- Dashboard ----
superAdminRouter.get("/dashboard-summary", async (req, res) => {
  const [totalFaculties, totalDepartments, totalUserAccounts, activeDisputes, sessionsThisWeek] = await Promise.all([
    prisma.faculty.count(),
    prisma.department.count(),
    prisma.user.count({ where: { NOT: { id: req.user!.id } } }),
    prisma.dispute.count({ where: { status: { in: ["FLAGGED", "ESCALATED", "IN_REVIEW"] } } }),
    prisma.classSession.count(),
  ]);
  res.json({
    totalFaculties,
    totalDepartments,
    totalUserAccounts,
    activeDisputes,
    activeDisputesTrendLabel: activeDisputes > 0 ? `${activeDisputes} open` : "All clear",
    sessionsThisWeek,
  });
});

superAdminRouter.get("/dashboard/recent-activity", async (_req, res) => {
  const entries = await prisma.auditLogEntry.findMany({ orderBy: { timestamp: "desc" }, take: 5, include: { actor: true } });
  res.json(
    entries.map((entry) => ({
      id: entry.id,
      actor: entry.actor.name,
      action: entry.target,
      timestamp: entry.timestamp.toLocaleString(),
      tone: entry.action === "DELETE" ? "warning" : "info",
    })),
  );
});

// ---- Users ----
superAdminRouter.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    where: { NOT: { id: req.user!.id } },
    include: { department: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: ROLE_KEY[u.role],
      department: u.department?.name ?? "—",
      status: u.status.toLowerCase(),
    })),
  );
});

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["SUPER_ADMIN", "DEPARTMENT_HEAD", "PROGRAM_COORDINATOR", "LECTURER", "CLASS_MONITOR"]),
  password: z.string().min(8),
});

superAdminRouter.post("/users", async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const department = await prisma.department.findFirst();
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      departmentId: department?.id,
    },
  });
  await logAction(req.user!.id, "CREATE", `Created account: ${user.name}`);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: ROLE_KEY[user.role], status: user.status.toLowerCase() });
});

const updateUserSchema = z.object({ status: z.enum(["ACTIVE", "SUSPENDED", "PENDING"]) });

superAdminRouter.patch("/users/:id", async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { status: parsed.data.status } });
  await logAction(req.user!.id, "UPDATE", `${parsed.data.status === "SUSPENDED" ? "Suspended" : "Reactivated"} account: ${user.name}`);
  res.json({ id: user.id, status: user.status.toLowerCase() });
});

// ---- Class Monitor Assignments ----
superAdminRouter.get("/users/class-monitor-assignments", async (_req, res) => {
  const classes = await prisma.class.findMany({ include: { department: true, monitor: true } });
  res.json(
    classes.map((c) => ({
      id: c.id,
      className: c.name,
      department: c.department.name,
      currentMonitor: c.monitor?.name ?? null,
      status: c.monitor ? "assigned" : "unassigned",
    })),
  );
});

const assignMonitorSchema = z.object({ monitorName: z.string().min(1) });

superAdminRouter.patch("/users/class-monitor-assignments/:classId", async (req, res) => {
  const parsed = assignMonitorSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const monitor = await prisma.user.findFirst({ where: { name: parsed.data.monitorName, role: "CLASS_MONITOR" } });
  if (!monitor) {
    res.status(404).json({ error: "Class Monitor account not found" });
    return;
  }
  const updated = await prisma.class.update({ where: { id: req.params.classId }, data: { monitorId: monitor.id } });
  await logAction(req.user!.id, "UPDATE", `Assigned ${monitor.name} to ${updated.name}`);
  res.json({ id: updated.id, currentMonitor: monitor.name, status: "assigned" });
});

// ---- Organization ----
superAdminRouter.get("/organization/units", async (_req, res) => {
  const faculties = await prisma.faculty.findMany({
    include: {
      departments: { include: { classes: true } },
      centers: true,
    },
  });

  res.json(
    faculties.map((faculty) => ({
      id: faculty.id,
      name: faculty.name,
      type: "faculty",
      children: [
        ...faculty.departments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          type: "department",
          children: dept.classes.map((cls) => ({ id: cls.id, name: cls.name, type: "class", children: [] })),
        })),
        ...faculty.centers.map((center) => ({ id: center.id, name: center.name, type: "center", children: [] })),
      ],
    })),
  );
});

const createClassSchema = z.object({ name: z.string().min(1) });

superAdminRouter.post("/organization/units", async (req, res) => {
  const parsed = createClassSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const department = await prisma.department.findFirst();
  if (!department) {
    res.status(500).json({ error: "No department exists to attach this class to" });
    return;
  }
  const code = parsed.data.name.split(" ")[0] ?? parsed.data.name;
  const created = await prisma.class.create({ data: { code, name: parsed.data.name, departmentId: department.id } });
  await logAction(req.user!.id, "CREATE", `Added class: ${created.name}`);
  res.status(201).json({ id: created.id, name: created.name, type: "class", children: [] });
});

// ---- Timetable ----
superAdminRouter.get("/timetable", async (_req, res) => {
  const sessions = await prisma.classSession.findMany({ include: { class: true, lecturer: true } });
  const semesterLabel = sessions[0]?.semesterLabel ?? "Semester Timetable";
  const timeSlots = Array.from(new Set(sessions.map((s) => `${s.startTime} – ${s.endTime}`))).sort();
  const slots = sessions.map((s) => ({
    day: s.dayOfWeek,
    time: `${s.startTime} – ${s.endTime}`,
    courseLabel: s.class.name,
    lecturerLabel: s.lecturer.name,
    roomLabel: s.room,
  }));
  res.json({ semesterLabel, timeSlots, slots });
});

superAdminRouter.get("/timetable/changes", async (_req, res) => {
  const entries = await prisma.auditLogEntry.findMany({
    where: { target: { contains: "session", mode: "insensitive" } },
    orderBy: { timestamp: "desc" },
    take: 5,
  });
  const CHANGE_TYPE = { CREATE: "added", UPDATE: "moved", DELETE: "cancelled" } as const;
  res.json(
    entries.map((entry) => ({
      id: entry.id,
      description: entry.target,
      changeType: CHANGE_TYPE[entry.action as keyof typeof CHANGE_TYPE] ?? "added",
      timestamp: entry.timestamp.toLocaleString(),
    })),
  );
});

const addSessionSchema = z.object({
  course: z.string().min(1),
  lecturer: z.string().min(1),
  day: z.string().min(1),
  time: z.string().min(1),
  room: z.string().min(1),
});

superAdminRouter.post("/timetable/sessions", async (req, res) => {
  const parsed = addSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { course, lecturer, day, time, room } = parsed.data;
  const code = course.split(" ")[0];
  const [startTime, endTime] = time.split(" – ").map((part) => part.trim());

  const [classRecord, lecturerRecord] = await Promise.all([
    prisma.class.findFirst({ where: { code } }),
    prisma.user.findFirst({ where: { name: lecturer, role: "LECTURER" } }),
  ]);
  if (!classRecord || !lecturerRecord) {
    res.status(404).json({ error: "Class or lecturer not found" });
    return;
  }

  const session = await prisma.classSession.create({
    data: {
      classId: classRecord.id,
      lecturerId: lecturerRecord.id,
      dayOfWeek: day,
      startTime: startTime ?? time,
      endTime: endTime ?? time,
      room,
      semesterLabel: "Semester 1, 2026–2027",
    },
  });
  await logAction(req.user!.id, "CREATE", `Added ${classRecord.name} on ${day} ${time}`);
  res.status(201).json({ id: session.id, day, time, courseLabel: classRecord.name, lecturerLabel: lecturerRecord.name, roomLabel: room });
});

// ---- Disputes ----
superAdminRouter.get("/disputes", async (_req, res) => {
  const disputes = await prisma.dispute.findMany({
    where: { status: { in: ["ESCALATED", "IN_REVIEW"] } },
    include: { raisedBy: true, attendanceRecord: { include: { session: { include: { class: { include: { department: true } } } } } } },
  });
  res.json(
    disputes.map((d) => ({
      id: d.id,
      subject: `Attendance marked ${d.attendanceRecord.status.charAt(0)}${d.attendanceRecord.status.slice(1).toLowerCase()} for ${d.attendanceRecord.date.toLocaleDateString()} session`,
      raisedBy: d.raisedBy.name,
      department: d.attendanceRecord.session.class.department.name,
      status: d.status === "ESCALATED" ? "escalated" : "in-review",
      daysOpen: Math.max(1, Math.floor((Date.now() - d.createdAt.getTime()) / 86_400_000)),
    })),
  );
});

superAdminRouter.get("/disputes/stats", async (_req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [openCount, resolvedThisMonth, overdueCount] = await Promise.all([
    prisma.dispute.count({ where: { status: { in: ["ESCALATED", "IN_REVIEW"] } } }),
    prisma.dispute.count({ where: { status: "RESOLVED", resolvedAt: { gte: startOfMonth } } }),
    prisma.dispute.count({ where: { status: { in: ["ESCALATED", "IN_REVIEW"] }, createdAt: { lt: new Date(Date.now() - 5 * 86_400_000) } } }),
  ]);
  res.json({ openCount, resolvedThisMonth, overdueCount });
});

const resolveDisputeSchema = z.object({ decision: z.string().min(1), status: z.enum(["RESOLVED", "IN_REVIEW"]) });

superAdminRouter.patch("/disputes/:id", async (req, res) => {
  const parsed = resolveDisputeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const dispute = await prisma.dispute.update({
    where: { id: req.params.id },
    data: {
      status: parsed.data.status,
      coordinatorDecision: parsed.data.decision,
      resolvedAt: parsed.data.status === "RESOLVED" ? new Date() : null,
    },
  });
  await logAction(req.user!.id, "UPDATE", `Dispute ${dispute.id} marked ${parsed.data.status.toLowerCase()}`);
  res.json({ id: dispute.id, status: dispute.status.toLowerCase() });
});

// ---- Audit Log (read-only, per BR-7) ----
superAdminRouter.get("/audit-log", async (_req, res) => {
  const entries = await prisma.auditLogEntry.findMany({ include: { actor: true }, orderBy: { timestamp: "desc" }, take: 50 });
  res.json(
    entries.map((entry) => ({
      id: entry.id,
      actor: entry.actor.name,
      actorRole: ROLE_KEY[entry.actor.role],
      action: entry.action.toLowerCase(),
      target: entry.target,
      timestamp: entry.timestamp.toLocaleString(),
    })),
  );
});

// ---- Settings ----
superAdminRouter.get("/settings/profile", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ fullName: user.name, universityEmail: user.email, employeeId: user.employeeId ?? "—", bio: user.bio ?? "" });
});

superAdminRouter.get("/settings/system-config", async (_req, res) => {
  const config = await prisma.systemConfiguration.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  res.json({
    attendanceWindowMinutes: config.attendanceWindowMinutes,
    disputeWindowDays: config.disputeWindowDays,
    digestScheduleLabel: config.digestScheduleLabel,
    digestEnabled: config.digestEnabled,
  });
});

const systemConfigSchema = z.object({
  attendanceWindowMinutes: z.number().int().min(0),
  disputeWindowDays: z.number().int().min(0),
  digestScheduleLabel: z.string().min(1),
  digestEnabled: z.boolean(),
});

superAdminRouter.patch("/settings/system-config", async (req, res) => {
  const parsed = systemConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const config = await prisma.systemConfiguration.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  await logAction(req.user!.id, "UPDATE", "Updated system configuration");
  res.json(config);
});

superAdminRouter.get("/settings/security", async (_req, res) => {
  res.json([
    { id: "2fa", title: "Two-Factor Authentication", description: "Require 2FA for all Super Admin and Program Coordinator accounts.", enabled: true },
    { id: "lockout", title: "Failed Login Lockout", description: "Lock an account after 5 consecutive failed sign-in attempts (NFR-6).", enabled: true },
    { id: "ip-allowlist", title: "IP Allowlist for Admin Console", description: "Restrict Super Admin access to the campus network range.", enabled: false },
  ]);
});
