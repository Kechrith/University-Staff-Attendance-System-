"use client";

import { toast } from "sonner";
import { FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Super Admin dashboard. */
export function SuperAdminDashboardHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Super Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">System-wide overview of accounts, organization, and pending work.</p>
      </div>

      <Button onClick={() => toast.success("Report queued", { description: "Preparing system-wide report…" })}>
        <FileBarChart className="size-4" /> Generate System Report
      </Button>
    </div>
  );
}
