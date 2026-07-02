"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Bottom discard/save row — see `SettingsActionBar` (Department Head) for why this is a placeholder for now. */
export function LecturerSettingsActionBar() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button
        variant="ghost"
        onClick={() => toast.message("Discard changes", { description: "Available once settings persistence is connected." })}
      >
        Discard Changes
      </Button>
      <Button onClick={() => toast.success("Settings saved")}>Save All Settings</Button>
    </div>
  );
}
