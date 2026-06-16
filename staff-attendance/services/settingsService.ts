/**
 * API layer for the Department Settings page — stubbed out the same way as
 * `dashboardService.ts` (no mock data, no backend wired up yet). Replace
 * each function body with a real `fetch(...)` call once the backend exists.
 */
import { DEPARTMENT_NAME } from "@/lib/constants";
import type { AttendancePolicy, DepartmentProfile, DepartmentStaffMember, LeaveApprovalRules } from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const EMPTY_PROFILE: DepartmentProfile = {
  // The department name mirrors the constant shown elsewhere in the app
  // (header subtitles, etc.) rather than an arbitrary placeholder.
  departmentName: DEPARTMENT_NAME,
  deptCode: "",
  establishedYear: "",
  signatureUrl: null,
};

const EMPTY_ATTENDANCE_POLICY: AttendancePolicy = {
  lateThresholdMinutes: 0,
  gracePeriodMode: "fixed",
};

const EMPTY_LEAVE_APPROVAL_RULES: LeaveApprovalRules = {
  autoApprovePersonalLeave: false,
  mandatoryMedicalDocumentation: false,
  escalationHierarchy: "",
};

// TODO: replace with `fetch('/api/settings/profile')`
export async function fetchDepartmentProfile(): Promise<DepartmentProfile> {
  return delay(EMPTY_PROFILE);
}

// TODO: replace with `fetch('/api/settings/attendance-policy')`
export async function fetchAttendancePolicy(): Promise<AttendancePolicy> {
  return delay(EMPTY_ATTENDANCE_POLICY);
}

// TODO: replace with `fetch('/api/settings/leave-approval-rules')`
export async function fetchLeaveApprovalRules(): Promise<LeaveApprovalRules> {
  return delay(EMPTY_LEAVE_APPROVAL_RULES);
}

// TODO: replace with `fetch('/api/settings/staff')`
export async function fetchDepartmentStaff(): Promise<DepartmentStaffMember[]> {
  return delay([]);
}
