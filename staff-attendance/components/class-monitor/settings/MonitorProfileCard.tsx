"use client";

import { useState } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchMonitorProfile } from "@/services/classMonitorService";
import type { MonitorProfile } from "@/types";

interface MonitorProfileFormProps {
  initial: MonitorProfile;
}

function MonitorProfileForm({ initial }: MonitorProfileFormProps) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [universityEmail, setUniversityEmail] = useState(initial.universityEmail);
  const [bio, setBio] = useState(initial.bio);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="monitor-full-name">Full Name</Label>
          <Input id="monitor-full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monitor-employee-id">Employee ID</Label>
          <Input id="monitor-employee-id" value={initial.employeeId} disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="monitor-email">Email Address</Label>
          <Input id="monitor-email" type="email" value={universityEmail} onChange={(e) => setUniversityEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monitor-unit">Monitoring Unit</Label>
          <Input id="monitor-unit" value={initial.monitoringUnit} disabled />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="monitor-bio">Short Bio / Professional Note</Label>
        <Textarea id="monitor-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>
    </div>
  );
}

/** Editable personal/professional profile for the class monitor. */
export function MonitorProfileCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchMonitorProfile);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <User className="size-5 text-primary" /> Profile Information
        </span>
      }
      action={<Button size="sm" onClick={() => toast.success("Profile saved")}>Save Changes</Button>}
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load your profile" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : (
        <MonitorProfileForm initial={data} />
      )}
    </SectionCard>
  );
}
