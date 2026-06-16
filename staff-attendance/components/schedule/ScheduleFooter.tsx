"use client";

import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchScheduleOverview } from "@/services/scheduleService";

/** Workload legend + "last updated" timestamp, plus the floating quick-assignment action. */
export function ScheduleFooter() {
  const { data, isLoading } = useAsyncData(fetchScheduleOverview);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" /> Full Workload
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-warning" aria-hidden="true" /> Partial/Available
          </span>
        </div>
        {isLoading || !data ? <Skeleton className="h-4 w-44" /> : <span>System last updated: {data.lastUpdatedLabel}</span>}
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-lg"
              className="fixed right-6 bottom-6 z-40 size-12 rounded-full shadow-lg"
              aria-label="Quick schedule assignment"
              onClick={() => toast.message("Quick assignment", { description: "Available once the assignment form is connected." })}
            >
              <CalendarPlus className="size-5" />
            </Button>
          }
        />
        <TooltipContent>Quick Assignment</TooltipContent>
      </Tooltip>
    </>
  );
}
