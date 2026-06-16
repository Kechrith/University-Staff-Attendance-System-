"use client";

import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, FlaskConical, Languages } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchUnassignedClasses } from "@/services/scheduleService";
import type { UnassignedClassCategory } from "@/types";

const CATEGORY_ICON: Record<UnassignedClassCategory, typeof AlertTriangle> = {
  general: AlertTriangle,
  language: Languages,
  science: FlaskConical,
};

/** Queue of classes still needing a lecturer/room assignment. */
export function UnassignedClassesCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchUnassignedClasses);
  const criticalCount = data?.length ?? 0;

  return (
    <SectionCard
      title="Unassigned Classes"
      action={
        criticalCount > 0 ? (
          <Badge className="rounded-full bg-destructive/10 text-[11px] font-semibold uppercase tracking-wide text-destructive">
            {criticalCount} critical
          </Badge>
        ) : null
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load unassigned classes" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="All classes assigned" description="There's nothing left in the resolve queue." />
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const Icon = CATEGORY_ICON[item.category];
            return (
              <div key={item.id} className="flex items-start gap-3 rounded-lg bg-destructive/5 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{item.courseLabel}</p>
                  <p className="text-xs text-muted-foreground">{item.scheduleLabel}</p>
                </div>
              </div>
            );
          })}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.message("Resolve queue", { description: "Available once the full queue view is connected." })}
          >
            View All Resolve Queue
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
