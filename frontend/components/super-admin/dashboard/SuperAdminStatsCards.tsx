"use client";

import { CalendarClock, Gavel, Users } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchSuperAdminDashboardSummary } from "@/services/superAdminService";

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

/**
 * Top stat row: total accounts, sessions this week, active disputes.
 * Faculties/departments are dropped here — with sample data scoped to a
 * single department they'd always read "1" and add no signal.
 */
export function SuperAdminStatsCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchSuperAdminDashboardSummary);

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <DashboardCard title="Total Accounts" value={data.totalUserAccounts} icon={Users} iconClassName="bg-primary/10 text-primary" />

      <DashboardCard title="Sessions This Week" value={data.sessionsThisWeek} icon={CalendarClock} iconClassName="bg-info/10 text-info" />

      <DashboardCard
        title="Active Disputes"
        value={data.activeDisputes}
        icon={Gavel}
        iconClassName="bg-destructive/10 text-destructive"
        trendLabel={data.activeDisputesTrendLabel}
        trendTone={data.activeDisputes > 0 ? "danger" : "success"}
      />
    </div>
  );
}
