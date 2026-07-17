/**
 * API layer for the Department Schedule page — stubbed out the same way as
 * `dashboardService.ts` (no mock data, no backend wired up yet). Replace
 * each function body with a real `fetch(...)` call once the backend exists.
 */
import type { RoomAvailability, ScheduleOverview, StaffWorkload, UnassignedClass, WeeklyScheduleGrid } from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const SAMPLE_OVERVIEW: ScheduleOverview = {
  termLabel: "Semester 1, 2026–2027",
  lastUpdatedLabel: "Today, 09:42 AM",
  unassignedCriticalCount: 1,
};

// Rooms are limited to A201, A105, and C302 — the only rooms this
// department uses.
const SAMPLE_GRID: WeeklyScheduleGrid = {
  weekRangeLabel: "Jul 13 - 19, 2026",
  timeSlots: ["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM"],
  slots: [
    { id: "slot-1", day: "Mon", time: "08:00 AM", title: "DSE-301 Software Engineering for Data Systems", subtitle: "Ly Sochea • A201", status: "class" },
    { id: "slot-2", day: "Mon", time: "01:00 PM", title: "DSE-204 Data Structures", subtitle: "Vann Kimheng • A105", status: "class" },
    { id: "slot-3", day: "Tue", time: "10:00 AM", title: "Department Staff Meeting", subtitle: "Hout Bunthoeun • C302", status: "meeting" },
    { id: "slot-4", day: "Wed", time: "03:00 PM", title: "Unassigned Slot", subtitle: "No lecturer assigned • C302", status: "unassigned" },
    { id: "slot-5", day: "Thu", time: "01:00 PM", title: "DSE-205 Machine Learning Basics", subtitle: "Ly Sochea • A105", status: "class" },
  ],
};

// TODO: replace with `fetch('/api/schedule/overview')`
export async function fetchScheduleOverview(): Promise<ScheduleOverview> {
  return delay(SAMPLE_OVERVIEW);
}

// TODO: replace with `fetch('/api/schedule/rooms')`
export async function fetchRoomAvailability(): Promise<RoomAvailability[]> {
  return delay([
    { id: "room-1", name: "Room A201 (Engineering Block)", capacityLabel: "Capacity: 45 students", status: "occupied" },
    { id: "room-2", name: "Room A105 (Engineering Block)", capacityLabel: "Capacity: 40 students", status: "available" },
    { id: "room-3", name: "Room C302 (Engineering Block)", capacityLabel: "Capacity: 50 students", status: "occupied" },
  ]);
}

// TODO: replace with `fetch(`/api/schedule/grid?weekOffset=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchWeeklyScheduleGrid(weekOffset = 0): Promise<WeeklyScheduleGrid> {
  return delay(SAMPLE_GRID);
}

// TODO: replace with `fetch('/api/schedule/unassigned-classes')`
export async function fetchUnassignedClasses(): Promise<UnassignedClass[]> {
  return delay([
    { id: "unc-1", courseLabel: "DSE-205: Machine Learning Basics", scheduleLabel: "Wednesdays, 3:00 PM - 5:00 PM", category: "science" },
  ]);
}

// TODO: replace with `fetch('/api/schedule/staff-workload')`
export async function fetchStaffWorkload(): Promise<StaffWorkload[]> {
  return delay([
    { id: "stf-1", name: "Ly Sochea", avatar: "https://i.pravatar.cc/150?u=ly.sochea", departmentCode: "LEC", hoursPerWeek: 18, workloadPercent: 90, presence: "online" },
    { id: "stf-2", name: "Vann Kimheng", avatar: "https://i.pravatar.cc/150?u=vann.kimheng", departmentCode: "LEC", hoursPerWeek: 14, workloadPercent: 70, presence: "away" },
    { id: "stf-3", name: "Prum Sophea", avatar: "https://i.pravatar.cc/150?u=prum.sophea", departmentCode: "CM", hoursPerWeek: 10, workloadPercent: 50, presence: "offline" },
    { id: "stf-4", name: "Meas Ratana", avatar: "https://i.pravatar.cc/150?u=meas.ratana", departmentCode: "CM", hoursPerWeek: 12, workloadPercent: 60, presence: "online" },
  ]);
}
