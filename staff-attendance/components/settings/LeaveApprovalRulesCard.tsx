"use client";

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLeaveApprovalRules } from "@/services/settingsService";
import type { LeaveApprovalRules } from "@/types";

const ESCALATION_OPTIONS = ["Direct to Department Head", "Direct to Faculty Dean", "Direct to HR Department"];

interface LeaveApprovalRulesFormProps {
  initial: LeaveApprovalRules;
}

/** See `DepartmentProfileForm` for why this is split from the fetching card. */
function LeaveApprovalRulesForm({ initial }: LeaveApprovalRulesFormProps) {
  const [autoApprove, setAutoApprove] = useState(initial.autoApprovePersonalLeave);
  const [mandatoryMedical, setMandatoryMedical] = useState(initial.mandatoryMedicalDocumentation);
  const [escalation, setEscalation] = useState(initial.escalationHierarchy || ESCALATION_OPTIONS[0]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Auto-Approval (Personal Leave)</p>
          <p className="text-xs text-muted-foreground">Approve automatically if &lt; 2 days</p>
        </div>
        <Switch checked={autoApprove} onCheckedChange={setAutoApprove} aria-label="Auto-approve personal leave under 2 days" />
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Mandatory Medical Documentation</p>
          <p className="text-xs text-muted-foreground">Required for sick leave &gt; 1 day</p>
        </div>
        <Switch
          checked={mandatoryMedical}
          onCheckedChange={setMandatoryMedical}
          aria-label="Require medical documentation for sick leave over 1 day"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="escalation-hierarchy">Escalation Hierarchy</Label>
        <Select value={escalation} onValueChange={(value) => setEscalation(value ?? ESCALATION_OPTIONS[0])}>
          <SelectTrigger id="escalation-hierarchy" className="w-full" aria-label="Escalation hierarchy">
            <SelectValue>{(value: string) => value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ESCALATION_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/** Leave auto-approval and escalation configuration for the department. */
export function LeaveApprovalRulesCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLeaveApprovalRules);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <ClipboardCheck className="size-5 text-primary" /> Leave Approval Rules
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load leave approval rules" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      ) : (
        <LeaveApprovalRulesForm initial={data} />
      )}
    </SectionCard>
  );
}
