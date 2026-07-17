"use client";

import { toast } from "sonner";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { DEPARTMENT_NAME } from "@/lib/constants";

/**
 * Hero section at the top of the dashboard content: page title, a
 * department + date summary, and the two primary actions.
 */
export function PageHeader() {
  const hasMounted = useHasMounted();
  // Formatted on the client only to avoid a server/client locale mismatch.
  const today = hasMounted
    ? new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of {DEPARTMENT_NAME} attendance for today,{" "}
          {today ?? <span className="inline-block h-4 w-28 animate-pulse rounded-md bg-muted align-middle" aria-hidden="true" />}.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => toast.success("Attendance report generated", { description: "Your report is ready to download." })}
        >
          <FileText className="size-4" /> Generate Report
        </Button>
        <Button onClick={() => toast.success("Export started", { description: "Preparing your data export…" })}>
          <Download className="size-4" /> Export Data
        </Button>
      </div>
    </div>
  );
}
