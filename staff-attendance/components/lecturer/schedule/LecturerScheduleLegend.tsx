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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${item.className}`} aria-hidden="true" /> {item.label}
          </span>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => toast.message("Export PDF", { description: "Available once schedule export is connected." })}
      >
        <Download className="size-4" /> Export PDF
      </Button>
    </div>
  );
}
