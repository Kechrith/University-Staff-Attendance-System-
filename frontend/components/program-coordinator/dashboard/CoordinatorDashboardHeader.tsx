"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/use-has-mounted";

/** Hero section at the top of the Program Coordinator dashboard. */
export function CoordinatorDashboardHeader() {
  const hasMounted = useHasMounted();
  const today = hasMounted
    ? new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Program Coordinator Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Schedule coordination and lecturer oversight for{" "}
          {today ?? <span className="inline-block h-4 w-28 animate-pulse rounded-md bg-muted align-middle" aria-hidden="true" />}.
        </p>
      </div>

      <Button onClick={() => toast.success("Export started", { description: "Preparing attendance export…" })}>
        <Download className="size-4" /> Export Attendance
      </Button>
    </div>
  );
}
