"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Check, Clock, X } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchMonitorDashboardSummary } from "@/services/classMonitorService";
import type { MonitorAttendanceMark } from "@/types";
import { cn } from "@/lib/utils";

const MARK_OPTIONS: { mark: MonitorAttendanceMark; icon: typeof Check; label: string; activeClassName: string }[] = [
  { mark: "present", icon: Check, label: "Present", activeClassName: "bg-success/10 text-success" },
  { mark: "late", icon: Clock, label: "Late", activeClassName: "bg-warning/10 text-warning" },
  { mark: "absent", icon: X, label: "Absent", activeClassName: "bg-destructive/10 text-destructive" },
];

/** The "Daily Class Attendance" table — quick present/late/absent toggles per scheduled class. */
export function DailyClassAttendanceTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchMonitorDashboardSummary);
  const [marks, setMarks] = useState<Record<string, MonitorAttendanceMark>>({});

  function setMark(entryId: string, mark: MonitorAttendanceMark, lecturerName: string) {
    setMarks((prev) => ({ ...prev, [entryId]: mark }));
    if (mark) toast.success(`Marked ${lecturerName} as ${mark}`);
  }

  return (
    <SectionCard
      title="Daily Class Attendance"
      description="Present · Late · Absent"
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load today's classes" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : data.dailyClasses.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No classes today" description="Scheduled classes will appear here once assigned." />
      ) : (
        <div className="divide-y divide-border/60">
          {data.dailyClasses.map((entry) => {
            const activeMark = marks[entry.id] ?? entry.mark;
            return (
              <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-20 shrink-0 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">{entry.timeRangeLabel}</p>
                    <p>{entry.room}</p>
                  </div>
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={entry.lecturerAvatar} alt={entry.lecturerName} />
                    <AvatarFallback>{entry.lecturerName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{entry.lecturerName}</p>
                    <p className="truncate text-xs text-muted-foreground">{entry.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {MARK_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeMark === option.mark;
                    return (
                      <Button
                        key={option.mark}
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Mark ${entry.lecturerName} as ${option.label}`}
                        aria-pressed={isActive}
                        className={cn("rounded-full text-muted-foreground", isActive && option.activeClassName)}
                        onClick={() => setMark(entry.id, option.mark, entry.lecturerName)}
                      >
                        <Icon className="size-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
