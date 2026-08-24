"use client";

import { toast } from "sonner";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEPARTMENT_NAME } from "@/lib/constants";

/** Hero section at the top of the Attendance page: title, subtitle, actions. */
export function AttendanceHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time attendance tracking for {DEPARTMENT_NAME}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => toast.message("Filters", { description: "Use the filter bar below to narrow down results." })}>
          <Filter className="size-4" /> Filter
        </Button>
        <Button onClick={() => toast.success("Export started", { description: "Preparing CSV download…" })}>
          <Download className="size-4" /> Export CSV
        </Button>
      </div>
    </div>
  );
}
