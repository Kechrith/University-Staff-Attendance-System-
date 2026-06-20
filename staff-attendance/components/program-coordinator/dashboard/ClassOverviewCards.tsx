"use client";

import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchClassOverview } from "@/services/programCoordinatorService";
import type { CoordinatorClassStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CoordinatorClassStatus, string> = {
  present: "bg-success/10 text-success border-success/30",
  late: "bg-warning/10 text-warning border-warning/30",
  upcoming: "bg-muted text-muted-foreground border-border",
};

const STATUS_LABEL: Record<CoordinatorClassStatus, string> = {
  present: "Present",
  late: "Late",
  upcoming: "Upcoming",
};

/** Active classes and assigned personnel, grouped as a card grid. */
export function ClassOverviewCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchClassOverview);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">Class Overview</h2>
          <p className="text-xs text-muted-foreground">Active classes and assigned personnel</p>
        </div>
      </div>

      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load class overview" />
      ) : isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent>
            <EmptyState icon={GraduationCap} title="No active classes" description="Classes will appear here once assigned to lecturers." />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <Card key={item.id} className="rounded-xl border-border/60 shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {item.department}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.studentCount} Students</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarImage src={item.instructorAvatar} alt={item.instructorName} />
                    <AvatarFallback>{item.instructorName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{item.instructorName}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{item.scheduleLabel}</span>
                  <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[item.status])}>
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
