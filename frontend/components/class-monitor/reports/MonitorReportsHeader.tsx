"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Class Monitor Reports page. */
export function MonitorReportsHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Attendance Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Recording accuracy and coverage for DSE-301, Department of Data Science and Engineering.</p>
      </div>

      <Button onClick={() => toast.success("Export started", { description: "Preparing your analytics export…" })}>
        <Download className="size-4" /> Export Report
      </Button>
    </div>
  );
}
