"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchDisputeStats } from "@/services/superAdminService";
import { cn } from "@/lib/utils";

interface StatChipProps {
  label: string;
  value: number;
  className: string;
}

function StatChip({ label, value, className }: StatChipProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", className)}>
      <span className="font-semibold">{value}</span> {label}
    </span>
  );
}

/** Hero section at the top of the Super Admin Disputes page, with inline stat chips. */
export function DisputesHeader() {
  const { data, isLoading } = useAsyncData(fetchDisputeStats);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Disputes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Final decisions on escalated attendance disputes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isLoading || !data ? (
          <>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </>
        ) : (
          <>
            <StatChip label="Open" value={data.openCount} className="border-warning/30 bg-warning/10 text-warning" />
            <StatChip label="Resolved this month" value={data.resolvedThisMonth} className="border-success/30 bg-success/10 text-success" />
            <StatChip label="Overdue" value={data.overdueCount} className="border-destructive/30 bg-destructive/10 text-destructive" />
          </>
        )}
      </div>
    </div>
  );
}
