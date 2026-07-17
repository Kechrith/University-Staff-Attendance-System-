/**
 * API layer for the Class Monitor pages — currently stubbed out (no mock
 * data, no backend wired up yet), mirroring `services/programCoordinatorService.ts`.
 *
 * Every function below keeps its real signature and is still `async`, so
 * the hooks/components that call them don't need to change once a real
 * backend exists. Replace each function body with a real `fetch(...)` call
 * to your API and remove the `delay(...)` wrapper.
 */
import type {
  CurrentUser,
  MonitorAccessSession,
  MonitorCampusLoad,
  MonitorCurrentClass,
  MonitorDashboardSummary,
  MonitorDepartmentCoverageRow,
  MonitorErrorDistributionDatum,
  MonitorLeaveBalance,
  MonitorLeaveRequest,
  MonitorLeaveStatus,
  MonitorNotificationPreference,
  MonitorPerformanceTrendPoint,
  MonitorProfile,
  MonitorReportKpis,
  MonitorScheduleSummary,
  MonitorSessionLogEntry,
  MonitorShiftStats,
  MonitorWeeklyScheduleEntry,
  NotificationItem,
} from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const SAMPLE_CURRENT_USER: CurrentUser = {
  name: "Prum Sophea",
  position: "Class Monitor",
  avatar: "https://i.pravatar.cc/150?u=prum.sophea",
  department: "Data Science and Engineering (DSE)",
  online: true,
};

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Session starting soon",
    description: "DSE-301 Software Engineering for Data Systems starts at 07:00 in Room A201 with Ly Sochea.",
    timestamp: "Today, 6:45 AM",
    read: false,
  },
  {
    id: "n2",
    title: "Leave request approved",
    description: "Your Annual Leave request for Jul 24 was approved by Hout Bunthoeun.",
    timestamp: "Yesterday, 4:12 PM",
    read: true,
  },
  {
    id: "n3",
    title: "Attendance log confirmed",
    description: "Your Jul 13 attendance log for DSE-301 Software Engineering for Data Systems was reviewed with no discrepancies.",
    timestamp: "3 days ago",
    read: true,
  },
];

const SAMPLE_DASHBOARD_SUMMARY: MonitorDashboardSummary = {
  alerts: [
    {
      id: "al1",
      title: "Attendance log due",
      description: "Submit today's DSE-301 Software Engineering for Data Systems attendance log before 08:30 to stay within the recording window.",
      tone: "warning",
    },
    {
      id: "al2",
      title: "Lecturer checked in",
      description: "Ly Sochea checked in at 07:04 for DSE-301 Software Engineering for Data Systems — 4 minutes past the scheduled start.",
      tone: "info",
    },
  ],
  dailyClasses: [
    {
      id: "dc1",
      timeRangeLabel: "07:00 – 08:30",
      room: "Room A201",
      lecturerName: "Ly Sochea",
      lecturerAvatar: "https://i.pravatar.cc/150?u=ly.sochea",
      course: "DSE-301 Software Engineering for Data Systems",
      mark: "present",
    },
    {
      id: "dc2",
      timeRangeLabel: "13:00 – 14:30",
      room: "Room A201",
      lecturerName: "Ly Sochea",
      lecturerAvatar: "https://i.pravatar.cc/150?u=ly.sochea",
      course: "DSE-301 Consultation Hours",
      mark: null,
    },
  ],
  assignedClasses: [
    {
      id: "ac1",
      groupLabel: "DSE-301 Software Engineering for Data Systems",
      programLabel: "BSc Data Science and Engineering, Year 3",
      tone: "active",
    },
    {
      id: "ac2",
      groupLabel: "DSE-301 Consultation Hours",
      programLabel: "BSc Data Science and Engineering, Year 3",
      tone: "upcoming",
    },
  ],
  duty: { onDuty: true, room: "Room A201", sessionEndsInLabel: "42 min" },
};

const SAMPLE_SHIFT_STATS: MonitorShiftStats = {
  totalClassesToday: 2,
  totalRoomsLabel: "1 room — A201",
  lecturerAttendanceRate: 96,
  lecturerAttendanceTrendLabel: "+2% vs last week",
  pendingRecords: 1,
};

const SAMPLE_CAMPUS_LOAD: MonitorCampusLoad = {
  capacityPercentage: 68,
  updatedLabel: "Updated 5 min ago",
};

const SAMPLE_CURRENT_CLASSES: MonitorCurrentClass[] = [
  {
    id: "cc1",
    room: "Room A201",
    timeRangeLabel: "07:00 – 08:30",
    course: "DSE-301 Software Engineering for Data Systems",
    lecturerName: "Ly Sochea",
    marks: ["present", "present", "present", "late", "present"],
  },
  {
    id: "cc2",
    room: "Room A201",
    timeRangeLabel: "13:00 – 14:30",
    course: "DSE-301 Consultation Hours",
    lecturerName: "Ly Sochea",
    marks: [],
  },
];

// NOTE: `sl3` is a fixed reference record — Ly Sochea later disputes this entry as a
// logging mistake (see Lecturer role data). Keep course DSE-301 and the Nov 4, 2026 date.
const SAMPLE_SESSION_LOG: MonitorSessionLogEntry[] = [
  {
    id: "sl1",
    message: "Attendance recorded — DSE-301 Software Engineering for Data Systems",
    detail: "Ly Sochea marked Present. Lesson: Chapter 4: Design Patterns.",
    timestamp: "Today, 7:05 AM",
  },
  {
    id: "sl2",
    message: "Attendance recorded — DSE-301 Software Engineering for Data Systems",
    detail: "Ly Sochea marked Present. Lesson: Chapter 3: Requirements Engineering.",
    timestamp: "Mon, Jul 13, 7:03 AM",
  },
  {
    id: "sl3",
    message: "Attendance recorded — DSE-301 Software Engineering for Data Systems",
    detail: "Ly Sochea marked Absent. No lesson summary submitted.",
    timestamp: "Wed, Nov 4, 2026, 7:02 AM",
  },
  {
    id: "sl4",
    message: "Attendance recorded — DSE-301 Software Engineering for Data Systems",
    detail: "Ly Sochea marked Present. Lesson: Chapter 2: Agile Methodologies.",
    timestamp: "Thu, Jul 3, 7:02 AM",
  },
];

const SAMPLE_LEAVE_BALANCES: MonitorLeaveBalance[] = [
  { type: "Annual", remaining: 9, total: 12 },
  { type: "Sick", remaining: 6, total: 7 },
  { type: "Other", remaining: 2, total: 3 },
];

const SAMPLE_LEAVE_STATUS: MonitorLeaveStatus = {
  isOnDuty: true,
  statusLabel: "On duty — DSE-301 Software Engineering for Data Systems, Room A201",
  nextScheduledLeaveLabel: "Jul 24 – Annual Leave (1 day)",
};

const SAMPLE_LEAVE_REQUESTS: MonitorLeaveRequest[] = [
  {
    id: "lr1",
    leaveType: "Annual Leave",
    startDate: "2026-07-24",
    endDate: "2026-07-24",
    duration: "1 day",
    reason: "Family event",
    status: "approved",
  },
  {
    id: "lr2",
    leaveType: "Sick Leave",
    startDate: "2026-06-15",
    endDate: "2026-06-16",
    duration: "2 days",
    reason: "Flu recovery",
    status: "approved",
  },
  {
    id: "lr3",
    leaveType: "Emergency Leave",
    startDate: "2026-08-03",
    endDate: "2026-08-03",
    duration: "1 day",
    reason: "Urgent family matter",
    status: "pending",
  },
];

const SAMPLE_WEEKLY_SCHEDULE: MonitorWeeklyScheduleEntry[] = [
  {
    id: "ws1",
    day: "Mon",
    timeLabel: "07:00 – 08:30",
    title: "DSE-301 Software Engineering for Data Systems",
    detail: "Ly Sochea · Room A201",
    isToday: true,
  },
  {
    id: "ws2",
    day: "Wed",
    timeLabel: "13:00 – 14:30",
    title: "DSE-301 Consultation Hours",
    detail: "Ly Sochea · Room A201",
  },
  {
    id: "ws3",
    day: "Thu",
    timeLabel: "07:00 – 08:30",
    title: "DSE-301 Software Engineering for Data Systems",
    detail: "Ly Sochea · Room A201",
  },
];

const SAMPLE_SCHEDULE_SUMMARY: MonitorScheduleSummary = {
  weekRangeLabel: "Jul 13 – Jul 17, 2026",
  assignedLecturers: 1,
  activeMonitoringZones: 1,
  weeklyCoveragePercentage: 100,
};

const SAMPLE_REPORT_KPIS: MonitorReportKpis = {
  avgRecordingAccuracy: 97,
  avgRecordingAccuracyTrendLabel: "+3% vs last month",
  sessionCoverage: 100,
  sessionCoverageTrendLabel: "No sessions missed",
  lateLogs: 1,
  lateLogsTrendLabel: "-2 vs last month",
  staffComplianceLabel: "Excellent",
  staffComplianceGradeLabel: "Grade A",
};

const SAMPLE_PERFORMANCE_TREND: MonitorPerformanceTrendPoint[] = [
  { monthLabel: "Feb", accuracy: 91 },
  { monthLabel: "Mar", accuracy: 93 },
  { monthLabel: "Apr", accuracy: 95 },
  { monthLabel: "May", accuracy: 94 },
  { monthLabel: "Jun", accuracy: 96 },
  { monthLabel: "Jul", accuracy: 97 },
];

const SAMPLE_ERROR_DISTRIBUTION: MonitorErrorDistributionDatum[] = [
  { type: "manual-overrides", percentage: 55 },
  { type: "missed-scans", percentage: 15 },
  { type: "sync-delays", percentage: 30 },
];

// Single-department deployment: instead of comparing across departments, this now
// shows the Data Science and Engineering department's own weekly coverage trend.
// The `department` field holds the week label shown in the table's first column.
const SAMPLE_DEPARTMENT_COVERAGE: MonitorDepartmentCoverageRow[] = [
  {
    id: "cov-w1",
    department: "Week of Jun 29 – Jul 3",
    totalSessions: 8,
    recorded: 8,
    accuracyPercentage: 100,
    status: "optimal",
  },
  {
    id: "cov-w2",
    department: "Week of Jul 6 – Jul 10",
    totalSessions: 8,
    recorded: 7,
    accuracyPercentage: 88,
    status: "warning",
  },
  {
    id: "cov-w3",
    department: "Week of Jul 13 – Jul 17",
    totalSessions: 4,
    recorded: 4,
    accuracyPercentage: 100,
    status: "optimal",
  },
];

const SAMPLE_PROFILE: MonitorProfile = {
  fullName: "Prum Sophea",
  monitoringUnit: "Department of Data Science and Engineering — DSE-301 Software Engineering for Data Systems (Semester 1, 2026–2027)",
  universityEmail: "sophea.prum@rupp.edu.kh",
  employeeId: "EMP-1091",
  bio: "Class Monitor for DSE-301 Software Engineering for Data Systems in the Department of Data Science and Engineering, supporting Ly Sochea with reliable session-by-session attendance logging every Monday and Thursday.",
};

const SAMPLE_ACCESS_SESSION: MonitorAccessSession = {
  lastLoginLabel: "Today, 6:52 AM",
  checkInStatusLabel: "Checked in — Room A201",
};

const SAMPLE_NOTIFICATION_PREFERENCES: MonitorNotificationPreference[] = [
  {
    id: "np1",
    title: "Session start reminders",
    description: "Notify me 15 minutes before each scheduled DSE-301 session.",
    enabled: true,
  },
  {
    id: "np2",
    title: "Leave request updates",
    description: "Notify me when a leave request is approved or rejected.",
    enabled: true,
  },
  {
    id: "np3",
    title: "Attendance discrepancy alerts",
    description: "Notify me if a submitted attendance log is flagged for review.",
    enabled: true,
  },
  {
    id: "np4",
    title: "Weekly summary email",
    description: "Send a weekly summary of my attendance-logging accuracy.",
    enabled: false,
  },
];

// TODO: replace with `fetch('/api/class-monitor/me')`
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(SAMPLE_CURRENT_USER);
}

// TODO: replace with `fetch('/api/class-monitor/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay(SAMPLE_NOTIFICATIONS);
}

// TODO: replace with `fetch('/api/class-monitor/dashboard-summary')`
export async function fetchMonitorDashboardSummary(): Promise<MonitorDashboardSummary> {
  return delay(SAMPLE_DASHBOARD_SUMMARY);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/shift-stats')`
export async function fetchShiftStats(): Promise<MonitorShiftStats> {
  return delay(SAMPLE_SHIFT_STATS);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/current-classes')`
export async function fetchCurrentClasses(): Promise<MonitorCurrentClass[]> {
  return delay(SAMPLE_CURRENT_CLASSES);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/session-log')`
export async function fetchSessionLog(): Promise<MonitorSessionLogEntry[]> {
  return delay(SAMPLE_SESSION_LOG);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/campus-load')`
export async function fetchCampusLoad(): Promise<MonitorCampusLoad> {
  return delay(SAMPLE_CAMPUS_LOAD);
}

// TODO: replace with `fetch('/api/class-monitor/leave/balances')`
export async function fetchLeaveBalances(): Promise<MonitorLeaveBalance[]> {
  return delay(SAMPLE_LEAVE_BALANCES);
}

// TODO: replace with `fetch('/api/class-monitor/leave/status')`
export async function fetchLeaveStatus(): Promise<MonitorLeaveStatus> {
  return delay(SAMPLE_LEAVE_STATUS);
}

// TODO: replace with `fetch('/api/class-monitor/leave/requests')`
export async function fetchLeaveRequests(): Promise<MonitorLeaveRequest[]> {
  return delay(SAMPLE_LEAVE_REQUESTS);
}

// TODO: replace with `fetch(`/api/class-monitor/schedule?week=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchWeeklySchedule(weekOffset = 0): Promise<MonitorWeeklyScheduleEntry[]> {
  return delay(SAMPLE_WEEKLY_SCHEDULE);
}

// TODO: replace with `fetch('/api/class-monitor/schedule/summary')`
export async function fetchScheduleSummary(): Promise<MonitorScheduleSummary> {
  return delay(SAMPLE_SCHEDULE_SUMMARY);
}

// TODO: replace with `fetch('/api/class-monitor/reports/kpis')`
export async function fetchReportKpis(): Promise<MonitorReportKpis> {
  return delay(SAMPLE_REPORT_KPIS);
}

// TODO: replace with `fetch('/api/class-monitor/reports/performance-trend')`
export async function fetchPerformanceTrend(): Promise<MonitorPerformanceTrendPoint[]> {
  return delay(SAMPLE_PERFORMANCE_TREND);
}

// TODO: replace with `fetch('/api/class-monitor/reports/error-distribution')`
export async function fetchErrorDistribution(): Promise<MonitorErrorDistributionDatum[]> {
  return delay(SAMPLE_ERROR_DISTRIBUTION);
}

// TODO: replace with `fetch('/api/class-monitor/reports/department-coverage')`
export async function fetchDepartmentCoverage(): Promise<MonitorDepartmentCoverageRow[]> {
  return delay(SAMPLE_DEPARTMENT_COVERAGE);
}

// TODO: replace with `fetch('/api/class-monitor/settings/profile')`
export async function fetchMonitorProfile(): Promise<MonitorProfile> {
  return delay(SAMPLE_PROFILE);
}

// TODO: replace with `fetch('/api/class-monitor/settings/access-session')`
export async function fetchMonitorAccessSession(): Promise<MonitorAccessSession> {
  return delay(SAMPLE_ACCESS_SESSION);
}

// TODO: replace with `fetch('/api/class-monitor/settings/notification-preferences')`
export async function fetchNotificationPreferences(): Promise<MonitorNotificationPreference[]> {
  return delay(SAMPLE_NOTIFICATION_PREFERENCES);
}
