"use client";

import { useState } from "react";
import { CoordinatorScheduleHeader } from "@/components/program-coordinator/schedule/CoordinatorScheduleHeader";
import { CoordinatorWeeklyScheduleGrid } from "@/components/program-coordinator/schedule/CoordinatorWeeklyScheduleGrid";
import { ScheduleFooterBar } from "@/components/program-coordinator/schedule/ScheduleFooterBar";

/**
 * Page-level composition for the Program Coordinator Schedule page. Client
 * Component: the week navigator lives in the header but drives the weekly
 * grid below it, so the two need to share `weekOffset` state (same pattern
 * as the Department Head Reports page's range toggle).
 */
export function ScheduleView() {
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <div className="space-y-6 pb-10">
      <CoordinatorScheduleHeader weekOffset={weekOffset} onWeekOffsetChange={setWeekOffset} />

      <CoordinatorWeeklyScheduleGrid weekOffset={weekOffset} />

      <ScheduleFooterBar />
    </div>
  );
}
