"use client";

import { CalendarDays } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchWeeklySchedule } from "@/services/classMonitorService";
import type { WeekDay } from "@/types";
import { cn } from "@/lib/utils";

const DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

interface MonitorWeeklyScheduleGridProps {
  weekOffset: number;
}

/** Mon-Fri weekly monitoring grid, with the current day and late entries highlighted. */
export function MonitorWeeklyScheduleGrid({ weekOffset }: MonitorWeeklyScheduleGridProps) {
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchWeeklySchedule(weekOffset), [weekOffset]);

  return (
    <SectionCard title="Weekly Monitoring Schedule">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the weekly schedule" />
      ) : isLoading || !data ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nothing scheduled this week" description="Monitoring assignments will appear here once scheduled." />
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-5 gap-3">
            {DAYS.map((day) => {
              const entries = data.filter((entry) => entry.day === day);
              const isToday = entries.some((e) => e.isToday);
              return (
                <div
                  key={day}
                  className={cn(
                    "space-y-2 rounded-lg border border-border/60 p-3",
                    isToday && "border-primary/40 bg-primary/5",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{day}</span>
                    {isToday ? (
                      <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-[10px] text-primary">
                        Today
                      </Badge>
                    ) : null}
                  </div>

                  {entries.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">—</p>
                  ) : (
                    entries.map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "rounded-md border-l-4 border-l-primary bg-primary/5 px-2.5 py-2 text-xs",
                          entry.isLate && "border-l-warning bg-warning/10",
                        )}
                      >
                        <p className="font-semibold text-foreground">{entry.timeLabel}</p>
                        <p className="mt-0.5 truncate text-foreground">{entry.title}</p>
                        <div className="mt-1 flex items-center justify-between gap-1">
                          <p className="truncate text-muted-foreground">{entry.detail}</p>
                          {entry.isLate ? (
                            <Badge variant="outline" className="shrink-0 rounded-full border-warning/30 bg-warning/10 text-[10px] text-warning">
                              Late
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
