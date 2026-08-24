"use client";

import { DoorOpen } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchRoomAvailability } from "@/services/scheduleService";
import type { RoomStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<RoomStatus, string> = {
  occupied: "bg-destructive/10 text-destructive border-destructive/30",
  available: "bg-success/10 text-success border-success/30",
};

const STATUS_LABEL: Record<RoomStatus, string> = {
  occupied: "Occupied",
  available: "Available",
};

/** Live room occupancy list shown alongside the weekly schedule grid. */
export function RoomAvailabilityCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchRoomAvailability);

  return (
    <SectionCard
      title="Room Availability"
      action={
        <Badge className="rounded-full bg-success/10 text-[11px] font-semibold uppercase tracking-wide text-success">
          Live now
        </Badge>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load room availability" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={DoorOpen} title="No rooms tracked" description="Rooms will appear here once they're configured." />
      ) : (
        <div className="space-y-3">
          {data.map((room) => (
            <div key={room.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{room.name}</p>
                <p className="text-xs text-muted-foreground">{room.capacityLabel}</p>
              </div>
              <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[room.status])}>
                {STATUS_LABEL[room.status]}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
