"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAcademicPerformanceTrend } from "@/services/programCoordinatorService";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-popover)",
  color: "var(--color-popover-foreground)",
  fontSize: 12,
};

function TrendLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary" /> CS Department
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary/25" /> Uni Average
      </span>
    </div>
  );
}

/** Department vs. university-average performance, grouped by academic year. */
export function AcademicPerformanceTrendChart() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchAcademicPerformanceTrend);

  return (
    <SectionCard title="Academic Performance Trend" action={<TrendLegend />}>
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load performance trend" />
      ) : isLoading || !data ? (
        <Skeleton className="h-[260px] w-full rounded-lg" />
      ) : data.length === 0 ? (
        <EmptyState icon={BarChart3} title="No performance data yet" description="Trend data will appear here once results are recorded." />
      ) : (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="yearLabel" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="departmentValue" name="CS Department" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar
                dataKey="universityAverage"
                name="Uni Average"
                fill="var(--color-primary)"
                fillOpacity={0.25}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
