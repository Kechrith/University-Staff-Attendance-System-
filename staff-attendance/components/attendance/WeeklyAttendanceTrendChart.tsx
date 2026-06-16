"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchWeeklyAttendance, type AttendanceRange } from "@/services/dashboardService";

const RANGE_OPTIONS: { value: AttendanceRange; label: string }[] = [
  { value: "7d", label: "This Week" },
  { value: "1m", label: "Last Month" },
  { value: "1y", label: "Last Year" },
];

export function WeeklyAttendanceTrendChart() {
  const [range, setRange] = useState<AttendanceRange>("7d");
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchWeeklyAttendance(range), [range]);
  // Only working days are plotted — the equivalent dashboard chart already
  // covers the weekend/non-working comparison.
  const workingDays = data?.filter((d) => d.isWorkingDay) ?? [];

  return (
    <SectionCard
      title="Weekly Attendance Trend"
      action={
        <Select value={range} onValueChange={(value) => setRange(value as AttendanceRange)}>
          <SelectTrigger size="sm" className="w-[140px] rounded-full" aria-label="Trend range">
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
        <ErrorState onRetry={refetch} title="Couldn't load attendance trend" />
      ) : isLoading || !data ? (
        <Skeleton className="h-[280px] w-full rounded-lg" />
      ) : workingDays.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No trend data yet" description="The weekly trend will appear here once attendance is recorded." />
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={workingDays} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="weeklyTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-popover)",
                  color: "var(--color-popover-foreground)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="value" name="Present" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#weeklyTrendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
