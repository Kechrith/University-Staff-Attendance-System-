"use client";

import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/use-async-data";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { fetchCurrentUser } from "@/services/classMonitorService";

/** Hero section at the top of the Class Monitor dashboard. */
export function MonitorDashboardHeader() {
  const hasMounted = useHasMounted();
  const { data: currentUser } = useAsyncData(fetchCurrentUser);
  const today = hasMounted
    ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recording attendance for{" "}
          {today ?? <span className="inline-block h-4 w-40 animate-pulse rounded-md bg-muted align-middle" aria-hidden="true" />}.
        </p>
      </div>

      <Button onClick={() => toast.success("Report submitted", { description: "Attendance report sent to the department head." })}>
        <Send className="size-4" /> Report Attendance
      </Button>
    </div>
  );
}
