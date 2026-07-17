"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ChevronLeft, ChevronRight, DoorOpen, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorScheduleOverview } from "@/services/programCoordinatorService";

interface CoordinatorScheduleHeaderProps {
  weekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
}

/** Hero section: title, primary actions, week navigator, and the schedule-conflicts alert banner. */
export function CoordinatorScheduleHeader({ weekOffset, onWeekOffsetChange }: CoordinatorScheduleHeaderProps) {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorScheduleOverview, [weekOffset]);
  const [weekLabelVisible] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Weekly Schedule Control</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage program assignments &amp; resource allocation.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast.message("Reassign room", { description: "Available once room reassignment is connected." })}
          >
            <DoorOpen className="size-4" /> Reassign Room
          </Button>
          <Button onClick={() => toast.message("Assign new lecturer", { description: "Available once lecturer assignment is connected." })}>
            <UserPlus className="size-4" /> Assign New Lecturer
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Previous week" onClick={() => onWeekOffsetChange(weekOffset - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            {error ? null : isLoading || !data ? (
              <Skeleton className="h-4 w-32" />
            ) : weekLabelVisible ? (
              <span className="whitespace-nowrap text-sm font-semibold text-foreground">{data.weekRangeLabel}</span>
            ) : null}
            <Button variant="ghost" size="icon-sm" aria-label="Next week" onClick={() => onWeekOffsetChange(weekOffset + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {error ? (
            <ErrorState onRetry={refetch} title="Couldn't load schedule overview" className="py-0" />
          ) : !isLoading && data && data.conflictCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                <span className="font-semibold">{data.conflictCount} Schedule Conflicts Detected</span> — {data.conflictDetailLabel}
              </span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-destructive underline"
                onClick={() => toast.message("Schedule conflicts", { description: "Resolution flow not connected yet." })}
              >
                View All
              </Button>
            </div>
          ) : null}

          <div className="flex items-center gap-4 text-sm">
            {isLoading || !data ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <>
                <span className="text-muted-foreground">
                  Room Utilization <span className="font-semibold text-foreground">{data.roomUtilization}%</span>
                </span>
                <span className="text-muted-foreground">
                  Pending Actions <span className="font-semibold text-foreground">{data.pendingActions}</span>
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
