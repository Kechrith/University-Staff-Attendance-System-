/**
 * API layer — talks to the real Express/Prisma backend (see `Backend/`).
 */
import { apiFetch } from "@/services/apiClient";
import type {
  AttendanceRecord,
  CurrentUser,
  DashboardSummary,
  LeaveRequest,
  NotificationItem,
  PerformanceOverview,
  ScheduleEvent,
  Staff,
  WeeklyTrendDatum,
  ActivityItem,
  AttendanceTrendDatum,
  DepartmentAttendanceDatum,
  LeaveTypeDatum,
  MonthlyAttendanceDatum,
} from "@/types";

export type AttendanceRange = "7d" | "1m" | "1y";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch("/api/department-head/dashboard/summary");
}

export async function fetchWeeklyAttendance(range: AttendanceRange = "7d"): Promise<WeeklyTrendDatum[]> {
  return apiFetch(`/api/department-head/dashboard/weekly-attendance?range=${range}`);
}

export async function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  return apiFetch("/api/department-head/dashboard/leave-requests");
}

export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  return apiFetch("/api/department-head/dashboard/attendance-today");
}

export async function fetchStaffList(): Promise<Staff[]> {
  return apiFetch("/api/department-head/staff");
}

export async function fetchAnalytics(): Promise<{
  attendanceTrend: AttendanceTrendDatum[];
  departmentAttendance: DepartmentAttendanceDatum[];
  leaveTypeBreakdown: LeaveTypeDatum[];
  monthlyAttendance: MonthlyAttendanceDatum[];
}> {
  return apiFetch("/api/department-head/dashboard/analytics");
}

export async function fetchScheduleEvents(): Promise<ScheduleEvent[]> {
  return apiFetch("/api/department-head/dashboard/schedule-events");
}

export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  return apiFetch("/api/department-head/dashboard/recent-activity");
}

export async function fetchPerformanceOverview(): Promise<PerformanceOverview> {
  return apiFetch("/api/department-head/dashboard/performance-overview");
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch("/api/me");
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return apiFetch("/api/department-head/notifications");
}
