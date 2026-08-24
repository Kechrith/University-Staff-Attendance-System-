"use client";

import { CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchTodaysFocus } from "@/services/programCoordinatorService";

/** Highlighted "Today's Focus" panel: current month, session window, and quick filters. */
export function TodaysFocusCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchTodaysFocus);

  return (
    <Card className="rounded-2xl border-none bg-primary text-primary-foreground shadow-sm">
      <CardContent className="space-y-5 p-5">
        {error ? (
          <ErrorState
            onRetry={refetch}
            title="Couldn't load today's focus"
            className="text-primary-foreground [&_p]:text-primary-foreground/80"
          />
        ) : isLoading || !data ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 bg-primary-foreground/20" />
            <Skeleton className="h-4 w-40 bg-primary-foreground/20" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary-foreground/15">
                <CalendarRange className="size-4" />
              </span>
              <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                {data.monthLabel}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold">Today&apos;s Focus</p>
              <p className="mt-1 text-sm text-primary-foreground/80">
                {data.sessionLabel}: {data.sessionTimeRangeLabel}
              </p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">Filter Attendance</p>
          <Select onValueChange={() => toast.message("Filter applied", { description: "Available once filtering is connected." })}>
            <SelectTrigger className="w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground" aria-label="Select course">
              <SelectValue>{() => "Select Course"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dse-101">DSE-101 Intro to Data Science</SelectItem>
              <SelectItem value="dse-204">DSE-204 Data Structures</SelectItem>
              <SelectItem value="dse-205">DSE-205 Machine Learning Basics</SelectItem>
              <SelectItem value="dse-301">DSE-301 Software Engineering for Data Systems</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => toast.message("Manual entry", { description: "Available once manual check-in is connected." })}
        >
          + Manual Entry
        </Button>
      </CardContent>
    </Card>
  );
}
