"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerWeeklyScheduleGrid } from "@/services/lecturerService";

interface LecturerScheduleHeaderProps {
  weekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
}

/** Hero section: title plus the week navigator. Read-only — lecturers view their timetable, not edit it. */
export function LecturerScheduleHeader({ weekOffset, onWeekOffsetChange }: LecturerScheduleHeaderProps) {
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchLecturerWeeklyScheduleGrid(weekOffset), [weekOffset]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">My Schedule</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Your assigned classes and office hours for the week.</p>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Previous week" onClick={() => onWeekOffsetChange(weekOffset - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            {error ? null : isLoading || !data ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="whitespace-nowrap text-xs sm:text-sm font-semibold text-foreground">{data.weekRangeLabel}</span>
            )}
            <Button variant="ghost" size="icon-sm" aria-label="Next week" onClick={() => onWeekOffsetChange(weekOffset + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {error ? <ErrorState onRetry={refetch} title="Couldn't load schedule overview" className="py-0" /> : null}
        </CardContent>
      </Card>
    </div>
  );
}
