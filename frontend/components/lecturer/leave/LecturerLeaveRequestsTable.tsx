"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLecturerLeaveRequests } from "@/services/lecturerService";
import type { LecturerLeaveRequest, LeaveType } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

type FilterTab = "all" | LecturerLeaveRequest["status"];

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const LEAVE_TYPE_STYLES: Record<LeaveType, string> = {
  "Sick Leave": "bg-warning/10 text-warning border-warning/30",
  "Annual Leave": "bg-info/10 text-info border-info/30",
  "Maternity Leave": "bg-rose-500/10 text-rose-600 border-rose-500/30",
  "Emergency Leave": "bg-destructive/10 text-destructive border-destructive/30",
  "Unpaid Leave": "bg-muted text-muted-foreground border-border",
  Research: "bg-violet-500/10 text-violet-600 border-violet-500/30",
};

function formatDateRange(startIso: string, endIso: string): string {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  return `${fmt(startIso)} - ${fmt(endIso)}`;
}

function formatSubmittedAt(iso: string): string {
  const date = new Date(iso);
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) {
    const hours = Math.round(diffHours);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

interface LecturerLeaveRequestsTableProps {
  /** Requests submitted this session, prepended ahead of the fetched history (FR: lecturers can request leave). */
  extraRequests: LecturerLeaveRequest[];
}

/** The lecturer's own leave request history, filterable by status. */
export function LecturerLeaveRequestsTable({ extraRequests }: LecturerLeaveRequestsTableProps) {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerLeaveRequests);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const requests = useMemo(() => {
    if (!data) return null;
    return [...extraRequests, ...data].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }, [data, extraRequests]);

  const filteredData = useMemo(() => {
    if (!requests) return [];
    if (filterTab === "all") return requests;
    return requests.filter((r) => r.status === filterTab);
  }, [requests, filterTab]);

  const columns = useMemo<ColumnDef<LecturerLeaveRequest>[]>(
    () => [
      {
        accessorKey: "leaveType",
        header: "Leave Type",
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("rounded-full", LEAVE_TYPE_STYLES[row.original.leaveType])}>
            {row.original.leaveType}
          </Badge>
        ),
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <div>
              <p className="whitespace-nowrap font-medium text-foreground">
                {formatDateRange(row.original.startDate, row.original.endDate)}
              </p>
              <p className="text-xs text-muted-foreground">{row.original.duration}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => (
          <p className="max-w-[220px] truncate text-muted-foreground" title={row.original.reason}>
            {row.original.reason}
          </p>
        ),
      },
      {
        accessorKey: "requestedAt",
        header: "Submitted",
        cell: ({ row }) => <span className="whitespace-nowrap text-muted-foreground">{formatSubmittedAt(row.original.requestedAt)}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
          row.original.status === "pending" ? (
            <Badge variant="outline" className="rounded-full bg-warning/10 text-warning border-warning/30">
              <Clock className="size-3.5" /> Pending
            </Badge>
          ) : row.original.status === "approved" ? (
            <Badge variant="outline" className="rounded-full bg-success/10 text-success border-success/30">
              <CheckCircle2 className="size-3.5" /> Approved
            </Badge>
          ) : (
            <Badge variant="outline" className="rounded-full bg-destructive/10 text-destructive border-destructive/30">
              <XCircle className="size-3.5" /> Rejected
            </Badge>
          ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <SectionCard
      title="My Leave History"
      action={
        <Tabs value={filterTab} onValueChange={(value) => setFilterTab(value as FilterTab)}>
          <TabsList className="rounded-full bg-muted p-1">
            {FILTER_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full px-4 data-active:bg-primary data-active:text-primary-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load your leave history" />
      ) : isLoading || !requests ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState title="No leave requests yet" description="Requests you submit will appear here for tracking." />
      ) : filteredData.length === 0 ? (
        <EmptyState title={`No ${filterTab} requests`} description="Try a different filter." />
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
              Showing 1-{Math.min(PAGE_SIZE, filteredData.length)} of {filteredData.length} requests
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
