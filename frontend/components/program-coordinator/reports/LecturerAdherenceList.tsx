"use client";

import { toast } from "sonner";
import { Users } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerAdherence } from "@/services/programCoordinatorService";
import type { LecturerAdherenceTone } from "@/types";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<LecturerAdherenceTone, string> = {
  top: "bg-success/10 text-success border-success/30",
  stable: "bg-info/10 text-info border-info/30",
  "action-required": "bg-destructive/10 text-destructive border-destructive/30",
};

const TONE_LABEL: Record<LecturerAdherenceTone, string> = {
  top: "Top",
  stable: "Stable",
  "action-required": "Action Req",
};

/** Per-lecturer adherence rate, ranked by tone (top performers vs needing attention). */
export function LecturerAdherenceList() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerAdherence);

  return (
    <SectionCard
      title="Lecturer Adherence"
      action={
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary"
          onClick={() => toast.message("All faculty", { description: "Available once the full roster view is connected." })}
        >
          View All Faculty
        </Button>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load lecturer adherence" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Users} title="No lecturer data yet" description="Adherence rates will appear here once classes are tracked." />
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.subject}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-bold text-foreground">{item.percentage}%</span>
                <Badge variant="outline" className={cn("rounded-full text-[10px]", TONE_STYLES[item.tone])}>
                  {TONE_LABEL[item.tone]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
