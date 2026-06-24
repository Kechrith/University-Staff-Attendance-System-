"use client";

import { useState } from "react";
import { LecturerScheduleHeader } from "@/components/lecturer/schedule/LecturerScheduleHeader";
import { LecturerWeeklyScheduleGrid } from "@/components/lecturer/schedule/LecturerWeeklyScheduleGrid";
import { LecturerScheduleLegend } from "@/components/lecturer/schedule/LecturerScheduleLegend";

/**
 * Page-level composition for the Lecturer "My Schedule" page. Client
 * Component: the week navigator lives in the header but drives the weekly
 * grid below it, so the two need to share `weekOffset` state (same pattern
 * as the Program Coordinator Schedule page).
 */
export function MyScheduleView() {
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <div className="space-y-6 pb-10">
      <LecturerScheduleHeader weekOffset={weekOffset} onWeekOffsetChange={setWeekOffset} />

      <LecturerWeeklyScheduleGrid weekOffset={weekOffset} />

      <LecturerScheduleLegend />
    </div>
  );
}
