"use client";

import { AlertCircle, CalendarDays, GraduationCap, MapPin, Users } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchScheduleEvents } from "@/services/dashboardService";
import type { Priority, ScheduleEventType } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<ScheduleEventType, typeof Users> = {
  meeting: Users,
  class: GraduationCap,
  event: CalendarDays,
  deadline: AlertCircle,
};

const TYPE_STYLES: Record<ScheduleEventType, string> = {
  meeting: "bg-info/10 text-info",
  class: "bg-primary/10 text-primary",
  event: "bg-success/10 text-success",
  deadline: "bg-destructive/10 text-destructive",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/10 text-warning border-warning/30",
  low: "bg-muted text-muted-foreground border-border",
};

export function ScheduleTimeline() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchScheduleEvents);

  return (
    <SectionCard title="Upcoming Schedule" description="Meetings, classes, events, and deadlines">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load schedule" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nothing scheduled" description="There are no upcoming events." />
      ) : (
        <ol className="relative space-y-5 border-l border-border pl-5">
          {data.map((event) => {
            const Icon = TYPE_ICON[event.type];
            return (
              <li key={event.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[27px] flex size-6 items-center justify-center rounded-full ring-4 ring-background",
                    TYPE_STYLES[event.type],
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{event.time}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className={PRIORITY_STYLES[event.priority]}>
                    {event.priority}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </SectionCard>
  );
}
