"use client";

import { DoorOpen, RefreshCw, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchScheduleSummary } from "@/services/classMonitorService";

function StatSkeleton() {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardContent className="space-y-2 p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-16" />
      </CardContent>
    </Card>
  );
}

/** Stat row beneath the weekly grid: assigned lecturers, monitoring zones, weekly coverage. */
export function ScheduleStatsCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchScheduleSummary);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load schedule stats" />
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
            <Users className="size-3.5" /> Total Assigned Lecturers
          </span>
          <p className="text-2xl font-bold tracking-tight text-foreground">{data.assignedLecturers}</p>
          <p className="text-xs text-muted-foreground">Professionals</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-1.5 p-5">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <DoorOpen className="size-3.5" /> Active Monitoring Zones
          </span>
          <p className="text-2xl font-bold tracking-tight text-foreground">{data.activeMonitoringZones}</p>
          <p className="text-xs text-muted-foreground">Room Wings</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-1.5 p-5">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <RefreshCw className="size-3.5" /> Weekly Coverage
          </span>
          <p className="text-2xl font-bold tracking-tight text-success">{data.weeklyCoveragePercentage}%</p>
          <p className="text-xs text-muted-foreground">Coverage</p>
        </CardContent>
      </Card>
    </div>
  );
}
