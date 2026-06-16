"use client";

import { toast } from "sonner";
import { ListFilter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchScheduleOverview } from "@/services/scheduleService";

/** Hero section at the top of the Schedule page: title, term subtitle, primary actions. */
export function ScheduleHeader() {
  const { data, isLoading } = useAsyncData(fetchScheduleOverview);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Schedule - Overview</h1>
        {isLoading || !data ? (
          <Skeleton className="mt-1.5 h-4 w-56" />
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">{data.termLabel}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => toast.message("Filter views", { description: "Available once schedule filters are connected." })}
        >
          <ListFilter className="size-4" /> Filter Views
        </Button>
        <Button onClick={() => toast.message("New assignment", { description: "Available once the assignment form is connected." })}>
          <Plus className="size-4" /> New Assignment
        </Button>
      </div>
    </div>
  );
}
