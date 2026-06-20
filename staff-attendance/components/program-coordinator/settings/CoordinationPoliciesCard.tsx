"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCoordinationPolicies } from "@/services/programCoordinatorService";
import type { CoordinationPolicies } from "@/types";

interface CoordinationPoliciesFormProps {
  initial: CoordinationPolicies;
}

function CoordinationPoliciesForm({ initial }: CoordinationPoliciesFormProps) {
  const [conflictDetection, setConflictDetection] = useState(initial.automaticScheduleConflictDetection);
  const [leaveEscalation, setLeaveEscalation] = useState(initial.leaveRequestEscalation);
  const [auditLogVisibility, setAuditLogVisibility] = useState(initial.auditLogVisibility);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Automatic Schedule Conflict Detection</p>
          <p className="text-xs text-muted-foreground">Notify me immediately when two courses overlap in the same auditorium.</p>
        </div>
        <Switch checked={conflictDetection} onCheckedChange={setConflictDetection} aria-label="Automatic schedule conflict detection" />
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Leave Request Escalation</p>
          <p className="text-xs text-muted-foreground">Automatically approve short-term leave (&lt; 2 days) for senior faculty.</p>
        </div>
        <Switch checked={leaveEscalation} onCheckedChange={setLeaveEscalation} aria-label="Leave request escalation" />
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Audit Log Visibility</p>
          <p className="text-xs text-muted-foreground">Allow department heads to view my coordination decision history.</p>
        </div>
        <Switch checked={auditLogVisibility} onCheckedChange={setAuditLogVisibility} aria-label="Audit log visibility" />
      </div>
    </div>
  );
}

/** Coordination-specific behavior toggles: conflict detection, leave escalation, audit visibility. */
export function CoordinationPoliciesCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinationPolicies);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <ListChecks className="size-5 text-primary" /> Coordination Policies
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load coordination policies" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : (
        <CoordinationPoliciesForm initial={data} />
      )}
    </SectionCard>
  );
}
