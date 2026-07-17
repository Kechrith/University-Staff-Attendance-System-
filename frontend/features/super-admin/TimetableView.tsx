import { TimetableHeader } from "@/components/super-admin/timetable/TimetableHeader";
import { SemesterTimetableGrid } from "@/components/super-admin/timetable/SemesterTimetableGrid";
import { RecentTimetableChangesList } from "@/components/super-admin/timetable/RecentTimetableChangesList";

/**
 * Page-level composition for the Super Admin Timetable page: header, the
 * semester timetable grid, and the recent changes list. Server Component —
 * interactivity and data fetching live in the client components under
 * `components/super-admin/timetable/`.
 */
export function TimetableView() {
  return (
    <div className="space-y-6 pb-10">
      <TimetableHeader />

      <SemesterTimetableGrid />

      <RecentTimetableChangesList />
    </div>
  );
}
