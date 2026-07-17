"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LeaveCard } from "@/components/dashboard/LeaveCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLeaveRequests } from "@/services/dashboardService";

export function PendingLeaveRequests() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLeaveRequests);
  // Locally-approved/rejected requests are hidden via this set rather than
  // mutating `data` directly, keeping the fetched payload as the single
  // source of truth and avoiding an effect just to copy it into state.
  const [resolvedIds, setResolvedIds] = useState<ReadonlySet<string>>(new Set());

  const requests = useMemo(
    () => data?.filter((r) => r.status === "pending" && !resolvedIds.has(r.id)) ?? null,
    [data, resolvedIds],
  );

  function handleApprove(id: string) {
    const request = requests?.find((r) => r.id === id);
    setResolvedIds((prev) => new Set(prev).add(id));
    toast.success(`${request?.staffName}'s leave request approved.`);
  }

  function handleReject(id: string) {
    const request = requests?.find((r) => r.id === id);
    setResolvedIds((prev) => new Set(prev).add(id));
    toast.error(`${request?.staffName}'s leave request rejected.`);
  }

  const newCount = requests?.length ?? 0;

  return (
    <SectionCard
      title="Pending Leaves"
      action={
        newCount > 0 ? (
          <Badge className="rounded-full bg-primary text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
            {newCount} new
          </Badge>
        ) : null
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load leave requests" />
      ) : isLoading || requests === null ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="All caught up" description="There are no pending leave requests right now." />
      ) : (
        <>
          <ScrollArea className="h-[380px] pr-3">
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {requests.map((request) => (
                  <LeaveCard key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
          <Link href="/Department-Head/Leave-Management" className="mt-3 block text-center text-sm font-medium text-primary hover:underline">
            View All Requests
          </Link>
        </>
      )}
    </SectionCard>
  );
}
