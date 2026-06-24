"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, FlaskConical, Cpu, Layers } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCurrentClasses } from "@/services/classMonitorService";
import type { MonitorCurrentClassMark } from "@/types";
import { cn } from "@/lib/utils";

const ROW_ICONS = [BookOpen, FlaskConical, Cpu, Layers];

const MARK_LABEL: Record<MonitorCurrentClassMark, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

const MARK_STYLES: Record<MonitorCurrentClassMark, string> = {
  present: "bg-success/10 text-success",
  late: "bg-warning/10 text-warning",
  absent: "bg-destructive/10 text-destructive",
};

/** "Current Classes" list — each row's lecturer status pills plus a Mark Attendance action. */
export function CurrentClassesList() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCurrentClasses);
  const [selected, setSelected] = useState<Record<string, MonitorCurrentClassMark>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});

  return (
    <SectionCard title="Current Classes (07:30 - 09:00)">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load current classes" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={BookOpen} title="No classes in this window" description="Classes scheduled for this time slot will appear here." />
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const Icon = ROW_ICONS[index % ROW_ICONS.length];
            const activeMark = selected[item.id] ?? item.marks[0];
            const isMarked = marked[item.id] ?? false;
            return (
              <Card key={item.id} className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{item.room}</p>
                      <p className="truncate text-sm font-semibold text-foreground">{item.course}</p>
                      <p className="truncate text-xs text-muted-foreground">Lecturer: {item.lecturerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-muted p-1">
                      {item.marks.map((mark) => (
                        <button
                          key={mark}
                          type="button"
                          aria-pressed={activeMark === mark}
                          onClick={() => setSelected((prev) => ({ ...prev, [item.id]: mark }))}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors",
                            activeMark === mark ? MARK_STYLES[mark] : "hover:text-foreground",
                          )}
                        >
                          {MARK_LABEL[mark]}
                        </button>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      disabled={isMarked}
                      onClick={() => {
                        setMarked((prev) => ({ ...prev, [item.id]: true }));
                        toast.success(`${item.lecturerName} marked ${MARK_LABEL[activeMark].toLowerCase()}`);
                      }}
                    >
                      {isMarked ? "Marked" : "Mark Attendance"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
