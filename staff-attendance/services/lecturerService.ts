/**
 * API layer for the Lecturer pages — talks to the real Express/Prisma
 * backend under `/api/lecturer/...` (see `Backend/src/routes/lecturer.ts`).
 */
import { apiFetch } from "@/services/apiClient";
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

export async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch("/api/me");
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return apiFetch("/api/lecturer/notifications");
}

export async function fetchLecturerDashboardSummary(): Promise<LecturerDashboardSummary> {
  return apiFetch("/api/lecturer/dashboard-summary");
}

export async function fetchTodaysClasses(): Promise<LecturerTodayClass[]> {
  return apiFetch("/api/lecturer/todays-classes");
}

export async function fetchLecturerAttendanceRecords(): Promise<LecturerAttendanceRecord[]> {
  return apiFetch("/api/lecturer/attendance-records");
}

export async function fetchLecturerWeeklyScheduleGrid(weekOffset = 0): Promise<LecturerWeeklyScheduleGrid> {
  return apiFetch(`/api/lecturer/schedule-grid?week=${weekOffset}`);
}

export async function fetchLecturerProfile(): Promise<LecturerProfile> {
  return apiFetch("/api/lecturer/profile");
}

export async function fetchLecturerAccessSession(): Promise<LecturerAccessSession> {
  return apiFetch("/api/lecturer/access-session");
}

export async function fetchLecturerAlertPreferences(): Promise<LecturerAlertPreference[]> {
  return apiFetch("/api/lecturer/alert-preferences");
}

export async function fetchLecturerSecurityItems(): Promise<LecturerSecurityItem[]> {
  return apiFetch("/api/lecturer/security");
}

export async function submitDispute(recordId: string, reason: string): Promise<void> {
  await apiFetch(`/api/lecturer/attendance-records/${recordId}/dispute`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function fetchLecturerLeaveSummary(): Promise<LecturerLeaveSummary> {
  return apiFetch("/api/lecturer/leave/summary");
}

export async function fetchLecturerLeaveRequests(): Promise<LecturerLeaveRequest[]> {
  return apiFetch("/api/lecturer/leave/requests");
}

export interface LeaveRequestPayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export async function submitLeaveRequest(payload: LeaveRequestPayload): Promise<void> {
  await apiFetch("/api/lecturer/leave/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
