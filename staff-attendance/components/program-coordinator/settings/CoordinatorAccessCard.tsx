"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorAccessSession } from "@/services/programCoordinatorService";

/** Side panel showing the active session and a duty-status toggle. */
export function CoordinatorAccessCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorAccessSession);
  const [onDuty, setOnDuty] = useState<boolean | null>(null);
  const isOnDuty = onDuty ?? data?.onDuty ?? false;

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheck className="size-4.5" /> Coordinator Access
        </div>

        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load session info" />
        ) : isLoading || !data ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div>
              <p className="text-lg font-bold text-foreground">Active Session</p>
              <p className="mt-1 text-sm text-muted-foreground">Last login: {data.lastLoginLabel}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Coordination Status</span>
              <Badge
                variant="outline"
                className={isOnDuty ? "rounded-full bg-success/10 text-success border-success/30" : "rounded-full bg-muted text-muted-foreground"}
              >
                {isOnDuty ? "On Duty" : "Off Duty"}
              </Badge>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setOnDuty(!isOnDuty);
                toast.success(!isOnDuty ? "You're now on duty" : "You're now off duty");
              }}
            >
              Toggle Duty Status
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
