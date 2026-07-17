/**
 * API layer for the Department Settings page — talks to the real
 * Express/Prisma backend (see `Backend/`).
 */
import { apiFetch } from "@/services/apiClient";
import type { AttendancePolicy, DepartmentProfile, DepartmentStaffMember, LeaveApprovalRules } from "@/types";

export async function fetchDepartmentProfile(): Promise<DepartmentProfile> {
  return apiFetch("/api/department-head/settings/profile");
}

export async function fetchAttendancePolicy(): Promise<AttendancePolicy> {
  return apiFetch("/api/department-head/settings/attendance-policy");
}

export async function fetchLeaveApprovalRules(): Promise<LeaveApprovalRules> {
  return apiFetch("/api/department-head/settings/leave-approval-rules");
}

export async function fetchDepartmentStaff(): Promise<DepartmentStaffMember[]> {
  return apiFetch("/api/department-head/settings/staff");
}
