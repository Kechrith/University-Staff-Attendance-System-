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

const SAMPLE_OVERVIEW: ReportsOverview = {
  termLabel: "Comprehensive reporting for Semester 1, 2026–2027",
};

const SAMPLE_LEAVE_DISTRIBUTION: LeaveDistributionSummary = {
  totalPending: 2,
  breakdown: [
    { category: "Medical", percentage: 50, color: "#ef4444" },
    { category: "Personal", percentage: 30, color: "#3b82f6" },
    { category: "Other", percentage: 20, color: "#f59e0b" },
  ],
};

// A smaller heatmap sized for the department's 4 teaching/monitoring staff
// (2 lecturers, 2 class monitors) rather than a large invented roster.
const SAMPLE_WORKLOAD_GRID: WorkloadIntensityGrid = {
  columns: 4,
  cells: [
    { id: "wl-1", intensity: 20 },
    { id: "wl-2", intensity: 45 },
    { id: "wl-3", intensity: 60 },
    { id: "wl-4", intensity: 35 },
    { id: "wl-5", intensity: 80 },
    { id: "wl-6", intensity: 15 },
    { id: "wl-7", intensity: 50 },
    { id: "wl-8", intensity: 70 },
  ],
};

// TODO: replace with `fetch('/api/reports/overview')`
export async function fetchReportsOverview(): Promise<ReportsOverview> {
  return delay(SAMPLE_OVERVIEW);
}

// TODO: replace with `fetch(`/api/reports/attendance-trends?range=${range}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchAttendanceTrends(range: ReportRange = "weekly"): Promise<AttendanceTrendPoint[]> {
  return delay([
    { label: "Mon", present: 5, late: 1 },
    { label: "Tue", present: 4, late: 1 },
    { label: "Wed", present: 6, late: 0 },
    { label: "Thu", present: 5, late: 1 },
  ]);
}

// TODO: replace with `fetch('/api/reports/leave-distribution')`
export async function fetchLeaveDistribution(): Promise<LeaveDistributionSummary> {
  return delay(SAMPLE_LEAVE_DISTRIBUTION);
}

// TODO: replace with `fetch('/api/reports/workload-intensity')`
export async function fetchWorkloadIntensity(): Promise<WorkloadIntensityGrid> {
  return delay(SAMPLE_WORKLOAD_GRID);
}

// TODO: replace with `fetch('/api/reports/department-sectors')`
// Single-department app now — these are staff-category sectors within Data
// Science and Engineering rather than a list of other departments.
export async function fetchDepartmentSectors(): Promise<string[]> {
  return delay(["Lecturers", "Class Monitors", "Coordination"]);
}

// TODO: replace with `fetch('/api/reports/recent')`
export async function fetchRecentReports(): Promise<GeneratedReport[]> {
  return delay([
    { id: "rep-1", name: "June Attendance Report — Data Science and Engineering", dateGeneratedLabel: "Jul 1, 2026", format: "PDF" },
    { id: "rep-2", name: "Q2 Leave Distribution Summary", dateGeneratedLabel: "Jun 28, 2026", format: "Excel" },
    { id: "rep-3", name: "Staff Workload Intensity Report", dateGeneratedLabel: "Jun 15, 2026", format: "PDF" },
  ]);
}
