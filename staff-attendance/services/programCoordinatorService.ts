/**
 * API layer for the Program Coordinator pages — currently stubbed out (no
 * mock data, no backend wired up yet), mirroring `services/dashboardService.ts`.
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
  CoordinatorSecurityItem,
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

const EMPTY_CURRENT_USER: CurrentUser = {
  name: "",
  position: "",
  avatar: "",
  department: "",
  online: false,
};

const EMPTY_DASHBOARD_SUMMARY: CoordinatorDashboardSummary = {
  managedPrograms: 0,
  managedProgramsGrowthLabel: "—",
  activeLecturers: 0,
  activeLecturersRateLabel: "—",
  absenceAlerts: 0,
  roomUtilization: 0,
  roomSeatCount: 0,
};

const EMPTY_WEEKLY_SCHEDULE_GRID: CoordinatorWeeklyScheduleGrid = {
  timeSlots: [],
  slots: [],
};

const EMPTY_DAILY_PULSE: CoordinatorDailyPulse = {
  presentToday: 0,
  totalLecturers: 0,
  lateArrival: 0,
  lateArrivalTrendLabel: "—",
  absentOnLeave: 0,
  preApprovedLeaveCount: 0,
};

const EMPTY_TODAYS_FOCUS: CoordinatorTodaysFocus = {
  monthLabel: "—",
  sessionLabel: "—",
  sessionTimeRangeLabel: "—",
};

const EMPTY_LEAVE_SUMMARY: CoordinatorLeaveSummary = {
  pendingCount: 0,
  approvedMonthly: 0,
  rejectedMonthly: 0,
  totalManagedLecturers: 0,
};

const EMPTY_SCHEDULE_OVERVIEW: CoordinatorScheduleOverview = {
  weekRangeLabel: "—",
  conflictCount: 0,
  conflictDetailLabel: "—",
  roomUtilization: 0,
  roomUtilizationTrendLabel: "—",
  pendingActions: 0,
  lastUpdatedLabel: "—",
};

const EMPTY_KPIS: CoordinatorKpis = {
  attendanceRate: 0,
  attendanceRateTrendLabel: "—",
  gpaAverage: 0,
  gpaTrendLabel: "—",
  scheduleAdherence: 0,
  scheduleAdherenceTrendLabel: "—",
  totalEnrollment: 0,
  totalEnrollmentTrendLabel: "—",
};

const EMPTY_PROFILE: CoordinatorProfile = {
  fullName: "",
  department: "",
  universityEmail: "",
  employeeId: "",
  bio: "",
};

const EMPTY_ACCESS_SESSION: CoordinatorAccessSession = {
  lastLoginLabel: "—",
  onDuty: false,
};

const EMPTY_POLICIES: CoordinationPolicies = {
  automaticScheduleConflictDetection: false,
  leaveRequestEscalation: false,
  auditLogVisibility: false,
};

// TODO: replace with `fetch('/api/program-coordinator/me')`
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(EMPTY_CURRENT_USER);
}

// TODO: replace with `fetch('/api/program-coordinator/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/dashboard-summary')`
export async function fetchCoordinatorDashboardSummary(): Promise<CoordinatorDashboardSummary> {
  return delay(EMPTY_DASHBOARD_SUMMARY);
}

// TODO: replace with `fetch(`/api/program-coordinator/schedule-grid?week=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchCoordinatorWeeklyScheduleGrid(weekOffset = 0): Promise<CoordinatorWeeklyScheduleGrid> {
  return delay(EMPTY_WEEKLY_SCHEDULE_GRID);
}

// TODO: replace with `fetch('/api/program-coordinator/live-monitor')`
export async function fetchLiveMonitorEvents(): Promise<CoordinatorLiveMonitorEvent[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/class-overview')`
export async function fetchClassOverview(): Promise<CoordinatorClassOverviewItem[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/daily-pulse')`
export async function fetchDailyPulse(): Promise<CoordinatorDailyPulse> {
  return delay(EMPTY_DAILY_PULSE);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/todays-focus')`
export async function fetchTodaysFocus(): Promise<CoordinatorTodaysFocus> {
  return delay(EMPTY_TODAYS_FOCUS);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/program-distribution')`
export async function fetchProgramDistribution(): Promise<CoordinatorProgramDistributionDatum[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/attendance/lecturer-log')`
export async function fetchLecturerAttendanceLog(): Promise<LecturerAttendanceLogEntry[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/summary')`
export async function fetchCoordinatorLeaveSummary(): Promise<CoordinatorLeaveSummary> {
  return delay(EMPTY_LEAVE_SUMMARY);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/queue')`
export async function fetchLeaveQueue(): Promise<LeaveQueueEntry[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/program-coverage')`
export async function fetchProgramLeaveCoverage(): Promise<ProgramLeaveCoverageDatum[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/leave/holiday')`
export async function fetchCoordinatorHolidayInfo(): Promise<CoordinatorHolidayInfo | null> {
  return delay(null);
}

// TODO: replace with `fetch('/api/program-coordinator/schedule/overview')`
export async function fetchCoordinatorScheduleOverview(): Promise<CoordinatorScheduleOverview> {
  return delay(EMPTY_SCHEDULE_OVERVIEW);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/kpis')`
export async function fetchCoordinatorKpis(): Promise<CoordinatorKpis> {
  return delay(EMPTY_KPIS);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/academic-performance-trend')`
export async function fetchAcademicPerformanceTrend(): Promise<AcademicPerformanceTrendPoint[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/lecturer-adherence')`
export async function fetchLecturerAdherence(): Promise<LecturerAdherenceItem[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/reports/weekly-attendance-breakdown')`
export async function fetchWeeklyAttendanceBreakdown(): Promise<WeeklyAttendanceBreakdownRow[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/profile')`
export async function fetchCoordinatorProfile(): Promise<CoordinatorProfile> {
  return delay(EMPTY_PROFILE);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/access-session')`
export async function fetchCoordinatorAccessSession(): Promise<CoordinatorAccessSession> {
  return delay(EMPTY_ACCESS_SESSION);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/policies')`
export async function fetchCoordinationPolicies(): Promise<CoordinationPolicies> {
  return delay(EMPTY_POLICIES);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/alert-preferences')`
export async function fetchCoordinatorAlertPreferences(): Promise<CoordinatorAlertPreference[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/program-coordinator/settings/security')`
export async function fetchCoordinatorSecurityItems(): Promise<CoordinatorSecurityItem[]> {
  return delay([]);
}
