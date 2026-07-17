"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchSuperAdminSecurityItems } from "@/services/superAdminService";
import type { SuperAdminSecurityItem } from "@/types";

interface SecurityAccessListProps {
  initial: SuperAdminSecurityItem[];
}

function SecurityAccessList({ initial }: SecurityAccessListProps) {
  const [items, setItems] = useState(initial);

  function toggle(id: string, enabled: boolean) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)));
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
          <Switch checked={item.enabled} onCheckedChange={(checked) => toggle(item.id, checked)} aria-label={item.title} />
        </div>
      ))}
    </div>
  );
}

/** Security & access toggles for the super admin account. */
export function SecurityAccessCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchSuperAdminSecurityItems);

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
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Lock} title="No security settings yet" description="Security options will appear here once available." />
      ) : (
        <SecurityAccessList initial={data} />
      )}
    </SectionCard>
  );
}
