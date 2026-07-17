"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorWeeklyScheduleGrid } from "@/services/programCoordinatorService";
import type { CoordinatorScheduleSlotStatus, WeekDay } from "@/types";
import { cn } from "@/lib/utils";

const DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu"];

const SLOT_STYLES: Record<CoordinatorScheduleSlotStatus, string> = {
  lecture: "border-l-4 border-l-primary bg-primary/5 text-primary",
  lab: "border-l-4 border-l-warning bg-warning/10 text-warning",
  conflict: "border-l-4 border-l-destructive/60 bg-destructive/5 text-destructive",
};

/** Compact Mon-Thu schedule preview used on the dashboard (full grid lives on the Schedule page). */
export function ScheduleCoordinationCard() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchCoordinatorWeeklyScheduleGrid(weekOffset), [weekOffset]);

  return (
    <SectionCard
      title="Schedule Coordination"
      action={
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Previous week" onClick={() => setWeekOffset((o) => o - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next week" onClick={() => setWeekOffset((o) => o + 1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the schedule" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.timeSlots.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nothing scheduled this week" description="Classes will appear here once assigned." />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-[64px_repeat(4,1fr)] gap-2 pb-2">
              <span aria-hidden="true" />
              {DAYS.map((day) => (
                <span key={day} className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {day}
                </span>
              ))}
            </div>

            <div className="divide-y divide-border/60">
              {data.timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-[64px_repeat(4,1fr)] items-start gap-2 py-3">
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
                        ) : null}
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
