import { SuperAdminDashboardHeader } from "@/components/super-admin/dashboard/SuperAdminDashboardHeader";
import { SuperAdminStatsCards } from "@/components/super-admin/dashboard/SuperAdminStatsCards";
import { SystemActivityCard } from "@/components/super-admin/dashboard/SystemActivityCard";
import { QuickActionsCard } from "@/components/super-admin/dashboard/QuickActionsCard";

/**
 * Page-level composition for the Super Admin Dashboard: header, stat cards,
 * and a two-column grid pairing the system activity feed with quick
 * actions. Server Component — interactivity and data fetching live in the
 * client components under `components/super-admin/dashboard/`.
 */
export function DashboardView() {
  return (
    <div className="space-y-6 pb-10">
      <SuperAdminDashboardHeader />

      <SuperAdminStatsCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SystemActivityCard />
        </div>
        <QuickActionsCard />
      </div>
    </div>
  );
}
