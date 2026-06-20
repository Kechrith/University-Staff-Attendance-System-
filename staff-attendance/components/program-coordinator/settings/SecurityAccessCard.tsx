"use client";

import { toast } from "sonner";
import { History, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinatorSecurityItems } from "@/services/programCoordinatorService";
import type { CoordinatorSecurityItem } from "@/types";

const ICONS: Record<CoordinatorSecurityItem["id"], typeof KeyRound> = {
  password: KeyRound,
  "2fa": ShieldCheck,
  "login-history": History,
};

/** Three sub-tiles: change password, 2FA, and login history. */
export function SecurityAccessCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorSecurityItems);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <Lock className="size-5 text-primary" /> Security &amp; Access
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load security settings" />
      ) : isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Lock} title="No security settings yet" description="Security options will appear here once available." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <div key={item.id} className="space-y-3 rounded-xl border border-border/60 p-4">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-primary"
                  onClick={() => toast.message(item.title, { description: "Available once this flow is connected." })}
                >
                  {item.actionLabel} →
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
