import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { AttendanceSummaryCards } from "@/components/attendance/AttendanceSummaryCards";
import { AttendanceLogs } from "@/components/attendance/AttendanceLogs";
import { WeeklyAttendanceTrendChart } from "@/components/attendance/WeeklyAttendanceTrendChart";
import { StatusDistributionCard } from "@/components/attendance/StatusDistributionCard";

/**
 * Page-level composition for the Attendance overview page: header, summary
 * cards, filterable logs table, and a trend/status-distribution row.
 * Server Component — interactivity and data fetching live in the client
 * components under `components/attendance/`.
 */
export function AttendanceView() {
  return (
    <div className="space-y-6 pb-10">
      <AttendanceHeader />

      <AttendanceSummaryCards />

      <AttendanceLogs />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WeeklyAttendanceTrendChart />
        </div>
        <StatusDistributionCard />
      </div>
    </div>
  );
}
