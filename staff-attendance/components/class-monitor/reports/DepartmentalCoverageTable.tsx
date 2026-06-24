"use client";

import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchDepartmentCoverage } from "@/services/classMonitorService";
import type { MonitorDepartmentCoverageStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MonitorDepartmentCoverageStatus, string> = {
  optimal: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
};

const STATUS_LABEL: Record<MonitorDepartmentCoverageStatus, string> = {
  optimal: "Optimal",
  warning: "Warning",
};

/** The "Departmental Coverage Details" table: sessions recorded vs. total, with an accuracy/status column. */
export function DepartmentalCoverageTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchDepartmentCoverage);

  return (
    <SectionCard
      title="Departmental Coverage Details"
      action={
        <Select defaultValue="all">
          <SelectTrigger className="w-40" size="sm">
            <SelectValue placeholder="All Faculties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load departmental coverage" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Building2} title="No coverage data yet" description="Departmental coverage will appear here once recorded." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Department</TableHead>
                <TableHead>Total Sessions</TableHead>
                <TableHead>Recorded</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-foreground">{row.department}</TableCell>
                  <TableCell className="text-muted-foreground">{row.totalSessions.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{row.recorded.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-foreground">{row.accuracyPercentage}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[row.status])}>
                      {STATUS_LABEL[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-primary"
                      onClick={() => toast.message(`${row.department} details`, { description: "Available once drill-down is connected." })}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SectionCard>
  );
}
