"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonitorScheduleHeader } from "@/components/class-monitor/schedule/MonitorScheduleHeader";
import { MonitorWeeklyScheduleGrid } from "@/components/class-monitor/schedule/MonitorWeeklyScheduleGrid";
import { ScheduleStatsCards } from "@/components/class-monitor/schedule/ScheduleStatsCards";

/**
 * Page-level composition for the Class Monitor Schedule page. Client
 * Component: the week navigator lives in the header but drives the weekly
 * grid below it, so the two need to share `weekOffset` state.
 */
export function ScheduleView() {
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <div className="relative space-y-6 pb-10">
      <MonitorScheduleHeader weekOffset={weekOffset} onWeekOffsetChange={setWeekOffset} />

      <MonitorWeeklyScheduleGrid weekOffset={weekOffset} />

      <ScheduleStatsCards />

      <Button
        size="icon-lg"
        className="fixed right-6 bottom-6 rounded-full shadow-lg"
        aria-label="Add monitoring assignment"
        onClick={() => toast.message("New assignment", { description: "Available once the assignment form is connected." })}
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
