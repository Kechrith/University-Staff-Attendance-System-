"use client";

import { Calendar, Clock, MapPin, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchTodaysClasses, fetchLecturerWeeklyScheduleGrid } from "@/services/lecturerService";
import type { LecturerTodayClass } from "@/types";
import { cn } from "@/lib/utils";

interface SessionDisplayInfo {
  time: string;
  courseName: string;
  className: string;
  room: string;
  status: "ongoing" | "upcoming" | "completed" | "scheduled";
  dayLabel?: string;
}

export function UpcomingSessionTile() {
  const { data: todayClasses, isLoading: isLoadingToday, error: errorToday, refetch: refetchToday } = useAsyncData(fetchTodaysClasses);
  const { data: scheduleGrid, isLoading: isLoadingGrid } = useAsyncData(() => fetchLecturerWeeklyScheduleGrid(0));

  const isLoading = isLoadingToday || isLoadingGrid;

  if (errorToday) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="p-5">
          <ErrorState onRetry={refetchToday} title="Couldn't load upcoming session" />
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-7 w-3/4" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine the next session to highlight
  let sessionInfo: SessionDisplayInfo | null = null;

  if (todayClasses && todayClasses.length > 0) {
    // 1. First priority: Ongoing session
    const ongoing = todayClasses.find((c) => c.status === "ongoing");
    // 2. Second priority: Upcoming session today
    const upcoming = todayClasses.find((c) => c.status === "upcoming");
    // 3. Fallback: Last completed session today
    const selected = ongoing || upcoming || todayClasses[0];

    if (selected) {
      const formattedRoom = selected.room.startsWith("Room") ? selected.room : `Room ${selected.room}`;
      // Clean course name if it starts with classCode (e.g. "DSE-101 Intro to Data Science" -> "Intro to Data Science")
      const cleanedCourse = selected.course.startsWith(selected.classCode)
        ? selected.course.slice(selected.classCode.length).replace(/^[:\s-]+/, "").trim() || selected.course
        : selected.course;

      sessionInfo = {
        time: selected.timeSlotLabel,
        courseName: cleanedCourse,
        className: selected.classCode,
        room: formattedRoom,
        status: selected.status,
        dayLabel: "Today",
      };
    }
  }

  // If no classes today, look for the next available slot in weekly schedule
  if (!sessionInfo && scheduleGrid && scheduleGrid.slots && scheduleGrid.slots.length > 0) {
    const firstSlot = scheduleGrid.slots[0];
    const rawRoom = firstSlot.subtitle || "Room A201";
    const formattedRoom = rawRoom.startsWith("Room") ? rawRoom : `Room ${rawRoom}`;

    // Extract class code (e.g., "DSE-101" from "DSE-101 Intro to Data Science")
    const codeMatch = firstSlot.title.match(/^([A-Z0-9-]+)/);
    const classCode = codeMatch ? codeMatch[1] : "DSE-101";

    sessionInfo = {
      time: firstSlot.time,
      courseName: firstSlot.title,
      className: classCode,
      room: formattedRoom,
      status: "scheduled",
      dayLabel: firstSlot.day,
    };
  }

  return (
    <Card className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
      {/* Decorative accent background blur */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />

      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Upcoming Session
            </span>
          </div>

          {sessionInfo ? (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 font-medium px-2.5 py-0.5 rounded-full text-xs",
                sessionInfo.status === "ongoing"
                  ? "bg-success/15 text-success border-success/30"
                  : sessionInfo.status === "upcoming"
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {sessionInfo.status === "ongoing" && <span className="mr-1.5 inline-block size-2 animate-ping rounded-full bg-success" />}
              {sessionInfo.status === "ongoing"
                ? "Ongoing Now"
                : sessionInfo.status === "upcoming"
                ? `Next Up (${sessionInfo.dayLabel})`
                : sessionInfo.dayLabel
                ? `${sessionInfo.dayLabel} Scheduled`
                : "Scheduled"}
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 bg-muted text-muted-foreground rounded-full text-xs">
              No Sessions
            </Badge>
          )}
        </div>

        {sessionInfo ? (
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {/* Course Name (Primary focus) */}
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-2xl break-words">
                {sessionInfo.courseName}
              </h3>
            </div>

            {/* Session Info Tile Metadata Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 rounded-lg border border-border/50 bg-background/60 p-3 sm:p-3.5 backdrop-blur-sm sm:grid-cols-3">
              {/* Time */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Clock className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Time</p>
                  <p className="truncate text-xs font-semibold text-foreground">{sessionInfo.time}</p>
                </div>
              </div>

              {/* Class */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/20 text-accent-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Class</p>
                  <p className="truncate text-xs font-semibold text-foreground">{sessionInfo.className}</p>
                </div>
              </div>

              {/* Room */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <MapPin className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Room</p>
                  <p className="truncate text-xs font-semibold text-foreground">{sessionInfo.room}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed border-border p-4 text-muted-foreground">
            <CheckCircle2 className="size-5 text-muted-foreground shrink-0" />
            <p className="text-xs sm:text-sm font-medium">No upcoming sessions scheduled for today.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
