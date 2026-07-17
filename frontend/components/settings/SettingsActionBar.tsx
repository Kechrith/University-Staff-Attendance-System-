"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Bottom save/reset row. Each card above manages its own local draft state
 * (see `DepartmentProfileForm` etc.), so these are placeholder actions for
 * now — wiring them to actually persist or reset every card's draft will
 * need that state lifted up once a real backend exists.
 */
export function SettingsActionBar() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button
        variant="outline"
        onClick={() => toast.message("Reset to defaults", { description: "Available once department configuration is connected." })}
      >
        Reset to Defaults
      </Button>
      <Button onClick={() => toast.success("Department configuration saved")}>Save Department Configuration</Button>
    </div>
  );
}
