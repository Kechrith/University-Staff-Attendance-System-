"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardCheck, UserCheck, Clock, UserX, FileCheck, AlertCircle, FileClock, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerDashboardSummary } from "@/services/lecturerService";

export function LecturerStatsTiles() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerDashboardSummary);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="p-5">
          <ErrorState onRetry={refetch} title="Couldn't load session metrics" />
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercent = data.totalSemesterSessions > 0
    ? Math.min(Math.round((data.completedSessions / data.totalSemesterSessions) * 100), 100)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      {/* Tile 1: Sessions Completed */}
      <Card className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card to-primary/5 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Sessions Completed</h3>
            </div>
            <span className="text-xs font-semibold text-primary">{progressPercent}%</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {data.completedSessions}
              </span>
              <span className="text-base font-medium text-muted-foreground sm:text-lg">
                / {data.totalSemesterSessions}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground ml-auto">
                (Semester Total)
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {data.completedSessions} completed out of {data.totalSemesterSessions} planned sessions ({data.weeklyCount} sessions/week × 15 weeks).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tile 2: Attendance Record */}
      <Card className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card to-accent/5 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <ClipboardCheck className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Attendance Record</h3>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Log Summary</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {/* Present */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-success/30 bg-success/10 p-2 sm:p-2.5 text-center">
              <div className="mb-1 flex items-center gap-1 text-success">
                <UserCheck className="size-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">Present</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-success">{data.presentCount}</span>
            </div>

            {/* Late */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-warning/30 bg-warning/10 p-2 sm:p-2.5 text-center">
              <div className="mb-1 flex items-center gap-1 text-warning">
                <Clock className="size-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">Late</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-warning">{data.lateCount}</span>
            </div>

            {/* Absent */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-2 sm:p-2.5 text-center">
              <div className="mb-1 flex items-center gap-1 text-destructive">
                <UserX className="size-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">Absent</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-destructive">{data.absentCount}</span>
            </div>

            {/* Permission / Leave */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 sm:p-2.5 text-center">
              <div className="mb-1 flex items-center gap-1 text-blue-500">
                <FileCheck className="size-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">Permission</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-blue-500">{data.permissionCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tile 3: Pending Permissions & Disputes Widget */}
      <Card className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card to-amber-500/5 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <AlertCircle className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Pending Requests &amp; Disputes</h3>
            </div>
            <span className="text-xs font-medium text-amber-500 shrink-0">Action Needed</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {/* Pending Permissions */}
            <Link
              href="/Lecturer/Leave-Requests"
              className="group flex flex-col justify-between rounded-lg border border-blue-500/20 bg-background/60 p-3 transition-all hover:border-blue-500/50 hover:bg-blue-500/5"
            >
              <div className="flex items-center justify-between gap-1 text-blue-500">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileClock className="size-3.5 shrink-0" />
                  <span className="truncate text-[11px] font-semibold uppercase tracking-wide">Pending Leave</span>
                </div>
                <ArrowUpRight className="size-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{data.pendingPermissions}</span>
                <span className="text-[10px] text-muted-foreground">Requests</span>
              </div>
            </Link>

            {/* Pending Disputes */}
            <Link
              href="/Lecturer/My-Records"
              className="group flex flex-col justify-between rounded-lg border border-destructive/20 bg-background/60 p-3 transition-all hover:border-destructive/50 hover:bg-destructive/5"
            >
              <div className="flex items-center justify-between gap-1 text-destructive">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ShieldAlert className="size-3.5 shrink-0" />
                  <span className="truncate text-[11px] font-semibold uppercase tracking-wide">Pending Disputes</span>
                </div>
                <ArrowUpRight className="size-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{data.pendingDisputes}</span>
                <span className="text-[10px] text-muted-foreground">In Review</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
