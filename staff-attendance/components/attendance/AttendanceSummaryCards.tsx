"use client";

import { CheckCircle2, Clock, Users, UserX } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAttendanceOverview } from "@/services/attendanceService";

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

export function AttendanceSummaryCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchAttendanceOverview);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load attendance overview" />
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
        title="Total Staff"
        value={data.totalStaff}
        icon={Users}
        iconClassName="bg-primary/10 text-primary"
        trendLabel={`${data.totalStaffTrend >= 0 ? "+" : ""}${data.totalStaffTrend}% from last week`}
        trendTone={data.totalStaffTrend >= 0 ? "success" : "danger"}
      />

      <DashboardCard
        title="Present Today"
        value={data.presentToday}
        icon={CheckCircle2}
        iconClassName="bg-success/10 text-success"
        trendLabel={`${data.presentRate}% Rate`}
        trendTone="success"
      />

      <DashboardCard
        title="Late Arrivals"
        value={data.lateArrivals}
        icon={Clock}
        iconClassName="bg-warning/10 text-warning"
        trendLabel={data.lateIsHighPriority ? "High priority" : "Normal"}
        trendTone={data.lateIsHighPriority ? "warning" : "success"}
      />

      <DashboardCard
        title="Absent"
        value={data.absentToday}
        icon={UserX}
        iconClassName="bg-destructive/10 text-destructive"
        trendLabel={`${data.absentTrend >= 0 ? "+" : ""}${data.absentTrend}% Today`}
        trendTone={data.absentTrend > 0 ? "danger" : "success"}
      />
    </div>
  );
}
