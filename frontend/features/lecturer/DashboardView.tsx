import { LecturerDashboardHeader } from "@/components/lecturer/dashboard/LecturerDashboardHeader";
import { LecturerStatsCards } from "@/components/lecturer/dashboard/LecturerStatsCards";
import { TodaysClassesCard } from "@/components/lecturer/dashboard/TodaysClassesCard";
import { RecentRecordsCard } from "@/components/lecturer/dashboard/RecentRecordsCard";

/**
 * Page-level composition for the Lecturer Dashboard: header, stat cards,
 * today's classes paired with the recent attendance/lesson-summary records
 * (FR-4). Server Component — interactivity and data fetching live in the
 * client components under `components/lecturer/dashboard/`.
 */
export function DashboardView() {
  return (
    <div className="space-y-6 pb-10">
      <LecturerDashboardHeader />

      <LecturerStatsCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TodaysClassesCard />
        <RecentRecordsCard />
      </div>
    </div>
  );
}
