"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, ChevronRight, ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerAccessSession, fetchLecturerAlertPreferences } from "@/services/lecturerService";

/**
 * Session info plus notification preferences, merged into a single card.
 * Previously "My Access" (session + a single "notify on new entry" toggle)
 * and "Alert Preferences" were separate cards, but the toggle duplicated the
 * list's own "New Attendance Entry" item — folding them together removes
 * that redundancy and keeps the Settings page to 3 cards instead of 4.
 */
export function LecturerAccessCard() {
  const session = useAsyncData(fetchLecturerAccessSession);
  const alerts = useAsyncData(fetchLecturerAlertPreferences);
  const [notifyOnNewEntry, setNotifyOnNewEntry] = useState<boolean | null>(null);
  const isNotifying = notifyOnNewEntry ?? session.data?.notifyOnNewEntry ?? false;

  const otherAlerts = alerts.data?.filter((item) => item.id !== "new-entry") ?? [];

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" /> Notifications &amp; Access
        </span>
      }
    >
      <div className="space-y-4">
        {session.error ? (
          <ErrorState onRetry={session.refetch} title="Couldn't load session info" />
        ) : session.isLoading || !session.data ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Last login: {session.data.lastLoginLabel}</p>

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

        {alerts.error ? (
          <ErrorState onRetry={alerts.refetch} title="Couldn't load alert preferences" />
        ) : alerts.isLoading || !alerts.data ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : otherAlerts.length === 0 ? (
          <EmptyState icon={Bell} title="No other alert preferences" description="More notification channels will appear here once configured." />
        ) : (
          <div className="space-y-2">
            {otherAlerts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toast.message(item.title, { description: "Available once notification routing is connected." })}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted/40"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
