import { CoordinatorLeaveHeader } from "@/components/program-coordinator/leave-management/CoordinatorLeaveHeader";
import { CoordinatorLeaveSummaryCards } from "@/components/program-coordinator/leave-management/CoordinatorLeaveSummaryCards";
import { LeaveRequestQueueTable } from "@/components/program-coordinator/leave-management/LeaveRequestQueueTable";
import { ProgramLeaveCoverageCard } from "@/components/program-coordinator/leave-management/ProgramLeaveCoverageCard";
import { HolidayScheduleCard } from "@/components/program-coordinator/leave-management/HolidayScheduleCard";

/**
 * Page-level composition for the Program Coordinator Leave Management
 * page: header, summary cards, the request queue table, and a coverage +
 * holiday sidebar row.
 */
export function LeaveManagementView() {
  return (
    <div className="space-y-6 pb-10">
      <CoordinatorLeaveHeader />

      <CoordinatorLeaveSummaryCards />

      <LeaveRequestQueueTable />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProgramLeaveCoverageCard />
        <HolidayScheduleCard />
      </div>
    </div>
  );
}
