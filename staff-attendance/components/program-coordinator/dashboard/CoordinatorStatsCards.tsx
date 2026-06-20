"use client";

import { AlertTriangle, BookOpen, DoorOpen, Users } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorDashboardSummary } from "@/services/programCoordinatorService";

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

/** Top stat row: managed programs, active lecturers, absence alerts, room utilization. */
export function CoordinatorStatsCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorDashboardSummary);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load dashboard summary" />
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
        title="Managed Programs"
        value={data.managedPrograms}
        icon={BookOpen}
        iconClassName="bg-primary/10 text-primary"
        trendLabel={data.managedProgramsGrowthLabel}
        trendTone="success"
      />

      <DashboardCard
        title="Active Lecturers"
        value={data.activeLecturers}
        icon={Users}
        iconClassName="bg-success/10 text-success"
        trendLabel={data.activeLecturersRateLabel}
        trendTone="success"
      />

      <DashboardCard
        title="Absence Alerts"
        value={data.absenceAlerts}
        icon={AlertTriangle}
        iconClassName="bg-destructive/10 text-destructive"
        trendLabel={data.absenceAlerts > 0 ? "Action needed" : "All clear"}
        trendTone={data.absenceAlerts > 0 ? "danger" : "success"}
      />

      <DashboardCard
        title="Room Utilization"
        value={`${data.roomUtilization}%`}
        icon={DoorOpen}
        iconClassName="bg-info/10 text-info"
        trendLabel={`${data.roomSeatCount} seats`}
        trendTone="muted"
      />
    </div>
  );
}
