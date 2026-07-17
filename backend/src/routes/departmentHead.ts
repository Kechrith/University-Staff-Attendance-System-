import { Router } from "express";
import { z } from "zod";
import { Prisma, type Role } from "@prisma/client";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const departmentHeadRouter = Router();
departmentHeadRouter.use(requireAuth, requireRole("DEPARTMENT_HEAD"));

async function logAction(actorId: string, action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT", target: string) {
  await prisma.auditLogEntry.create({ data: { actorId, action, target } });
}

// ---- Shared helpers ----

/** Display labels for the role picker / staff roster (spaces, not the dashed `ROLE_KEY` slugs). */
const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  DEPARTMENT_HEAD: "Department Head",
  PROGRAM_COORDINATOR: "Program Coordinator",
  LECTURER: "Lecturer",
  CLASS_MONITOR: "Class Monitor",
};

/** Staff roles that can be "tracked" for classroom-derived attendance. The Department Head themself doesn't teach or log attendance. */
const TRACKABLE_ROLES: Role[] = ["PROGRAM_COORDINATOR", "LECTURER", "CLASS_MONITOR"];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Drops the "Department of " prefix so labels read like "Data Science and Engineering" instead of the full formal name. */
function shortDeptName(name: string): string {
  return name.replace(/^Department of /, "");
}

function formatTimeAmPm(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function computeWorkingHours(start: string, end: string): string {
  const total = Math.max(0, minutesBetween(start, end));
  return `${Math.floor(total / 60)}h ${total % 60}m`;
}

/** Parses a "hh:mm AM/PM" label back into minutes-since-midnight, for sorting generated time slots. */
function to24hMinutes(label: string): number {
  const match = label.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let h = Number(match[1]);
  const m = Number(match[2]);
  const period = match[3]!.toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function nextOccurrenceDate(dayOfWeek: string, from: Date): Date {
  const targetIdx = DAY_NAMES.indexOf(dayOfWeek);
  const fromIdx = from.getDay();
  const diff = (targetIdx - fromIdx + 7) % 7;
  const d = new Date(from);
  d.setDate(d.getDate() + diff);
  return d;
}

function formatUpdatedLabel(date: Date): string {
  const now = new Date();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (date.toDateString() === now.toDateString()) return `Today, ${time}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

async function getDepartment() {
  const department = await prisma.department.findFirst();
  if (!department) throw new Error("No department configured");
  return department;
}

type AttendanceRecordWithSession = Prisma.AttendanceRecordGetPayload<{ include: { session: true } }>;
type LeaveRequestWithUser = Prisma.LeaveRequestGetPayload<{ include: { user: true } }>;

/** All AttendanceRecord rows belonging to this department's class sessions, optionally scoped to a date range. */
async function departmentAttendanceRecords(departmentId: string, from?: Date, to?: Date): Promise<AttendanceRecordWithSession[]> {
  return prisma.attendanceRecord.findMany({
    where: {
      session: { class: { departmentId } },
      ...(from || to ? { date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    },
    include: { session: true },
  });
}

/**
 * Derives each trackable staff member's status for a specific calendar date. There is no dedicated
 * check-in table, so AttendanceRecord rows are treated as evidence of presence: a LECTURER is
 * present/late/absent per their ClassSession's records that day; a CLASS_MONITOR who logged a
 * session that day was themself on duty (present). An approved LeaveRequest covering the date wins
 * over everything else. No evidence at all (no record, no leave) defaults to "absent" — the Program
 * Coordinator never teaches or logs attendance, so they always fall into this default unless on leave.
 */
async function deriveStaffStatusForDate(departmentId: string, date: Date) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const [staff, records, approvedLeaves] = await Promise.all([
    prisma.user.findMany({ where: { departmentId, role: { in: TRACKABLE_ROLES } }, orderBy: { createdAt: "asc" } }),
    departmentAttendanceRecords(departmentId, dayStart, dayEnd),
    prisma.leaveRequest.findMany({ where: { status: "APPROVED", startDate: { lte: dayEnd }, endDate: { gte: dayStart } } }),
  ]);

  const leaveUserIds = new Set(approvedLeaves.map((l) => l.userId));

  return staff.map((member) => {
    if (leaveUserIds.has(member.id)) {
      return { user: member, status: "leave" as const, record: null as AttendanceRecordWithSession | null };
    }
    const own =
      member.role === "LECTURER"
        ? records.filter((r) => r.session.lecturerId === member.id)
        : member.role === "CLASS_MONITOR"
          ? records.filter((r) => r.loggedById === member.id)
          : [];
    if (own.length === 0) {
      return { user: member, status: "absent" as const, record: null as AttendanceRecordWithSession | null };
    }
    const status = own.some((r) => r.status === "ABSENT") ? "absent" : own.some((r) => r.status === "LATE") ? "late" : "present";
    return { user: member, status: status as "present" | "late" | "absent", record: own[0]! };
  });
}

/** Shapes today's derived staff statuses into the frontend's `AttendanceRecord` rows (used by both the dashboard preview and the full attendance log). */
async function buildTodayAttendanceRecords(department: Awaited<ReturnType<typeof getDepartment>>) {
  const today = new Date();
  const derived = await deriveStaffStatusForDate(department.id, today);
  const dateLabel = isoDate(today);

  return derived.map((entry) => {
    const position = `${entry.user.position ?? ROLE_LABEL[entry.user.role]}, ${shortDeptName(department.name)}`;
    const base = {
      id: `att-${entry.user.id}`,
      staffId: entry.user.id,
      staffName: entry.user.name,
      employeeId: entry.user.employeeId ?? "—",
      avatar: entry.user.avatarUrl ?? "",
      position,
      date: dateLabel,
    };

    if (entry.status === "present" || entry.status === "late") {
      const session = entry.record?.session;
      return {
        ...base,
        checkIn: session ? formatTimeAmPm(session.startTime) : null,
        checkOut: session ? formatTimeAmPm(session.endTime) : null,
        workingHours: session ? computeWorkingHours(session.startTime, session.endTime) : "—",
        status: entry.status,
        ...(entry.status === "late" ? { lateMinutes: department.lateThresholdMinutes } : {}),
      };
    }

    return { ...base, checkIn: null, checkOut: null, workingHours: "—", status: entry.status };
  });
}

function leaveDuration(start: Date, end: Date): string {
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  return `${days} day${days === 1 ? "" : "s"}`;
}

function mapLeaveRequest(lr: LeaveRequestWithUser, departmentName: string) {
  return {
    id: lr.id,
    staffId: lr.userId,
    staffName: lr.user.name,
    employeeId: lr.user.employeeId ?? "—",
    avatar: lr.user.avatarUrl ?? "",
    position: `${lr.user.position ?? ROLE_LABEL[lr.user.role]}, ${shortDeptName(departmentName)}`,
    leaveType: lr.leaveType,
    startDate: isoDate(lr.startDate),
    endDate: isoDate(lr.endDate),
    duration: leaveDuration(lr.startDate, lr.endDate),
    reason: lr.reason,
    status: lr.status.toLowerCase(),
    requestedAt: lr.requestedAt.toISOString(),
  };
}

function inferActivityType(entry: { action: string; target: string }) {
  const t = entry.target.toLowerCase();
  if (t.includes("leave") && t.includes("approved")) return "leave-approved" as const;
  if (t.includes("leave") && t.includes("rejected")) return "leave-rejected" as const;
  if (t.includes("report")) return "report-generated" as const;
  if (t.includes("attendance")) return "check-in" as const;
  if (entry.action === "CREATE" && t.includes("account")) return "staff-added" as const;
  return "attendance-updated" as const;
}

function averageTimeLabel(records: AttendanceRecordWithSession[]): string {
  if (records.length === 0) return "—";
  const totalMinutes = records.reduce((sum, r) => sum + minutesBetween("00:00", r.session.startTime), 0);
  const avg = Math.round(totalMinutes / records.length);
  const h = Math.floor(avg / 60);
  const m = avg % 60;
  return formatTimeAmPm(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

/** Weekly attendance-rate buckets (oldest first), used by the dashboard's "Attendance Trend" chart. */
async function weeklyAttendanceRateBuckets(departmentId: string, weeks: number) {
  const buckets = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const end = endOfDay(new Date(Date.now() - i * 7 * 86_400_000));
    const start = startOfDay(new Date(end.getTime() - 6 * 86_400_000));
    const records = await departmentAttendanceRecords(departmentId, start, end);
    const rate = records.length ? Math.round((records.filter((r) => r.status !== "ABSENT").length / records.length) * 100) : 0;
    buckets.push({ label: `Week ${weeks - i}`, attendanceRate: rate });
  }
  return buckets;
}

async function monthlyAttendanceBuckets(departmentId: string, months: number) {
  const buckets = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = startOfDay(monthDate);
    const end = endOfDay(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0));
    const records = await departmentAttendanceRecords(departmentId, start, end);
    const rate = records.length ? Math.round((records.filter((r) => r.status !== "ABSENT").length / records.length) * 100) : 0;
    buckets.push({ month: monthDate.toLocaleDateString("en-US", { month: "short" }), attendance: rate });
  }
  return buckets;
}

/** Percentage of this department's ClassSessions that have at least one logged AttendanceRecord — a completeness metric for Class Monitors' logging duty. */
async function classMonitorCompletionRate(departmentId: string): Promise<number> {
  const sessions = await prisma.classSession.findMany({ where: { class: { departmentId } }, select: { id: true } });
  if (sessions.length === 0) return 0;
  const logged = await prisma.attendanceRecord.findMany({
    where: { sessionId: { in: sessions.map((s) => s.id) } },
    select: { sessionId: true },
    distinct: ["sessionId"],
  });
  return Math.round((logged.length / sessions.length) * 100);
}

async function computeCategoryAttendance(departmentId: string) {
  const records = await departmentAttendanceRecords(departmentId);
  const lecturersRate = records.length
    ? Math.round((records.filter((r) => r.status !== "ABSENT").length / records.length) * 100)
    : 0;
  const monitorsRate = await classMonitorCompletionRate(departmentId);
  return [
    { department: "Lecturers", value: lecturersRate, color: "#2563eb" },
    { department: "Class Monitors", value: monitorsRate, color: "#16a34a" },
    // Program Coordinators never teach or log attendance, so there's no AttendanceRecord evidence to derive a rate from.
    { department: "Coordination", value: 0, color: "#f59e0b" },
  ];
}

const LEAVE_TYPE_COLORS: Record<string, string> = {
  "Sick Leave": "#ef4444",
  "Annual Leave": "#3b82f6",
  "Maternity Leave": "#ec4899",
  "Emergency Leave": "#f97316",
  "Unpaid Leave": "#6b7280",
  Research: "#8b5cf6",
};

async function leaveTypeBreakdownFor(departmentId: string) {
  const requests = await prisma.leaveRequest.findMany({ where: { user: { departmentId } } });
  const counts = new Map<string, number>();
  for (const r of requests) counts.set(r.leaveType, (counts.get(r.leaveType) ?? 0) + 1);
  return Array.from(counts.entries()).map(([type, value]) => ({ type, value, color: LEAVE_TYPE_COLORS[type] ?? "#94a3b8" }));
}

async function attendanceTrendPoints(departmentId: string, range: "weekly" | "monthly" | "quarterly") {
  if (range === "weekly") {
    const points = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(Date.now() - i * 86_400_000);
      const records = await departmentAttendanceRecords(departmentId, startOfDay(day), endOfDay(day));
      points.push({
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        present: records.filter((r) => r.status === "PRESENT").length,
        late: records.filter((r) => r.status === "LATE").length,
      });
    }
    return points;
  }

  if (range === "monthly") {
    const points = [];
    for (let i = 3; i >= 0; i--) {
      const end = endOfDay(new Date(Date.now() - i * 7 * 86_400_000));
      const start = startOfDay(new Date(end.getTime() - 6 * 86_400_000));
      const records = await departmentAttendanceRecords(departmentId, start, end);
      points.push({
        label: `Week ${4 - i}`,
        present: records.filter((r) => r.status === "PRESENT").length,
        late: records.filter((r) => r.status === "LATE").length,
      });
    }
    return points;
  }

  const points = [];
  const now = new Date();
  for (let i = 2; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = startOfDay(monthDate);
    const end = endOfDay(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0));
    const records = await departmentAttendanceRecords(departmentId, start, end);
    points.push({
      label: monthDate.toLocaleDateString("en-US", { month: "short" }),
      present: records.filter((r) => r.status === "PRESENT").length,
      late: records.filter((r) => r.status === "LATE").length,
    });
  }
  return points;
}

// ---- Notifications ----
departmentHeadRouter.get("/notifications", async (req, res) => {
  const notifications = await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } });
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
departmentHeadRouter.get("/dashboard/summary", async (_req, res) => {
  const department = await getDepartment();
  const [totalStaff, statuses, pendingLeave] = await Promise.all([
    prisma.user.count({ where: { departmentId: department.id } }),
    deriveStaffStatusForDate(department.id, new Date()),
    prisma.leaveRequest.count({ where: { status: "PENDING", user: { departmentId: department.id } } }),
  ]);

  const presentToday = statuses.filter((s) => s.status === "present").length;
  const lateArrivals = statuses.filter((s) => s.status === "late").length;
  const onLeave = statuses.filter((s) => s.status === "leave").length;

  res.json({
    totalStaff,
    // No historical roster snapshots exist to compute a real period-over-period delta.
    totalStaffGrowth: 0,
    presentToday,
    presentPercentage: totalStaff ? Math.round((presentToday / totalStaff) * 1000) / 10 : 0,
    onLeave,
    pendingLeave,
    lateArrivals,
    lateArrivalsAlert: lateArrivals >= 2,
  });
});

// range is accepted for call-site compatibility but the 7-slot WeeklyTrendDatum shape only fits a single
// Mon-Sun week, so every range currently returns the current calendar week.
departmentHeadRouter.get("/dashboard/weekly-attendance", async (_req, res) => {
  const department = await getDepartment();
  const totalStaff = await prisma.user.count({ where: { departmentId: department.id } });

  const today = startOfDay(new Date());
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(monday.getDate() + (dow === 0 ? -6 : 1 - dow));

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const result = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const isWorkingDay = i < 5;
    if (isWorkingDay) {
      const statuses = await deriveStaffStatusForDate(department.id, day);
      const value = statuses.filter((s) => s.status === "present" || s.status === "late").length;
      result.push({ day: labels[i], value, isWorkingDay: true });
    } else {
      result.push({ day: labels[i], value: totalStaff, isWorkingDay: false });
    }
  }
  res.json(result);
});

departmentHeadRouter.get("/dashboard/leave-requests", async (_req, res) => {
  const department = await getDepartment();
  const requests = await prisma.leaveRequest.findMany({
    where: { user: { departmentId: department.id } },
    include: { user: true },
    orderBy: { requestedAt: "desc" },
  });
  res.json(requests.map((lr) => mapLeaveRequest(lr, department.name)));
});

departmentHeadRouter.get("/dashboard/attendance-today", async (_req, res) => {
  const department = await getDepartment();
  res.json(await buildTodayAttendanceRecords(department));
});

departmentHeadRouter.get("/staff", async (_req, res) => {
  const department = await getDepartment();
  const staff = await prisma.user.findMany({ where: { departmentId: department.id }, orderBy: { createdAt: "asc" } });
  res.json(
    staff.map((u) => ({
      id: u.id,
      employeeId: u.employeeId ?? "—",
      name: u.name,
      avatar: u.avatarUrl ?? "",
      position: u.position ?? ROLE_LABEL[u.role],
      department: department.name,
      email: u.email,
      phone: u.phone ?? "—",
      joinedAt: isoDate(u.createdAt),
      status: u.status === "ACTIVE" ? "active" : "inactive",
    })),
  );
});

departmentHeadRouter.get("/dashboard/analytics", async (_req, res) => {
  const department = await getDepartment();
  const [attendanceTrend, departmentAttendance, leaveTypeBreakdown, monthlyAttendance] = await Promise.all([
    weeklyAttendanceRateBuckets(department.id, 4),
    computeCategoryAttendance(department.id),
    leaveTypeBreakdownFor(department.id),
    monthlyAttendanceBuckets(department.id, 4),
  ]);
  res.json({ attendanceTrend, departmentAttendance, leaveTypeBreakdown, monthlyAttendance });
});

departmentHeadRouter.get("/dashboard/schedule-events", async (_req, res) => {
  const department = await getDepartment();
  const [sessions, calendarEvents] = await Promise.all([
    prisma.classSession.findMany({ where: { class: { departmentId: department.id } }, include: { class: true } }),
    prisma.calendarEvent.findMany({ where: { departmentId: department.id } }),
  ]);

  const today = startOfDay(new Date());

  const classItems = sessions.map((s) => ({
    id: `session-${s.id}`,
    title: s.class.name,
    type: "class" as const,
    time: `${formatTimeAmPm(s.startTime)} - ${formatTimeAmPm(s.endTime)}`,
    date: isoDate(nextOccurrenceDate(s.dayOfWeek, today)),
    location: s.room,
    priority: "medium" as const,
  }));

  const eventItems = calendarEvents
    .filter((e) => startOfDay(e.date).getTime() >= today.getTime())
    .map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type as "meeting" | "class" | "event" | "deadline",
      time: e.time,
      date: isoDate(e.date),
      location: e.location,
      priority: e.priority as "high" | "medium" | "low",
    }));

  const merged = [...classItems, ...eventItems].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  res.json(merged.slice(0, 8));
});

departmentHeadRouter.get("/dashboard/recent-activity", async (_req, res) => {
  const department = await getDepartment();
  const entries = await prisma.auditLogEntry.findMany({
    where: { actor: { departmentId: department.id } },
    include: { actor: true },
    orderBy: { timestamp: "desc" },
    take: 5,
  });
  res.json(
    entries.map((entry) => ({
      id: entry.id,
      type: inferActivityType(entry),
      message: entry.target,
      actor: entry.actor.name,
      avatar: entry.actor.avatarUrl ?? "",
      timestamp: entry.timestamp.toISOString(),
    })),
  );
});

departmentHeadRouter.get("/dashboard/performance-overview", async (_req, res) => {
  const department = await getDepartment();
  const [staff, allRecords] = await Promise.all([
    prisma.user.findMany({ where: { departmentId: department.id, role: { in: ["LECTURER", "CLASS_MONITOR"] } } }),
    departmentAttendanceRecords(department.id),
  ]);

  const stats = staff.map((member) => {
    const own =
      member.role === "LECTURER"
        ? allRecords.filter((r) => r.session.lecturerId === member.id)
        : allRecords.filter((r) => r.loggedById === member.id);
    const total = own.length;
    const rate = total ? Math.round((own.filter((r) => r.status !== "ABSENT").length / total) * 100) : 0;
    const lateCount = own.filter((r) => r.status === "LATE").length;
    return { user: member, rate, lateCount, total };
  });

  const withData = stats.filter((s) => s.total > 0);
  const best = withData.length ? withData.reduce((a, b) => (b.rate > a.rate ? b : a)) : null;
  const mostLate = stats.length ? stats.reduce((a, b) => (b.lateCount > a.lateCount ? b : a)) : null;

  const departmentRate = allRecords.length
    ? Math.round((allRecords.filter((r) => r.status !== "ABSENT").length / allRecords.length) * 100)
    : 0;

  res.json({
    bestAttendanceStaff: best
      ? { name: best.user.name, avatar: best.user.avatarUrl ?? "", rate: best.rate }
      : { name: "—", avatar: "", rate: 0 },
    mostLateStaff: mostLate
      ? { name: mostLate.user.name, avatar: mostLate.user.avatarUrl ?? "", lateCount: mostLate.lateCount }
      : { name: "—", avatar: "", lateCount: 0 },
    departmentAttendanceRate: departmentRate,
    averageCheckInTime: averageTimeLabel(allRecords.filter((r) => r.status !== "ABSENT")),
  });
});

// ---- Attendance ----
departmentHeadRouter.get("/attendance/overview", async (_req, res) => {
  const department = await getDepartment();
  const statuses = await deriveStaffStatusForDate(department.id, new Date());
  const totalStaff = statuses.length;
  const presentToday = statuses.filter((s) => s.status === "present").length;
  const lateArrivals = statuses.filter((s) => s.status === "late").length;
  const absentToday = statuses.filter((s) => s.status === "absent").length;

  res.json({
    totalStaff,
    totalStaffTrend: 0,
    presentToday,
    presentRate: totalStaff ? Math.round((presentToday / totalStaff) * 1000) / 10 : 0,
    lateArrivals,
    lateIsHighPriority: lateArrivals >= 2,
    absentToday,
    absentTrend: 0,
  });
});

departmentHeadRouter.get("/attendance/logs", async (_req, res) => {
  const department = await getDepartment();
  res.json(await buildTodayAttendanceRecords(department));
});

departmentHeadRouter.get("/attendance/status-distribution", async (_req, res) => {
  const department = await getDepartment();
  const statuses = await deriveStaffStatusForDate(department.id, new Date());
  const total = statuses.length || 1;
  const counts = { present: 0, late: 0, absent: 0, leave: 0 };
  for (const s of statuses) counts[s.status] += 1;
  res.json(
    (["present", "late", "absent", "leave"] as const).map((status) => ({
      status,
      percentage: Math.round((counts[status] / total) * 100),
    })),
  );
});

departmentHeadRouter.get("/attendance/insight", async (_req, res) => {
  const department = await getDepartment();
  const statuses = await deriveStaffStatusForDate(department.id, new Date());
  const lateStaff = statuses.filter((s) => s.status === "late");
  const absentStaff = statuses.filter((s) => s.status === "absent");
  const presentCount = statuses.filter((s) => s.status === "present" || s.status === "late").length;

  let insight = `Attendance in the ${shortDeptName(department.name)} department shows ${presentCount} of ${statuses.length} tracked staff checked in today.`;
  if (lateStaff.length > 0) {
    insight += ` ${lateStaff.map((s) => s.user.name).join(", ")} arrived late — consider a check-in.`;
  } else if (absentStaff.length > 0) {
    insight += ` ${absentStaff.length} staff member${absentStaff.length === 1 ? " has" : "s have"} no attendance logged yet today.`;
  }
  res.json(insight);
});

// ---- Leave Management ----
departmentHeadRouter.get("/leave-management/summary", async (_req, res) => {
  const department = await getDepartment();
  const dayStart = startOfDay(new Date());
  const dayEnd = endOfDay(new Date());

  const [pendingApprovalCount, onLeaveToday] = await Promise.all([
    prisma.leaveRequest.count({ where: { status: "PENDING", user: { departmentId: department.id } } }),
    prisma.leaveRequest.findMany({
      where: { status: "APPROVED", startDate: { lte: dayEnd }, endDate: { gte: dayStart }, user: { departmentId: department.id } },
      include: { user: true },
    }),
  ]);

  res.json({
    staffOnLeaveToday: onLeaveToday.length,
    pendingApprovalCount,
    currentlyOnLeave: onLeaveToday.map((l) => ({ id: l.user.id, name: l.user.name, avatar: l.user.avatarUrl ?? "" })),
  });
});

departmentHeadRouter.get("/leave-management/requests", async (_req, res) => {
  const department = await getDepartment();
  const requests = await prisma.leaveRequest.findMany({
    where: { user: { departmentId: department.id } },
    include: { user: true },
    orderBy: { requestedAt: "desc" },
  });
  res.json(requests.map((lr) => mapLeaveRequest(lr, department.name)));
});

const decideLeaveSchema = z.object({ status: z.enum(["APPROVED", "REJECTED"]) });

departmentHeadRouter.patch("/leave-requests/:id", async (req, res) => {
  const parsed = decideLeaveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.leaveRequest.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: "Leave request not found" });
    return;
  }

  const updated = await prisma.leaveRequest.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status, decidedAt: new Date(), decidedBy: req.user!.id },
    include: { user: true },
  });

  const department = await getDepartment();
  await logAction(
    req.user!.id,
    "UPDATE",
    `${parsed.data.status === "APPROVED" ? "Approved" : "Rejected"} leave request: ${updated.user.name} (${updated.leaveType})`,
  );
  res.json(mapLeaveRequest(updated, department.name));
});

// ---- Reports ----
departmentHeadRouter.get("/reports/overview", async (_req, res) => {
  const session = await prisma.classSession.findFirst();
  res.json({ termLabel: `Comprehensive reporting for ${session?.semesterLabel ?? "the current semester"}` });
});

const reportRangeSchema = z.enum(["weekly", "monthly", "quarterly"]);

departmentHeadRouter.get("/reports/attendance-trends", async (req, res) => {
  const department = await getDepartment();
  const parsed = reportRangeSchema.safeParse(req.query.range);
  res.json(await attendanceTrendPoints(department.id, parsed.success ? parsed.data : "weekly"));
});

const LEAVE_CATEGORY_MAP: Record<string, "Medical" | "Personal" | "Other"> = {
  "Sick Leave": "Medical",
  "Maternity Leave": "Medical",
  "Annual Leave": "Personal",
  "Emergency Leave": "Personal",
  "Unpaid Leave": "Personal",
  Research: "Other",
};
const LEAVE_CATEGORY_COLORS: Record<"Medical" | "Personal" | "Other", string> = {
  Medical: "#ef4444",
  Personal: "#3b82f6",
  Other: "#f59e0b",
};

departmentHeadRouter.get("/reports/leave-distribution", async (_req, res) => {
  const department = await getDepartment();
  const [totalPending, allRequests] = await Promise.all([
    prisma.leaveRequest.count({ where: { status: "PENDING", user: { departmentId: department.id } } }),
    prisma.leaveRequest.findMany({ where: { user: { departmentId: department.id } } }),
  ]);

  const counts: Record<"Medical" | "Personal" | "Other", number> = { Medical: 0, Personal: 0, Other: 0 };
  for (const r of allRequests) counts[LEAVE_CATEGORY_MAP[r.leaveType] ?? "Other"] += 1;
  const total = allRequests.length || 1;

  res.json({
    totalPending,
    breakdown: (["Medical", "Personal", "Other"] as const).map((category) => ({
      category,
      percentage: Math.round((counts[category] / total) * 100),
      color: LEAVE_CATEGORY_COLORS[category],
    })),
  });
});

departmentHeadRouter.get("/reports/workload-intensity", async (_req, res) => {
  const department = await getDepartment();
  const staff = await prisma.user.findMany({
    where: { departmentId: department.id, role: { in: ["LECTURER", "CLASS_MONITOR"] } },
    orderBy: { name: "asc" },
  });

  if (staff.length === 0) {
    res.json({ columns: 0, cells: [] });
    return;
  }

  const scheduledCounts = await Promise.all(
    staff.map((member) =>
      member.role === "LECTURER"
        ? prisma.classSession.count({ where: { lecturerId: member.id } })
        : prisma.classSession.count({ where: { class: { monitorId: member.id } } }),
    ),
  );

  const WEEKS = 4;
  const cells: { id: string; intensity: number }[] = [];
  for (let week = 0; week < WEEKS; week++) {
    const end = endOfDay(new Date(Date.now() - week * 7 * 86_400_000));
    const start = startOfDay(new Date(end.getTime() - 6 * 86_400_000));
    for (let i = 0; i < staff.length; i++) {
      const member = staff[i]!;
      const scheduled = scheduledCounts[i]!;
      const actual =
        member.role === "LECTURER"
          ? await prisma.attendanceRecord.count({ where: { session: { lecturerId: member.id }, date: { gte: start, lte: end } } })
          : await prisma.attendanceRecord.count({ where: { loggedById: member.id, date: { gte: start, lte: end } } });
      const intensity = scheduled > 0 ? Math.min(100, Math.round((actual / scheduled) * 100)) : 0;
      cells.push({ id: `wl-${i}-${week}`, intensity });
    }
  }
  res.json({ columns: staff.length, cells });
});

departmentHeadRouter.get("/reports/department-sectors", async (_req, res) => {
  res.json(["Lecturers", "Class Monitors", "Coordination"]);
});

departmentHeadRouter.get("/reports/recent", async (_req, res) => {
  const department = await getDepartment();
  const reports = await prisma.generatedReport.findMany({ where: { departmentId: department.id }, orderBy: { generatedAt: "desc" } });
  res.json(
    reports.map((r) => ({
      id: r.id,
      name: r.name,
      dateGeneratedLabel: r.generatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      format: r.format,
    })),
  );
});

// ---- Schedule ----
departmentHeadRouter.get("/schedule/overview", async (_req, res) => {
  const department = await getDepartment();
  const [session, unassignedCriticalCount, lastChange] = await Promise.all([
    prisma.classSession.findFirst(),
    prisma.class.count({ where: { departmentId: department.id, monitorId: null } }),
    prisma.auditLogEntry.findFirst({
      where: { target: { contains: "session", mode: "insensitive" } },
      orderBy: { timestamp: "desc" },
    }),
  ]);

  res.json({
    termLabel: session?.semesterLabel ?? "Current Semester",
    lastUpdatedLabel: lastChange ? formatUpdatedLabel(lastChange.timestamp) : "Not yet updated",
    unassignedCriticalCount,
  });
});

departmentHeadRouter.get("/schedule/rooms", async (_req, res) => {
  const department = await getDepartment();
  const [rooms, sessions] = await Promise.all([
    prisma.room.findMany({ where: { departmentId: department.id }, orderBy: { name: "asc" } }),
    prisma.classSession.findMany({ where: { class: { departmentId: department.id } } }),
  ]);

  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const nowHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  res.json(
    rooms.map((room) => {
      // ClassSession.room stores the short form ("Room A201"); the Room table's name includes a
      // building suffix ("Room A201 (Engineering Block)") — match by prefix rather than equality.
      const occupied = sessions.some(
        (s) => room.name.startsWith(s.room) && s.dayOfWeek === dayName && s.startTime <= nowHHMM && nowHHMM < s.endTime,
      );
      return { id: room.id, name: room.name, capacityLabel: `Capacity: ${room.capacity} students`, status: occupied ? "occupied" : "available" };
    }),
  );
});

departmentHeadRouter.get("/schedule/grid", async (req, res) => {
  const department = await getDepartment();
  const weekOffset = Number(req.query.weekOffset ?? 0) || 0;

  const today = startOfDay(new Date());
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(monday.getDate() + (dow === 0 ? -6 : 1 - dow) + weekOffset * 7);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const [sessions, meetings] = await Promise.all([
    prisma.classSession.findMany({ where: { class: { departmentId: department.id } }, include: { class: true, lecturer: true } }),
    prisma.calendarEvent.findMany({ where: { departmentId: department.id, type: "meeting" } }),
  ]);

  const slots: { id: string; day: (typeof WEEKDAY_LABELS)[number]; time: string; title: string; subtitle: string; status: "class" | "meeting" | "unassigned" }[] = [];
  const timeSet = new Set<string>();

  for (const s of sessions) {
    const idx = DAY_NAMES.indexOf(s.dayOfWeek) - 1; // Monday -> 0 ... Friday -> 4
    if (idx < 0 || idx > 4) continue;
    const time = formatTimeAmPm(s.startTime);
    timeSet.add(time);
    slots.push({
      id: `grid-session-${s.id}`,
      day: WEEKDAY_LABELS[idx]!,
      time,
      title: s.class.name,
      subtitle: `${s.lecturer.name} • ${s.room.replace(/^Room /, "")}`,
      status: s.class.monitorId ? "class" : "unassigned",
    });
  }

  for (const e of meetings) {
    const day = startOfDay(e.date);
    if (day.getTime() < monday.getTime() || day.getTime() > friday.getTime()) continue;
    const dayIdx = day.getDay() - 1;
    if (dayIdx < 0 || dayIdx > 4) continue;
    const time = e.time.split(" - ")[0]?.trim() ?? e.time;
    timeSet.add(time);
    slots.push({
      id: `grid-event-${e.id}`,
      day: WEEKDAY_LABELS[dayIdx]!,
      time,
      title: e.title,
      subtitle: e.location.replace(/^Room /, ""),
      status: "meeting",
    });
  }

  res.json({
    weekRangeLabel: `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${friday.toLocaleDateString("en-US", { day: "numeric" })}, ${friday.getFullYear()}`,
    timeSlots: Array.from(timeSet).sort((a, b) => to24hMinutes(a) - to24hMinutes(b)),
    slots,
  });
});

departmentHeadRouter.get("/schedule/unassigned-classes", async (_req, res) => {
  const department = await getDepartment();
  const classes = await prisma.class.findMany({ where: { departmentId: department.id, monitorId: null }, include: { sessions: true } });
  res.json(
    classes.map((c) => {
      const session = c.sessions[0];
      const scheduleLabel = session
        ? `${session.dayOfWeek}s, ${formatTimeAmPm(session.startTime)} - ${formatTimeAmPm(session.endTime)}`
        : "Not yet scheduled";
      const category = /data|machine learning|software|algorithm|engineering/i.test(c.name) ? "science" : "general";
      return { id: c.id, courseLabel: `${c.code}: ${c.name.replace(`${c.code} `, "")}`, scheduleLabel, category };
    }),
  );
});

departmentHeadRouter.get("/schedule/staff-workload", async (_req, res) => {
  const department = await getDepartment();
  const staff = await prisma.user.findMany({
    where: { departmentId: department.id, role: { in: ["LECTURER", "CLASS_MONITOR"] } },
    orderBy: { name: "asc" },
  });

  const MAX_HOURS_PER_WEEK = 20;
  // No live presence system exists yet — approximate from account status until one is built.
  const PRESENCE_BY_STATUS = { ACTIVE: "online", SUSPENDED: "offline", PENDING: "away" } as const;

  const result = await Promise.all(
    staff.map(async (member) => {
      const sessions =
        member.role === "LECTURER"
          ? await prisma.classSession.findMany({ where: { lecturerId: member.id } })
          : await prisma.classSession.findMany({ where: { class: { monitorId: member.id } } });
      const hoursPerWeek = Math.round(sessions.reduce((sum, s) => sum + minutesBetween(s.startTime, s.endTime), 0) / 60);
      return {
        id: member.id,
        name: member.name,
        avatar: member.avatarUrl ?? "",
        departmentCode: member.role === "LECTURER" ? "LEC" : "CM",
        hoursPerWeek,
        workloadPercent: Math.min(100, Math.round((hoursPerWeek / MAX_HOURS_PER_WEEK) * 100)),
        presence: PRESENCE_BY_STATUS[member.status],
      };
    }),
  );
  res.json(result);
});

// ---- Settings ----
departmentHeadRouter.get("/settings/profile", async (_req, res) => {
  const department = await getDepartment();
  res.json({
    departmentName: department.name,
    deptCode: department.deptCode ?? "—",
    establishedYear: department.establishedYear ?? "—",
    signatureUrl: department.signatureUrl,
  });
});

departmentHeadRouter.get("/settings/attendance-policy", async (_req, res) => {
  const department = await getDepartment();
  res.json({ lateThresholdMinutes: department.lateThresholdMinutes, gracePeriodMode: department.gracePeriodMode });
});

departmentHeadRouter.get("/settings/leave-approval-rules", async (_req, res) => {
  const department = await getDepartment();
  res.json({
    autoApprovePersonalLeave: department.autoApprovePersonalLeave,
    mandatoryMedicalDocumentation: department.mandatoryMedicalDocumentation,
    escalationHierarchy: department.escalationHierarchy,
  });
});

departmentHeadRouter.get("/settings/staff", async (_req, res) => {
  const department = await getDepartment();
  const staff = await prisma.user.findMany({ where: { departmentId: department.id }, orderBy: { createdAt: "asc" } });
  res.json(staff.map((u) => ({ id: u.id, name: u.name, avatar: u.avatarUrl ?? "", role: ROLE_LABEL[u.role] })));
});
