import { MonitorAttendanceHeader } from "@/components/class-monitor/attendance/MonitorAttendanceHeader";
import { ShiftStatsCards } from "@/components/class-monitor/attendance/ShiftStatsCards";
import { CurrentClassesList } from "@/components/class-monitor/attendance/CurrentClassesList";
import { SessionLogCard } from "@/components/class-monitor/attendance/SessionLogCard";
import { CampusLoadCard } from "@/components/class-monitor/attendance/CampusLoadCard";

/**
 * Page-level composition for the Class Monitor Attendance ("Mark
 * Attendance") page: header, shift stats, the current-classes list, and a
 * session log paired with the campus load tile.
 */
export function AttendanceView() {
  return (
    <div className="space-y-6 pb-10">
      <MonitorAttendanceHeader />

      <ShiftStatsCards />

      <CurrentClassesList />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SessionLogCard />
        <CampusLoadCard />
      </div>
    </div>
  );
}
