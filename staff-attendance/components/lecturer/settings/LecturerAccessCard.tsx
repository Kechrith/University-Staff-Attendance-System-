"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerAccessSession } from "@/services/lecturerService";

/** Side panel showing the active session and the new-entry notification toggle. */
export function LecturerAccessCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerAccessSession);
  const [notifyOnNewEntry, setNotifyOnNewEntry] = useState<boolean | null>(null);
  const isNotifying = notifyOnNewEntry ?? data?.notifyOnNewEntry ?? false;

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheck className="size-4.5" /> My Access
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

            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">Notify on new entry</p>
                <p className="text-xs text-muted-foreground">Get notified when a Class Monitor logs your attendance.</p>
              </div>
              <Switch
                checked={isNotifying}
                onCheckedChange={(checked) => {
                  setNotifyOnNewEntry(checked);
                  toast.success(checked ? "Notifications enabled" : "Notifications disabled");
                }}
                aria-label="Notify on new entry"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
