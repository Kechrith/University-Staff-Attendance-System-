"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchSystemConfiguration } from "@/services/superAdminService";
import type { SystemConfiguration } from "@/types";

interface SystemConfigurationFormProps {
  initial: SystemConfiguration;
}

function SystemConfigurationForm({ initial }: SystemConfigurationFormProps) {
  const [attendanceWindowMinutes, setAttendanceWindowMinutes] = useState(initial.attendanceWindowMinutes);
  const [disputeWindowDays, setDisputeWindowDays] = useState(initial.disputeWindowDays);
  const [digestScheduleLabel, setDigestScheduleLabel] = useState(initial.digestScheduleLabel);
  const [digestEnabled, setDigestEnabled] = useState(initial.digestEnabled);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="system-config-attendance-window">Attendance Window (minutes)</Label>
          <Input
            id="system-config-attendance-window"
            type="number"
            min={0}
            value={attendanceWindowMinutes}
            onChange={(e) => setAttendanceWindowMinutes(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">Minutes after session end before the attendance window closes.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="system-config-dispute-window">Dispute Window (days)</Label>
          <Input
            id="system-config-dispute-window"
            type="number"
            min={0}
            value={disputeWindowDays}
            onChange={(e) => setDisputeWindowDays(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">Days a Lecturer may dispute an entry.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="system-config-digest-schedule">Digest Schedule</Label>
        <Input id="system-config-digest-schedule" value={digestScheduleLabel} onChange={(e) => setDigestScheduleLabel(e.target.value)} />
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Weekly Digest</p>
          <p className="text-xs text-muted-foreground">Send a weekly summary digest to administrators.</p>
        </div>
        <Switch checked={digestEnabled} onCheckedChange={setDigestEnabled} aria-label="Weekly digest" />
      </div>
    </div>
  );
}

/** System-wide configuration: attendance window, dispute window, and digest schedule. */
export function SystemConfigurationCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchSystemConfiguration);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <Settings className="size-5 text-primary" /> System Configuration
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load system configuration" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : (
        <SystemConfigurationForm initial={data} />
      )}
    </SectionCard>
  );
}
