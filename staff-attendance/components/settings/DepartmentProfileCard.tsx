"use client";

import { useState } from "react";
import { IdCard, PenLine } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchDepartmentProfile } from "@/services/settingsService";
import type { DepartmentProfile } from "@/types";

interface DepartmentProfileFormProps {
  initial: DepartmentProfile;
}

/**
 * The editable form, split out from the data-fetching card below so its
 * `useState` calls can initialize directly from the fetched record — the
 * outer card only mounts this once `initial` is available, so there's no
 * need for a sync effect.
 */
function DepartmentProfileForm({ initial }: DepartmentProfileFormProps) {
  const [departmentName, setDepartmentName] = useState(initial.departmentName);
  const [deptCode, setDeptCode] = useState(initial.deptCode);
  const [establishedYear, setEstablishedYear] = useState(initial.establishedYear);
  const [signatureUrl, setSignatureUrl] = useState(initial.signatureUrl);

  function handleSignatureChange(file: File | undefined) {
    if (!file) return;
    setSignatureUrl(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="dept-name">Department Name</Label>
        <Input id="dept-name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="dept-code">Dept. Code</Label>
          <Input id="dept-code" value={deptCode} onChange={(e) => setDeptCode(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dept-established">Established</Label>
          <Input
            id="dept-established"
            value={establishedYear}
            onChange={(e) => setEstablishedYear(e.target.value)}
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signature-upload">Head of Department Signature</Label>
        <label
          htmlFor="signature-upload"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
        >
          {signatureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- transient client-side object URL preview, not an optimizable remote asset
            <img src={signatureUrl} alt="Head of department signature" className="h-16 object-contain" />
          ) : (
            <PenLine className="size-6 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-muted-foreground">Click to upload new signature</span>
          <input
            id="signature-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleSignatureChange(e.target.files?.[0])}
          />
        </label>
      </div>
    </div>
  );
}

/** Department identity card: name, code, founding year, and head-of-department signature. */
export function DepartmentProfileCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchDepartmentProfile);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <IdCard className="size-5 text-primary" /> Department Profile
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load department profile" />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : (
        <DepartmentProfileForm initial={data} />
      )}
    </SectionCard>
  );
}
