"use client";

import { toast } from "sonner";
import { CalendarDays, Plus } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorWeeklyScheduleGrid } from "@/services/programCoordinatorService";
import type { CoordinatorScheduleSlotStatus, WeekDay } from "@/types";
import { cn } from "@/lib/utils";

const DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const SLOT_STYLES: Record<CoordinatorScheduleSlotStatus, string> = {
  lecture: "border-l-4 border-l-primary bg-primary/5 text-primary",
  lab: "border-l-4 border-l-warning bg-warning/10 text-warning",
  conflict: "border-l-4 border-l-destructive bg-destructive/10 text-destructive",
};

interface CoordinatorWeeklyScheduleGridProps {
  weekOffset: number;
}

/** The Mon-Fri x time-slot weekly grid, with conflict highlighting and quick-add empty slots. */
export function CoordinatorWeeklyScheduleGrid({ weekOffset }: CoordinatorWeeklyScheduleGridProps) {
  const { data, isLoading, error, refetch } = useAsyncData(() => fetchCoordinatorWeeklyScheduleGrid(weekOffset), [weekOffset]);

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
        <EmptyState icon={CalendarDays} title="Nothing scheduled this week" description="Classes and labs will appear here once assigned." />
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
                          <button
                            type="button"
                            aria-label={`Add a class on ${day} at ${time}`}
                            onClick={() => toast.message("New assignment", { description: "Available once the assignment form is connected." })}
                            className="flex h-full w-full min-h-12 items-center justify-center rounded-md border border-dashed border-border/60 text-muted-foreground/60 transition-colors hover:border-primary/40 hover:text-primary"
                          >
                            <Plus className="size-3.5" />
                          </button>
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
