/**
 * API layer for the Attendance overview page — talks to the real
 * Express/Prisma backend (see `backend/`).
 */
import { apiFetch } from "@/services/apiClient";
import type { AttendanceOverviewSummary, AttendanceRecord, StatusDistributionDatum } from "@/types";

export async function fetchAttendanceOverview(): Promise<AttendanceOverviewSummary> {
  return apiFetch("/api/department-head/attendance/overview");
}

export async function fetchAttendanceLogs(): Promise<AttendanceRecord[]> {
  return apiFetch("/api/department-head/attendance/logs");
}

export async function fetchStatusDistribution(): Promise<StatusDistributionDatum[]> {
  return apiFetch("/api/department-head/attendance/status-distribution");
}

export async function fetchAttendanceInsight(): Promise<string | null> {
  return apiFetch("/api/department-head/attendance/insight");
}
