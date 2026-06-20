"use client";

import { PieChart } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchProgramDistribution } from "@/services/programCoordinatorService";

/** Attendance rate broken down by managed program (e.g. IT vs CS). */
export function ProgramDistributionCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchProgramDistribution);

  return (
    <SectionCard title="Program Distribution">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load program distribution" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={PieChart} title="No program data yet" description="Distribution will appear here once programs report attendance." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map((datum) => (
            <div key={datum.program} className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{datum.program}</span>
                <span className="text-sm font-bold text-foreground">{datum.percentage}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${datum.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
