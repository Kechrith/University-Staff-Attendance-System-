"use client";

import { Briefcase, CalendarDays, HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLeaveBalances, fetchLeaveStatus } from "@/services/classMonitorService";

const TYPE_ICON = {
  Annual: CalendarDays,
  Sick: HeartPulse,
  Other: Briefcase,
} as const;

function BalanceSkeleton() {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardContent className="space-y-2 p-5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-20" />
      </CardContent>
    </Card>
  );
}

/** Leave balance row: Annual / Sick / Other days remaining, plus the highlighted current-status tile. */
export function LeaveBalanceCards() {
  const balances = useAsyncData(fetchLeaveBalances);
  const status = useAsyncData(fetchLeaveStatus);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {balances.error ? (
        <Card className="rounded-xl border-border/60 shadow-sm sm:col-span-2 lg:col-span-3">
          <CardContent>
            <ErrorState onRetry={balances.refetch} title="Couldn't load leave balances" />
          </CardContent>
        </Card>
      ) : balances.isLoading || !balances.data ? (
        Array.from({ length: 3 }).map((_, i) => <BalanceSkeleton key={i} />)
      ) : (
        balances.data.map((balance) => {
          const Icon = TYPE_ICON[balance.type];
          return (
            <Card key={balance.type} className="rounded-xl border-border/60 shadow-sm">
              <CardContent className="space-y-1.5 p-5">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Icon className="size-3.5" /> {balance.type}
                </span>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {balance.remaining} <span className="text-sm font-medium text-muted-foreground">/{balance.total}</span>
                </p>
                <p className="text-xs text-muted-foreground">Days Remaining</p>
              </CardContent>
            </Card>
          );
        })
      )}

      <Card className="rounded-xl border-border/60 bg-primary shadow-sm">
        <CardContent className="space-y-1.5 p-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">Current Status</span>
          {status.error ? (
            <ErrorState onRetry={status.refetch} title="Couldn't load status" className="py-2" />
          ) : status.isLoading || !status.data ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-28 bg-primary-foreground/20" />
              <Skeleton className="h-3 w-32 bg-primary-foreground/20" />
            </div>
          ) : (
            <>
              <p className="text-lg font-bold text-primary-foreground">{status.data.statusLabel}</p>
              <p className="text-xs text-primary-foreground/80">Next scheduled leave: {status.data.nextScheduledLeaveLabel}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
