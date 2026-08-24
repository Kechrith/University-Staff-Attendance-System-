import { LecturerDashboardHeader } from "@/components/lecturer/dashboard/LecturerDashboardHeader";
import { UpcomingSessionTile } from "@/components/lecturer/dashboard/UpcomingSessionTile";
import { LecturerStatsTiles } from "@/components/lecturer/dashboard/LecturerStatsTiles";
import { RecentRecordsCard } from "@/components/lecturer/dashboard/RecentRecordsCard";

/**
 * Page-level composition for the Lecturer Dashboard: header, upcoming session tile,
 * sessions completed / attendance record tiles, and recent attendance records.
 */
export function DashboardView() {
  return (
    <div className="space-y-6 pb-10">
      <LecturerDashboardHeader />

      <UpcomingSessionTile />

      <LecturerStatsTiles />

      <div>
        <RecentRecordsCard />
      </div>
    </div>
  );
}

