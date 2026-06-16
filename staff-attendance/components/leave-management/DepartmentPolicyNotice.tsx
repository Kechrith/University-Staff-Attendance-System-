import { Info } from "lucide-react";
import { DEPARTMENT_NAME } from "@/lib/constants";

/** Static policy reminder banner shown beneath the leave requests panel. */
export function DepartmentPolicyNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Info className="size-4.5" />
      </span>
      <div className="text-sm">
        <p className="font-semibold text-foreground">Department Policy Reminder</p>
        <p className="mt-0.5 text-muted-foreground">
          According to {DEPARTMENT_NAME} guidelines, any leave exceeding 5 consecutive days requires higher-level approval from the
          Faculty Dean after your initial review.
        </p>
      </div>
    </div>
  );
}
