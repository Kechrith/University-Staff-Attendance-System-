"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const LEGEND = [
  { label: "Lectures", className: "bg-primary" },
  { label: "Lab Sessions", className: "bg-warning" },
  { label: "Conflict", className: "bg-destructive" },
] as const;

/** Legend for the weekly grid's slot colors, plus the export / commit actions. */
export function ScheduleFooterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${item.className}`} aria-hidden="true" /> {item.label}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => toast.message("Export PDF", { description: "Available once schedule export is connected." })}
        >
          <Download className="size-4" /> Export PDF
        </Button>
        <Button onClick={() => toast.success("All changes committed")}>Commit All Changes</Button>
      </div>
    </div>
  );
}
