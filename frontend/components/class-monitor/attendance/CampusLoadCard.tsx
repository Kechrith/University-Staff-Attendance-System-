"use client";

import { Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCampusLoad } from "@/services/classMonitorService";

/** Highlighted tile showing current campus occupancy load. */
export function CampusLoadCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCampusLoad);

  return (
    <Card className="rounded-2xl border-border/60 bg-muted/40 shadow-sm">
      <CardContent className="space-y-2 p-5">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Gauge className="size-3.5" /> Current Campus Load
        </span>

        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load campus load" className="py-2" />
        ) : isLoading || !data ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold tracking-tight text-destructive">{data.capacityPercentage}% Capacity</p>
            <p className="text-xs text-muted-foreground">Data updated {data.updatedLabel}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
