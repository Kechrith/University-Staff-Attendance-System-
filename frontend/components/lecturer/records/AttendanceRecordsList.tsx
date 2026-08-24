"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, ClipboardList, Flag } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerAttendanceRecords, submitDispute } from "@/services/lecturerService";
import type { LecturerAttendanceRecord, LecturerRecordStatus } from "@/types";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "flagged";

const STATUS_STYLES: Record<LecturerRecordStatus, string> = {
  present: "bg-success/10 text-success border-success/30",
  late: "bg-warning/10 text-warning border-warning/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_LABEL: Record<LecturerRecordStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

interface DisputeOverride {
  disputeStatus: "flagged";
  disputeReason: string;
}

interface DisputeSheetProps {
  record: LecturerAttendanceRecord;
  onSubmitted: (reason: string) => void;
}

/** The Flag/Dispute form (FR-5), opened from a record's "Flag" button. */
function DisputeSheet({ record, onSubmitted }: DisputeSheetProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!reason.trim()) {
      toast.error("Please describe what's inaccurate before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitDispute(record.id, reason.trim());
      onSubmitted(reason.trim());
      toast.success("Dispute submitted", { description: "Your Program Coordinator will review this entry." });
      setOpen(false);
      setReason("");
    } catch {
      toast.error("Couldn't submit dispute", { description: "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm">
            <Flag className="size-3.5" /> Flag / Dispute
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Flag this entry</SheetTitle>
          <SheetDescription>
            {record.course} ({record.classCode}) ·{" "}
            {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          <div className="rounded-lg border border-border/60 p-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Logged status</p>
            <Badge variant="outline" className={cn("mt-1.5 rounded-full", STATUS_STYLES[record.status])}>
              {STATUS_LABEL[record.status]}
            </Badge>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lesson summary</p>
            <p className="mt-1 text-muted-foreground">{record.lessonSummary || "—"}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dispute-reason">What&apos;s inaccurate?</Label>
            <Textarea
              id="dispute-reason"
              rows={4}
              placeholder="e.g. I was marked late, but I was in the room before class started…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Dispute"}
          </Button>
          <SheetClose render={<Button variant="ghost">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** The chronological list of attendance + lesson-summary records, with the flag/dispute action (FR-4/FR-5). */
export function AttendanceRecordsList() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerAttendanceRecords);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [overrides, setOverrides] = useState<Record<string, DisputeOverride>>({});

  const records = useMemo(() => {
    if (!data) return [];
    const merged = data.map((record) => (overrides[record.id] ? { ...record, ...overrides[record.id] } : record));
    return [...merged].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, overrides]);

  const filteredRecords = useMemo(() => {
    if (filterTab === "all") return records;
    return records.filter((record) => record.disputeStatus === "flagged");
  }, [records, filterTab]);

  return (
    <SectionCard
      title="Attendance & Lesson Log"
      action={
        <Tabs value={filterTab} onValueChange={(value) => setFilterTab(value as FilterTab)} className="w-full sm:w-auto">
          <TabsList className="rounded-full bg-muted p-1 w-full sm:w-auto overflow-x-auto flex justify-start sm:justify-center">
            <TabsTrigger value="all" className="rounded-full px-3.5 sm:px-4 text-xs sm:text-sm data-active:bg-primary data-active:text-primary-foreground">
              All
            </TabsTrigger>
            <TabsTrigger value="flagged" className="rounded-full px-3.5 sm:px-4 text-xs sm:text-sm data-active:bg-primary data-active:text-primary-foreground">
              Flagged
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load your records" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No records yet" description="Attendance logged by your Class Monitor will appear here." />
      ) : filteredRecords.length === 0 ? (
        <EmptyState icon={Flag} title="No flagged entries" description="Entries you dispute will appear here for tracking." />
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div key={record.id} className="rounded-lg border border-border/60 p-3.5 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground break-words">
                    {record.course} <span className="text-muted-foreground">· {record.classCode}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ·{" "}
                    {record.timeSlotLabel} · Logged by {record.loggedBy}
                  </p>
                </div>
                <Badge variant="outline" className={cn("self-start shrink-0 rounded-full text-xs", STATUS_STYLES[record.status])}>
                  {STATUS_LABEL[record.status]}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground break-words">{record.lessonSummary || "No lesson summary recorded."}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                {record.disputeStatus === "flagged" ? (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/5 px-3 py-2 text-xs text-destructive w-full sm:w-auto">
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                    <span className="break-words">
                      <span className="font-semibold">Disputed:</span> {record.disputeReason}
                    </span>
                  </div>
                ) : record.disputeStatus === "resolved" ? (
                  <Badge variant="outline" className="rounded-full bg-success/10 text-success border-success/30 self-start">
                    Dispute resolved
                  </Badge>
                ) : (
                  <span />
                )}

                {record.disputeStatus === "none" ? (
                  <div className="w-full sm:w-auto">
                    <DisputeSheet
                      record={record}
                      onSubmitted={(reason) => {
                        setOverrides((prev) => ({ ...prev, [record.id]: { disputeStatus: "flagged", disputeReason: reason } }));
                        void refetch();
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
