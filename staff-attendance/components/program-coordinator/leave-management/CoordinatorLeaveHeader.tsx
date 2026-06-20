"use client";

import { toast } from "sonner";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Program Coordinator Leave Management page. */
export function CoordinatorLeaveHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leave Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review leave requests across your managed programs.</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Print"
          onClick={() => toast.message("Print", { description: "Available once printable reports are connected." })}
        >
          <Printer className="size-4" />
        </Button>
        <Button onClick={() => toast.success("Export started", { description: "Preparing your download…" })}>
          <Download className="size-4" /> Export
        </Button>
      </div>
    </div>
  );
}
