"use client";

import { toast } from "sonner";
import { FileText, LifeBuoy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** Two static link tiles: the leave policy handbook download and HR support contact. */
export function LeaveResourceLinksCard() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Leave Policy Handbook</p>
            <p className="mt-1 text-xs text-muted-foreground">Review the updated academic leave regulations for staff.</p>
            <Button
              variant="link"
              size="sm"
              className="mt-1 h-auto p-0 text-primary"
              onClick={() => toast.message("Download PDF", { description: "Available once the handbook is connected." })}
            >
              Download PDF →
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LifeBuoy className="size-4.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">HR Support</p>
            <p className="mt-1 text-xs text-muted-foreground">Have questions about your leave balance? Contact the administrative office.</p>
            <Button
              variant="link"
              size="sm"
              className="mt-1 h-auto p-0 text-primary"
              onClick={() => toast.message("Contact admin", { description: "Available once HR support is connected." })}
            >
              Contact Admin →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
