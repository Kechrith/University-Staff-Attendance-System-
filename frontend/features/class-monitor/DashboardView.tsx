import { MonitorDashboardHeader } from "@/components/class-monitor/dashboard/MonitorDashboardHeader";
import { MonitorAlertsCard } from "@/components/class-monitor/dashboard/MonitorAlertsCard";
import { DailyClassAttendanceTable } from "@/components/class-monitor/dashboard/DailyClassAttendanceTable";
import { AssignedClassesCard } from "@/components/class-monitor/dashboard/AssignedClassesCard";
import { DutyStatusCard } from "@/components/class-monitor/dashboard/DutyStatusCard";

/**
 * Page-level composition for the Class Monitor Dashboard: header, the
 * alerts + daily class attendance pairing, and the assigned classes + duty
 * status sidebar. Server Component — interactivity and data fetching live
 * in the client components under `components/class-monitor/dashboard/`.
 */
export function DashboardView() {
  return (
    <div className="space-y-6 pb-10">
      <MonitorDashboardHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <MonitorAlertsCard />
        <div className="xl:col-span-2">
          <DailyClassAttendanceTable />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <AssignedClassesCard />
        <div className="xl:col-span-2">
          <DutyStatusCard />
        </div>
      </div>
    </div>
  );
}
