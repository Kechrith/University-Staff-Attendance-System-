"use client";

import { CalendarDays } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchTodaysClasses } from "@/services/lecturerService";
import type { LecturerClassStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<LecturerClassStatus, string> = {
  ongoing: "bg-success/10 text-success border-success/30",
  upcoming: "bg-muted text-muted-foreground border-border",
  completed: "bg-primary/10 text-primary border-primary/30",
};

const STATUS_LABEL: Record<LecturerClassStatus, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

/** Today's teaching slots, sourced from the timetable. */
export function TodaysClassesCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchTodaysClasses);

  return (
    <SectionCard title="Today's Classes">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load today's classes" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No classes today" description="Your scheduled classes will appear here." />
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{item.course}</p>
                <p className="text-xs text-muted-foreground">
                  Class: {item.classCode} · {item.timeSlotLabel} · {item.room.startsWith("Room") ? item.room : `Room ${item.room}`}
                </p>
              </div>
              <Badge variant="outline" className={cn("shrink-0 rounded-full", STATUS_STYLES[item.status])}>
                {STATUS_LABEL[item.status]}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
