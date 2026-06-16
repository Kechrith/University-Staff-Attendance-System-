"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, ClipboardCheck, FileBarChart, LogOut, UserPlus, type LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchRecentActivity } from "@/services/dashboardService";
import type { ActivityType } from "@/types";
import { cn } from "@/lib/utils";

const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  "check-in": CheckCircle2,
  "check-out": LogOut,
  "leave-approved": ClipboardCheck,
  "leave-rejected": ClipboardCheck,
  "attendance-updated": ClipboardCheck,
  "report-generated": FileBarChart,
  "staff-added": UserPlus,
};

const ACTIVITY_STYLES: Record<ActivityType, string> = {
  "check-in": "bg-success/10 text-success",
  "check-out": "bg-muted text-muted-foreground",
  "leave-approved": "bg-info/10 text-info",
  "leave-rejected": "bg-destructive/10 text-destructive",
  "attendance-updated": "bg-warning/10 text-warning",
  "report-generated": "bg-primary/10 text-primary",
  "staff-added": "bg-secondary/10 text-secondary",
};

export function RecentActivity() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchRecentActivity);

  return (
    <SectionCard title="Recent Activity" description="Latest actions across your department">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load activity" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No recent activity" description="Activity will show up here as it happens." />
      ) : (
        <ul className="space-y-4">
          {data.map((item) => {
            const Icon = ACTIVITY_ICON[item.type];
            return (
              <li key={item.id} className="flex items-start gap-3">
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", ACTIVITY_STYLES[item.type])}>
                  <Icon className="size-4" />
                </span>
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <Avatar className="size-6 shrink-0">
                    <AvatarImage src={item.avatar} alt={item.actor} />
                    <AvatarFallback>{item.actor.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p className="min-w-0 flex-1 text-sm text-foreground">
                    <span className="font-medium">{item.actor}</span> <span className="text-muted-foreground">{item.message}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
