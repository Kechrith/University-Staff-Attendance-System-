"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ClipboardList } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerAttendanceRecords } from "@/services/lecturerService";
import type { LecturerRecordStatus } from "@/types";
import { cn } from "@/lib/utils";

const RECENT_COUNT = 5;

const STATUS_STYLES: Record<LecturerRecordStatus, string> = {
  present: "bg-success/10 text-success border-success/30",
  late: "bg-warning/10 text-warning border-warning/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_LABEL: Record<LecturerRecordStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

/** The latest few attendance + lesson-summary entries, most recent first (FR-4). */
export function RecentRecordsCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerAttendanceRecords);

  const recent = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, RECENT_COUNT);
  }, [data]);

  return (
    <SectionCard
      title="Recent Records"
      action={
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          nativeButton={false}
          render={<Link href="/Lecturer/My-Records">View all</Link>}
        />
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load your recent records" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No records yet" description="Attendance logged by your Class Monitor will appear here." />
      ) : (
        <div className="space-y-3">
          {recent.map((record) => (
            <div key={record.id} className="rounded-lg border border-border/60 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {record.course} <span className="text-muted-foreground">· {record.classCode}</span>
                </p>
                <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[record.status])}>
                  {STATUS_LABEL[record.status]}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ·{" "}
                {record.timeSlotLabel}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{record.lessonSummary}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
