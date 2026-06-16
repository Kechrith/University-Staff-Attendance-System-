/**
 * API layer for the Reports (Departmental Analytics) page — stubbed out the
 * same way as `dashboardService.ts` (no mock data, no backend wired up
 * yet). Replace each function body with a real `fetch(...)` call once the
 * backend exists.
 */
import type {
  AttendanceTrendPoint,
  GeneratedReport,
  LeaveDistributionSummary,
  ReportRange,
  ReportsOverview,
  WorkloadIntensityGrid,
} from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const EMPTY_OVERVIEW: ReportsOverview = {
  termLabel: "",
};

const EMPTY_LEAVE_DISTRIBUTION: LeaveDistributionSummary = {
  totalPending: 0,
  breakdown: [],
};

const EMPTY_WORKLOAD_GRID: WorkloadIntensityGrid = {
  columns: 7,
  cells: [],
};

// TODO: replace with `fetch('/api/reports/overview')`
export async function fetchReportsOverview(): Promise<ReportsOverview> {
  return delay(EMPTY_OVERVIEW);
}

// TODO: replace with `fetch(`/api/reports/attendance-trends?range=${range}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchAttendanceTrends(range: ReportRange = "weekly"): Promise<AttendanceTrendPoint[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/reports/leave-distribution')`
export async function fetchLeaveDistribution(): Promise<LeaveDistributionSummary> {
  return delay(EMPTY_LEAVE_DISTRIBUTION);
}

// TODO: replace with `fetch('/api/reports/workload-intensity')`
export async function fetchWorkloadIntensity(): Promise<WorkloadIntensityGrid> {
  return delay(EMPTY_WORKLOAD_GRID);
}

// TODO: replace with `fetch('/api/reports/department-sectors')`
export async function fetchDepartmentSectors(): Promise<string[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/reports/recent')`
export async function fetchRecentReports(): Promise<GeneratedReport[]> {
  return delay([]);
}
