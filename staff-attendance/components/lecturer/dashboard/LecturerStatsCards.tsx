"use client";

import { AlertCircle, BookOpen, CalendarCheck2, Clock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerDashboardSummary } from "@/services/lecturerService";

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

/** Top stat row: attendance rate, classes this month, late count, pending disputes. */
export function LecturerStatsCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerDashboardSummary);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load your dashboard summary" />
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Attendance Rate"
        value={`${data.attendanceRate}%`}
        icon={CalendarCheck2}
        iconClassName="bg-success/10 text-success"
        trendLabel={data.attendanceRateTrendLabel}
        trendTone="success"
      />

      <DashboardCard
        title="Classes This Month"
        value={data.classesThisMonth}
        icon={BookOpen}
        iconClassName="bg-primary/10 text-primary"
        trendLabel={data.classesThisMonthTrendLabel}
        trendTone="muted"
      />

      <DashboardCard
        title="Late Arrivals"
        value={data.lateCount}
        icon={Clock}
        iconClassName="bg-warning/10 text-warning"
        trendLabel={data.lateCount > 0 ? "Review logs" : "All on time"}
        trendTone={data.lateCount > 0 ? "warning" : "success"}
      />

      <DashboardCard
        title="Pending Disputes"
        value={data.pendingDisputes}
        icon={AlertCircle}
        iconClassName="bg-destructive/10 text-destructive"
        trendLabel={data.pendingDisputes > 0 ? "Awaiting review" : "All clear"}
        trendTone={data.pendingDisputes > 0 ? "danger" : "success"}
      />
    </div>
  );
}
