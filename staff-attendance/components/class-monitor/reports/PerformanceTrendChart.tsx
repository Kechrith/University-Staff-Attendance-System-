"use client";

import { toast } from "sonner";
import { Download, LineChart as LineChartIcon } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchPerformanceTrend } from "@/services/classMonitorService";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-popover)",
  color: "var(--color-popover-foreground)",
  fontSize: 12,
};

/** "Monthly Performance Trends" — recording accuracy over time, vs the university's academic standard threshold. */
export function PerformanceTrendChart() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchPerformanceTrend);

  return (
    <SectionCard
      title="Monthly Performance Trends"
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.message("Export CSV", { description: "Available once data export is connected." })}
        >
          <Download className="size-3.5" /> Export CSV
        </Button>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load performance trends" />
      ) : isLoading || !data ? (
        <Skeleton className="h-[260px] w-full rounded-lg" />
      ) : data.length === 0 ? (
        <EmptyState icon={LineChartIcon} title="No performance data yet" description="Monthly accuracy trends will appear here once recorded." />
      ) : (
        <>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Recording Accuracy"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            &ldquo;Performance is currently 4% above the university&apos;s academic standard threshold.&rdquo;
          </p>
        </>
      )}
    </SectionCard>
  );
}
