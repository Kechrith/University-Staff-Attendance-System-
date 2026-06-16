/**
 * API layer for the Department Schedule page — stubbed out the same way as
 * `dashboardService.ts` (no mock data, no backend wired up yet). Replace
 * each function body with a real `fetch(...)` call once the backend exists.
 */
import type { RoomAvailability, ScheduleOverview, StaffWorkload, UnassignedClass, WeeklyScheduleGrid } from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const EMPTY_OVERVIEW: ScheduleOverview = {
  termLabel: "",
  lastUpdatedLabel: "—",
  unassignedCriticalCount: 0,
};

const EMPTY_GRID: WeeklyScheduleGrid = {
  weekRangeLabel: "—",
  timeSlots: [],
  slots: [],
};

// TODO: replace with `fetch('/api/schedule/overview')`
export async function fetchScheduleOverview(): Promise<ScheduleOverview> {
  return delay(EMPTY_OVERVIEW);
}

// TODO: replace with `fetch('/api/schedule/rooms')`
export async function fetchRoomAvailability(): Promise<RoomAvailability[]> {
  return delay([]);
}

// TODO: replace with `fetch(`/api/schedule/grid?weekOffset=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchWeeklyScheduleGrid(weekOffset = 0): Promise<WeeklyScheduleGrid> {
  return delay(EMPTY_GRID);
}

// TODO: replace with `fetch('/api/schedule/unassigned-classes')`
export async function fetchUnassignedClasses(): Promise<UnassignedClass[]> {
  return delay([]);
}

// TODO: replace with `fetch('/api/schedule/staff-workload')`
export async function fetchStaffWorkload(): Promise<StaffWorkload[]> {
  return delay([]);
}
