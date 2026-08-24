import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const lecturerRouter = Router();
lecturerRouter.use(requireAuth, requireRole("LECTURER"));

async function logAction(actorId: string, action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT", target: string) {
  await prisma.auditLogEntry.create({ data: { actorId, action, target } });
}

const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const FULL_TO_SHORT_DAY: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

function formatDuration(start: Date, end: Date): string {
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  return `${days} day${days === 1 ? "" : "s"}`;
}

// ---- Notifications ----
lecturerRouter.get("/notifications", async (req, res) => {
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
lecturerRouter.get("/dashboard-summary", async (req, res) => {
  const [allRecords, weeklySessions, approvedLeaves, pendingPermissions, pendingDisputes] = await Promise.all([
    prisma.attendanceRecord.findMany({ where: { session: { lecturerId: req.user!.id } } }),
    prisma.classSession.findMany({ where: { lecturerId: req.user!.id } }),
    prisma.leaveRequest.findMany({ where: { userId: req.user!.id, status: "APPROVED" } }),
    prisma.leaveRequest.count({ where: { userId: req.user!.id, status: "PENDING" } }),
    prisma.dispute.count({ where: { raisedById: req.user!.id, status: { not: "RESOLVED" } } }),
  ]);

  const completedSessions = allRecords.length;
  const weeklyCount = weeklySessions.length;
  const totalSemesterSessions = weeklyCount * 15; // Standard 15-week semester

  const presentCount = allRecords.filter((r) => r.status === "PRESENT").length;
  const lateCount = allRecords.filter((r) => r.status === "LATE").length;
  const absentCount = allRecords.filter((r) => r.status === "ABSENT").length;
  const permissionCount = approvedLeaves.length;

  res.json({
    completedSessions,
    totalSemesterSessions,
    weeklyCount,
    presentCount,
    lateCount,
    absentCount,
    permissionCount,
    pendingPermissions,
    pendingDisputes,
  });
});

lecturerRouter.get("/todays-classes", async (req, res) => {
  const todayFull = FULL_DAY_NAMES[new Date().getDay()];
  const sessions = await prisma.classSession.findMany({
    where: { lecturerId: req.user!.id, dayOfWeek: todayFull },
    include: { class: true },
    orderBy: { startTime: "asc" },
  });
  const nowLabel = new Date().toTimeString().slice(0, 5);

  res.json(
    sessions.map((s) => {
      const status = nowLabel < s.startTime ? "upcoming" : nowLabel <= s.endTime ? "ongoing" : "completed";
      return {
        id: s.id,
        course: s.class.name,
        classCode: s.class.code,
        timeSlotLabel: `${s.startTime} – ${s.endTime}`,
        room: s.room,
        status,
      };
    }),
  );
});

// ---- Attendance records ----
lecturerRouter.get("/attendance-records", async (req, res) => {
  const records = await prisma.attendanceRecord.findMany({
    where: { session: { lecturerId: req.user!.id } },
    include: { session: { include: { class: true } }, loggedBy: true, dispute: true },
    orderBy: { date: "desc" },
  });

  res.json(
    records.map((r) => ({
      id: r.id,
      date: r.date.toISOString().slice(0, 10),
      course: r.session.class.name,
      classCode: r.session.class.code,
      timeSlotLabel: `${r.session.startTime} – ${r.session.endTime}`,
      status: r.status.toLowerCase(),
      lessonSummary: r.lessonSummary ?? "",
      loggedBy: r.loggedBy.name,
      disputeStatus: !r.dispute ? "none" : r.dispute.status === "RESOLVED" ? "resolved" : "flagged",
      disputeReason: r.dispute?.reason,
    })),
  );
});

const disputeSchema = z.object({ reason: z.string().min(1) });

lecturerRouter.post("/attendance-records/:id/dispute", async (req, res) => {
  const parsed = disputeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const record = await prisma.attendanceRecord.findUnique({
    where: { id: req.params.id },
    include: { session: true, dispute: true },
  });
  if (!record) {
    res.status(404).json({ error: "Attendance record not found" });
    return;
  }
  if (record.session.lecturerId !== req.user!.id) {
    res.status(403).json({ error: "You can only dispute your own attendance records" });
    return;
  }
  if (record.dispute) {
    res.status(409).json({ error: "This record already has a dispute" });
    return;
  }

  await prisma.dispute.create({
    data: { attendanceRecordId: record.id, raisedById: req.user!.id, reason: parsed.data.reason, status: "FLAGGED" },
  });
  await logAction(req.user!.id, "CREATE", `Disputed attendance record for ${record.date.toLocaleDateString()}`);
  res.status(204).end();
});

// ---- Weekly schedule ----
lecturerRouter.get("/schedule-grid", async (req, res) => {
  const weekOffsetRaw = Number(req.query.week);
  const weekOffset = Number.isFinite(weekOffsetRaw) ? weekOffsetRaw : 0;

  const sessions = await prisma.classSession.findMany({
    where: { lecturerId: req.user!.id },
    include: { class: true },
  });

  const timeSlots = Array.from(new Set(sessions.map((s) => `${s.startTime} – ${s.endTime}`))).sort();
  const slots = sessions.map((s) => ({
    id: s.id,
    day: FULL_TO_SHORT_DAY[s.dayOfWeek] ?? s.dayOfWeek,
    time: `${s.startTime} – ${s.endTime}`,
    title: s.class.name,
    subtitle: s.room,
    status: "class" as const,
  }));

  const now = new Date();
  const diffToMonday = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday + weekOffset * 7);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const weekRangeLabel = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${friday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  res.json({ weekRangeLabel, timeSlots, slots });
});

// ---- Settings ----
lecturerRouter.get("/profile", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { department: true } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    fullName: user.name,
    position: user.position ?? "Lecturer",
    department: user.department?.name ?? "—",
    universityEmail: user.email,
    employeeId: user.employeeId ?? "—",
    phone: user.phone ?? "—",
    bio: user.bio ?? "",
  });
});

lecturerRouter.get("/access-session", async (req, res) => {
  const [user, lastLogin] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.user!.id } }),
    prisma.auditLogEntry.findFirst({ where: { actorId: req.user!.id, action: "LOGIN" }, orderBy: { timestamp: "desc" } }),
  ]);
  res.json({
    lastLoginLabel: lastLogin ? lastLogin.timestamp.toLocaleString() : "No recent login recorded",
    notifyOnNewEntry: user?.notifyOnNewLogin ?? true,
  });
});

// No dedicated alert-routing table is wired up yet (same precedent as the
// static /security list below) — this list is display-only for now; each
// item just links out to a "coming soon" toast in the UI.
lecturerRouter.get("/alert-preferences", async (_req, res) => {
  res.json([
    {
      id: "new-entry",
      title: "New Attendance Entry",
      description: "Get notified when a Class Monitor logs a new attendance record for your classes.",
    },
    {
      id: "dispute-update",
      title: "Dispute Status Updates",
      description: "Get notified when a flagged entry is reviewed or resolved.",
    },
    {
      id: "leave-decision",
      title: "Leave Request Decisions",
      description: "Get notified when your leave request is approved or rejected.",
    },
    {
      id: "schedule-change",
      title: "Schedule Changes",
      description: "Get notified when your weekly teaching schedule is updated.",
    },
  ]);
});

lecturerRouter.get("/security", async (_req, res) => {
  res.json([
    { id: "password", title: "Change Password", description: "Last changed 3 months ago.", actionLabel: "Update password" },
    { id: "2fa", title: "Two-Factor Authentication", description: "Add an extra layer of security to your account.", actionLabel: "Enable 2FA" },
    { id: "login-history", title: "Login History", description: "Review recent sign-ins to your account.", actionLabel: "View history" },
  ]);
});

// ---- Leave ----
lecturerRouter.get("/leave/summary", async (req, res) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const ANNUAL_LEAVE_ALLOWANCE_DAYS = 18; // no allowance field on the schema yet; kept as a fixed default

  const [pendingCount, approvedThisYear, approvedRequests] = await Promise.all([
    prisma.leaveRequest.count({ where: { userId: req.user!.id, status: "PENDING" } }),
    prisma.leaveRequest.count({ where: { userId: req.user!.id, status: "APPROVED", decidedAt: { gte: startOfYear } } }),
    prisma.leaveRequest.findMany({ where: { userId: req.user!.id, status: "APPROVED" } }),
  ]);

  const usedDays = approvedRequests.reduce(
    (sum, lr) => sum + (Math.round((lr.endDate.getTime() - lr.startDate.getTime()) / 86_400_000) + 1),
    0,
  );
  const remainingDays = Math.max(ANNUAL_LEAVE_ALLOWANCE_DAYS - usedDays, 0);

  res.json({ remainingDays, usedDays, pendingCount, approvedThisYear });
});

lecturerRouter.get("/leave/requests", async (req, res) => {
  const requests = await prisma.leaveRequest.findMany({
    where: { userId: req.user!.id },
    orderBy: { requestedAt: "desc" },
  });
  res.json(
    requests.map((lr) => ({
      id: lr.id,
      leaveType: lr.leaveType,
      startDate: lr.startDate.toISOString().slice(0, 10),
      endDate: lr.endDate.toISOString().slice(0, 10),
      duration: formatDuration(lr.startDate, lr.endDate),
      reason: lr.reason,
      status: lr.status.toLowerCase(),
      requestedAt: lr.requestedAt.toISOString(),
    })),
  );
});

const leaveRequestSchema = z.object({
  leaveType: z.enum(["Sick Leave", "Annual Leave", "Maternity Leave", "Emergency Leave", "Unpaid Leave", "Research"]),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.string().min(1),
});

lecturerRouter.post("/leave/requests", async (req, res) => {
  const parsed = leaveRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { leaveType, startDate, endDate, reason } = parsed.data;

  await prisma.leaveRequest.create({
    data: {
      userId: req.user!.id,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "PENDING",
    },
  });
  await logAction(req.user!.id, "CREATE", `Requested ${leaveType} (${startDate} – ${endDate})`);
  res.status(204).end();
});
