"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { addTimetableSession, fetchSemesterTimetableGrid, fetchUserAccounts } from "@/services/superAdminService";

const COURSE_OPTIONS = [
  "DSE-101 Intro to Data Science",
  "DSE-204 Data Structures",
  "DSE-205 Machine Learning Basics",
  "DSE-301 Software Engineering for Data Systems",
];

const DAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const ROOM_OPTIONS = ["Room A201", "Room A105", "Room C302"];

/** The semester Time x Day timetable grid, with a working "Add Session" dialog that assigns a lecturer to a class. */
export function SemesterTimetableGrid() {
  const { data: grid, isLoading, error, refetch } = useAsyncData(() => fetchSemesterTimetableGrid());
  const { data: accounts } = useAsyncData(fetchUserAccounts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [course, setCourse] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const lecturerOptions = accounts?.filter((account) => account.role === "Lecturer") ?? [];
  const days = grid ? Array.from(new Set(grid.slots.map((slot) => slot.day))) : [];

  function resetForm() {
    setCourse("");
    setLecturer("");
    setDay("");
    setTime("");
    setRoom("");
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) resetForm();
  }

  async function handleAddSession() {
    if (!course || !lecturer || !day || !time || !room) return;
    setSubmitting(true);
    try {
      await addTimetableSession({ course, lecturer, day, time, room });
      toast.success("Session added", { description: `${lecturer} assigned to ${course} on ${day}, ${time}.` });
      resetForm();
      setDialogOpen(false);
      refetch();
    } catch {
      toast.error("Couldn't add the session", { description: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard
      title={grid ? grid.semesterLabel : "Semester Timetable"}
      action={
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger
            render={
              <Button size="sm">
                <CalendarPlus className="size-4" /> Add Session
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Session</DialogTitle>
              <DialogDescription>Assign a lecturer to a class for a specific day and time.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Select value={course} onValueChange={(value) => setCourse((value as string) ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Lecturer</Label>
                <Select value={lecturer} onValueChange={(value) => setLecturer((value as string) ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturerOptions.length === 0 ? (
                      <SelectItem value="" disabled>
                        No Lecturer accounts yet
                      </SelectItem>
                    ) : (
                      lecturerOptions.map((account) => (
                        <SelectItem key={account.id} value={account.name}>
                          {account.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Day</Label>
                  <Select value={day} onValueChange={(value) => setDay((value as string) ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Select value={time} onValueChange={(value) => setTime((value as string) ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {(grid?.timeSlots ?? []).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Room</Label>
                <Select value={room} onValueChange={(value) => setRoom((value as string) ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSession} disabled={!course || !lecturer || !day || !time || !room || submitting}>
                {submitting ? "Adding…" : "Add Session"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the timetable" />
      ) : isLoading || !grid ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : grid.timeSlots.length === 0 || grid.slots.length === 0 ? (
        <EmptyState
          title="No timetable loaded yet"
          description="Import or create a semester timetable to see scheduled sessions here."
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                {days.map((day) => (
                  <TableHead key={day}>{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {grid.timeSlots.map((time) => (
                <TableRow key={time}>
                  <TableCell className="font-medium text-muted-foreground">{time}</TableCell>
                  {days.map((day) => {
                    const slot = grid.slots.find((s) => s.day === day && s.time === time);
                    return (
                      <TableCell key={day}>
                        {slot ? (
                          <div className="text-xs whitespace-normal">
                            <p className="font-semibold text-foreground">{slot.courseLabel}</p>
                            <p className="mt-0.5 text-muted-foreground">
                              {slot.lecturerLabel} • {slot.roomLabel}
                            </p>
                          </div>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SectionCard>
  );
}
