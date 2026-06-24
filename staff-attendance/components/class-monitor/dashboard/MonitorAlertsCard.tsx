"use client";

import { AlertTriangle } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchMonitorDashboardSummary } from "@/services/classMonitorService";
import type { MonitorAlertTone } from "@/types";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<MonitorAlertTone, string> = {
  warning: "border-l-warning bg-warning/5",
  info: "border-l-info bg-info/5",
};

/** "Alerts" panel: schedule changes, proxy assignments, and other heads-up items for the monitor. */
export function MonitorAlertsCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchMonitorDashboardSummary);

  return (
    <SectionCard
      title="Alerts"
      action={data && data.alerts.length > 0 ? <Badge variant="outline" className="rounded-full border-destructive/30 bg-destructive/10 text-destructive">{data.alerts.length} new</Badge> : null}
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load alerts" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : data.alerts.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No alerts" description="Schedule changes and proxy assignments will appear here." />
      ) : (
        <div className="space-y-2.5">
          {data.alerts.map((alert) => (
            <div key={alert.id} className={cn("rounded-lg border-l-4 px-3 py-2.5", TONE_STYLES[alert.tone])}>
              <p className="text-sm font-semibold text-foreground">{alert.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
