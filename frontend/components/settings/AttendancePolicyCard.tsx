"use client";

import { useState } from "react";
import { Info, Timer } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAttendancePolicy } from "@/services/settingsService";
import type { AttendancePolicy, GracePeriodMode } from "@/types";

/** Badge label shown next to "Grace Period Settings", derived from the selected mode. */
const GRACE_PERIOD_TIER_LABEL: Record<GracePeriodMode, string> = {
  fixed: "Standard",
  "class-specific": "Custom",
};

const GRACE_PERIOD_TIER_STYLES: Record<GracePeriodMode, string> = {
  fixed: "bg-warning/10 text-warning",
  "class-specific": "bg-info/10 text-info",
};

interface AttendancePolicyFormProps {
  initial: AttendancePolicy;
}

/** See `DepartmentProfileForm` for why this is split from the fetching card. */
function AttendancePolicyForm({ initial }: AttendancePolicyFormProps) {
  const [threshold, setThreshold] = useState(initial.lateThresholdMinutes);
  const [mode, setMode] = useState<GracePeriodMode>(initial.gracePeriodMode);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Late Threshold (Minutes)</p>
          <Badge className="rounded-full bg-destructive/10 text-xs font-semibold text-destructive">{threshold} min</Badge>
        </div>
        <Slider min={0} max={60} step={1} value={threshold} onValueChange={(value) => setThreshold(value as number)} />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Strict (0 min)</span>
          <span>Lenient (60 min)</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Grace Period Settings</p>
          <Badge className={`rounded-full text-xs font-semibold ${GRACE_PERIOD_TIER_STYLES[mode]}`}>
            {GRACE_PERIOD_TIER_LABEL[mode]}
          </Badge>
        </div>

        <RadioGroup value={mode} onValueChange={(value) => setMode(value as GracePeriodMode)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RadioGroupItem value="fixed">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input group-data-checked:border-primary">
              <RadioGroupIndicator />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Fixed Buffer</p>
              <p className="text-xs text-muted-foreground">Applies to all sessions equally.</p>
            </div>
          </RadioGroupItem>

          <RadioGroupItem value="class-specific">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input group-data-checked:border-primary">
              <RadioGroupIndicator />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Class-specific</p>
              <p className="text-xs text-muted-foreground">Adjust based on session type.</p>
            </div>
          </RadioGroupItem>
        </RadioGroup>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Info className="size-4" />
        </span>
        <p className="text-sm text-muted-foreground">
          Staff members who exceed the late threshold 3 times in a month will be automatically flagged for administrative review.
        </p>
      </div>
    </div>
  );
}

/** Late-arrival threshold + grace period configuration for the department. */
export function AttendancePolicyCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchAttendancePolicy);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <Timer className="size-5 text-primary" /> Attendance Policies
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load attendance policy" />
      ) : isLoading || !data ? (
        <div className="space-y-6">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <AttendancePolicyForm initial={data} />
      )}
    </SectionCard>
  );
}
