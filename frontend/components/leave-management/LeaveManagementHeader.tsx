"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Leave Management page: title, subtitle, primary action. */
export function LeaveManagementHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leave Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and approve faculty absence requests.</p>
      </div>

      <Button
        onClick={() => toast.message("New leave record", { description: "Available once the leave request form is connected." })}
      >
        <Plus className="size-4" /> New Record
      </Button>
    </div>
  );
}
