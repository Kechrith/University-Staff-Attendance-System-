"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Page-level copyright/links footer, plus the floating quick-action to start a new report. */
export function ReportsFooterNote() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span>© 2024 Royal University of Phnom Penh - Staff Management Portal</span>
        <div className="flex items-center gap-4">
          <button type="button" className="hover:text-foreground" onClick={() => toast.message("Data Privacy Policy")}>
            Data Privacy Policy
          </button>
          <button type="button" className="hover:text-foreground" onClick={() => toast.message("Support Center")}>
            Support Center
          </button>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-lg"
              className="fixed right-6 bottom-6 z-40 size-12 rounded-full shadow-lg"
              aria-label="Create new report"
              onClick={() => toast.message("New report", { description: "Available once report generation is connected." })}
            >
              <Plus className="size-5" />
            </Button>
          }
        />
        <TooltipContent>New Report</TooltipContent>
      </Tooltip>
    </>
  );
}
