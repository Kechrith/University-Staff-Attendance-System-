import { CoordinatorDashboardHeader } from "@/components/program-coordinator/dashboard/CoordinatorDashboardHeader";
import { CoordinatorStatsCards } from "@/components/program-coordinator/dashboard/CoordinatorStatsCards";
import { ScheduleCoordinationCard } from "@/components/program-coordinator/dashboard/ScheduleCoordinationCard";
import { LiveMonitorCard } from "@/components/program-coordinator/dashboard/LiveMonitorCard";
import { ClassOverviewCards } from "@/components/program-coordinator/dashboard/ClassOverviewCards";

/**
 * Page-level composition for the Program Coordinator Dashboard: header,
 * stat cards, the schedule coordination grid paired with the live monitor
 * feed, and the class overview grid. Trimmed from 5 sections to 4 (dropped
 * the static Quick Actions shortcut list — redundant with the sidebar nav
 * for a single-department program) to keep the page easy to scan. Server
 * Component — interactivity and data fetching live in the client
 * components under `components/program-coordinator/dashboard/`.
 */
export function DashboardView() {
  return (
    <div className="space-y-6 pb-10">
      <CoordinatorDashboardHeader />

      <CoordinatorStatsCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ScheduleCoordinationCard />
        </div>
        <LiveMonitorCard />
      </div>

      <ClassOverviewCards />
    </div>
  );
}
