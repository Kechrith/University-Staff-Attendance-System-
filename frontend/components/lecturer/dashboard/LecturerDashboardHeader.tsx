"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/use-has-mounted";

/** Hero section at the top of the Lecturer dashboard. */
export function LecturerDashboardHeader() {
  const hasMounted = useHasMounted();
  const today = hasMounted
    ? new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">My Dashboard</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Your teaching activity for{" "}
          {today ?? <span className="inline-block h-4 w-28 animate-pulse rounded-md bg-muted align-middle" aria-hidden="true" />}.
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full sm:w-auto shrink-0 justify-center"
        onClick={() => toast.success("Export started", { description: "Preparing your teaching history export…" })}
      >
        <Download className="size-4" /> Export My History
      </Button>
    </div>
  );
}
