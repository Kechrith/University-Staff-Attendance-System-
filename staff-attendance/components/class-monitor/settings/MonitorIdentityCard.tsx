"use client";

import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCurrentUser } from "@/services/classMonitorService";

/** Side panel: avatar with photo upload, name, position, and status badges. */
export function MonitorIdentityCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCurrentUser);

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load profile" />
        ) : isLoading || !data ? (
          <>
            <Skeleton className="size-20 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </>
        ) : (
          <>
            <div className="relative">
              <Avatar className="size-20">
                <AvatarImage src={data.avatar || undefined} alt={data.name} />
                <AvatarFallback className="text-lg">{data.name ? data.name.slice(0, 2) : "—"}</AvatarFallback>
              </Avatar>
              <Button
                size="icon-sm"
                className="absolute -right-1 -bottom-1 rounded-full"
                aria-label="Change photo"
                onClick={() => toast.message("Change photo", { description: "Available once photo upload is connected." })}
              >
                <Camera className="size-3.5" />
              </Button>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">{data.name || "—"}</p>
              <p className="text-xs text-muted-foreground">{data.position || "Class Monitor"}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                Staff Role
              </Badge>
              <Badge variant="outline" className="rounded-full border-success/30 bg-success/10 text-success">
                Active
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
