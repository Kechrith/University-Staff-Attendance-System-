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

const EMPTY_CURRENT_USER: CurrentUser = {
  name: "",
  position: "",
  avatar: "",
  department: "",
  online: false,
};

const EMPTY_DASHBOARD_SUMMARY: MonitorDashboardSummary = {
  alerts: [],
  dailyClasses: [],
  assignedClasses: [],
  duty: { onDuty: false, room: "", sessionEndsInLabel: "—" },
};

const EMPTY_SHIFT_STATS: MonitorShiftStats = {
  totalClassesToday: 0,
  totalRoomsLabel: "—",
  lecturerAttendanceRate: 0,
  lecturerAttendanceTrendLabel: "—",
  pendingRecords: 0,
};

const EMPTY_CAMPUS_LOAD: MonitorCampusLoad = {
  capacityPercentage: 0,
  updatedLabel: "—",
};

const EMPTY_LEAVE_STATUS: MonitorLeaveStatus = {
  isOnDuty: false,
  statusLabel: "—",
  nextScheduledLeaveLabel: "—",
};

const EMPTY_SCHEDULE_SUMMARY: MonitorScheduleSummary = {
  weekRangeLabel: "—",
  assignedLecturers: 0,
  activeMonitoringZones: 0,
  weeklyCoveragePercentage: 0,
};

const EMPTY_REPORT_KPIS: MonitorReportKpis = {
  avgRecordingAccuracy: 0,
  avgRecordingAccuracyTrendLabel: "—",
  sessionCoverage: 0,
  sessionCoverageTrendLabel: "—",
  lateLogs: 0,
  lateLogsTrendLabel: "—",
  staffComplianceLabel: "—",
  staffComplianceGradeLabel: "—",
};

const EMPTY_PROFILE: MonitorProfile = {
  fullName: "",
  monitoringUnit: "",
  universityEmail: "",
  employeeId: "",
  bio: "",
};

const EMPTY_ACCESS_SESSION: MonitorAccessSession = {
  lastLoginLabel: "—",
  checkInStatusLabel: "—",
};

// TODO: replace with `fetch('/api/class-monitor/me')`
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(EMPTY_CURRENT_USER);
}

// TODO: replace with `fetch('/api/class-monitor/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/dashboard-summary')`
export async function fetchMonitorDashboardSummary(): Promise<MonitorDashboardSummary> {
  return delay(EMPTY_DASHBOARD_SUMMARY);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/shift-stats')`
export async function fetchShiftStats(): Promise<MonitorShiftStats> {
  return delay(EMPTY_SHIFT_STATS);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/current-classes')`
export async function fetchCurrentClasses(): Promise<MonitorCurrentClass[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/session-log')`
export async function fetchSessionLog(): Promise<MonitorSessionLogEntry[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/attendance/campus-load')`
export async function fetchCampusLoad(): Promise<MonitorCampusLoad> {
  return delay(EMPTY_CAMPUS_LOAD);
}

// TODO: replace with `fetch('/api/class-monitor/leave/balances')`
export async function fetchLeaveBalances(): Promise<MonitorLeaveBalance[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/leave/status')`
export async function fetchLeaveStatus(): Promise<MonitorLeaveStatus> {
  return delay(EMPTY_LEAVE_STATUS);
}

// TODO: replace with `fetch('/api/class-monitor/leave/requests')`
export async function fetchLeaveRequests(): Promise<MonitorLeaveRequest[]> {
  return delay([]);
}

// TODO: replace with `fetch(`/api/class-monitor/schedule?week=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchWeeklySchedule(weekOffset = 0): Promise<MonitorWeeklyScheduleEntry[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/schedule/summary')`
export async function fetchScheduleSummary(): Promise<MonitorScheduleSummary> {
  return delay(EMPTY_SCHEDULE_SUMMARY);
}

// TODO: replace with `fetch('/api/class-monitor/reports/kpis')`
export async function fetchReportKpis(): Promise<MonitorReportKpis> {
  return delay(EMPTY_REPORT_KPIS);
}

// TODO: replace with `fetch('/api/class-monitor/reports/performance-trend')`
export async function fetchPerformanceTrend(): Promise<MonitorPerformanceTrendPoint[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/reports/error-distribution')`
export async function fetchErrorDistribution(): Promise<MonitorErrorDistributionDatum[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/reports/department-coverage')`
export async function fetchDepartmentCoverage(): Promise<MonitorDepartmentCoverageRow[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/class-monitor/settings/profile')`
export async function fetchMonitorProfile(): Promise<MonitorProfile> {
  return delay(EMPTY_PROFILE);
}

// TODO: replace with `fetch('/api/class-monitor/settings/access-session')`
export async function fetchMonitorAccessSession(): Promise<MonitorAccessSession> {
  return delay(EMPTY_ACCESS_SESSION);
}

// TODO: replace with `fetch('/api/class-monitor/settings/notification-preferences')`
export async function fetchNotificationPreferences(): Promise<MonitorNotificationPreference[]> {
  return delay([]);
}
