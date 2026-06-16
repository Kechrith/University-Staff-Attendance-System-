"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fetchStaffWorkload } from "@/services/scheduleService";
import type { StaffPresence } from "@/types";
import { cn } from "@/lib/utils";

const PRESENCE_DOT: Record<StaffPresence, string> = {
  online: "bg-success",
  away: "bg-warning",
  offline: "bg-destructive",
};

/** Legend dots in the card header: online / away / offline, matching the avatar presence dots below. */
function PresenceLegend() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {(Object.keys(PRESENCE_DOT) as StaffPresence[]).map((presence) => (
        <span key={presence} className={cn("size-2.5 rounded-full", PRESENCE_DOT[presence])} />
      ))}
    </div>
  );
}

/** Searchable staff roster with a per-person weekly workload bar. */
export function StaffWorkloadFinder() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchStaffWorkload);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);

  const filtered = useMemo(() => {
    if (!data) return [];
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return data;
    return data.filter((staff) => staff.name.toLowerCase().includes(query) || staff.departmentCode.toLowerCase().includes(query));
  }, [data, debouncedSearch]);

  return (
    <SectionCard title="Staff Workload Finder" action={<PresenceLegend />}>
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or department code…"
            className="h-9 rounded-full pl-9"
            aria-label="Filter staff workload"
          />
        </div>

        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load staff workload" />
        ) : isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState title="No staff tracked yet" description="Workload data will appear here once staff are assigned classes." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No matches" description="Try a different name or department code." />
        ) : (
          <div className="space-y-3">
            {filtered.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={staff.avatar} alt={staff.name} />
                    <AvatarFallback>{staff.name.slice(0, 2)}</AvatarFallback>
                    <AvatarBadge className={PRESENCE_DOT[staff.presence]} />
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{staff.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {staff.departmentCode} · {staff.hoursPerWeek} hrs/week
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-muted sm:w-24">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${staff.workloadPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
