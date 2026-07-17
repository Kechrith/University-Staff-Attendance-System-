"use client";

import { CalendarCheck, GraduationCap, Target, Users } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorKpis } from "@/services/programCoordinatorService";

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

/** KPI row: attendance rate, GPA average, schedule adherence, total enrollment. */
export function CoordinatorKpiCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorKpis);

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
        icon={CalendarCheck}
        iconClassName="bg-primary/10 text-primary"
        trendLabel={data.attendanceRateTrendLabel}
        trendTone="success"
      />

      <DashboardCard
        title="GPA Average"
        value={data.gpaAverage}
        icon={GraduationCap}
        iconClassName="bg-warning/10 text-warning"
        trendLabel={data.gpaTrendLabel}
        trendTone="muted"
      />

      <DashboardCard
        title="Schedule Adherence"
        value={`${data.scheduleAdherence}%`}
        icon={Target}
        iconClassName="bg-destructive/10 text-destructive"
        trendLabel={data.scheduleAdherenceTrendLabel}
        trendTone="danger"
      />

      <DashboardCard
        title="Total Enrollment"
        value={data.totalEnrollment}
        icon={Users}
        iconClassName="bg-success/10 text-success"
        trendLabel={data.totalEnrollmentTrendLabel}
        trendTone="success"
      />
    </div>
  );
}
