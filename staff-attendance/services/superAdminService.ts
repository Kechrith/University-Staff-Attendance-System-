/**
 * API layer for the Super Admin pages — wired up to the real backend
 * (Backend/, Express + Prisma + Postgres, see docker-compose.yml at the
 * repo root). Every function below keeps its original signature/return
 * type so no component above this layer needed to change.
 */
import type {
  AuditLogEntry,
  ClassMonitorAssignmentRow,
  CurrentUser,
  DisputeStats,
  EscalatedDisputeEntry,
  NotificationItem,
  OrgUnitNode,
  SuperAdminDashboardSummary,
  SuperAdminProfile,
  SuperAdminSecurityItem,
  SuperAdminTimetableGrid,
  SystemActivityItem,
  SystemConfiguration,
  TimetableChangeEntry,
  UserAccountRow,
} from "@/types";
import { apiFetch } from "@/services/apiClient";

export async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch("/api/me");
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return apiFetch("/api/super-admin/notifications");
}

export async function fetchSuperAdminDashboardSummary(): Promise<SuperAdminDashboardSummary> {
  return apiFetch("/api/super-admin/dashboard-summary");
}

export async function fetchSystemActivityFeed(): Promise<SystemActivityItem[]> {
  return apiFetch("/api/super-admin/dashboard/recent-activity");
}

export async function fetchUserAccounts(): Promise<UserAccountRow[]> {
  return apiFetch("/api/super-admin/users");
}

export async function fetchClassMonitorAssignments(): Promise<ClassMonitorAssignmentRow[]> {
  return apiFetch("/api/super-admin/users/class-monitor-assignments");
}

export async function assignClassMonitor(classId: string, monitorName: string): Promise<ClassMonitorAssignmentRow> {
  return apiFetch(`/api/super-admin/users/class-monitor-assignments/${classId}`, {
    method: "PATCH",
    body: JSON.stringify({ monitorName }),
  });
}

export async function fetchOrgHierarchy(): Promise<OrgUnitNode[]> {
  return apiFetch("/api/super-admin/organization/units");
}

export async function createClass(name: string): Promise<OrgUnitNode> {
  return apiFetch("/api/super-admin/organization/units", { method: "POST", body: JSON.stringify({ name }) });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility; the backend only tracks one semester so far
export async function fetchSemesterTimetableGrid(semesterId?: string): Promise<SuperAdminTimetableGrid> {
  return apiFetch("/api/super-admin/timetable");
}

export async function fetchRecentTimetableChanges(): Promise<TimetableChangeEntry[]> {
  return apiFetch("/api/super-admin/timetable/changes");
}

export interface AddSessionPayload {
  course: string;
  lecturer: string;
  day: string;
  time: string;
  room: string;
}

export async function addTimetableSession(payload: AddSessionPayload): Promise<void> {
  await apiFetch("/api/super-admin/timetable/sessions", { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchEscalatedDisputes(): Promise<EscalatedDisputeEntry[]> {
  return apiFetch("/api/super-admin/disputes");
}

export async function fetchDisputeStats(): Promise<DisputeStats> {
  return apiFetch("/api/super-admin/disputes/stats");
}

export async function fetchAuditLogEntries(): Promise<AuditLogEntry[]> {
  return apiFetch("/api/super-admin/audit-log");
}

export async function fetchSuperAdminProfile(): Promise<SuperAdminProfile> {
  return apiFetch("/api/super-admin/settings/profile");
}

export async function fetchSystemConfiguration(): Promise<SystemConfiguration> {
  return apiFetch("/api/super-admin/settings/system-config");
}

export async function updateSystemConfiguration(config: SystemConfiguration): Promise<SystemConfiguration> {
  return apiFetch("/api/super-admin/settings/system-config", { method: "PATCH", body: JSON.stringify(config) });
}

export async function fetchSuperAdminSecurityItems(): Promise<SuperAdminSecurityItem[]> {
  return apiFetch("/api/super-admin/settings/security");
}
