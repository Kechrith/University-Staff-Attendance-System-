"use client";

import { PieChart } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchErrorDistribution } from "@/services/classMonitorService";
import type { MonitorErrorDistributionType } from "@/types";

const TYPE_LABEL: Record<MonitorErrorDistributionType, string> = {
  "manual-overrides": "Manual Overrides",
  "missed-scans": "Missed Scans",
  "sync-delays": "System Sync Delays",
};

const BAR_COLOR: Record<MonitorErrorDistributionType, string> = {
  "manual-overrides": "bg-warning",
  "missed-scans": "bg-destructive",
  "sync-delays": "bg-info",
};

/** "Error Distribution" panel — breakdown of why attendance records needed correction. */
export function ErrorDistributionCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchErrorDistribution);

  return (
    <SectionCard title="Error Distribution">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load error distribution" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={PieChart} title="No errors recorded" description="Attendance correction reasons will appear here." />
      ) : (
        <div className="space-y-4">
          {data.map((datum) => (
            <div key={datum.type}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{TYPE_LABEL[datum.type]}</span>
                <span className="text-muted-foreground">{datum.percentage}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${BAR_COLOR[datum.type]}`} style={{ width: `${datum.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
