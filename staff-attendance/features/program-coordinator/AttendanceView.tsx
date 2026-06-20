import { CoordinatorAttendanceHeader } from "@/components/program-coordinator/attendance/CoordinatorAttendanceHeader";
import { DailyPulseCards } from "@/components/program-coordinator/attendance/DailyPulseCards";
import { ProgramDistributionCard } from "@/components/program-coordinator/attendance/ProgramDistributionCard";
import { TodaysFocusCard } from "@/components/program-coordinator/attendance/TodaysFocusCard";
import { LecturerAttendanceLogTable } from "@/components/program-coordinator/attendance/LecturerAttendanceLogTable";

/**
 * Page-level composition for the Program Coordinator Attendance page:
 * header, daily pulse stats, program distribution paired with the
 * highlighted "Today's Focus" panel, and the detailed attendance log.
 */
export function AttendanceView() {
  return (
    <div className="space-y-6 pb-10">
      <CoordinatorAttendanceHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <DailyPulseCards />
          <ProgramDistributionCard />
        </div>
        <TodaysFocusCard />
      </div>

      <LecturerAttendanceLogTable />
    </div>
  );
}
