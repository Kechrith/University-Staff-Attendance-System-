"use client";

import { toast } from "sonner";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Program Coordinator Attendance page. */
export function CoordinatorAttendanceHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Lecturer Attendance Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitoring lecturers across your managed programs.</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => toast.success("Export started", { description: "Preparing CSV download…" })}>
          <Download className="size-4" /> Export CSV
        </Button>
        <Button onClick={() => toast.message("Manual entry", { description: "Available once manual check-in is connected." })}>
          <Plus className="size-4" /> Manual Entry
        </Button>
      </div>
    </div>
  );
}
