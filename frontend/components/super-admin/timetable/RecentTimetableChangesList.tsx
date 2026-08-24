"use client";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchRecentTimetableChanges } from "@/services/superAdminService";
import type { TimetableChangeType } from "@/types";

const CHANGE_BADGE_STYLES: Record<TimetableChangeType, string> = {
  added: "border-transparent bg-success/10 text-success",
  moved: "border-transparent bg-warning/10 text-warning",
  cancelled: "border-transparent bg-destructive/10 text-destructive",
};

const CHANGE_LABELS: Record<TimetableChangeType, string> = {
  added: "Added",
  moved: "Moved",
  cancelled: "Cancelled",
};

/** Recent additions, moves, and cancellations across the semester timetable. */
export function RecentTimetableChangesList() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchRecentTimetableChanges);

  return (
    <SectionCard title="Recent Changes">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load recent timetable changes" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No recent timetable changes" />
      ) : (
        <div className="divide-y divide-border/60">
          {data.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={CHANGE_BADGE_STYLES[entry.changeType]}>
                  {CHANGE_LABELS[entry.changeType]}
                </Badge>
                <p className="text-sm text-foreground">{entry.description}</p>
              </div>
              <span className="text-xs whitespace-nowrap text-muted-foreground">{entry.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
