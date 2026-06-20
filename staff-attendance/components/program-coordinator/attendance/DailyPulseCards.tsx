"use client";

import { CalendarCheck2, Clock, UserX } from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchDailyPulse } from "@/services/programCoordinatorService";

/** "Daily Pulse" stat row: present today, late arrivals, absent/on-leave. */
export function DailyPulseCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchDailyPulse);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load today's attendance" />
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="rounded-xl border border-success/30 bg-success/5 shadow-sm">
        <CardContent className="space-y-2 p-5">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-success/10 text-success">
              <CalendarCheck2 className="size-4.5" />
            </span>
            <span className="text-xs font-semibold text-success">Live Tracking Active</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {data.presentToday} / {data.totalLecturers}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Present Today</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-warning/30 bg-warning/5 shadow-sm">
        <CardContent className="space-y-2 p-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <Clock className="size-4.5" />
          </span>
          <p className="text-2xl font-bold tracking-tight text-foreground">{data.lateArrival}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Late Arrival</p>
          <p className="text-xs text-warning">{data.lateArrivalTrendLabel}</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-destructive/30 bg-destructive/5 shadow-sm">
        <CardContent className="space-y-2 p-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <UserX className="size-4.5" />
          </span>
          <p className="text-2xl font-bold tracking-tight text-foreground">{data.absentOnLeave}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Absent / On Leave</p>
          <p className="text-xs text-muted-foreground">{data.preApprovedLeaveCount} pre-approved leaves</p>
        </CardContent>
      </Card>
    </div>
  );
}
