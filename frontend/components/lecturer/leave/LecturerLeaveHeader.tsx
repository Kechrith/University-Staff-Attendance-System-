"use client";

import { useId, useState, useEffect } from "react";
import { toast } from "sonner";
import { CalendarPlus, Clock, BookOpen } from "lucide-react";
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
import { submitLeaveRequest, fetchLecturerWeeklyScheduleGrid } from "@/services/lecturerService";
import type { LeaveType, LecturerLeaveRequest, LecturerWeeklyScheduleGrid } from "@/types";

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

export function LecturerLeaveHeader({ onRequestSubmitted }: LecturerLeaveHeaderProps) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [requestMode, setRequestMode] = useState<"date-range" | "by-session">("by-session");
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // By-session state
  const [scheduleGrid, setScheduleGrid] = useState<LecturerWeeklyScheduleGrid | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && !scheduleGrid) {
      fetchLecturerWeeklyScheduleGrid(0)
        .then(setScheduleGrid)
        .catch(() => {});
    }
  }, [open, scheduleGrid]);

  function resetForm() {
    setLeaveType("Annual Leave");
    setStartDate("");
    setEndDate("");
    setReason("");
    setSelectedSessionId("");
    setSessionDate("");
    setRequestMode("by-session");
  }

  async function handleSubmit() {
    let finalStartDate = startDate;
    let finalEndDate = endDate;
    let finalReason = reason.trim();
    let durationLabel = "";

    if (requestMode === "by-session") {
      if (!selectedSessionId) {
        toast.error("Please select a class session.");
        return;
      }
      if (!sessionDate) {
        toast.error("Please select the date for the class session.");
        return;
      }
      const chosenSlot = scheduleGrid?.slots.find((s) => s.id === selectedSessionId);
      if (!chosenSlot) {
        toast.error("Invalid session selection.");
        return;
      }

      finalStartDate = sessionDate;
      finalEndDate = sessionDate;
      const sessionTag = `[Permission for Session: ${chosenSlot.title} (${chosenSlot.time}, ${chosenSlot.subtitle})]`;
      finalReason = finalReason ? `${sessionTag} - ${finalReason}` : sessionTag;
      durationLabel = `1 Session (${chosenSlot.time})`;
    } else {
      if (!startDate || !endDate) {
        toast.error("Please select a start and end date.");
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        toast.error("End date can't be before the start date.");
        return;
      }
      const days = countDays(startDate, endDate);
      durationLabel = `${days} day${days === 1 ? "" : "s"}`;
    }

    if (!finalReason) {
      toast.error("Please provide a reason for your permission request.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLeaveRequest({
        leaveType,
        startDate: finalStartDate,
        endDate: finalEndDate,
        reason: finalReason,
      });

      onRequestSubmitted({
        id: `local-${Date.now()}`,
        leaveType,
        startDate: finalStartDate,
        endDate: finalEndDate,
        duration: durationLabel,
        reason: finalReason,
        status: "pending",
        requestedAt: new Date().toISOString(),
      });

      toast.success("Permission request submitted", {
        description: "Your Program Coordinator will review it shortly.",
      });
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Couldn't submit permission request", { description: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Leave &amp; Permission Requests</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Request permission by class session or date range and track submission statuses.
        </p>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button className="w-full sm:w-auto shrink-0 justify-center">
              <CalendarPlus className="size-4" /> Request Permission
            </Button>
          }
        />
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto max-h-screen">
          <SheetHeader>
            <SheetTitle>Request Permission / Leave</SheetTitle>
            <SheetDescription>
              Submit a session permission or leave request for your Program Coordinator to review.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 py-2">
            {/* Mode Selector */}
            <div className="space-y-1.5">
              <Label>Request Type</Label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-1">
                <Button
                  type="button"
                  variant={requestMode === "by-session" ? "default" : "ghost"}
                  size="sm"
                  className="w-full text-xs font-semibold"
                  onClick={() => setRequestMode("by-session")}
                >
                  <BookOpen className="mr-1.5 size-3.5" /> By Class Session
                </Button>
                <Button
                  type="button"
                  variant={requestMode === "date-range" ? "default" : "ghost"}
                  size="sm"
                  className="w-full text-xs font-semibold"
                  onClick={() => setRequestMode("date-range")}
                >
                  <Clock className="mr-1.5 size-3.5" /> Date Range
                </Button>
              </div>
            </div>

            {/* Leave Type */}
            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-type`}>Reason Category</Label>
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

            {/* Mode 1: By Class Session */}
            {requestMode === "by-session" && (
              <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor={`${formId}-session`}>Select Class Session</Label>
                  <Select value={selectedSessionId} onValueChange={(val) => setSelectedSessionId(val ?? "")}>
                    <SelectTrigger id={`${formId}-session`} className="w-full bg-background">
                      <SelectValue placeholder="Choose a scheduled class session…" />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduleGrid?.slots && scheduleGrid.slots.length > 0 ? (
                        scheduleGrid.slots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.title} ({slot.day} {slot.time} • {slot.subtitle})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Loading scheduled sessions…
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`${formId}-session-date`}>Session Date</Label>
                  <Input
                    id={`${formId}-session-date`}
                    type="date"
                    className="bg-background"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Mode 2: Date Range */}
            {requestMode === "date-range" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`${formId}-start`}>Start Date</Label>
                  <Input id={`${formId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${formId}-end`}>End Date</Label>
                  <Input id={`${formId}-end`} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-reason`}>Reason / Notes</Label>
              <Textarea
                id={`${formId}-reason`}
                rows={3}
                placeholder="Explain the reason for requesting permission for this session…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter className="mt-4 flex-col-reverse sm:flex-row gap-2">
            <SheetClose render={<Button variant="ghost" className="w-full sm:w-auto">Cancel</Button>} />
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Submitting…" : "Submit Permission Request"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
