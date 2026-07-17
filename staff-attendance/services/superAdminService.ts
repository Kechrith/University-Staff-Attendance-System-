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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ? JSON.stringify(body.error) : `Request to ${path} failed with ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<{ role: string; name: string }> {
  return apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

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
