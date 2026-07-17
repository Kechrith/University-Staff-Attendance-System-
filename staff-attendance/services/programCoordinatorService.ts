/**
 * API layer for the Program Coordinator pages — talks to the real
 * Express/Prisma backend (see `Backend/src/routes/programCoordinator.ts`),
 * mounted at `/api/program-coordinator`. Every function keeps its original
 * name/signature/return type so the hooks/components that call them didn't
 * need to change when this was wired up.
 */
import { apiFetch } from "@/services/apiClient";
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

export async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch("/api/me");
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return apiFetch("/api/program-coordinator/notifications");
}

export async function fetchCoordinatorDashboardSummary(): Promise<CoordinatorDashboardSummary> {
  return apiFetch("/api/program-coordinator/dashboard-summary");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility; the schedule grid is the same regardless of week offset (ClassSession has no per-week date)
export async function fetchCoordinatorWeeklyScheduleGrid(weekOffset = 0): Promise<CoordinatorWeeklyScheduleGrid> {
  return apiFetch("/api/program-coordinator/schedule-grid");
}

export async function fetchLiveMonitorEvents(): Promise<CoordinatorLiveMonitorEvent[]> {
  return apiFetch("/api/program-coordinator/live-monitor");
}

export async function fetchClassOverview(): Promise<CoordinatorClassOverviewItem[]> {
  return apiFetch("/api/program-coordinator/class-overview");
}

export async function fetchDailyPulse(): Promise<CoordinatorDailyPulse> {
  return apiFetch("/api/program-coordinator/attendance/daily-pulse");
}

export async function fetchTodaysFocus(): Promise<CoordinatorTodaysFocus> {
  return apiFetch("/api/program-coordinator/attendance/todays-focus");
}

export async function fetchProgramDistribution(): Promise<CoordinatorProgramDistributionDatum[]> {
  return apiFetch("/api/program-coordinator/attendance/course-distribution");
}

export async function fetchLecturerAttendanceLog(): Promise<LecturerAttendanceLogEntry[]> {
  return apiFetch("/api/program-coordinator/attendance/lecturer-log");
}

export async function fetchCoordinatorLeaveSummary(): Promise<CoordinatorLeaveSummary> {
  return apiFetch("/api/program-coordinator/leave/summary");
}

export async function fetchLeaveQueue(): Promise<LeaveQueueEntry[]> {
  return apiFetch("/api/program-coordinator/leave/queue");
}

export async function fetchProgramLeaveCoverage(): Promise<ProgramLeaveCoverageDatum[]> {
  return apiFetch("/api/program-coordinator/leave/course-coverage");
}

export async function fetchCoordinatorHolidayInfo(): Promise<CoordinatorHolidayInfo | null> {
  return apiFetch("/api/program-coordinator/leave/holiday");
}

export async function fetchCoordinatorScheduleOverview(): Promise<CoordinatorScheduleOverview> {
  return apiFetch("/api/program-coordinator/schedule/overview");
}

export async function fetchCoordinatorKpis(): Promise<CoordinatorKpis> {
  return apiFetch("/api/program-coordinator/reports/kpis");
}

export async function fetchAcademicPerformanceTrend(): Promise<AcademicPerformanceTrendPoint[]> {
  return apiFetch("/api/program-coordinator/reports/academic-performance-trend");
}

export async function fetchLecturerAdherence(): Promise<LecturerAdherenceItem[]> {
  return apiFetch("/api/program-coordinator/reports/lecturer-adherence");
}

export async function fetchWeeklyAttendanceBreakdown(): Promise<WeeklyAttendanceBreakdownRow[]> {
  return apiFetch("/api/program-coordinator/reports/weekly-attendance-breakdown");
}

export async function fetchCoordinatorProfile(): Promise<CoordinatorProfile> {
  return apiFetch("/api/program-coordinator/settings/profile");
}

export async function fetchCoordinatorAccessSession(): Promise<CoordinatorAccessSession> {
  return apiFetch("/api/program-coordinator/settings/access-session");
}

export async function fetchCoordinationPolicies(): Promise<CoordinationPolicies> {
  return apiFetch("/api/program-coordinator/settings/policies");
}

export async function fetchCoordinatorAlertPreferences(): Promise<CoordinatorAlertPreference[]> {
  return apiFetch("/api/program-coordinator/settings/alert-preferences");
}
