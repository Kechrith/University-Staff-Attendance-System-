/**
 * API layer for the Department Schedule page — talks to the real
 * Express/Prisma backend (see `backend/`).
 */
import { apiFetch } from "@/services/apiClient";
import type { RoomAvailability, ScheduleOverview, StaffWorkload, UnassignedClass, WeeklyScheduleGrid } from "@/types";

export async function fetchScheduleOverview(): Promise<ScheduleOverview> {
  return apiFetch("/api/department-head/schedule/overview");
}

export async function fetchRoomAvailability(): Promise<RoomAvailability[]> {
  return apiFetch("/api/department-head/schedule/rooms");
}

export async function fetchWeeklyScheduleGrid(weekOffset = 0): Promise<WeeklyScheduleGrid> {
  return apiFetch(`/api/department-head/schedule/grid?weekOffset=${weekOffset}`);
}

export async function fetchUnassignedClasses(): Promise<UnassignedClass[]> {
  return apiFetch("/api/department-head/schedule/unassigned-classes");
}

export async function fetchStaffWorkload(): Promise<StaffWorkload[]> {
  return apiFetch("/api/department-head/schedule/staff-workload");
}
