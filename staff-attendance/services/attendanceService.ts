/**
 * API layer for the Attendance overview page — stubbed out the same way as
 * `dashboardService.ts` (no mock data, no backend wired up yet). Replace
 * each function body with a real `fetch(...)` call once the backend exists.
 */
import type { AttendanceOverviewSummary, AttendanceRecord, StatusDistributionDatum } from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const EMPTY_OVERVIEW: AttendanceOverviewSummary = {
  totalStaff: 0,
  totalStaffTrend: 0,
  presentToday: 0,
  presentRate: 0,
  lateArrivals: 0,
  lateIsHighPriority: false,
  absentToday: 0,
  absentTrend: 0,
};

// TODO: replace with `fetch('/api/attendance/overview')`
export async function fetchAttendanceOverview(): Promise<AttendanceOverviewSummary> {
  return delay(EMPTY_OVERVIEW);
}

// TODO: replace with `fetch('/api/attendance/logs')`
export async function fetchAttendanceLogs(): Promise<AttendanceRecord[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/attendance/status-distribution')`
export async function fetchStatusDistribution(): Promise<StatusDistributionDatum[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/attendance/insight')` (AI-generated summary, may be null)
export async function fetchAttendanceInsight(): Promise<string | null> {
  return delay(null);
}
