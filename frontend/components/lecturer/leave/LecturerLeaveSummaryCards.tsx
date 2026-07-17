"use client";

import { CalendarCheck2, CalendarMinus, CheckCircle2, ClipboardList } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerLeaveSummary } from "@/services/lecturerService";

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

/** Top stat row: remaining days, used days, pending requests, approved this year. */
export function LecturerLeaveSummaryCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerLeaveSummary);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load your leave summary" />
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
        title="Remaining Days"
        value={data.remainingDays}
        icon={CalendarCheck2}
        iconClassName="bg-success/10 text-success"
      />

      <DashboardCard title="Used Days" value={data.usedDays} icon={CalendarMinus} iconClassName="bg-info/10 text-info" />

      <DashboardCard
        title="Pending Requests"
        value={data.pendingCount}
        icon={ClipboardList}
        iconClassName="bg-warning/10 text-warning"
        trendLabel={data.pendingCount > 0 ? "Awaiting review" : "All clear"}
        trendTone={data.pendingCount > 0 ? "warning" : "success"}
      />

      <DashboardCard
        title="Approved This Year"
        value={data.approvedThisYear}
        icon={CheckCircle2}
        iconClassName="bg-primary/10 text-primary"
      />
    </div>
  );
}
