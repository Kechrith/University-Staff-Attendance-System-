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

const SAMPLE_PROFILE: DepartmentProfile = {
  // The department name mirrors the constant shown elsewhere in the app
  // (header subtitles, etc.) rather than an arbitrary placeholder.
  departmentName: DEPARTMENT_NAME,
  deptCode: "DSE-DEPT",
  establishedYear: "1998",
  signatureUrl: null,
};

const SAMPLE_ATTENDANCE_POLICY: AttendancePolicy = {
  lateThresholdMinutes: 15,
  gracePeriodMode: "fixed",
};

const SAMPLE_LEAVE_APPROVAL_RULES: LeaveApprovalRules = {
  autoApprovePersonalLeave: false,
  mandatoryMedicalDocumentation: true,
  escalationHierarchy: "Direct to Department Head",
};

// TODO: replace with `fetch('/api/settings/profile')`
export async function fetchDepartmentProfile(): Promise<DepartmentProfile> {
  return delay(SAMPLE_PROFILE);
}

// TODO: replace with `fetch('/api/settings/attendance-policy')`
export async function fetchAttendancePolicy(): Promise<AttendancePolicy> {
  return delay(SAMPLE_ATTENDANCE_POLICY);
}

// TODO: replace with `fetch('/api/settings/leave-approval-rules')`
export async function fetchLeaveApprovalRules(): Promise<LeaveApprovalRules> {
  return delay(SAMPLE_LEAVE_APPROVAL_RULES);
}

// TODO: replace with `fetch('/api/settings/staff')`
export async function fetchDepartmentStaff(): Promise<DepartmentStaffMember[]> {
  return delay([
    { id: "stf-6", name: "Hout Bunthoeun", avatar: "https://i.pravatar.cc/150?u=hout.bunthoeun", role: "Department Head" },
    { id: "stf-5", name: "Chan Pisey", avatar: "https://i.pravatar.cc/150?u=chan.pisey", role: "Program Coordinator" },
    { id: "stf-1", name: "Ly Sochea", avatar: "https://i.pravatar.cc/150?u=ly.sochea", role: "Lecturer" },
    { id: "stf-2", name: "Vann Kimheng", avatar: "https://i.pravatar.cc/150?u=vann.kimheng", role: "Lecturer" },
    { id: "stf-3", name: "Prum Sophea", avatar: "https://i.pravatar.cc/150?u=prum.sophea", role: "Class Monitor" },
  ]);
}
