"use client";

import { CheckCircle2, ClipboardList, Users, XCircle } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorLeaveSummary } from "@/services/programCoordinatorService";

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

/** Stat row: pending requests, approved/rejected this month, total managed lecturers. */
export function CoordinatorLeaveSummaryCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorLeaveSummary);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load leave summary" />
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
        title="Pending Requests"
        value={data.pendingCount}
        icon={ClipboardList}
        iconClassName="bg-destructive/10 text-destructive"
        trendLabel="Urgent"
        trendTone="danger"
      />

      <DashboardCard
        title="Approved (Monthly)"
        value={data.approvedMonthly}
        icon={CheckCircle2}
        iconClassName="bg-success/10 text-success"
      />

      <DashboardCard title="Rejected (Monthly)" value={data.rejectedMonthly} icon={XCircle} iconClassName="bg-muted text-muted-foreground" />

      <DashboardCard
        title="Total Managed Lecturers"
        value={data.totalManagedLecturers}
        icon={Users}
        iconClassName="bg-primary/10 text-primary"
      />
    </div>
  );
}
