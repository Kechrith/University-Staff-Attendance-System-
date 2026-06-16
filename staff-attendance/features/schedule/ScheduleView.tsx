import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { RoomAvailabilityCard } from "@/components/schedule/RoomAvailabilityCard";
import { WeeklyScheduleGrid } from "@/components/schedule/WeeklyScheduleGrid";
import { UnassignedClassesCard } from "@/components/schedule/UnassignedClassesCard";
import { StaffWorkloadFinder } from "@/components/schedule/StaffWorkloadFinder";
import { ScheduleFooter } from "@/components/schedule/ScheduleFooter";

/**
 * Page-level composition for the Department Schedule page: header, room
 * availability paired with the weekly class grid, the unassigned-classes
 * queue paired with the staff workload finder, and a footer legend with a
 * floating quick-assignment action. Server Component — interactivity and
 * data fetching live in the client components under `components/schedule/`.
 */
export function ScheduleView() {
  return (
    <div className="space-y-6 pb-10">
      <ScheduleHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <RoomAvailabilityCard />
        <div className="xl:col-span-2">
          <WeeklyScheduleGrid />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UnassignedClassesCard />
        <StaffWorkloadFinder />
      </div>

      <ScheduleFooter />
    </div>
  );
}
