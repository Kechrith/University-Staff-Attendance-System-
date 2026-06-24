"use client";

import { CalendarDays } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerWeeklyScheduleGrid } from "@/services/lecturerService";
import type { LecturerScheduleSlotStatus, WeekDay } from "@/types";
import { cn } from "@/lib/utils";

const DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const SLOT_STYLES: Record<LecturerScheduleSlotStatus, string> = {
  class: "border-l-4 border-l-primary bg-primary/5 text-primary",
  "office-hours": "border-l-4 border-l-info bg-info/10 text-info",
  meeting: "border-l-4 border-l-warning bg-warning/10 text-warning",
};

interface LecturerWeeklyScheduleGridProps {
  weekOffset: number;
}

/** The Mon-Fri x time-slot read-only weekly grid of the lecturer's own classes and office hours. */
export function LecturerWeeklyScheduleGrid({ weekOffset }: LecturerWeeklyScheduleGridProps) {
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchLecturerWeeklyScheduleGrid(weekOffset), [weekOffset]);

  return (
    <SectionCard title="Time / Day Schedule">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the schedule grid" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : data.timeSlots.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nothing scheduled this week" description="Your assigned classes will appear here once published." />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[88px_repeat(5,1fr)] gap-2 pb-2">
              <span aria-hidden="true" />
              {DAYS.map((day) => (
                <span key={day} className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {day}
                </span>
              ))}
            </div>

            <div className="divide-y divide-border/60">
              {data.timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-[88px_repeat(5,1fr)] items-start gap-2 py-3">
                  <span className="pt-1 text-xs font-medium whitespace-nowrap text-muted-foreground">{time}</span>
                  {DAYS.map((day) => {
                    const slot = data.slots.find((s) => s.day === day && s.time === time);
                    return (
                      <div key={day}>
                        {slot ? (
                          <div className={cn("rounded-md px-2.5 py-2 text-xs", SLOT_STYLES[slot.status])}>
                            <p className="font-semibold">{slot.title}</p>
                            <p className="mt-0.5 text-muted-foreground">{slot.subtitle}</p>
                          </div>
                        ) : (
                          <div className="flex h-full min-h-12 items-center justify-center rounded-md border border-dashed border-border/40" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
