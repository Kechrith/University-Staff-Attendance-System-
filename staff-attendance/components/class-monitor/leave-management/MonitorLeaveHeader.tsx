"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Class Monitor Leave Management page. */
export function MonitorLeaveHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leave Management</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Monitor your academic leave balances, track pending approvals, and submit new absence requests for administrative review.
        </p>
      </div>

      <Button onClick={() => toast.message("Request leave", { description: "Available once the leave request form is connected." })}>
        <Plus className="size-4" /> Request Leave
      </Button>
    </div>
  );
}
