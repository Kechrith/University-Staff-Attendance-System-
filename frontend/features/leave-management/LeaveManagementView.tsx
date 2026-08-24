import { LeaveManagementHeader } from "@/components/leave-management/LeaveManagementHeader";
import { LeaveSummaryCards } from "@/components/leave-management/LeaveSummaryCards";
import { LeaveRequestsPanel } from "@/components/leave-management/LeaveRequestsPanel";
import { DepartmentPolicyNotice } from "@/components/leave-management/DepartmentPolicyNotice";

/**
 * Page-level composition for the Leave Management page: header, summary
 * cards, the tabbed approval table, and a static policy reminder.
 * Server Component — interactivity and data fetching live in the client
 * components under `components/leave-management/`.
 */
export function LeaveManagementView() {
  return (
    <div className="space-y-6 pb-10">
      <LeaveManagementHeader />

      <LeaveSummaryCards />

      <LeaveRequestsPanel />

      <DepartmentPolicyNotice />
    </div>
  );
}
