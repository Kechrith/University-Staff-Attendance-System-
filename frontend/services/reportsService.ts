/**
 * API layer for the Reports (Departmental Analytics) page — talks to the
 * real Express/Prisma backend (see `backend/`).
 */
import { apiFetch } from "@/services/apiClient";
import type {
  AttendanceTrendPoint,
  GeneratedReport,
  LeaveDistributionSummary,
  ReportRange,
  ReportsOverview,
  WorkloadIntensityGrid,
} from "@/types";

export async function fetchReportsOverview(): Promise<ReportsOverview> {
  return apiFetch("/api/department-head/reports/overview");
}

export async function fetchAttendanceTrends(range: ReportRange = "weekly"): Promise<AttendanceTrendPoint[]> {
  return apiFetch(`/api/department-head/reports/attendance-trends?range=${range}`);
}

export async function fetchLeaveDistribution(): Promise<LeaveDistributionSummary> {
  return apiFetch("/api/department-head/reports/leave-distribution");
}

export async function fetchWorkloadIntensity(): Promise<WorkloadIntensityGrid> {
  return apiFetch("/api/department-head/reports/workload-intensity");
}

// Single-department app now — these are staff-category sectors within Data
// Science and Engineering rather than a list of other departments.
export async function fetchDepartmentSectors(): Promise<string[]> {
  return apiFetch("/api/department-head/reports/department-sectors");
}

export async function fetchRecentReports(): Promise<GeneratedReport[]> {
  return apiFetch("/api/department-head/reports/recent");
}
