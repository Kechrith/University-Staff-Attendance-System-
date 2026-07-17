"use client";

import { CalendarCheck, Hourglass, Target } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchReportKpis } from "@/services/classMonitorService";

function CardSkeleton() {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-14" />
        </div>
      </CardContent>
    </Card>
  );
}

/** KPI row: average recording accuracy, session coverage, late logs, staff compliance grade. */
export function MonitorKpiCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchReportKpis);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load report KPIs" />
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <DashboardCard
        title="Avg. Recording Accuracy"
        value={`${data.avgRecordingAccuracy}%`}
        icon={Target}
        iconClassName="bg-primary/10 text-primary"
        trendLabel={data.avgRecordingAccuracyTrendLabel}
        trendTone="success"
      />

      <DashboardCard
        title="Session Coverage"
        value={`${data.sessionCoverage}%`}
        icon={CalendarCheck}
        iconClassName="bg-success/10 text-success"
        trendLabel={data.sessionCoverageTrendLabel}
        trendTone="muted"
      />

      <DashboardCard
        title="Late Logs"
        value={data.lateLogs}
        icon={Hourglass}
        iconClassName="bg-warning/10 text-warning"
        trendLabel={data.lateLogsTrendLabel}
        trendTone="warning"
      />
    </div>
  );
}
