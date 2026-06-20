"use client";

import { toast } from "sonner";
import { ChevronRight, DoorOpen, FileText, UserPlus } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  { id: "manage-subjects", label: "Manage Subjects", icon: FileText },
  { id: "view-room-assignments", label: "View Room Assignments", icon: DoorOpen },
  { id: "assign-new-lecturer", label: "Assign New Lecturer", icon: UserPlus },
] as const;

/** Static shortcut list — each action is a placeholder until the relevant flow is wired up. */
export function QuickActionsCard() {
  return (
    <SectionCard title="Quick Actions">
      <div className="space-y-2">
        {ACTIONS.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="w-full justify-between"
            onClick={() => toast.message(action.label, { description: "Available once this flow is connected." })}
          >
            <span className="flex items-center gap-2">
              <action.icon className="size-4 text-muted-foreground" /> {action.label}
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}
