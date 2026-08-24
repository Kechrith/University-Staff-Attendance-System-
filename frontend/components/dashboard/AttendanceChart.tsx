"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchWeeklyAttendance, type AttendanceRange } from "@/services/dashboardService";

const RANGE_OPTIONS: { value: AttendanceRange; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "1m", label: "Last Month" },
  { value: "1y", label: "Last Year" },
];

const WORKING_DAY_COLOR = "var(--color-primary)";
const NON_WORKING_DAY_COLOR = "var(--color-muted-foreground)";

// Recharts legend only supports one swatch per series, so a static two-item
// legend is rendered manually below the chart (the bars themselves are
// colored per-day, not per-series, via <Cell>).
function ChartLegend() {
  return (
    <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: WORKING_DAY_COLOR }} /> Present
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: NON_WORKING_DAY_COLOR }} /> Non-Working
      </span>
    </div>
  );
}

export function AttendanceChart() {
  const [range, setRange] = useState<AttendanceRange>("7d");
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchWeeklyAttendance(range), [range]);

  return (
    <SectionCard
      title="Weekly Trends"
      action={
        <Select value={range} onValueChange={(value) => setRange(value as AttendanceRange)}>
          <SelectTrigger size="sm" className="w-[150px] rounded-full" aria-label="Attendance range">
            <SelectValue>{(value: AttendanceRange) => RANGE_OPTIONS.find((opt) => opt.value === value)?.label ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load attendance chart" />
      ) : isLoading || !data ? (
        <Skeleton className="h-[300px] w-full rounded-lg" />
      ) : data.length === 0 ? (
        <EmptyState icon={BarChart3} title="No attendance data yet" description="Data for this range will appear here once it's available." />
      ) : (
        <>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-popover)",
                    color: "var(--color-popover-foreground)",
                    fontSize: 12,
                  }}
                  formatter={(value, _name, item) => [value, item.payload.isWorkingDay ? "Present" : "Non-Working"]}
                />
                <Legend content={() => null} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {data.map((entry) => (
                    <Cell key={entry.day} fill={entry.isWorkingDay ? WORKING_DAY_COLOR : NON_WORKING_DAY_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend />
        </>
      )}
    </SectionCard>
  );
}
