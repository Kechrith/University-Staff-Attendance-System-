"use client";

import { CalendarHeart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorHolidayInfo } from "@/services/programCoordinatorService";

/** Small highlighted card surfacing the next university holiday. */
export function HolidayScheduleCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorHolidayInfo);

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-3 p-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CalendarHeart className="size-4.5" />
        </span>

        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load holiday schedule" />
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ) : !data ? (
          <EmptyState title="No upcoming holidays" description="The next university holiday will appear here." />
        ) : (
          <div>
            <p className="text-sm font-semibold text-foreground">Holiday Schedule</p>
            <p className="mt-1 text-sm text-muted-foreground">Next university holiday: {data.name}</p>
            <div className="mt-3 rounded-lg bg-destructive/5 p-3">
              <p className="text-sm font-semibold text-destructive">{data.dateRangeLabel}</p>
              <p className="text-xs text-muted-foreground">{data.daysObserved} Days Observed</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
