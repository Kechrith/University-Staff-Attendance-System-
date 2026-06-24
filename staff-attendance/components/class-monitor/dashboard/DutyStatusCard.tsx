"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchMonitorDashboardSummary } from "@/services/classMonitorService";

/** "Duty Status" panel — current room being monitored, session countdown, and an end-duty action. */
export function DutyStatusCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchMonitorDashboardSummary);
  const [ended, setEnded] = useState(false);

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheck className="size-4.5" /> Duty Status
        </div>

        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load duty status" />
        ) : isLoading || !data ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ) : ended || !data.duty.onDuty ? (
          <p className="text-sm text-muted-foreground">You are currently off duty. Your next monitoring session will appear here.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              You are currently monitoring <span className="font-semibold text-foreground">{data.duty.room}</span>. Please ensure
              lecturers sign off digitally before leaving.
            </p>

            <div className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Current session ends in</p>
              <p className="text-lg font-bold tabular-nums text-destructive">{data.duty.sessionEndsInLabel}</p>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                setEnded(true);
                toast.success("Duty ended", { description: `You've ended monitoring for ${data.duty.room}.` });
              }}
            >
              <LogOut className="size-4" /> End Duty
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
