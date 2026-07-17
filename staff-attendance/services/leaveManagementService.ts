/**
 * API layer for the Leave Management page — stubbed out the same way as
 * `dashboardService.ts` (no mock data, no backend wired up yet). Replace
 * each function body with a real `fetch(...)` call once the backend exists.
 */
import type { LeaveManagementSummary, LeaveRequest } from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const SAMPLE_SUMMARY: LeaveManagementSummary = {
  staffOnLeaveToday: 1,
  pendingApprovalCount: 2,
  currentlyOnLeave: [{ id: "stf-2", name: "Vann Kimheng", avatar: "https://i.pravatar.cc/150?u=vann.kimheng" }],
};

// TODO: replace with `fetch('/api/leave-management/summary')`
export async function fetchLeaveManagementSummary(): Promise<LeaveManagementSummary> {
  return delay(SAMPLE_SUMMARY);
}

// TODO: replace with `fetch('/api/leave-management/requests')` (all statuses, this page filters client-side)
export async function fetchAllLeaveRequests(): Promise<LeaveRequest[]> {
  return delay([
    {
      id: "lr-1",
      staffId: "stf-2",
      staffName: "Vann Kimheng",
      employeeId: "EMP-1042",
      avatar: "https://i.pravatar.cc/150?u=vann.kimheng",
      position: "Lecturer, Data Science and Engineering",
      leaveType: "Sick Leave",
      startDate: "2026-07-16",
      endDate: "2026-07-17",
      duration: "2 days",
      reason: "Flu and fever, doctor advised rest.",
      status: "pending",
      requestedAt: "2026-07-16T08:30:00+07:00",
    },
    {
      id: "lr-2",
      staffId: "stf-4",
      staffName: "Meas Ratana",
      employeeId: "EMP-1077",
      avatar: "https://i.pravatar.cc/150?u=meas.ratana",
      position: "Class Monitor, Data Science and Engineering",
      leaveType: "Annual Leave",
      startDate: "2026-07-22",
      endDate: "2026-07-24",
      duration: "3 days",
      reason: "Family trip planned in advance.",
      status: "pending",
      requestedAt: "2026-07-15T14:10:00+07:00",
    },
    {
      id: "lr-3",
      staffId: "stf-1",
      staffName: "Ly Sochea",
      employeeId: "EMP-1010",
      avatar: "https://i.pravatar.cc/150?u=ly.sochea",
      position: "Lecturer, Data Science and Engineering",
      leaveType: "Research",
      startDate: "2026-07-10",
      endDate: "2026-07-12",
      duration: "3 days",
      reason: "Presenting a paper at a regional conference.",
      status: "approved",
      requestedAt: "2026-07-05T09:00:00+07:00",
    },
    {
      id: "lr-4",
      staffId: "stf-3",
      staffName: "Prum Sophea",
      employeeId: "EMP-1091",
      avatar: "https://i.pravatar.cc/150?u=prum.sophea",
      position: "Class Monitor, Data Science and Engineering",
      leaveType: "Unpaid Leave",
      startDate: "2026-06-28",
      endDate: "2026-06-29",
      duration: "2 days",
      reason: "Personal matters requiring time off.",
      status: "rejected",
      requestedAt: "2026-06-25T10:15:00+07:00",
    },
  ]);
}
