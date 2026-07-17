"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchWeeklyAttendanceBreakdown } from "@/services/programCoordinatorService";
import type { AttendanceBreakdownStatus } from "@/types";
import { cn } from "@/lib/utils";

type ViewMode = "table" | "grid";

const STATUS_STYLES: Record<AttendanceBreakdownStatus, string> = {
  excellent: "bg-success/10 text-success border-success/30",
  "on-target": "bg-warning/10 text-warning border-warning/30",
  "low-attendance": "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_LABEL: Record<AttendanceBreakdownStatus, string> = {
  excellent: "Excellent",
  "on-target": "On Target",
  "low-attendance": "Low Attendance",
};

const BAR_COLOR: Record<AttendanceBreakdownStatus, string> = {
  excellent: "bg-success",
  "on-target": "bg-warning",
  "low-attendance": "bg-destructive",
};

/** The "Weekly Attendance Detailed Breakdown" table, with a Table/Grid display toggle. */
export function WeeklyAttendanceBreakdownTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchWeeklyAttendanceBreakdown);
  const [view, setView] = useState<ViewMode>("table");

  return (
    <SectionCard
      title="Weekly Attendance Detailed Breakdown"
      action={
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            className="h-7 rounded-full px-3"
            onClick={() => setView("table")}
          >
            <List className="size-3.5" /> Table
          </Button>
          <Button variant={view === "grid" ? "default" : "ghost"} size="sm" className="h-7 rounded-full px-3" onClick={() => setView("grid")}>
            <LayoutGrid className="size-3.5" /> Grid
          </Button>
        </div>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the attendance breakdown" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No attendance data yet" description="Class-level breakdowns will appear here once recorded." />
      ) : view === "table" ? (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Class Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-primary">{row.classCode}</TableCell>
                  <TableCell>{row.subjectName}</TableCell>
                  <TableCell className="text-muted-foreground">{row.lecturerName}</TableCell>
                  <TableCell className="text-muted-foreground">{row.enrolled}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{row.attendancePercentage}%</span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", BAR_COLOR[row.status])} style={{ width: `${row.attendancePercentage}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[row.status])}>
                      {STATUS_LABEL[row.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((row) => (
            <Card key={row.id} className="rounded-xl border-border/60 shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{row.classCode}</span>
                  <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[row.status])}>
                    {STATUS_LABEL[row.status]}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{row.subjectName}</p>
                <p className="text-xs text-muted-foreground">
                  {row.lecturerName} · {row.enrolled} enrolled
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{row.attendancePercentage}%</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", BAR_COLOR[row.status])} style={{ width: `${row.attendancePercentage}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
