import { MonitorLeaveHeader } from "@/components/class-monitor/leave-management/MonitorLeaveHeader";
import { LeaveBalanceCards } from "@/components/class-monitor/leave-management/LeaveBalanceCards";
import { LeaveRequestHistoryTable } from "@/components/class-monitor/leave-management/LeaveRequestHistoryTable";
import { LeaveResourceLinksCard } from "@/components/class-monitor/leave-management/LeaveResourceLinksCard";

/**
 * Page-level composition for the Class Monitor Leave Management page:
 * header, balance cards, request history table, and the policy/HR resource
 * links row.
 */
export function LeaveManagementView() {
  return (
    <div className="space-y-6 pb-10">
      <MonitorLeaveHeader />

      <LeaveBalanceCards />

      <LeaveRequestHistoryTable />

      <LeaveResourceLinksCard />
    </div>
  );
}
