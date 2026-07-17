/**
 * API layer for the Class Monitor pages — wired up to the real Express/Prisma
 * backend under `Backend/src/routes/classMonitor.ts` (mounted at
 * `/api/class-monitor`), mirroring `services/superAdminService.ts`.
 */
import { apiFetch } from "@/services/apiClient";
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

export async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch("/api/me");
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return apiFetch("/api/class-monitor/notifications");
}

export async function fetchMonitorDashboardSummary(): Promise<MonitorDashboardSummary> {
  return apiFetch("/api/class-monitor/dashboard-summary");
}

export async function fetchShiftStats(): Promise<MonitorShiftStats> {
  return apiFetch("/api/class-monitor/attendance/shift-stats");
}

export async function fetchCurrentClasses(): Promise<MonitorCurrentClass[]> {
  return apiFetch("/api/class-monitor/attendance/current-classes");
}

export async function fetchSessionLog(): Promise<MonitorSessionLogEntry[]> {
  return apiFetch("/api/class-monitor/attendance/session-log");
}

export async function fetchCampusLoad(): Promise<MonitorCampusLoad> {
  return apiFetch("/api/class-monitor/attendance/campus-load");
}

export async function fetchLeaveBalances(): Promise<MonitorLeaveBalance[]> {
  return apiFetch("/api/class-monitor/leave/balances");
}

export async function fetchLeaveStatus(): Promise<MonitorLeaveStatus> {
  return apiFetch("/api/class-monitor/leave/status");
}

export async function fetchLeaveRequests(): Promise<MonitorLeaveRequest[]> {
  return apiFetch("/api/class-monitor/leave/requests");
}

export async function fetchWeeklySchedule(weekOffset = 0): Promise<MonitorWeeklyScheduleEntry[]> {
  return apiFetch(`/api/class-monitor/schedule?week=${weekOffset}`);
}

export async function fetchScheduleSummary(): Promise<MonitorScheduleSummary> {
  return apiFetch("/api/class-monitor/schedule/summary");
}

export async function fetchReportKpis(): Promise<MonitorReportKpis> {
  return apiFetch("/api/class-monitor/reports/kpis");
}

export async function fetchPerformanceTrend(): Promise<MonitorPerformanceTrendPoint[]> {
  return apiFetch("/api/class-monitor/reports/performance-trend");
}

export async function fetchErrorDistribution(): Promise<MonitorErrorDistributionDatum[]> {
  return apiFetch("/api/class-monitor/reports/error-distribution");
}

export async function fetchDepartmentCoverage(): Promise<MonitorDepartmentCoverageRow[]> {
  return apiFetch("/api/class-monitor/reports/department-coverage");
}

export async function fetchMonitorProfile(): Promise<MonitorProfile> {
  return apiFetch("/api/class-monitor/settings/profile");
}

export async function fetchMonitorAccessSession(): Promise<MonitorAccessSession> {
  return apiFetch("/api/class-monitor/settings/access-session");
}

export async function fetchNotificationPreferences(): Promise<MonitorNotificationPreference[]> {
  return apiFetch("/api/class-monitor/settings/notification-preferences");
}

/** Toggles a single notification preference by its `key` (used as `id` in the list above). */
export async function updateNotificationPreference(id: string, enabled: boolean): Promise<MonitorNotificationPreference> {
  return apiFetch(`/api/class-monitor/settings/notification-preferences/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
}
