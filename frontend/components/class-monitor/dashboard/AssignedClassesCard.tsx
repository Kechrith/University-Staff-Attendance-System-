"use client";

import { toast } from "sonner";
import { ChevronRight, Users } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchMonitorDashboardSummary } from "@/services/classMonitorService";
import type { MonitorAssignedClassTone } from "@/types";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<MonitorAssignedClassTone, string> = {
  active: "border-l-success bg-success/5",
  upcoming: "border-l-border bg-muted/30",
  evening: "border-l-warning bg-warning/5",
};

/** "My Assigned Classes" panel — the monitor's current-semester roster. */
export function AssignedClassesCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchMonitorDashboardSummary);

  return (
    <SectionCard title="My Assigned Classes" description="Current semester">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load assigned classes" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : data.assignedClasses.length === 0 ? (
        <EmptyState icon={Users} title="No assigned classes" description="Classes assigned to you will appear here." />
      ) : (
        <div className="space-y-2">
          {data.assignedClasses.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toast.message(item.groupLabel, { description: "Available once the class detail view is connected." })}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg border-l-4 px-3 py-2.5 text-left transition-colors hover:bg-muted/40",
                TONE_STYLES[item.tone],
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{item.groupLabel}</p>
                <p className="truncate text-xs text-muted-foreground">{item.programLabel}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
