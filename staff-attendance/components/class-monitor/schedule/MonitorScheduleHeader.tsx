"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchScheduleSummary } from "@/services/classMonitorService";

interface MonitorScheduleHeaderProps {
  weekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
}

/** Hero section for the Schedule page: title and the week navigator. */
export function MonitorScheduleHeader({ weekOffset, onWeekOffsetChange }: MonitorScheduleHeaderProps) {
  const { data, isLoading, error, refetch } = useAsyncData(fetchScheduleSummary, [weekOffset]);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Weekly Monitoring Schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">Managing attendance for Department of Data Science and Engineering, Faculty of Engineering</p>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border/60 px-1">
        <Button variant="ghost" size="icon-sm" aria-label="Previous week" onClick={() => onWeekOffsetChange(weekOffset - 1)}>
          <ChevronLeft className="size-4" />
        </Button>
        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load week" className="py-0" />
        ) : isLoading || !data ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <span className="whitespace-nowrap px-2 text-sm font-semibold text-foreground">{data.weekRangeLabel}</span>
        )}
        <Button variant="ghost" size="icon-sm" aria-label="Next week" onClick={() => onWeekOffsetChange(weekOffset + 1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
