"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Hero row at the top of the Settings page: title and a manual data-sync action. */
export function SettingsHeader() {
  const [isSyncing, setIsSyncing] = useState(false);

  function handleSync() {
    setIsSyncing(true);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
      loading: "Syncing department data…",
      success: "Department data is up to date.",
      error: "Couldn't sync department data.",
    });
    setTimeout(() => setIsSyncing(false), 1200);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Settings</h1>

      <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
        <RefreshCw className={cn("size-4", isSyncing && "animate-spin")} /> Sync Data
      </Button>
    </div>
  );
}
