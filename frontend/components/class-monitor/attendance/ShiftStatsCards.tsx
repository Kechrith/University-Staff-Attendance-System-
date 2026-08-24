"use client";

import { toast } from "sonner";
import { CalendarCheck, Hourglass, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchShiftStats } from "@/services/classMonitorService";

function StatSkeleton() {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardContent className="space-y-2 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-14" />
      </CardContent>
    </Card>
  );
}

/** Stat row above the current-classes list: total classes, lecturer attendance rate, pending records + finalize action. */
export function ShiftStatsCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchShiftStats);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load shift stats" />
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-1.5 p-5">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <CalendarCheck className="size-3.5" /> Total Classes Today
          </span>
          <p className="text-2xl font-bold tracking-tight text-foreground">{data.totalClassesToday}</p>
          <p className="text-xs text-muted-foreground">{data.totalRoomsLabel}</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-1.5 p-5">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <TrendingUp className="size-3.5" /> Lecturer Attendance
          </span>
          <p className="text-2xl font-bold tracking-tight text-success">{data.lecturerAttendanceRate}%</p>
          <p className="text-xs text-success">{data.lecturerAttendanceTrendLabel}</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-2 p-5">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Hourglass className="size-3.5" /> Pending Records
          </span>
          <p className="text-2xl font-bold tracking-tight text-destructive">{data.pendingRecords}</p>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-primary"
            onClick={() => toast.success("All records finalized", { description: "Today's attendance has been locked in." })}
          >
            Finalize All →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
