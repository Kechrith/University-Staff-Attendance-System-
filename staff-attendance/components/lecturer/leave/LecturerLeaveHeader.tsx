"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { submitLeaveRequest } from "@/services/lecturerService";
import type { LeaveType, LecturerLeaveRequest } from "@/types";

const LEAVE_TYPES: LeaveType[] = ["Sick Leave", "Annual Leave", "Maternity Leave", "Emergency Leave", "Unpaid Leave", "Research"];

function countDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff + 1, 1);
}

interface LecturerLeaveHeaderProps {
  onRequestSubmitted: (request: LecturerLeaveRequest) => void;
}

/** Hero section for the Lecturer "Leave Requests" page, hosting the "Request Leave" form. */
export function LecturerLeaveHeader({ onRequestSubmitted }: LecturerLeaveHeaderProps) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setLeaveType("Annual Leave");
    setStartDate("");
    setEndDate("");
    setReason("");
  }

  async function handleSubmit() {
    if (!startDate || !endDate) {
      toast.error("Please select a start and end date.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date can't be before the start date.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave request.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLeaveRequest({ leaveType, startDate, endDate, reason: reason.trim() });
      const days = countDays(startDate, endDate);
      onRequestSubmitted({
        id: `local-${Date.now()}`,
        leaveType,
        startDate,
        endDate,
        duration: `${days} day${days === 1 ? "" : "s"}`,
        reason: reason.trim(),
        status: "pending",
        requestedAt: new Date().toISOString(),
      });
      toast.success("Leave request submitted", { description: "Your Program Coordinator will review it shortly." });
      setOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leave Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Request time off and track the status of your submissions.</p>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button>
              <CalendarPlus className="size-4" /> Request Leave
            </Button>
          }
        />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Request Leave</SheetTitle>
            <SheetDescription>Submit a new leave request for your Program Coordinator to review.</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4">
            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-type`}>Leave Type</Label>
              <Select value={leaveType} onValueChange={(value) => setLeaveType((value as LeaveType) ?? "Annual Leave")}>
                <SelectTrigger id={`${formId}-type`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAVE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-start`}>Start Date</Label>
                <Input id={`${formId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-end`}>End Date</Label>
                <Input id={`${formId}-end`} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-reason`}>Reason</Label>
              <Textarea
                id={`${formId}-reason`}
                rows={4}
                placeholder="Briefly explain the reason for your leave…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit Request"}
            </Button>
            <SheetClose render={<Button variant="ghost">Cancel</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
