/**
 * API layer for the Attendance overview page — stubbed out the same way as
 * `dashboardService.ts` (no mock data, no backend wired up yet). Replace
 * each function body with a real `fetch(...)` call once the backend exists.
 */
import type { AttendanceOverviewSummary, AttendanceRecord, StatusDistributionDatum } from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

// Trackable staff: the Department Head's team of 5 (Program Coordinator,
// 2 Lecturers, 2 Class Monitors) within the Department of Data Science and
// Engineering — the Department Head himself isn't included in check-in
// tracking.
const SAMPLE_OVERVIEW: AttendanceOverviewSummary = {
  totalStaff: 5,
  totalStaffTrend: 2,
  presentToday: 2,
  presentRate: 40,
  lateArrivals: 1,
  lateIsHighPriority: false,
  absentToday: 1,
  absentTrend: 1,
};

// TODO: replace with `fetch('/api/attendance/overview')`
export async function fetchAttendanceOverview(): Promise<AttendanceOverviewSummary> {
  return delay(SAMPLE_OVERVIEW);
}

// TODO: replace with `fetch('/api/attendance/logs')`
export async function fetchAttendanceLogs(): Promise<AttendanceRecord[]> {
  return delay([
    {
      id: "log-1",
      staffId: "stf-1",
      staffName: "Ly Sochea",
      employeeId: "EMP-1010",
      avatar: "https://i.pravatar.cc/150?u=ly.sochea",
      position: "Lecturer, Data Science and Engineering",
      checkIn: "07:52 AM",
      checkOut: "04:30 PM",
      workingHours: "8h 38m",
      status: "present",
      date: "2026-07-16",
    },
    {
      id: "log-2",
      staffId: "stf-4",
      staffName: "Meas Ratana",
      employeeId: "EMP-1077",
      avatar: "https://i.pravatar.cc/150?u=meas.ratana",
      position: "Class Monitor, Data Science and Engineering",
      checkIn: "08:14 AM",
      checkOut: "04:45 PM",
      workingHours: "8h 31m",
      status: "late",
      date: "2026-07-16",
      lateMinutes: 14,
    },
    {
      id: "log-3",
      staffId: "stf-2",
      staffName: "Vann Kimheng",
      employeeId: "EMP-1042",
      avatar: "https://i.pravatar.cc/150?u=vann.kimheng",
      position: "Lecturer, Data Science and Engineering",
      checkIn: null,
      checkOut: null,
      workingHours: "—",
      status: "leave",
      date: "2026-07-16",
    },
    {
      id: "log-4",
      staffId: "stf-5",
      staffName: "Chan Pisey",
      employeeId: "EMP-1055",
      avatar: "https://i.pravatar.cc/150?u=chan.pisey",
      position: "Program Coordinator, Data Science and Engineering",
      checkIn: null,
      checkOut: null,
      workingHours: "—",
      status: "absent",
      date: "2026-07-16",
    },
    {
      id: "log-5",
      staffId: "stf-3",
      staffName: "Prum Sophea",
      employeeId: "EMP-1091",
      avatar: "https://i.pravatar.cc/150?u=prum.sophea",
      position: "Class Monitor, Data Science and Engineering",
      checkIn: "07:48 AM",
      checkOut: "04:20 PM",
      workingHours: "8h 32m",
      status: "present",
      date: "2026-07-16",
    },
  ]);
}

// TODO: replace with `fetch('/api/attendance/status-distribution')`
export async function fetchStatusDistribution(): Promise<StatusDistributionDatum[]> {
  return delay([
    { status: "present", percentage: 40 },
    { status: "late", percentage: 20 },
    { status: "absent", percentage: 20 },
    { status: "leave", percentage: 20 },
  ]);
}

// TODO: replace with `fetch('/api/attendance/insight')` (AI-generated summary, may be null)
export async function fetchAttendanceInsight(): Promise<string | null> {
  return delay(
    "Attendance in the Data Science and Engineering department is steady this week. Meas Ratana has been late twice — consider a check-in.",
  );
}
