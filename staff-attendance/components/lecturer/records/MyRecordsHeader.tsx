"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Lecturer "My Records" page. */
export function MyRecordsHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Attendance Records</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A chronological log of your attendance and lesson summaries, as recorded by your Class Monitor.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={() => toast.success("Export started", { description: "Preparing your records export…" })}
      >
        <Download className="size-4" /> Export
      </Button>
    </div>
  );
}
