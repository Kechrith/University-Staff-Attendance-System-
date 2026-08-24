"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLeaveRequests } from "@/services/classMonitorService";
import type { MonitorLeaveRequest } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

const STATUS_STYLES: Record<MonitorLeaveRequest["status"], string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_LABEL: Record<MonitorLeaveRequest["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function formatDateRange(startIso: string, endIso: string): string {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt(startIso)} - ${fmt(endIso)}`;
}

/** The "Request History" table: leave type, duration, reason, and status. */
export function LeaveRequestHistoryTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLeaveRequests);

  const columns = useMemo<ColumnDef<MonitorLeaveRequest>[]>(
    () => [
      {
        accessorKey: "leaveType",
        header: "Leave Type",
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.leaveType}</span>,
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <div>
            <p className="whitespace-nowrap text-foreground">{formatDateRange(row.original.startDate, row.original.endDate)}</p>
            <p className="text-xs text-muted-foreground">{row.original.duration}</p>
          </div>
        ),
      },
      {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.reason}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[row.original.status])}>
            {STATUS_LABEL[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`More actions for ${row.original.leaveType} request`}
            onClick={() => toast.message("Request actions", { description: "Available once this flow is connected." })}
          >
            <MoreVertical className="size-4" />
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <SectionCard title="Request History">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load your request history" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No leave requests yet" description="Requests you submit will appear here." />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/40">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/40">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              Showing 1-{Math.min(PAGE_SIZE, data.length)} of {data.length} requests
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
                <Button
                  key={i}
                  variant={i === pageIndex ? "default" : "outline"}
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => table.setPageIndex(i)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
