import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import type { AttendanceStatus } from "@prisma/client";

export const programCoordinatorRouter = Router();
programCoordinatorRouter.use(requireAuth, requireRole("PROGRAM_COORDINATOR"));

// Every route below is read-only: the leave queue is view-only for this role (see
// LeaveRequestQueueTable.tsx), and the Settings page's "Save All Settings" button is
// still a toast stub, so there is no mutation endpoint to wire up yet.

/** Every route below scopes to the coordinator's one department (only one Department row exists, per the seed world). */
async function getDepartment() {
  const department = await prisma.department.findFirst({ include: { faculty: true } });
  if (!department) throw new Error("No department found");
  return department;
}

const DAY_ABBREV: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

/** "HH:mm" -> "7:00 AM" */
function formatTime12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

/** Attendance percentage across a set of records: PRESENT + LATE both count as "attended". */
function attendancePercentage(records: { status: AttendanceStatus }[]): number {
  if (records.length === 0) return 0;
  const attended = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
  return Math.round((attended / records.length) * 100);
}

// ---- Notifications ----
programCoordinatorRouter.get("/notifications", async (req, res) => {
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
programCoordinatorRouter.get("/dashboard-summary", async (_req, res) => {
  const department = await getDepartment();
  const [activeLecturers, totalLecturers, rooms, sessions] = await Promise.all([
    prisma.user.count({ where: { departmentId: department.id, role: "LECTURER", status: "ACTIVE" } }),
    prisma.user.count({ where: { departmentId: department.id, role: "LECTURER" } }),
    prisma.room.findMany({ where: { departmentId: department.id } }),
    prisma.classSession.findMany({ where: { class: { departmentId: department.id } } }),
  ]);

  // Latest logged record per session stands in for "today's" status (seed history is anchored to a fixed demo date, not the server's real clock).
  const latestPerSession = await Promise.all(
    sessions.map((s) => prisma.attendanceRecord.findFirst({ where: { sessionId: s.id }, orderBy: { date: "desc" } })),
  );
  const latestRecords = latestPerSession.filter((r): r is NonNullable<typeof r> => r !== null);
  const absenceAlerts = latestRecords.filter((r) => r.status === "ABSENT").length;
  const checkedIn = latestRecords.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;

  const totalSlotCapacity = rooms.length * 5 * new Set(sessions.map((s) => `${s.startTime}-${s.endTime}`)).size;
  const roomUtilization = totalSlotCapacity > 0 ? Math.min(100, Math.round((sessions.length / totalSlotCapacity) * 100)) : 0;

  res.json({
    managedPrograms: 1,
    managedProgramsGrowthLabel: department.faculty.name,
    activeLecturers,
    activeLecturersRateLabel:
      totalLecturers === 0 ? "No lecturers yet" : checkedIn >= totalLecturers ? "All checked in today" : `${checkedIn} of ${totalLecturers} checked in today`,
    absenceAlerts,
    roomUtilization,
    roomSeatCount: rooms.reduce((sum, r) => sum + r.capacity, 0),
  });
});

programCoordinatorRouter.get("/schedule-grid", async (_req, res) => {
  // ClassSession models a recurring weekly slot (no per-week date), so the grid is the same regardless of `week` offset.
  const department = await getDepartment();
  const sessions = await prisma.classSession.findMany({
    where: { class: { departmentId: department.id } },
    include: { class: true, lecturer: true },
  });

  const conflictSessionIds = detectConflictingSessionIds(sessions);

  const timeSlots = Array.from(new Set(sessions.map((s) => `${formatTime12h(s.startTime)} – ${formatTime12h(s.endTime)}`))).sort();
  const slots = sessions.map((s) => ({
    id: s.id,
    day: DAY_ABBREV[s.dayOfWeek] ?? s.dayOfWeek.slice(0, 3),
    time: `${formatTime12h(s.startTime)} – ${formatTime12h(s.endTime)}`,
    title: s.class.name,
    subtitle: `${s.lecturer.name} • ${s.room}`,
    status: conflictSessionIds.has(s.id) ? "conflict" : "lecture",
  }));

  res.json({ timeSlots, slots });
});

function detectConflictingSessionIds(sessions: { id: string; dayOfWeek: string; startTime: string; endTime: string; room: string }[]): Set<string> {
  const conflicting = new Set<string>();
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      const a = sessions[i];
      const b = sessions[j];
      if (a.dayOfWeek !== b.dayOfWeek || a.room !== b.room) continue;
      const overlaps = a.startTime < b.endTime && b.startTime < a.endTime;
      if (overlaps) {
        conflicting.add(a.id);
        conflicting.add(b.id);
      }
    }
  }
  return conflicting;
}

programCoordinatorRouter.get("/live-monitor", async (_req, res) => {
  const department = await getDepartment();
  const records = await prisma.attendanceRecord.findMany({
    where: { session: { class: { departmentId: department.id } } },
    include: { session: { include: { class: true, lecturer: true } } },
    orderBy: { date: "desc" },
    take: 5,
  });

  res.json(
    records.map((r) => {
      const tone = r.status === "PRESENT" ? "success" : r.status === "LATE" ? "warning" : "info";
      const message =
        r.status === "PRESENT"
          ? `${r.session.lecturer.name} checked in`
          : r.status === "LATE"
            ? "Late arrival flagged"
            : `${r.session.lecturer.name} marked absent`;
      return {
        id: r.id,
        message,
        detail: `${r.session.class.name} • ${r.session.room}`,
        timestamp: r.date.toLocaleString(undefined, { hour: "numeric", minute: "2-digit" }),
        tone,
      };
    }),
  );
});

programCoordinatorRouter.get("/class-overview", async (_req, res) => {
  const department = await getDepartment();
  const classes = await prisma.class.findMany({
    where: { departmentId: department.id },
    include: { sessions: { include: { lecturer: true } } },
    orderBy: { code: "asc" },
  });

  const items = await Promise.all(
    classes.map(async (cls) => {
      const primarySession = cls.sessions[0] ?? null;
      const dayLabels = Array.from(new Set(cls.sessions.map((s) => DAY_ABBREV[s.dayOfWeek] ?? s.dayOfWeek.slice(0, 3))));
      const scheduleLabel = primarySession
        ? `${dayLabels.join(", ")} • ${formatTime12h(primarySession.startTime)} – ${formatTime12h(primarySession.endTime)}`
        : "Unscheduled";

      const latestRecord = cls.sessions.length
        ? await prisma.attendanceRecord.findFirst({
            where: { sessionId: { in: cls.sessions.map((s) => s.id) } },
            orderBy: { date: "desc" },
          })
        : null;

      // CoordinatorClassStatus has no "absent" state; an absent lecturer is surfaced as "late" (needs attention) rather than silently as "present".
      const status = !latestRecord ? "upcoming" : latestRecord.status === "PRESENT" ? "present" : "late";

      return {
        id: cls.id,
        department: department.name,
        studentCount: cls.studentCount,
        title: cls.name,
        instructorName: primarySession?.lecturer.name ?? "Unassigned",
        instructorAvatar: primarySession?.lecturer.avatarUrl ?? "",
        scheduleLabel,
        status,
      };
    }),
  );

  res.json(items);
});

// ---- Attendance ----
programCoordinatorRouter.get("/attendance/daily-pulse", async (_req, res) => {
  const department = await getDepartment();
  const [totalLecturers, sessions] = await Promise.all([
    prisma.user.count({ where: { departmentId: department.id, role: "LECTURER" } }),
    prisma.classSession.findMany({ where: { class: { departmentId: department.id } } }),
  ]);

  const latestPerSession = await Promise.all(
    sessions.map((s) => prisma.attendanceRecord.findFirst({ where: { sessionId: s.id }, orderBy: { date: "desc" } })),
  );
  const latestRecords = latestPerSession.filter((r): r is NonNullable<typeof r> => r !== null);
  const presentToday = latestRecords.filter((r) => r.status === "PRESENT").length;
  const lateArrival = latestRecords.filter((r) => r.status === "LATE").length;

  const today = new Date();
  const onApprovedLeave = await prisma.leaveRequest.count({
    where: {
      status: "APPROVED",
      startDate: { lte: today },
      endDate: { gte: today },
      user: { departmentId: department.id, role: "LECTURER" },
    },
  });

  res.json({
    presentToday,
    totalLecturers,
    lateArrival,
    lateArrivalTrendLabel: "On par with last week",
    absentOnLeave: onApprovedLeave,
    preApprovedLeaveCount: onApprovedLeave,
  });
});

programCoordinatorRouter.get("/attendance/todays-focus", async (_req, res) => {
  const department = await getDepartment();
  const sessions = await prisma.classSession.findMany({
    where: { class: { departmentId: department.id } },
    include: { class: true },
  });

  const now = new Date();
  const todayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const nowHHmm = now.toTimeString().slice(0, 5);

  const todaySessions = sessions.filter((s) => s.dayOfWeek === todayName).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const upcoming = todaySessions.find((s) => s.startTime >= nowHHmm);
  const focusSession = upcoming ?? todaySessions[0] ?? [...sessions].sort((a, b) => a.startTime.localeCompare(b.startTime))[0] ?? null;

  res.json({
    monthLabel: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    sessionLabel: focusSession?.class.name ?? "No sessions scheduled",
    sessionTimeRangeLabel: focusSession ? `${formatTime12h(focusSession.startTime)} – ${formatTime12h(focusSession.endTime)}` : "—",
  });
});

programCoordinatorRouter.get("/attendance/course-distribution", async (_req, res) => {
  const department = await getDepartment();
  const classes = await prisma.class.findMany({
    where: { departmentId: department.id },
    include: { sessions: { include: { attendanceRecords: true } } },
    orderBy: { code: "asc" },
  });

  res.json(
    classes.map((cls) => ({
      program: cls.name,
      percentage: attendancePercentage(cls.sessions.flatMap((s) => s.attendanceRecords)),
    })),
  );
});

programCoordinatorRouter.get("/attendance/lecturer-log", async (_req, res) => {
  const department = await getDepartment();
  const records = await prisma.attendanceRecord.findMany({
    where: { session: { class: { departmentId: department.id } } },
    include: { session: { include: { class: true, lecturer: true } } },
    orderBy: { date: "desc" },
    take: 20,
  });

  res.json(
    records.map((r) => ({
      id: r.id,
      lecturerName: r.session.lecturer.name,
      lecturerAvatar: r.session.lecturer.avatarUrl ?? "",
      position: `${r.session.lecturer.position ?? "Lecturer"}, ${department.name}`,
      course: r.session.class.name.replace(`${r.session.class.code} `, ""),
      classCode: r.session.class.code,
      timeSlotLabel: `${formatTime12h(r.session.startTime)} – ${formatTime12h(r.session.endTime)}`,
      checkInLabel: r.date.toLocaleString(undefined, { hour: "numeric", minute: "2-digit" }),
      status: r.status.toLowerCase(),
      // No check-in method is modeled (QR / biometric) — the type's "—" fallback covers that.
      method: "—",
    })),
  );
});

// ---- Leave ----
programCoordinatorRouter.get("/leave/summary", async (_req, res) => {
  const department = await getDepartment();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [pendingCount, approvedMonthly, rejectedMonthly, totalManagedLecturers] = await Promise.all([
    prisma.leaveRequest.count({ where: { status: "PENDING", user: { departmentId: department.id, role: "LECTURER" } } }),
    prisma.leaveRequest.count({
      where: { status: "APPROVED", decidedAt: { gte: startOfMonth }, user: { departmentId: department.id, role: "LECTURER" } },
    }),
    prisma.leaveRequest.count({
      where: { status: "REJECTED", decidedAt: { gte: startOfMonth }, user: { departmentId: department.id, role: "LECTURER" } },
    }),
    prisma.user.count({ where: { departmentId: department.id, role: "LECTURER" } }),
  ]);

  res.json({ pendingCount, approvedMonthly, rejectedMonthly, totalManagedLecturers });
});

programCoordinatorRouter.get("/leave/queue", async (_req, res) => {
  const department = await getDepartment();
  const requests = await prisma.leaveRequest.findMany({
    where: { user: { departmentId: department.id, role: "LECTURER" } },
    include: { user: { include: { taughtSessions: { include: { class: true } } } } },
    orderBy: { requestedAt: "desc" },
  });

  res.json(
    requests.map((r) => {
      const durationDays = Math.max(1, Math.round((r.endDate.getTime() - r.startDate.getTime()) / 86_400_000) + 1);
      const taughtClass = r.user.taughtSessions[0]?.class ?? null;
      return {
        id: r.id,
        lecturerName: r.user.name,
        lecturerAvatar: r.user.avatarUrl ?? "",
        employeeId: r.user.employeeId ?? "—",
        program: department.name,
        programDetail: taughtClass?.name ?? department.name,
        startDate: r.startDate.toISOString().slice(0, 10),
        endDate: r.endDate.toISOString().slice(0, 10),
        duration: durationDays === 1 ? "1 day" : `${durationDays} days`,
        leaveType: r.leaveType,
        status: r.status.toLowerCase(),
      };
    }),
  );
});

programCoordinatorRouter.get("/leave/course-coverage", async (_req, res) => {
  const department = await getDepartment();
  const classes = await prisma.class.findMany({
    where: { departmentId: department.id },
    include: { sessions: { include: { attendanceRecords: true } } },
    orderBy: { code: "asc" },
  });

  res.json(
    classes.map((cls) => ({
      program: cls.name,
      presentPercentage: attendancePercentage(cls.sessions.flatMap((s) => s.attendanceRecords)),
    })),
  );
});

programCoordinatorRouter.get("/leave/holiday", async (_req, res) => {
  // No holiday table exists in the schema; static, same precedent as the GPA fields below.
  res.json({ name: "Pchum Ben Festival", dateRangeLabel: "Sep 30 – Oct 2, 2026", daysObserved: 3 });
});

// ---- Schedule ----
programCoordinatorRouter.get("/schedule/overview", async (_req, res) => {
  const department = await getDepartment();
  const [sessions, rooms] = await Promise.all([
    prisma.classSession.findMany({ where: { class: { departmentId: department.id } } }),
    prisma.room.findMany({ where: { departmentId: department.id } }),
  ]);

  const conflictSessionIds = detectConflictingSessionIds(sessions);
  const conflictPairs: string[] = [];
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      const a = sessions[i];
      const b = sessions[j];
      if (a.dayOfWeek !== b.dayOfWeek || a.room !== b.room) continue;
      if (a.startTime < b.endTime && b.startTime < a.endTime) {
        conflictPairs.push(`${a.room} double-booked ${DAY_ABBREV[a.dayOfWeek] ?? a.dayOfWeek} ${formatTime12h(a.startTime)} – ${formatTime12h(a.endTime)}`);
      }
    }
  }

  const totalSlotCapacity = rooms.length * 5 * new Set(sessions.map((s) => `${s.startTime}-${s.endTime}`)).size;
  const roomUtilization = totalSlotCapacity > 0 ? Math.min(100, Math.round((sessions.length / totalSlotCapacity) * 100)) : 0;

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);
  const weekRangeLabel = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const pendingActions = await prisma.leaveRequest.count({ where: { status: "PENDING", user: { departmentId: department.id, role: "LECTURER" } } });

  res.json({
    weekRangeLabel,
    conflictCount: conflictSessionIds.size / 2,
    conflictDetailLabel: conflictPairs[0] ?? "No conflicts detected",
    roomUtilization,
    roomUtilizationTrendLabel: "vs last week",
    pendingActions,
    lastUpdatedLabel: now.toLocaleString(undefined, { hour: "numeric", minute: "2-digit" }),
  });
});

// ---- Reports ----
programCoordinatorRouter.get("/reports/kpis", async (_req, res) => {
  const department = await getDepartment();
  const classes = await prisma.class.findMany({
    where: { departmentId: department.id },
    include: { sessions: { include: { attendanceRecords: true } } },
  });
  const allRecords = classes.flatMap((c) => c.sessions.flatMap((s) => s.attendanceRecords));
  const attendanceRate = attendancePercentage(allRecords);
  const attended = allRecords.filter((r) => r.status === "PRESENT" || r.status === "LATE");
  const scheduleAdherence = attended.length > 0 ? Math.round((attended.filter((r) => r.status === "PRESENT").length / attended.length) * 100) : 0;
  const totalEnrollment = classes.reduce((sum, c) => sum + c.studentCount, 0);

  res.json({
    attendanceRate,
    attendanceRateTrendLabel: "vs last semester",
    // No gradebook/GPA system is modeled (out of scope, attendance-only SRS) — static, same precedent as `/settings/security`.
    gpaAverage: 3.3,
    gpaTrendLabel: "+0.1 vs last semester",
    scheduleAdherence,
    scheduleAdherenceTrendLabel: "vs last month",
    totalEnrollment,
    totalEnrollmentTrendLabel: "this semester",
  });
});

programCoordinatorRouter.get("/reports/academic-performance-trend", async (_req, res) => {
  // No gradebook/GPA system is modeled — static, same precedent as `gpaAverage` above.
  res.json([
    { yearLabel: "2023", departmentValue: 3.0, universityAverage: 2.95 },
    { yearLabel: "2024", departmentValue: 3.1, universityAverage: 3.0 },
    { yearLabel: "2025", departmentValue: 3.2, universityAverage: 3.05 },
    { yearLabel: "2026", departmentValue: 3.3, universityAverage: 3.1 },
  ]);
});

programCoordinatorRouter.get("/reports/lecturer-adherence", async (_req, res) => {
  const department = await getDepartment();
  const lecturers = await prisma.user.findMany({
    where: { departmentId: department.id, role: "LECTURER" },
    include: { taughtSessions: { include: { attendanceRecords: true } } },
  });

  res.json(
    lecturers.map((lecturer) => {
      const records = lecturer.taughtSessions.flatMap((s) => s.attendanceRecords);
      const percentage = attendancePercentage(records);
      const tone = percentage >= 90 ? "top" : percentage >= 75 ? "stable" : "action-required";
      return {
        id: lecturer.id,
        name: lecturer.name,
        avatar: lecturer.avatarUrl ?? "",
        subject: department.name,
        percentage,
        tone,
      };
    }),
  );
});

programCoordinatorRouter.get("/reports/weekly-attendance-breakdown", async (_req, res) => {
  const department = await getDepartment();
  const classes = await prisma.class.findMany({
    where: { departmentId: department.id },
    include: { sessions: { include: { lecturer: true, attendanceRecords: true } } },
    orderBy: { code: "asc" },
  });

  res.json(
    classes.map((cls) => {
      const records = cls.sessions.flatMap((s) => s.attendanceRecords);
      const percentage = attendancePercentage(records);
      const status = percentage >= 90 ? "excellent" : percentage >= 75 ? "on-target" : "low-attendance";
      return {
        id: cls.id,
        classCode: cls.code,
        subjectName: cls.name.replace(`${cls.code} `, ""),
        lecturerName: cls.sessions[0]?.lecturer.name ?? "Unassigned",
        enrolled: cls.studentCount,
        attendancePercentage: percentage,
        status,
      };
    }),
  );
});

// ---- Settings ----
programCoordinatorRouter.get("/settings/profile", async (req, res) => {
  const department = await getDepartment();
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    fullName: user.name,
    department: department.name,
    universityEmail: user.email,
    employeeId: user.employeeId ?? "—",
    bio: user.bio ?? "",
  });
});

programCoordinatorRouter.get("/settings/access-session", async (req, res) => {
  const lastLogin = await prisma.auditLogEntry.findFirst({
    where: { actorId: req.user!.id, action: "LOGIN" },
    orderBy: { timestamp: "desc" },
  });
  res.json({
    lastLoginLabel: lastLogin ? lastLogin.timestamp.toLocaleString() : "—",
    onDuty: true,
  });
});

programCoordinatorRouter.get("/settings/policies", async (_req, res) => {
  const department = await getDepartment();
  res.json({
    automaticScheduleConflictDetection: department.autoScheduleConflictDetection,
    leaveRequestEscalation: department.leaveRequestEscalationEnabled,
    auditLogVisibility: department.auditLogVisibility,
  });
});

programCoordinatorRouter.get("/settings/alert-preferences", async (_req, res) => {
  res.json([
    { id: "ap-1", title: "Late Arrival Alerts", description: "Notify me when a lecturer checks in more than 10 minutes late." },
    { id: "ap-2", title: "Leave Request Alerts", description: "Notify me immediately when a lecturer submits a new leave request." },
    { id: "ap-3", title: "Schedule Conflict Alerts", description: "Notify me when the weekly schedule generator detects a room or lecturer conflict." },
    { id: "ap-4", title: "Weekly Digest", description: "Send a summary of attendance, leave, and schedule activity every Monday morning." },
  ]);
});
