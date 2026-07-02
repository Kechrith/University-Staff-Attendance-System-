/**
 * API layer for the Lecturer pages — currently stubbed out (no mock data,
 * no backend wired up yet), mirroring `services/programCoordinatorService.ts`.
 *
 * Every function below keeps its real signature and is still `async`, so
 * the hooks/components that call them don't need to change once a real
 * backend exists. Replace each function body with a real `fetch(...)` call
 * to your API and remove the `delay(...)` wrapper.
 */
import type {
  CurrentUser,
  LecturerAccessSession,
  LecturerAlertPreference,
  LecturerAttendanceRecord,
  LecturerDashboardSummary,
  LecturerLeaveRequest,
  LecturerLeaveSummary,
  LecturerProfile,
  LecturerSecurityItem,
  LecturerTodayClass,
  LecturerWeeklyScheduleGrid,
  LeaveType,
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

const EMPTY_DASHBOARD_SUMMARY: LecturerDashboardSummary = {
  attendanceRate: 0,
  attendanceRateTrendLabel: "—",
  classesThisMonth: 0,
  classesThisMonthTrendLabel: "—",
  lateCount: 0,
  pendingDisputes: 0,
};

const EMPTY_WEEKLY_SCHEDULE_GRID: LecturerWeeklyScheduleGrid = {
  weekRangeLabel: "—",
  timeSlots: [],
  slots: [],
};

const EMPTY_PROFILE: LecturerProfile = {
  fullName: "",
  position: "",
  department: "",
  universityEmail: "",
  employeeId: "",
  phone: "",
  bio: "",
};

const EMPTY_ACCESS_SESSION: LecturerAccessSession = {
  lastLoginLabel: "—",
  notifyOnNewEntry: false,
};

const EMPTY_LEAVE_SUMMARY: LecturerLeaveSummary = {
  remainingDays: 0,
  usedDays: 0,
  pendingCount: 0,
  approvedThisYear: 0,
};

// TODO: replace with `fetch('/api/lecturer/me')`
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(EMPTY_CURRENT_USER);
}

// TODO: replace with `fetch('/api/lecturer/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/lecturer/dashboard-summary')`
export async function fetchLecturerDashboardSummary(): Promise<LecturerDashboardSummary> {
  return delay(EMPTY_DASHBOARD_SUMMARY);
}

// TODO: replace with `fetch('/api/lecturer/todays-classes')`
export async function fetchTodaysClasses(): Promise<LecturerTodayClass[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/lecturer/attendance-records')`
export async function fetchLecturerAttendanceRecords(): Promise<LecturerAttendanceRecord[]> {
  return delay([]);
}

// TODO: replace with `fetch(`/api/lecturer/schedule-grid?week=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchLecturerWeeklyScheduleGrid(weekOffset = 0): Promise<LecturerWeeklyScheduleGrid> {
  return delay(EMPTY_WEEKLY_SCHEDULE_GRID);
}

// TODO: replace with `fetch('/api/lecturer/profile')`
export async function fetchLecturerProfile(): Promise<LecturerProfile> {
  return delay(EMPTY_PROFILE);
}

// TODO: replace with `fetch('/api/lecturer/access-session')`
export async function fetchLecturerAccessSession(): Promise<LecturerAccessSession> {
  return delay(EMPTY_ACCESS_SESSION);
}

// TODO: replace with `fetch('/api/lecturer/alert-preferences')`
export async function fetchLecturerAlertPreferences(): Promise<LecturerAlertPreference[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/lecturer/security')`
export async function fetchLecturerSecurityItems(): Promise<LecturerSecurityItem[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/lecturer/attendance-records/:id/dispute', { method: 'POST', body: reason })`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function submitDispute(recordId: string, reason: string): Promise<void> {
  await delay(undefined, 400);
}

// TODO: replace with `fetch('/api/lecturer/leave/summary')`
export async function fetchLecturerLeaveSummary(): Promise<LecturerLeaveSummary> {
  return delay(EMPTY_LEAVE_SUMMARY);
}

// TODO: replace with `fetch('/api/lecturer/leave/requests')`
export async function fetchLecturerLeaveRequests(): Promise<LecturerLeaveRequest[]> {
  return delay([]);
}

export interface LeaveRequestPayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

// TODO: replace with `fetch('/api/lecturer/leave/requests', { method: 'POST', body: payload })`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function submitLeaveRequest(payload: LeaveRequestPayload): Promise<void> {
  await delay(undefined, 400);
}
