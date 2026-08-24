"use client";

import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** "Danger Zone" card — irreversible account deletion, styled as a clear warning. */
export function MonitorDangerZoneCard() {
  return (
    <Card className="rounded-2xl border-destructive/30 bg-destructive/5 shadow-sm">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-destructive">Danger Zone</p>
            <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
              Permanently delete your staff account and all associated record history. This action is irreversible.
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={() => toast.error("Account deletion not connected", { description: "This is a placeholder until the flow is wired up." })}
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
