/**
 * API layer — currently stubbed out (no mock data, no backend wired up yet).
 *
 * Every function below keeps its real signature and is still `async`, so
 * the hooks/components that call them don't need to change once a real
 * backend exists. Replace each function body with a real `fetch(...)` call
 * to your API and remove the `delay(...)` wrapper.
 */
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

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

export type AttendanceRange = "7d" | "1m" | "1y";

const EMPTY_SUMMARY: DashboardSummary = {
  totalStaff: 0,
  totalStaffGrowth: 0,
  presentToday: 0,
  presentPercentage: 0,
  onLeave: 0,
  pendingLeave: 0,
  lateArrivals: 0,
  lateArrivalsAlert: false,
};

const EMPTY_CURRENT_USER: CurrentUser = {
  name: "",
  position: "",
  avatar: "",
  department: "",
  online: false,
};

const EMPTY_PERFORMANCE_OVERVIEW: PerformanceOverview = {
  bestAttendanceStaff: { name: "", avatar: "", rate: 0 },
  mostLateStaff: { name: "", avatar: "", lateCount: 0 },
  departmentAttendanceRate: 0,
  averageCheckInTime: "—",
};

// TODO: replace with `fetch('/api/dashboard/summary')`
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return delay(EMPTY_SUMMARY);
}

// TODO: replace with `fetch(`/api/attendance/weekly?range=${range}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchWeeklyAttendance(range: AttendanceRange = "7d"): Promise<WeeklyTrendDatum[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/leave-requests')`
export async function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/attendance/today')`
export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/staff')`
export async function fetchStaffList(): Promise<Staff[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/analytics')`
export async function fetchAnalytics(): Promise<{
  attendanceTrend: AttendanceTrendDatum[];
  departmentAttendance: DepartmentAttendanceDatum[];
  leaveTypeBreakdown: LeaveTypeDatum[];
  monthlyAttendance: MonthlyAttendanceDatum[];
}> {
  return delay({
    attendanceTrend: [],
    departmentAttendance: [],
    leaveTypeBreakdown: [],
    monthlyAttendance: [],
  });
}

// TODO: replace with `fetch('/api/schedule')`
export async function fetchScheduleEvents(): Promise<ScheduleEvent[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/activity')`
export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/performance-overview')`
export async function fetchPerformanceOverview(): Promise<PerformanceOverview> {
  return delay(EMPTY_PERFORMANCE_OVERVIEW);
}

// TODO: replace with `fetch('/api/me')` (the authenticated department head)
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(EMPTY_CURRENT_USER);
}

// TODO: replace with `fetch('/api/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay([]);
}
