"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLeaveDistribution } from "@/services/reportsService";

/** Donut chart of pending leave by category, with the total overlaid in the center. */
export function LeaveDistributionCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLeaveDistribution);

  return (
    <SectionCard title="Leave Distribution">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load leave distribution" />
      ) : isLoading || !data ? (
        <Skeleton className="h-[260px] w-full rounded-lg" />
      ) : data.breakdown.length === 0 ? (
        <EmptyState icon={PieChartIcon} title="No pending leave" description="The breakdown will appear here once requests come in." />
      ) : (
        <div className="space-y-5">
          <div className="relative h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.breakdown}
                  dataKey="percentage"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.breakdown.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold tracking-tight text-foreground">{data.totalPending}</p>
              <p className="text-xs text-muted-foreground">Total Pending</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {data.breakdown.map((entry) => (
              <div key={entry.category} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                  {entry.category}
                </span>
                <span className="text-muted-foreground">{entry.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
