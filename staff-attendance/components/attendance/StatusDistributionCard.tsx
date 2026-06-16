"use client";

import { Sparkles } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAttendanceInsight, fetchStatusDistribution } from "@/services/attendanceService";
import type { AttendanceStatus } from "@/types";

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  leave: "Leave",
};

const STATUS_INDICATOR: Record<AttendanceStatus, string> = {
  present: "bg-success",
  late: "bg-warning",
  absent: "bg-destructive",
  leave: "bg-info",
};

export function StatusDistributionCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchStatusDistribution);
  const { data: insight, isLoading: isInsightLoading } = useAsyncData(fetchAttendanceInsight);

  return (
    <SectionCard title="Status Distribution">
      <div className="space-y-5">
        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load status distribution" />
        ) : isLoading || !data ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState title="No data yet" description="Status breakdown will appear here once attendance is recorded." />
        ) : (
          <div className="space-y-3">
            {data.map((entry) => (
              <div key={entry.status}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <span className={`size-2 rounded-full ${STATUS_INDICATOR[entry.status]}`} />
                    {STATUS_LABEL[entry.status]}
                  </span>
                  <span className="text-muted-foreground">{entry.percentage}%</span>
                </div>
                <Progress value={entry.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Sparkles className="size-4" /> AI Insight
          </p>
          {isInsightLoading ? (
            <Skeleton className="mt-2 h-10 w-full" />
          ) : (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {insight || "Insights will appear here once enough attendance data has been collected."}
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
