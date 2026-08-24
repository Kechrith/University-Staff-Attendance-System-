"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, FileBarChart, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchRecentReports } from "@/services/reportsService";
import type { ReportFormat } from "@/types";
import { cn } from "@/lib/utils";

const FORMAT_STYLES: Record<ReportFormat, string> = {
  PDF: "bg-destructive/10 text-destructive border-destructive/30",
  Excel: "bg-warning/10 text-warning border-warning/30",
};

/** Table of previously generated exports, with download/delete actions. */
export function RecentReportsTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchRecentReports);
  // Deletions are tracked locally rather than mutating `data`, the same
  // pattern used for leave-request approvals elsewhere in the app.
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(new Set());

  const reports = data?.filter((r) => !deletedIds.has(r.id)) ?? null;

  function handleDelete(id: string, name: string) {
    setDeletedIds((prev) => new Set(prev).add(id));
    toast.success("Report deleted", { description: name });
  }

  return (
    <SectionCard
      title="Recent Reports"
      action={
        reports && reports.length > 0 ? (
          <Badge variant="outline" className="rounded-full">
            {reports.length} Reports Ready
          </Badge>
        ) : null
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load recent reports" />
      ) : isLoading || !reports ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState icon={FileBarChart} title="No reports yet" description="Generated reports will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Report Name</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-foreground">{report.name}</TableCell>
                  <TableCell className="text-muted-foreground">{report.dateGeneratedLabel}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-full uppercase", FORMAT_STYLES[report.format])}>
                      {report.format}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Download ${report.name}`}
                        onClick={() => toast.success("Download started", { description: report.name })}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${report.name}`}
                        onClick={() => handleDelete(report.id, report.name)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
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
