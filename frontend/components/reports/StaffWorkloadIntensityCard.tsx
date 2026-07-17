"use client";

import { toast } from "sonner";
import { ChevronRight, Flame } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchWorkloadIntensity } from "@/services/reportsService";

/** Gradient swatches matching the heatmap cells, from "Low Intensity" to "Overloaded". */
const LEGEND_OPACITIES = [0.15, 0.4, 0.65, 1];

/** Heatmap correlating scheduled hours with actual attendance, one cell per staff/period bucket. */
export function StaffWorkloadIntensityCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchWorkloadIntensity);

  return (
    <SectionCard
      title="Staff Workload Intensity"
      description="Correlation between scheduled hours and actual attendance"
      action={
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary"
          onClick={() => toast.message("Workload details", { description: "Available once workload analytics are connected." })}
        >
          View Details <ChevronRight className="size-3.5" />
        </Button>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load workload intensity" />
      ) : isLoading || !data ? (
        <Skeleton className="h-[220px] w-full rounded-lg" />
      ) : data.cells.length === 0 ? (
        <EmptyState icon={Flame} title="No workload data yet" description="The heatmap will appear here once schedules and attendance overlap." />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))` }}>
            {data.cells.map((cell) => (
              <div
                key={cell.id}
                className="aspect-square rounded-lg bg-primary"
                style={{ opacity: 0.12 + (cell.intensity / 100) * 0.88 }}
                title={`${cell.intensity}% intensity`}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span>Low Intensity</span>
            <div className="flex items-center gap-1">
              {LEGEND_OPACITIES.map((opacity) => (
                <span key={opacity} className="size-3 rounded-sm bg-primary" style={{ opacity }} />
              ))}
            </div>
            <span>Overloaded</span>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
