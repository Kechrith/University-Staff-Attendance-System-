/**
 * API layer for the Program Coordinator pages — currently stubbed out (no
 * backend wired up yet), mirroring `services/dashboardService.ts`. Returns
 * realistic sample data (not a real backend) so the pages are meaningful to
 * look at; every function is preceded by a `// TODO` comment pointing at the
 * real endpoint it should eventually call.
 *
 * Sample data is scoped to a single program: the Department of Data Science
 * and Engineering (Faculty of Engineering) — Chan Pisey's only program,
 * with 2 lecturers (Ly Sochea, Vann Kimheng), 2 class monitors, and 4
 * courses (DSE-101, DSE-204, DSE-205, DSE-301). No other department is
 * referenced anywhere below.
 *
 * Every function below keeps its real signature and is still `async`, so
 * the hooks/components that call them don't need to change once a real
 * backend exists. Replace each function body with a real `fetch(...)` call
 * to your API and remove the `delay(...)` wrapper.
 */
import type {
  AcademicPerformanceTrendPoint,
  CoordinationPolicies,
  CoordinatorAccessSession,
  CoordinatorAlertPreference,
  CoordinatorClassOverviewItem,
  CoordinatorDailyPulse,
  CoordinatorDashboardSummary,
  CoordinatorHolidayInfo,
  CoordinatorKpis,
  CoordinatorLeaveSummary,
  CoordinatorLiveMonitorEvent,
  CoordinatorProfile,
  CoordinatorProgramDistributionDatum,
  CoordinatorScheduleOverview,
  CoordinatorTodaysFocus,
  CoordinatorWeeklyScheduleGrid,
  CurrentUser,
  LeaveQueueEntry,
  LecturerAdherenceItem,
  LecturerAttendanceLogEntry,
  NotificationItem,
  ProgramLeaveCoverageDatum,
  WeeklyAttendanceBreakdownRow,
} from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const SAMPLE_CURRENT_USER: CurrentUser = {
  name: "Chan Pisey",
  position: "Program Coordinator",
  avatar: "",
  department: "Data Science and Engineering (DSE)",
  online: true,
};

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "ntf-1",
    title: "New leave request",
    description: "Vann Kimheng requested Sick Leave for Jul 20 – Jul 21, covering DSE-101.",
    timestamp: "20 minutes ago",
    read: false,
  },
  {
    id: "ntf-2",
    title: "Schedule conflict detected",
    description: "Room C302 is double-booked Wednesday 14:30 – 16:00 (DSE-205 vs faculty meeting).",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "ntf-3",
    title: "Lecturer checked in late",
    description: "Ly Sochea checked in 12 minutes late for DSE-204 Data Structures.",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "ntf-4",
    title: "Weekly digest ready",
    description: "Attendance, leave, and schedule summary for Jul 13 – Jul 17 is available.",
    timestamp: "Yesterday",
    read: true,
  },
];

const SAMPLE_DASHBOARD_SUMMARY: CoordinatorDashboardSummary = {
  managedPrograms: 1,
  managedProgramsGrowthLabel: "Faculty of Engineering",
  activeLecturers: 2,
  activeLecturersRateLabel: "Both checked in today",
  absenceAlerts: 0,
  roomUtilization: 58,
  roomSeatCount: 135,
};

const SAMPLE_WEEKLY_SCHEDULE_GRID: CoordinatorWeeklyScheduleGrid = {
  timeSlots: ["07:00 – 08:30", "08:30 – 10:00", "10:00 – 11:30", "13:00 – 14:30", "14:30 – 16:00"],
  slots: [
    { id: "slot-1", day: "Mon", time: "07:00 – 08:30", title: "DSE-101 Intro to Data Science", subtitle: "Vann Kimheng • Room A105", status: "lecture" },
    { id: "slot-2", day: "Mon", time: "10:00 – 11:30", title: "DSE-301 Software Engineering for Data Systems", subtitle: "Ly Sochea • Room A201", status: "lecture" },
    { id: "slot-3", day: "Tue", time: "08:30 – 10:00", title: "DSE-204 Data Structures", subtitle: "Ly Sochea • Room A201", status: "lecture" },
    { id: "slot-4", day: "Tue", time: "13:00 – 14:30", title: "DSE-205 Machine Learning Basics", subtitle: "Vann Kimheng • Room C302", status: "lab" },
    { id: "slot-5", day: "Wed", time: "10:00 – 11:30", title: "DSE-101 Intro to Data Science", subtitle: "Vann Kimheng • Room A105", status: "lecture" },
    { id: "slot-6", day: "Wed", time: "14:30 – 16:00", title: "DSE-205 Machine Learning Basics", subtitle: "Vann Kimheng • Room C302", status: "conflict" },
    { id: "slot-7", day: "Thu", time: "07:00 – 08:30", title: "DSE-301 Software Engineering for Data Systems", subtitle: "Ly Sochea • Room A201", status: "lecture" },
    { id: "slot-8", day: "Fri", time: "08:30 – 10:00", title: "DSE-204 Data Structures", subtitle: "Ly Sochea • Room A201", status: "lecture" },
  ],
};

const SAMPLE_LIVE_MONITOR_EVENTS: CoordinatorLiveMonitorEvent[] = [
  { id: "lm-1", message: "Vann Kimheng checked in", detail: "DSE-101 Intro to Data Science • Room A105", timestamp: "7:58 AM", tone: "success" },
  { id: "lm-2", message: "Late arrival flagged", detail: "Ly Sochea arrived 12 minutes late for DSE-204 Data Structures", timestamp: "8:42 AM", tone: "warning" },
  { id: "lm-3", message: "Room booked back-to-back", detail: "Room A201 has two consecutive DSE sessions today", timestamp: "9:00 AM", tone: "info" },
];

const SAMPLE_CLASS_OVERVIEW: CoordinatorClassOverviewItem[] = [
  {
    id: "co-1",
    department: "Data Science and Engineering",
    studentCount: 34,
    title: "DSE-101 Intro to Data Science",
    instructorName: "Vann Kimheng",
    instructorAvatar: "",
    scheduleLabel: "Mon, Wed • 07:00 – 08:30",
    status: "present",
  },
  {
    id: "co-2",
    department: "Data Science and Engineering",
    studentCount: 30,
    title: "DSE-204 Data Structures",
    instructorName: "Ly Sochea",
    instructorAvatar: "",
    scheduleLabel: "Tue, Fri • 08:30 – 10:00",
    status: "late",
  },
  {
    id: "co-3",
    department: "Data Science and Engineering",
    studentCount: 28,
    title: "DSE-205 Machine Learning Basics",
    instructorName: "Vann Kimheng",
    instructorAvatar: "",
    scheduleLabel: "Tue • 13:00 – 14:30",
    status: "upcoming",
  },
  {
    id: "co-4",
    department: "Data Science and Engineering",
    studentCount: 26,
    title: "DSE-301 Software Engineering for Data Systems",
    instructorName: "Ly Sochea",
    instructorAvatar: "",
    scheduleLabel: "Mon, Thu • 10:00 – 11:30",
    status: "present",
  },
];

const SAMPLE_DAILY_PULSE: CoordinatorDailyPulse = {
  presentToday: 1,
  totalLecturers: 2,
  lateArrival: 1,
  lateArrivalTrendLabel: "On par with last week",
  absentOnLeave: 0,
  preApprovedLeaveCount: 0,
};

const SAMPLE_TODAYS_FOCUS: CoordinatorTodaysFocus = {
  monthLabel: "July 2026",
  sessionLabel: "DSE-101 Intro to Data Science",
  sessionTimeRangeLabel: "07:00 AM – 08:30 AM",
};

// Attendance rate by course (the program's 4 DSE courses — there is only one department to distribute across).
const SAMPLE_PROGRAM_DISTRIBUTION: CoordinatorProgramDistributionDatum[] = [
  { program: "DSE-101 Intro to Data Science", percentage: 94 },
  { program: "DSE-204 Data Structures", percentage: 90 },
  { program: "DSE-205 Machine Learning Basics", percentage: 96 },
  { program: "DSE-301 Software Engineering for Data Systems", percentage: 82 },
];

const SAMPLE_LECTURER_ATTENDANCE_LOG: LecturerAttendanceLogEntry[] = [
  {
    id: "log-1",
    lecturerName: "Vann Kimheng",
    lecturerAvatar: "",
    position: "Lecturer, Data Science and Engineering",
    course: "Intro to Data Science",
    classCode: "DSE-101",
    timeSlotLabel: "07:00 – 08:30",
    checkInLabel: "7:58 AM",
    status: "present",
    method: "QR Scan",
  },
  {
    id: "log-2",
    lecturerName: "Vann Kimheng",
    lecturerAvatar: "",
    position: "Lecturer, Data Science and Engineering",
    course: "Machine Learning Basics",
    classCode: "DSE-205",
    timeSlotLabel: "13:00 – 14:30",
    checkInLabel: "1:05 PM",
    status: "present",
    method: "Biometric",
  },
  {
    id: "log-3",
    lecturerName: "Ly Sochea",
    lecturerAvatar: "",
    position: "Lecturer, Data Science and Engineering",
    course: "Data Structures",
    classCode: "DSE-204",
    timeSlotLabel: "08:30 – 10:00",
    checkInLabel: "8:42 AM",
    status: "late",
    method: "QR Scan",
  },
  {
    id: "log-4",
    lecturerName: "Ly Sochea",
    lecturerAvatar: "",
    position: "Lecturer, Data Science and Engineering",
    course: "Software Engineering for Data Systems",
    classCode: "DSE-301",
    timeSlotLabel: "10:00 – 11:30",
    checkInLabel: "10:02 AM",
    status: "present",
    method: "QR Scan",
  },
];

const SAMPLE_LEAVE_SUMMARY: CoordinatorLeaveSummary = {
  pendingCount: 1,
  approvedMonthly: 2,
  rejectedMonthly: 0,
  totalManagedLecturers: 2,
};

const SAMPLE_LEAVE_QUEUE: LeaveQueueEntry[] = [
  {
    id: "lq-1",
    lecturerName: "Vann Kimheng",
    lecturerAvatar: "",
    employeeId: "RUPP-LEC-0097",
    program: "Data Science and Engineering",
    programDetail: "DSE-101 Intro to Data Science",
    startDate: "2026-07-20",
    endDate: "2026-07-21",
    duration: "2 days",
    leaveType: "Sick Leave",
    status: "pending",
  },
  {
    id: "lq-2",
    lecturerName: "Ly Sochea",
    lecturerAvatar: "",
    employeeId: "RUPP-LEC-0056",
    program: "Data Science and Engineering",
    programDetail: "DSE-301 Software Engineering for Data Systems",
    startDate: "2026-07-10",
    endDate: "2026-07-11",
    duration: "2 days",
    leaveType: "Annual Leave",
    status: "approved",
  },
  {
    id: "lq-3",
    lecturerName: "Vann Kimheng",
    lecturerAvatar: "",
    employeeId: "RUPP-LEC-0097",
    program: "Data Science and Engineering",
    programDetail: "DSE-205 Machine Learning Basics",
    startDate: "2026-07-05",
    endDate: "2026-07-05",
    duration: "1 day",
    leaveType: "Emergency Leave",
    status: "approved",
  },
];

// Leave coverage (present rate) by course — the program's 4 DSE courses.
const SAMPLE_PROGRAM_LEAVE_COVERAGE: ProgramLeaveCoverageDatum[] = [
  { program: "DSE-101 Intro to Data Science", presentPercentage: 92 },
  { program: "DSE-204 Data Structures", presentPercentage: 88 },
  { program: "DSE-205 Machine Learning Basics", presentPercentage: 95 },
  { program: "DSE-301 Software Engineering for Data Systems", presentPercentage: 85 },
];

const SAMPLE_HOLIDAY_INFO: CoordinatorHolidayInfo = {
  name: "Pchum Ben Festival",
  dateRangeLabel: "Sep 30 – Oct 2, 2026",
  daysObserved: 3,
};

const SAMPLE_SCHEDULE_OVERVIEW: CoordinatorScheduleOverview = {
  weekRangeLabel: "Jul 13 – Jul 17, 2026",
  conflictCount: 1,
  conflictDetailLabel: "Room C302 double-booked Wed 14:30 – 16:00 (DSE-205 vs faculty meeting)",
  roomUtilization: 58,
  roomUtilizationTrendLabel: "+3% vs last week",
  pendingActions: 1,
  lastUpdatedLabel: "Today, 8:30 AM",
};

const SAMPLE_KPIS: CoordinatorKpis = {
  attendanceRate: 90,
  attendanceRateTrendLabel: "+2% vs last semester",
  gpaAverage: 3.3,
  gpaTrendLabel: "+0.1 vs last semester",
  scheduleAdherence: 93,
  scheduleAdherenceTrendLabel: "+1% vs last month",
  totalEnrollment: 118,
  totalEnrollmentTrendLabel: "+6 this semester",
};

const SAMPLE_ACADEMIC_PERFORMANCE_TREND: AcademicPerformanceTrendPoint[] = [
  { yearLabel: "2023", departmentValue: 3.0, universityAverage: 2.95 },
  { yearLabel: "2024", departmentValue: 3.1, universityAverage: 3.0 },
  { yearLabel: "2025", departmentValue: 3.2, universityAverage: 3.05 },
  { yearLabel: "2026", departmentValue: 3.3, universityAverage: 3.1 },
];

const SAMPLE_LECTURER_ADHERENCE: LecturerAdherenceItem[] = [
  { id: "la-1", name: "Vann Kimheng", avatar: "", subject: "Data Science and Engineering", percentage: 95, tone: "top" },
  { id: "la-2", name: "Ly Sochea", avatar: "", subject: "Data Science and Engineering", percentage: 88, tone: "stable" },
];

const SAMPLE_WEEKLY_ATTENDANCE_BREAKDOWN: WeeklyAttendanceBreakdownRow[] = [
  { id: "wb-1", classCode: "DSE-101", subjectName: "Intro to Data Science", lecturerName: "Vann Kimheng", enrolled: 34, attendancePercentage: 94, status: "excellent" },
  { id: "wb-2", classCode: "DSE-204", subjectName: "Data Structures", lecturerName: "Ly Sochea", enrolled: 30, attendancePercentage: 90, status: "on-target" },
  { id: "wb-3", classCode: "DSE-205", subjectName: "Machine Learning Basics", lecturerName: "Vann Kimheng", enrolled: 28, attendancePercentage: 96, status: "excellent" },
  { id: "wb-4", classCode: "DSE-301", subjectName: "Software Engineering for Data Systems", lecturerName: "Ly Sochea", enrolled: 26, attendancePercentage: 82, status: "on-target" },
];

const SAMPLE_PROFILE: CoordinatorProfile = {
  fullName: "Chan Pisey",
  department: "Data Science and Engineering",
  universityEmail: "chan.pisey@rupp.edu.kh",
  employeeId: "RUPP-PC-0031",
  bio: "Program Coordinator for the Department of Data Science and Engineering, Faculty of Engineering — overseeing lecturer scheduling, attendance monitoring, and leave coordination for DSE-101, DSE-204, DSE-205, and DSE-301.",
};

const SAMPLE_ACCESS_SESSION: CoordinatorAccessSession = {
  lastLoginLabel: "Today, 7:45 AM",
  onDuty: true,
};

const SAMPLE_POLICIES: CoordinationPolicies = {
  automaticScheduleConflictDetection: true,
  leaveRequestEscalation: true,
  auditLogVisibility: false,
};

const SAMPLE_ALERT_PREFERENCES: CoordinatorAlertPreference[] = [
  { id: "ap-1", title: "Late Arrival Alerts", description: "Notify me when a lecturer checks in more than 10 minutes late." },
  { id: "ap-2", title: "Leave Request Alerts", description: "Notify me immediately when a lecturer submits a new leave request." },
  { id: "ap-3", title: "Schedule Conflict Alerts", description: "Notify me when the weekly schedule generator detects a room or lecturer conflict." },
  { id: "ap-4", title: "Weekly Digest", description: "Send a summary of attendance, leave, and schedule activity every Monday morning." },
];

// TODO: replace with `fetch('/api/program-coordinator/me')`
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(SAMPLE_CURRENT_USER);
}

// TODO: replace with `fetch('/api/program-coordinator/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay(SAMPLE_NOTIFICATIONS);
}

// TODO: replace with `fetch('/api/program-coordinator/dashboard-summary')`
export async function fetchCoordinatorDashboardSummary(): Promise<CoordinatorDashboardSummary> {
  return delay(SAMPLE_DASHBOARD_SUMMARY);
}

// TODO: replace with `fetch(`/api/program-coordinator/schedule-grid?week=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchCoordinatorWeeklyScheduleGrid(weekOffset = 0): Promise<CoordinatorWeeklyScheduleGrid> {
  return delay(SAMPLE_WEEKLY_SCHEDULE_GRID);
}

// TODO: replace with `fetch('/api/program-coordinator/live-monitor')`
export async function fetchLiveMonitorEvents(): Promise<CoordinatorLiveMonitorEvent[]> {
  return delay(SAMPLE_LIVE_MONITOR_EVENTS);
}

// TODO: replace with `fetch('/api/program-coordinator/class-overview')`
export async function fetchClassOverview(): Promise<CoordinatorClassOverviewItem[]> {
  return delay(SAMPLE_CLASS_OVERVIEW);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/daily-pulse')`
export async function fetchDailyPulse(): Promise<CoordinatorDailyPulse> {
  return delay(SAMPLE_DAILY_PULSE);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/todays-focus')`
export async function fetchTodaysFocus(): Promise<CoordinatorTodaysFocus> {
  return delay(SAMPLE_TODAYS_FOCUS);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/course-distribution')`
export async function fetchProgramDistribution(): Promise<CoordinatorProgramDistributionDatum[]> {
  return delay(SAMPLE_PROGRAM_DISTRIBUTION);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/lecturer-log')`
export async function fetchLecturerAttendanceLog(): Promise<LecturerAttendanceLogEntry[]> {
  return delay(SAMPLE_LECTURER_ATTENDANCE_LOG);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/summary')`
export async function fetchCoordinatorLeaveSummary(): Promise<CoordinatorLeaveSummary> {
  return delay(SAMPLE_LEAVE_SUMMARY);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/queue')`
export async function fetchLeaveQueue(): Promise<LeaveQueueEntry[]> {
  return delay(SAMPLE_LEAVE_QUEUE);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/course-coverage')`
export async function fetchProgramLeaveCoverage(): Promise<ProgramLeaveCoverageDatum[]> {
  return delay(SAMPLE_PROGRAM_LEAVE_COVERAGE);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/holiday')`
export async function fetchCoordinatorHolidayInfo(): Promise<CoordinatorHolidayInfo | null> {
  return delay(SAMPLE_HOLIDAY_INFO);
}

// TODO: replace with `fetch('/api/program-coordinator/schedule/overview')`
export async function fetchCoordinatorScheduleOverview(): Promise<CoordinatorScheduleOverview> {
  return delay(SAMPLE_SCHEDULE_OVERVIEW);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/kpis')`
export async function fetchCoordinatorKpis(): Promise<CoordinatorKpis> {
  return delay(SAMPLE_KPIS);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/academic-performance-trend')`
export async function fetchAcademicPerformanceTrend(): Promise<AcademicPerformanceTrendPoint[]> {
  return delay(SAMPLE_ACADEMIC_PERFORMANCE_TREND);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/lecturer-adherence')`
export async function fetchLecturerAdherence(): Promise<LecturerAdherenceItem[]> {
  return delay(SAMPLE_LECTURER_ADHERENCE);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/weekly-attendance-breakdown')`
export async function fetchWeeklyAttendanceBreakdown(): Promise<WeeklyAttendanceBreakdownRow[]> {
  return delay(SAMPLE_WEEKLY_ATTENDANCE_BREAKDOWN);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/profile')`
export async function fetchCoordinatorProfile(): Promise<CoordinatorProfile> {
  return delay(SAMPLE_PROFILE);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/access-session')`
export async function fetchCoordinatorAccessSession(): Promise<CoordinatorAccessSession> {
  return delay(SAMPLE_ACCESS_SESSION);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/policies')`
export async function fetchCoordinationPolicies(): Promise<CoordinationPolicies> {
  return delay(SAMPLE_POLICIES);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/alert-preferences')`
export async function fetchCoordinatorAlertPreferences(): Promise<CoordinatorAlertPreference[]> {
  return delay(SAMPLE_ALERT_PREFERENCES);
}
