"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAttendanceTrends } from "@/services/reportsService";
import type { ReportRange } from "@/types";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-popover)",
  color: "var(--color-popover-foreground)",
  fontSize: 12,
};

/** Static two-swatch legend, since the two `<Bar>` series share one stack. */
function TrendLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary" /> Present
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary/25" /> Late
      </span>
    </div>
  );
}

interface AttendanceTrendsCardProps {
  range: ReportRange;
}

/** Stacked Present/Late attendance bar chart, scoped by the header's Weekly/Monthly/Quarterly toggle. */
export function AttendanceTrendsCard({ range }: AttendanceTrendsCardProps) {
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchAttendanceTrends(range), [range]);

  return (
    <SectionCard title="Attendance Trends" action={<TrendLegend />}>
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load attendance trends" />
      ) : isLoading || !data ? (
        <Skeleton className="h-[260px] w-full rounded-lg" />
      ) : data.length === 0 ? (
        <EmptyState icon={BarChart3} title="No trend data yet" description="Attendance trends will appear here once data is recorded." />
      ) : (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="present" name="Present" stackId="attendance" fill="var(--color-primary)" maxBarSize={48} />
              <Bar
                dataKey="late"
                name="Late"
                stackId="attendance"
                fill="var(--color-primary)"
                fillOpacity={0.25}
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
