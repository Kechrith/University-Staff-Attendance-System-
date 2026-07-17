"use client";

import { toast } from "sonner";
import { History } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchSessionLog } from "@/services/classMonitorService";

/** "Session Log" panel — a running feed of marks and check-ins recorded this shift. */
export function SessionLogCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchSessionLog);

  return (
    <SectionCard
      title="Session Log"
      action={
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary"
          onClick={() => toast.message("Session log", { description: "Available once the full log view is connected." })}
        >
          View All
        </Button>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the session log" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={History} title="No activity yet" description="Marks and check-ins will appear here as you record them." />
      ) : (
        <div className="space-y-3">
          {data.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm text-foreground">{entry.message}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.detail} · {entry.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
