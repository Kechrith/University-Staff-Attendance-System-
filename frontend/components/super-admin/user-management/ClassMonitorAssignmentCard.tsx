"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { assignClassMonitor, fetchClassMonitorAssignments, fetchUserAccounts } from "@/services/superAdminService";
import type { ClassMonitorAssignmentRow } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ClassMonitorAssignmentRow["status"], string> = {
  assigned: "bg-success/10 text-success border-success/30",
  unassigned: "bg-warning/10 text-warning border-warning/30",
};

const STATUS_LABEL: Record<ClassMonitorAssignmentRow["status"], string> = {
  assigned: "Assigned",
  unassigned: "Unassigned",
};

/** Roster of classes and their Class Monitor assignment status, with a working "Assign" dialog. */
export function ClassMonitorAssignmentCard() {
  const { data: rows, isLoading, error, refetch } = useAsyncData(fetchClassMonitorAssignments);
  const { data: accounts } = useAsyncData(fetchUserAccounts);
  const [assigningRow, setAssigningRow] = useState<ClassMonitorAssignmentRow | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const monitorOptions = accounts?.filter((account) => account.role === "Class-Monitor") ?? [];

  async function handleAssign() {
    if (!assigningRow || !selectedMonitor) return;
    setSubmitting(true);
    try {
      await assignClassMonitor(assigningRow.id, selectedMonitor);
      toast.success(`${selectedMonitor} assigned to ${assigningRow.className}`);
      setAssigningRow(null);
      setSelectedMonitor("");
      refetch();
    } catch {
      toast.error("Couldn't assign the monitor", { description: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard title="Class Monitor Assignments">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load class monitor assignments" />
      ) : isLoading || !rows ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No classes yet" description="Classes and their monitor assignments will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Class</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Current Monitor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-foreground">{row.className}</TableCell>
                  <TableCell className="text-muted-foreground">{row.department}</TableCell>
                  <TableCell>
                    {row.currentMonitor ? (
                      <span className="text-foreground">{row.currentMonitor}</span>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[row.status])}>
                      {STATUS_LABEL[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.status === "unassigned" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMonitor("");
                          setAssigningRow(row);
                        }}
                      >
                        Assign
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!assigningRow} onOpenChange={(open) => !open && setAssigningRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Class Monitor</DialogTitle>
            <DialogDescription>Choose a Class Monitor for {assigningRow?.className}.</DialogDescription>
          </DialogHeader>

          <Select value={selectedMonitor} onValueChange={(value) => setSelectedMonitor((value as string) ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a monitor" />
            </SelectTrigger>
            <SelectContent>
              {monitorOptions.length === 0 ? (
                <SelectItem value="" disabled>
                  No Class Monitor accounts yet
                </SelectItem>
              ) : (
                monitorOptions.map((monitor) => (
                  <SelectItem key={monitor.id} value={monitor.name}>
                    {monitor.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigningRow(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedMonitor || submitting}>
              {submitting ? "Assigning…" : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
