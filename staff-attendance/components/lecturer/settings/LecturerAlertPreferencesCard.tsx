"use client";

import { toast } from "sonner";
import { Bell, ChevronRight } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerAlertPreferences } from "@/services/lecturerService";

/** Expandable list of notification-channel preferences (new entries, dispute updates, etc.). */
export function LecturerAlertPreferencesCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerAlertPreferences);

  return (
    <SectionCard title="Alert Preferences">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load alert preferences" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Bell} title="No alert preferences yet" description="Notification channels will appear here once configured." />
      ) : (
        <div className="space-y-2">
          {data.map((item) => (
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
    </SectionCard>
  );
}
