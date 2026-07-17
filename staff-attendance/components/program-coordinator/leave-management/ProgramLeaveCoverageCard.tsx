"use client";

import { BarChart3 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchProgramLeaveCoverage } from "@/services/programCoordinatorService";

const BAR_COLORS = ["bg-primary", "bg-success", "bg-warning"];

/** Present-rate bars per course, used to spot coverage gaps from leave. */
export function ProgramLeaveCoverageCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchProgramLeaveCoverage);

  return (
    <SectionCard title="Course Leave Coverage">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load program coverage" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={BarChart3} title="No coverage data yet" description="Coverage will appear here once attendance is tracked." />
      ) : (
        <div className="space-y-4">
          {data.map((datum, index) => (
            <div key={datum.program}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{datum.program}</span>
                <span className="text-muted-foreground">{datum.presentPercentage}% Present</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${BAR_COLORS[index % BAR_COLORS.length]}`}
                  style={{ width: `${datum.presentPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
