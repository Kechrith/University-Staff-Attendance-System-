import { PageHeader } from "@/components/dashboard/PageHeader";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { PendingLeaveRequests } from "@/components/dashboard/PendingLeaveRequests";
import { AttendanceTable } from "@/components/dashboard/AttendanceTable";

/**
 * Page-level composition for the Department Head Dashboard.
 * Scoped to match the reference mockup: header, summary cards, the weekly
 * trend chart paired with pending leave requests, and the staff attendance
 * table. Server Component: it only arranges layout — every section that
 * needs interactivity or data fetching is a client component under
 * `components/dashboard/`.
 */
export function DashboardView() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader />

      {/* Summary cards */}
      <SummaryCards />

      {/* Weekly trend chart + pending leave requests */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AttendanceChart />
        </div>
        <PendingLeaveRequests />
      </div>

      {/* Department staff attendance overview */}
      <AttendanceTable />
    </div>
  );
}
