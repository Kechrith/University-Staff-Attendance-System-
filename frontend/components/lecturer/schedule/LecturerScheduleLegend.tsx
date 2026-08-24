"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const LEGEND = [
  { label: "Classes", className: "bg-primary" },
  { label: "Office Hours", className: "bg-info" },
  { label: "Meetings", className: "bg-warning" },
] as const;

/** Legend for the weekly grid's slot colors, plus the export action. */
export function LecturerScheduleLegend() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${item.className}`} aria-hidden="true" /> {item.label}
          </span>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full sm:w-auto shrink-0 justify-center"
        onClick={() => toast.message("Export PDF", { description: "Available once schedule export is connected." })}
      >
        <Download className="size-4" /> Export PDF
      </Button>
    </div>
  );
}
