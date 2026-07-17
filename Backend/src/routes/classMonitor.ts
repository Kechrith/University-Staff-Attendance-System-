import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const classMonitorRouter = Router();
classMonitorRouter.use(requireAuth, requireRole("CLASS_MONITOR"));

async function logAction(actorId: string, action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT", target: string) {
  await prisma.auditLogEntry.create({ data: { actorId, action, target } });
}

// ---- Date/time helpers ----
// `dayOfWeek` on ClassSession is a full weekday name ("Monday" … "Sunday").
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_ORDER: Record<string, number> = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };
const WEEKDAY_ABBR: Record<string, string> = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" };

function todayWeekdayName(date = new Date()): string {
  return WEEKDAY_NAMES[date.getDay()];
}

function nowTimeLabel(date = new Date()): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function minutesUntil(timeStr: string, from = new Date()): number {
  const [h, m] = timeStr.split(":").map(Number);
  const end = new Date(from);
  end.setHours(h, m, 0, 0);
  return Math.max(0, Math.round((end.getTime() - from.getTime()) / 60_000));
}

function startOfWeekMonday(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

function dateForWeekday(mondayStart: Date, dayOfWeek: string, weekOffset = 0): Date | null {
  const offset = WEEKDAY_ORDER[dayOfWeek];
  if (offset === undefined) return null;
  const d = new Date(mondayStart);
  d.setDate(d.getDate() + offset + weekOffset * 7);
  return d;
}

function dayRange(date: Date): { gte: Date; lte: Date } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { gte: start, lte: end };
}

function titleCase(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

async function findRecordForDate(sessionId: string, date: Date) {
  return prisma.attendanceRecord.findFirst({ where: { sessionId, date: dayRange(date) } });
}

async function getMonitorSessions(monitorId: string) {
  return prisma.classSession.findMany({
    where: { class: { monitorId } },
    include: { class: { include: { department: true } }, lecturer: true },
  });
}

// ---- Notifications ----
classMonitorRouter.get("/notifications", async (req, res) => {
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
classMonitorRouter.get("/dashboard-summary", async (req, res) => {
  const monitorId = req.user!.id;
  const [sessions, myClasses] = await Promise.all([
    getMonitorSessions(monitorId),
    prisma.class.findMany({ where: { monitorId }, include: { department: true } }),
  ]);

  const now = new Date();
  const todayName = todayWeekdayName(now);
  const nowLabel = nowTimeLabel(now);
  const todaysSessions = sessions.filter((s) => s.dayOfWeek === todayName).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const dailyClasses = await Promise.all(
    todaysSessions.map(async (s) => {
      const record = await findRecordForDate(s.id, now);
      return {
        id: s.id,
        timeRangeLabel: `${s.startTime} – ${s.endTime}`,
        room: s.room,
        lecturerName: s.lecturer.name,
        lecturerAvatar: s.lecturer.avatarUrl ?? "",
        course: s.class.name,
        mark: record ? (record.status.toLowerCase() as "present" | "late" | "absent") : null,
      };
    }),
  );

  const classesWithSessionToday = new Set(todaysSessions.map((s) => s.classId));
  const assignedClasses = myClasses.map((c) => ({
    id: c.id,
    groupLabel: c.name,
    programLabel: c.department.name,
    tone: classesWithSessionToday.has(c.id) ? ("active" as const) : ("upcoming" as const),
  }));

  const activeSession = todaysSessions.find((s) => s.startTime <= nowLabel && nowLabel <= s.endTime);
  const duty = activeSession
    ? { onDuty: true, room: activeSession.room, sessionEndsInLabel: `${minutesUntil(activeSession.endTime, now)} min` }
    : { onDuty: false, room: "", sessionEndsInLabel: "" };

  const alerts: { id: string; title: string; description: string; tone: "warning" | "info" }[] = [];
  const pending = dailyClasses.find((d) => d.mark === null);
  if (pending) {
    alerts.push({
      id: `pending-${pending.id}`,
      title: "Attendance log due",
      description: `Submit today's ${pending.course} attendance log (${pending.timeRangeLabel}) to stay within the recording window.`,
      tone: "warning",
    });
  }
  const lastRecord = await prisma.attendanceRecord.findFirst({
    where: { loggedById: monitorId },
    orderBy: { createdAt: "desc" },
    include: { session: { include: { class: true, lecturer: true } } },
  });
  if (lastRecord) {
    alerts.push({
      id: `last-${lastRecord.id}`,
      title: `${lastRecord.session.lecturer.name} marked ${titleCase(lastRecord.status)}`,
      description: `${lastRecord.session.lecturer.name} was logged ${lastRecord.status.toLowerCase()} for ${lastRecord.session.class.name} on ${lastRecord.date.toLocaleDateString()}.`,
      tone: "info",
    });
  }

  res.json({ alerts, dailyClasses, assignedClasses, duty });
});

// ---- Attendance (Mark Attendance page) ----
classMonitorRouter.get("/attendance/shift-stats", async (req, res) => {
  const monitorId = req.user!.id;
  const sessions = await getMonitorSessions(monitorId);
  const todayName = todayWeekdayName();
  const todaysSessions = sessions.filter((s) => s.dayOfWeek === todayName);
  const rooms = Array.from(new Set(todaysSessions.map((s) => s.room)));
  const totalRoomsLabel = rooms.length === 0 ? "No rooms today" : `${rooms.length} room${rooms.length === 1 ? "" : "s"} — ${rooms.join(", ")}`;

  const myRecords = await prisma.attendanceRecord.findMany({ where: { loggedById: monitorId } });
  const now = new Date();
  const last7Start = new Date(now.getTime() - 7 * 86_400_000);
  const prev7Start = new Date(now.getTime() - 14 * 86_400_000);

  function rateFor(records: typeof myRecords): number | null {
    if (!records.length) return null;
    const present = records.filter((r) => r.status !== "ABSENT").length;
    return Math.round((present / records.length) * 100);
  }

  const overallRate = rateFor(myRecords) ?? 100;
  const last7 = myRecords.filter((r) => r.date >= last7Start && r.date <= now);
  const prev7 = myRecords.filter((r) => r.date >= prev7Start && r.date < last7Start);
  const last7Rate = rateFor(last7);
  const prev7Rate = rateFor(prev7);

  let trendLabel = "No recent data";
  if (last7Rate !== null && prev7Rate !== null) {
    const diff = last7Rate - prev7Rate;
    trendLabel = diff === 0 ? "No change vs last week" : `${diff > 0 ? "+" : ""}${diff}% vs last week`;
  } else if (last7Rate !== null) {
    trendLabel = `${last7Rate}% this week`;
  }

  let pendingRecords = 0;
  for (const s of todaysSessions) {
    const rec = await findRecordForDate(s.id, now);
    if (!rec) pendingRecords++;
  }

  res.json({
    totalClassesToday: todaysSessions.length,
    totalRoomsLabel,
    lecturerAttendanceRate: overallRate,
    lecturerAttendanceTrendLabel: trendLabel,
    pendingRecords,
  });
});

classMonitorRouter.get("/attendance/current-classes", async (req, res) => {
  const sessions = await getMonitorSessions(req.user!.id);
  const todayName = todayWeekdayName();
  const nowLabel = nowTimeLabel();
  const upcoming = sessions
    .filter((s) => s.dayOfWeek === todayName && s.endTime >= nowLabel)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  res.json(
    upcoming.map((s) => ({
      id: s.id,
      room: s.room,
      timeRangeLabel: `${s.startTime} – ${s.endTime}`,
      course: s.class.name,
      lecturerName: s.lecturer.name,
      marks: ["present", "late", "absent"],
    })),
  );
});

classMonitorRouter.get("/attendance/session-log", async (req, res) => {
  const records = await prisma.attendanceRecord.findMany({
    where: { loggedById: req.user!.id },
    include: { session: { include: { class: true, lecturer: true } } },
    orderBy: { date: "desc" },
    take: 10,
  });
  res.json(
    records.map((r) => ({
      id: r.id,
      message: `Attendance recorded — ${r.session.class.name}`,
      detail: `${r.session.lecturer.name} marked ${titleCase(r.status)}.${
        r.lessonSummary ? ` Lesson: ${r.lessonSummary}.` : r.status === "ABSENT" ? " No lesson summary submitted." : ""
      }`,
      timestamp: r.date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    })),
  );
});

// No occupancy-sensor data exists anywhere in the schema, so — same precedent as Super
// Admin's static `/settings/security` — this stays a static placeholder rather than a
// number derived from nothing.
classMonitorRouter.get("/attendance/campus-load", async (_req, res) => {
  res.json({ capacityPercentage: 68, updatedLabel: "Updated recently" });
});

// ---- Leave Management ----
const LEAVE_CATEGORY_TOTALS: Record<"Annual" | "Sick" | "Other", number> = { Annual: 12, Sick: 7, Other: 3 };

function leaveCategory(leaveType: string): "Annual" | "Sick" | "Other" {
  if (leaveType === "Annual Leave") return "Annual";
  if (leaveType === "Sick Leave") return "Sick";
  return "Other";
}

function leaveDurationDays(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
}

classMonitorRouter.get("/leave/balances", async (req, res) => {
  const now = new Date();
  const approved = await prisma.leaveRequest.findMany({
    where: { userId: req.user!.id, status: "APPROVED", startDate: { gte: new Date(now.getFullYear(), 0, 1) } },
  });

  const used: Record<"Annual" | "Sick" | "Other", number> = { Annual: 0, Sick: 0, Other: 0 };
  for (const r of approved) {
    used[leaveCategory(r.leaveType)] += leaveDurationDays(r.startDate, r.endDate);
  }

  res.json(
    (["Annual", "Sick", "Other"] as const).map((type) => ({
      type,
      remaining: Math.max(0, LEAVE_CATEGORY_TOTALS[type] - used[type]),
      total: LEAVE_CATEGORY_TOTALS[type],
    })),
  );
});

classMonitorRouter.get("/leave/status", async (req, res) => {
  const sessions = await getMonitorSessions(req.user!.id);
  const todayName = todayWeekdayName();
  const nowLabel = nowTimeLabel();
  const activeSession = sessions.find((s) => s.dayOfWeek === todayName && s.startTime <= nowLabel && nowLabel <= s.endTime);

  const now = new Date();
  const nextLeave = await prisma.leaveRequest.findFirst({
    where: { userId: req.user!.id, status: "APPROVED", startDate: { gte: now } },
    orderBy: { startDate: "asc" },
  });

  res.json({
    isOnDuty: Boolean(activeSession),
    statusLabel: activeSession ? `On duty — ${activeSession.class.name}, ${activeSession.room}` : "Off duty",
    nextScheduledLeaveLabel: nextLeave
      ? `${nextLeave.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${nextLeave.leaveType} (${leaveDurationDays(nextLeave.startDate, nextLeave.endDate)} day${leaveDurationDays(nextLeave.startDate, nextLeave.endDate) === 1 ? "" : "s"})`
      : "No upcoming leave scheduled",
  });
});

classMonitorRouter.get("/leave/requests", async (req, res) => {
  const requests = await prisma.leaveRequest.findMany({
    where: { userId: req.user!.id },
    orderBy: { requestedAt: "desc" },
  });
  res.json(
    requests.map((r) => ({
      id: r.id,
      leaveType: r.leaveType,
      startDate: r.startDate.toISOString().slice(0, 10),
      endDate: r.endDate.toISOString().slice(0, 10),
      duration: `${leaveDurationDays(r.startDate, r.endDate)} day${leaveDurationDays(r.startDate, r.endDate) === 1 ? "" : "s"}`,
      reason: r.reason,
      status: r.status.toLowerCase(),
    })),
  );
});

// ---- Schedule ----
classMonitorRouter.get("/schedule", async (req, res) => {
  const weekOffset = Number(req.query.week ?? 0) || 0;
  const sessions = await getMonitorSessions(req.user!.id);
  const now = new Date();
  const monday = startOfWeekMonday(now);
  const todayName = todayWeekdayName(now);

  const entries = await Promise.all(
    sessions
      .filter((s) => WEEKDAY_ABBR[s.dayOfWeek])
      .map(async (s) => {
        const sessionDate = dateForWeekday(monday, s.dayOfWeek, weekOffset);
        const record = sessionDate ? await findRecordForDate(s.id, sessionDate) : null;
        return {
          id: s.id,
          day: WEEKDAY_ABBR[s.dayOfWeek],
          timeLabel: `${s.startTime} – ${s.endTime}`,
          title: s.class.name,
          detail: `${s.lecturer.name} · ${s.room}`,
          isToday: weekOffset === 0 && s.dayOfWeek === todayName,
          isLate: record?.status === "LATE",
        };
      }),
  );

  res.json(entries);
});

classMonitorRouter.get("/schedule/summary", async (req, res) => {
  const sessions = await getMonitorSessions(req.user!.id);
  const now = new Date();
  const monday = startOfWeekMonday(now);
  const friday = new Date(monday);
  friday.setDate(friday.getDate() + 4);
  const weekRangeLabel = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${friday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const assignedLecturers = new Set(sessions.map((s) => s.lecturerId)).size;
  const activeMonitoringZones = new Set(sessions.map((s) => s.room)).size;

  let scheduled = 0;
  let recorded = 0;
  for (const s of sessions) {
    const sessionDate = dateForWeekday(monday, s.dayOfWeek);
    if (!sessionDate || sessionDate > now) continue;
    scheduled++;
    const rec = await findRecordForDate(s.id, sessionDate);
    if (rec) recorded++;
  }
  const weeklyCoveragePercentage = scheduled ? Math.round((recorded / scheduled) * 100) : 100;

  res.json({ weekRangeLabel, assignedLecturers, activeMonitoringZones, weeklyCoveragePercentage });
});

// ---- Reports ----
// avgRecordingAccuracy / sessionCoverage / lateLogs are all derived from this monitor's own
// AttendanceRecord + Dispute rows (see task notes — no dedicated accuracy-tracking table exists).
classMonitorRouter.get("/reports/kpis", async (req, res) => {
  const monitorId = req.user!.id;
  const myRecords = await prisma.attendanceRecord.findMany({ where: { loggedById: monitorId }, include: { dispute: true } });
  const totalLogged = myRecords.length;
  const disputed = myRecords.filter((r) => r.dispute).length;
  const avgRecordingAccuracy = totalLogged ? Math.round(((totalLogged - disputed) / totalLogged) * 100) : 100;
  const lateLogs = myRecords.filter((r) => r.status === "LATE").length;

  const sessions = await getMonitorSessions(monitorId);
  const now = new Date();
  const monday = startOfWeekMonday(now);
  let scheduledSoFar = 0;
  let recordedSoFar = 0;
  for (const s of sessions) {
    const sessionDate = dateForWeekday(monday, s.dayOfWeek);
    if (!sessionDate || sessionDate > now) continue;
    scheduledSoFar++;
    const rec = await findRecordForDate(s.id, sessionDate);
    if (rec) recordedSoFar++;
  }
  const sessionCoverage = scheduledSoFar ? Math.round((recordedSoFar / scheduledSoFar) * 100) : 100;
  const missed = scheduledSoFar - recordedSoFar;

  const compliance =
    avgRecordingAccuracy >= 95
      ? { label: "Excellent", grade: "Grade A" }
      : avgRecordingAccuracy >= 85
        ? { label: "Good", grade: "Grade B" }
        : avgRecordingAccuracy >= 70
          ? { label: "Fair", grade: "Grade C" }
          : { label: "Needs Improvement", grade: "Grade D" };

  res.json({
    avgRecordingAccuracy,
    avgRecordingAccuracyTrendLabel: disputed === 0 ? "No disputes on record" : `${disputed} disputed record${disputed === 1 ? "" : "s"}`,
    sessionCoverage,
    sessionCoverageTrendLabel: missed <= 0 ? "No sessions missed" : `${missed} session${missed === 1 ? "" : "s"} not yet logged`,
    lateLogs,
    lateLogsTrendLabel: `${lateLogs} late log${lateLogs === 1 ? "" : "s"} recorded`,
    staffComplianceLabel: compliance.label,
    staffComplianceGradeLabel: compliance.grade,
  });
});

// Grouped by calendar month from this monitor's own logged records — reflects whatever
// months actually have data in the (few-week) seed window rather than a fixed 6-month axis.
classMonitorRouter.get("/reports/performance-trend", async (req, res) => {
  const myRecords = await prisma.attendanceRecord.findMany({ where: { loggedById: req.user!.id }, include: { dispute: true } });

  const buckets = new Map<string, { label: string; total: number; ok: number; sortKey: number }>();
  for (const r of myRecords) {
    const key = `${r.date.getFullYear()}-${r.date.getMonth()}`;
    const bucket = buckets.get(key) ?? {
      label: r.date.toLocaleString("en-US", { month: "short" }),
      total: 0,
      ok: 0,
      sortKey: r.date.getFullYear() * 12 + r.date.getMonth(),
    };
    bucket.total += 1;
    if (!r.dispute) bucket.ok += 1;
    buckets.set(key, bucket);
  }

  const points = Array.from(buckets.values())
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((b) => ({ monthLabel: b.label, accuracy: Math.round((b.ok / b.total) * 100) }));

  res.json(points);
});

// No "logging method" field exists in the schema. As a stand-in, this buckets the monitor's
// own records into three real signals: disputed records ("manual-overrides"), ABSENT records
// with nothing captured ("missed-scans"), and LATE records ("sync-delays") — categories with
// zero occurrences are omitted rather than padded to a fixed split.
classMonitorRouter.get("/reports/error-distribution", async (req, res) => {
  const myRecords = await prisma.attendanceRecord.findMany({ where: { loggedById: req.user!.id }, include: { dispute: true } });
  const manualOverrides = myRecords.filter((r) => r.dispute).length;
  const missedScans = myRecords.filter((r) => r.status === "ABSENT").length;
  const syncDelays = myRecords.filter((r) => r.status === "LATE").length;
  const total = manualOverrides + missedScans + syncDelays;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const rows = [
    { type: "manual-overrides", percentage: pct(manualOverrides) },
    { type: "missed-scans", percentage: pct(missedScans) },
    { type: "sync-delays", percentage: pct(syncDelays) },
  ].filter((d) => d.percentage > 0);

  res.json(rows);
});

classMonitorRouter.get("/reports/department-coverage", async (req, res) => {
  const sessions = await getMonitorSessions(req.user!.id);
  const now = new Date();
  const currentMonday = startOfWeekMonday(now);

  const rows = [];
  for (let weeksAgo = 2; weeksAgo >= 0; weeksAgo--) {
    const weekStart = new Date(currentMonday);
    weekStart.setDate(weekStart.getDate() - weeksAgo * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 4);

    let total = 0;
    let recorded = 0;
    for (const s of sessions) {
      const sessionDate = dateForWeekday(weekStart, s.dayOfWeek);
      if (!sessionDate || sessionDate > now) continue;
      total++;
      const rec = await findRecordForDate(s.id, sessionDate);
      if (rec) recorded++;
    }
    const accuracyPercentage = total ? Math.round((recorded / total) * 100) : 100;
    rows.push({
      id: `week-${weekStart.toISOString().slice(0, 10)}`,
      department: `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      totalSessions: total,
      recorded,
      accuracyPercentage,
      status: accuracyPercentage >= 95 ? "optimal" : "warning",
    });
  }

  res.json(rows);
});

// ---- Settings ----
classMonitorRouter.get("/settings/profile", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { department: true } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const myClasses = await prisma.class.findMany({ where: { monitorId: user.id } });
  const firstSession = myClasses.length
    ? await prisma.classSession.findFirst({ where: { classId: { in: myClasses.map((c) => c.id) } } })
    : null;

  const monitoringUnit = user.department
    ? `${user.department.name}${myClasses.length ? ` — ${myClasses.map((c) => c.name).join(", ")}` : ""}${firstSession ? ` (${firstSession.semesterLabel})` : ""}`
    : "—";

  res.json({
    fullName: user.name,
    monitoringUnit,
    universityEmail: user.email,
    employeeId: user.employeeId ?? "—",
    bio: user.bio ?? "",
  });
});

classMonitorRouter.get("/settings/access-session", async (req, res) => {
  const lastLogin = await prisma.auditLogEntry.findFirst({
    where: { actorId: req.user!.id, action: "LOGIN" },
    orderBy: { timestamp: "desc" },
  });

  const sessions = await getMonitorSessions(req.user!.id);
  const todayName = todayWeekdayName();
  const nowLabel = nowTimeLabel();
  const activeSession = sessions.find((s) => s.dayOfWeek === todayName && s.startTime <= nowLabel && nowLabel <= s.endTime);

  res.json({
    lastLoginLabel: lastLogin ? lastLogin.timestamp.toLocaleString() : "—",
    checkInStatusLabel: activeSession ? `Checked in — ${activeSession.room}` : "Not checked in",
  });
});

classMonitorRouter.get("/settings/notification-preferences", async (req, res) => {
  const prefs = await prisma.notificationPreference.findMany({
    where: { userId: req.user!.id },
    orderBy: { key: "asc" },
  });
  res.json(prefs.map((p) => ({ id: p.key, title: p.title, description: p.description, enabled: p.enabled })));
});

const toggleNotificationSchema = z.object({ enabled: z.boolean() });

classMonitorRouter.patch("/settings/notification-preferences/:key", async (req, res) => {
  const parsed = toggleNotificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const pref = await prisma.notificationPreference.update({
    where: { userId_key: { userId: req.user!.id, key: req.params.key } },
    data: { enabled: parsed.data.enabled },
  });
  await logAction(req.user!.id, "UPDATE", `${parsed.data.enabled ? "Enabled" : "Disabled"} notification preference: ${pref.title}`);
  res.json({ id: pref.key, title: pref.title, description: pref.description, enabled: pref.enabled });
});
