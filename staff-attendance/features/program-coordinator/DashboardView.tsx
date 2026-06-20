import { CoordinatorDashboardHeader } from "@/components/program-coordinator/dashboard/CoordinatorDashboardHeader";
import { CoordinatorStatsCards } from "@/components/program-coordinator/dashboard/CoordinatorStatsCards";
import { ScheduleCoordinationCard } from "@/components/program-coordinator/dashboard/ScheduleCoordinationCard";
import { QuickActionsCard } from "@/components/program-coordinator/dashboard/QuickActionsCard";
import { LiveMonitorCard } from "@/components/program-coordinator/dashboard/LiveMonitorCard";
import { ClassOverviewCards } from "@/components/program-coordinator/dashboard/ClassOverviewCards";

/**
 * Page-level composition for the Program Coordinator Dashboard: header,
 * stat cards, the schedule coordination grid paired with quick actions and
 * the live monitor feed, and the class overview grid. Server Component —
 * interactivity and data fetching live in the client components under
 * `components/program-coordinator/dashboard/`.
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
        <div className="space-y-6">
          <QuickActionsCard />
          <LiveMonitorCard />
        </div>
      </div>

      <ClassOverviewCards />
    </div>
  );
}
