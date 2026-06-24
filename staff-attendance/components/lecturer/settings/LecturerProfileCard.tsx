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
import { fetchLecturerProfile } from "@/services/lecturerService";
import type { LecturerProfile } from "@/types";

interface LecturerProfileFormProps {
  initial: LecturerProfile;
}

function LecturerProfileForm({ initial }: LecturerProfileFormProps) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [universityEmail, setUniversityEmail] = useState(initial.universityEmail);
  const [phone, setPhone] = useState(initial.phone);
  const [bio, setBio] = useState(initial.bio);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lecturer-full-name">Full Name</Label>
          <Input id="lecturer-full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lecturer-department">Department</Label>
          <Input id="lecturer-department" value={initial.department} disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lecturer-email">University Email</Label>
          <Input id="lecturer-email" type="email" value={universityEmail} onChange={(e) => setUniversityEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lecturer-employee-id">Employee ID</Label>
          <Input id="lecturer-employee-id" value={initial.employeeId} disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lecturer-phone">Phone</Label>
          <Input id="lecturer-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lecturer-position">Position</Label>
          <Input id="lecturer-position" value={initial.position} disabled />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lecturer-bio">Professional Bio</Label>
        <Textarea id="lecturer-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>
    </div>
  );
}

/** Editable personal/professional profile for the signed-in lecturer. */
export function LecturerProfileCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerProfile);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <User className="size-5 text-primary" /> Personal Profile
        </span>
      }
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.message("Edit profile", { description: "Available once profile editing is connected." })}
        >
          Edit Profile
        </Button>
      }
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
        <LecturerProfileForm initial={data} />
      )}
    </SectionCard>
  );
}
