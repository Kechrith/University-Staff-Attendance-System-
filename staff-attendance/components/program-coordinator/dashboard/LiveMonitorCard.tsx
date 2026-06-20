"use client";

import { Activity } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLiveMonitorEvents } from "@/services/programCoordinatorService";
import type { CoordinatorLiveMonitorTone } from "@/types";
import { cn } from "@/lib/utils";

const DOT_STYLES: Record<CoordinatorLiveMonitorTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

/** Live feed of check-ins / lateness events across managed programs. */
export function LiveMonitorCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLiveMonitorEvents);

  return (
    <SectionCard title="Live Monitor">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load live monitor" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Activity} title="No activity yet" description="Check-ins and alerts will appear here in real time." />
      ) : (
        <div className="space-y-4">
          {data.map((event) => (
            <div key={event.id} className="flex items-start gap-2.5">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT_STYLES[event.tone])} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{event.message}</p>
                <p className="text-xs text-muted-foreground">
                  {event.detail} · {event.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
