"use client";

import { Award, Clock3, Gauge, TimerOff } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchPerformanceOverview } from "@/services/dashboardService";

export function PerformanceCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchPerformanceOverview);

  if (error) {
    return (
      <SectionCard title="Performance Overview">
        <ErrorState onRetry={refetch} title="Couldn't load performance data" />
      </SectionCard>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
            <Award className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Best Attendance</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage src={data.bestAttendanceStaff.avatar} alt={data.bestAttendanceStaff.name} />
                <AvatarFallback>{data.bestAttendanceStaff.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="truncate text-sm font-semibold text-foreground">{data.bestAttendanceStaff.name}</p>
            </div>
            <p className="mt-1 text-xs text-success">{data.bestAttendanceStaff.rate}% attendance rate</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <TimerOff className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Most Late Arrivals</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage src={data.mostLateStaff.avatar} alt={data.mostLateStaff.name} />
                <AvatarFallback>{data.mostLateStaff.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="truncate text-sm font-semibold text-foreground">{data.mostLateStaff.name}</p>
            </div>
            <p className="mt-1 text-xs text-warning">{data.mostLateStaff.lateCount} late arrivals this month</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Gauge className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">Department Attendance Rate</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{data.departmentAttendanceRate}%</p>
            <Progress value={data.departmentAttendanceRate} className="mt-2 h-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
            <Clock3 className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Average Check-in Time</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{data.averageCheckInTime}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
