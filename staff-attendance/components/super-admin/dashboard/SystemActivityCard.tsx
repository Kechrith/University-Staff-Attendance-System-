"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchSystemActivityFeed } from "@/services/superAdminService";
import type { SystemActivityTone } from "@/types";
import { cn } from "@/lib/utils";

const DOT_STYLES: Record<SystemActivityTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

/** Recent system-wide activity feed: who did what, and when. */
export function SystemActivityCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchSystemActivityFeed);

  return (
    <SectionCard
      title="Recent Activity"
      action={
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          nativeButton={false}
          render={<Link href="/Super-Admin/Audit-Log">View all</Link>}
        />
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load recent activity" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Activity} title="No activity yet" description="System-wide account and org changes will appear here." />
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT_STYLES[item.tone])} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {item.actor} <span className="font-normal text-muted-foreground">{item.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
