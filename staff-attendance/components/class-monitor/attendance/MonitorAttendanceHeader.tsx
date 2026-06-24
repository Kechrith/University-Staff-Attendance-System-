"use client";

import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/use-has-mounted";

/** Hero section at the top of the Class Monitor Attendance ("Mark Attendance") page. */
export function MonitorAttendanceHeader() {
  const hasMounted = useHasMounted();
  const today = hasMounted
    ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Shift Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recording attendance for Morning Session,{" "}
          {today ?? <span className="inline-block h-4 w-36 animate-pulse rounded-md bg-muted align-middle" aria-hidden="true" />}.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => toast.message("Download schedule", { description: "Available once schedule export is connected." })}
        >
          <Download className="size-4" /> Download Schedule
        </Button>
        <Button onClick={() => toast.success("Sync forced", { description: "Attendance records are syncing now." })}>
          <RefreshCw className="size-4" /> Force Sync
        </Button>
      </div>
    </div>
  );
}
