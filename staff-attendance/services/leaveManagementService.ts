/**
 * API layer for the Leave Management page — stubbed out the same way as
 * `dashboardService.ts` (no mock data, no backend wired up yet). Replace
 * each function body with a real `fetch(...)` call once the backend exists.
 */
import type { LeaveManagementSummary, LeaveRequest } from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const EMPTY_SUMMARY: LeaveManagementSummary = {
  staffOnLeaveToday: 0,
  pendingApprovalCount: 0,
  currentlyOnLeave: [],
};

// TODO: replace with `fetch('/api/leave-management/summary')`
export async function fetchLeaveManagementSummary(): Promise<LeaveManagementSummary> {
  return delay(EMPTY_SUMMARY);
}

// TODO: replace with `fetch('/api/leave-management/requests')` (all statuses, this page filters client-side)
export async function fetchAllLeaveRequests(): Promise<LeaveRequest[]> {
  return delay([]);
}
