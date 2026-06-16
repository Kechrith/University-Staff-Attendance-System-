"use client";

import { CalendarClock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLeaveManagementSummary } from "@/services/leaveManagementService";

/** Avatar chips shown before the "+N Others" overflow pill. */
const VISIBLE_AVATARS = 3;

export function LeaveSummaryCards() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLeaveManagementSummary);

  if (error) {
    return (
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState onRetry={refetch} title="Couldn't load leave summary" />
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl lg:col-span-2" />
      </div>
    );
  }

  const visibleStaff = data.currentlyOnLeave.slice(0, VISIBLE_AVATARS);
  const overflowCount = data.currentlyOnLeave.length - visibleStaff.length;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4.5" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">Today</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{data.staffOnLeaveToday}</p>
          <p className="text-xs font-semibold text-muted-foreground">Staff on Leave</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <CalendarClock className="size-4.5" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">Queue</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{String(data.pendingApprovalCount).padStart(2, "0")}</p>
          <p className="text-xs font-semibold text-muted-foreground">Pending Approval</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60 shadow-sm lg:col-span-2">
        <CardContent className="space-y-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Currently on Leave</p>
          {data.currentlyOnLeave.length === 0 ? (
            <p className="text-sm text-muted-foreground">No one is on leave right now.</p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {visibleStaff.map((staff) => (
                <div key={staff.id} className="flex items-center gap-2 rounded-full border border-border/60 py-1 pr-3 pl-1">
                  <Avatar className="size-7">
                    <AvatarImage src={staff.avatar} alt={staff.name} />
                    <AvatarFallback>{staff.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{staff.name}</span>
                </div>
              ))}
              {overflowCount > 0 ? (
                <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
                  +{overflowCount} Others
                </span>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
