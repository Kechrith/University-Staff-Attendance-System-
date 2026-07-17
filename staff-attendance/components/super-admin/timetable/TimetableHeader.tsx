"use client";

import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Super Admin Timetable page. */
export function TimetableHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Timetable</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the semester timetable and generated sessions.</p>
      </div>

      <Button
        onClick={() => toast.success("Generating sessions…", { description: "Available once session generation is connected." })}
      >
        <CalendarClock className="size-4" /> Generate Sessions
      </Button>
    </div>
  );
}
