/**
 * API layer for the Leave Management page — talks to the real
 * Express/Prisma backend (see `Backend/`).
 */
import { apiFetch } from "@/services/apiClient";
import type { LeaveManagementSummary, LeaveRequest } from "@/types";

export async function fetchLeaveManagementSummary(): Promise<LeaveManagementSummary> {
  return apiFetch("/api/department-head/leave-management/summary");
}

export async function fetchAllLeaveRequests(): Promise<LeaveRequest[]> {
  return apiFetch("/api/department-head/leave-management/requests");
}

/** Approves or rejects a pending leave request; writes an audit-log entry on the backend. */
export async function updateLeaveRequestStatus(id: string, status: "APPROVED" | "REJECTED"): Promise<LeaveRequest> {
  return apiFetch(`/api/department-head/leave-requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
