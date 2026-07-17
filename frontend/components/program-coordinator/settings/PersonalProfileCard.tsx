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
import { fetchCoordinatorProfile } from "@/services/programCoordinatorService";
import type { CoordinatorProfile } from "@/types";

interface PersonalProfileFormProps {
  initial: CoordinatorProfile;
}

function PersonalProfileForm({ initial }: PersonalProfileFormProps) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [universityEmail, setUniversityEmail] = useState(initial.universityEmail);
  const [bio, setBio] = useState(initial.bio);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="coordinator-full-name">Full Name</Label>
          <Input id="coordinator-full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coordinator-department">Department</Label>
          <Input id="coordinator-department" value={initial.department} disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="coordinator-email">University Email</Label>
          <Input id="coordinator-email" type="email" value={universityEmail} onChange={(e) => setUniversityEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coordinator-employee-id">Employee ID</Label>
          <Input id="coordinator-employee-id" value={initial.employeeId} disabled />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coordinator-bio">Professional Bio</Label>
        <Textarea id="coordinator-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>
    </div>
  );
}

/** Editable personal/professional profile for the program coordinator. */
export function PersonalProfileCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchCoordinatorProfile);

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
        <PersonalProfileForm initial={data} />
      )}
    </SectionCard>
  );
}
