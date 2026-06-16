"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CalendarDays, CheckCircle2, Filter, XCircle } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAllLeaveRequests } from "@/services/leaveManagementService";
import type { LeaveRequest, LeaveType } from "@/types";
import { cn } from "@/lib/utils";

type LeaveStatus = LeaveRequest["status"];

const PAGE_SIZE = 3;

const STATUS_TABS: { value: LeaveStatus; label: string }[] = [
  { value: "pending", label: "Pending Requests" },
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

/** Renders a leave request's submission time the way the mockup does: relative for recent items, absolute for older ones. */
function formatSubmittedAt(iso: string): string {
  const date = new Date(iso);
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) {
    const hours = Math.round(diffHours);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  return `${diffDays} days ago`;
}

function formatDateRange(startIso: string, endIso: string): string {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  return `${fmt(startIso)} - ${fmt(endIso)}`;
}

/** The "Pending / Approved / Rejected" tabbed table that drives leave approvals for the department. */
export function LeaveRequestsPanel() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchAllLeaveRequests);
  // Approve/reject decisions are tracked locally rather than mutating `data`,
  // keeping the fetched payload as the single source of truth (same pattern
  // as the dashboard's PendingLeaveRequests widget).
  const [overrides, setOverrides] = useState<ReadonlyMap<string, LeaveStatus>>(new Map());
  const [activeTab, setActiveTab] = useState<LeaveStatus>("pending");
  const [categoryFilter, setCategoryFilter] = useState<LeaveType | "all">("all");

  const requests = useMemo(() => {
    if (!data) return null;
    return data.map((request) => (overrides.has(request.id) ? { ...request, status: overrides.get(request.id)! } : request));
  }, [data, overrides]);

  const categoryOptions = useMemo(
    () => Array.from(new Set((data ?? []).map((r) => r.leaveType))).sort(),
    [data],
  );

  const tabCounts = useMemo(() => {
    const counts: Record<LeaveStatus, number> = { pending: 0, approved: 0, rejected: 0 };
    for (const request of requests ?? []) counts[request.status] += 1;
    return counts;
  }, [requests]);

  const filteredData = useMemo(() => {
    if (!requests) return [];
    return requests.filter((r) => r.status === activeTab && (categoryFilter === "all" || r.leaveType === categoryFilter));
  }, [requests, activeTab, categoryFilter]);

  function handleApprove(id: string) {
    const request = requests?.find((r) => r.id === id);
    setOverrides((prev) => new Map(prev).set(id, "approved"));
    toast.success(`${request?.staffName}'s leave request approved.`);
  }

  function handleReject(id: string) {
    const request = requests?.find((r) => r.id === id);
    setOverrides((prev) => new Map(prev).set(id, "rejected"));
    toast.error(`${request?.staffName}'s leave request rejected.`);
  }

  const columns = useMemo<ColumnDef<LeaveRequest>[]>(
    () => [
      {
        accessorKey: "staffName",
        header: "Staff Member",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-9">
              <AvatarImage src={row.original.avatar} alt={row.original.staffName} />
              <AvatarFallback>{row.original.staffName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{row.original.staffName}</p>
              <p className="truncate text-xs text-muted-foreground">ID: {row.original.employeeId}</p>
            </div>
          </div>
        ),
      },
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
              <p className="text-xs text-muted-foreground">{row.original.duration} total</p>
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          row.original.status === "pending" ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleReject(row.original.id)}>
                Reject
              </Button>
              <Button size="sm" onClick={() => handleApprove(row.original.id)}>
                Approve
              </Button>
            </div>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleApprove/handleReject close over `requests`, which already drives this memo's row data
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
  const rangeStart = filteredData.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const rangeEnd = Math.min((pageIndex + 1) * PAGE_SIZE, filteredData.length);

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as LeaveStatus);
            table.setPageIndex(0);
          }}
        >
          <TabsList variant="line" className="h-auto border-b border-border/60 pb-px">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-3 py-2 text-sm">
                {tab.label} {tab.value === "pending" ? `(${tabCounts.pending})` : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter((value as LeaveType | "all") ?? "all");
                table.setPageIndex(0);
              }}
            >
              <SelectTrigger size="sm" className="rounded-full gap-1.5" aria-label="Filter by category">
                <Filter className="size-3.5 text-muted-foreground" />
                <SelectValue>{(value: LeaveType | "all") => (value === "all" ? "All Categories" : value)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => toast.message("Date range picker", { description: "Available once leave history is connected." })}
            >
              <CalendarDays className="size-3.5" /> Date Range
            </Button>
          </div>

          <span className="text-sm text-muted-foreground">
            Showing {rangeStart} to {rangeEnd} of {filteredData.length} {activeTab} requests
          </span>
        </div>

        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load leave requests" />
        ) : isLoading || !requests ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState title="No leave requests yet" description="Requests will appear here once staff submit them." />
        ) : filteredData.length === 0 ? (
          <EmptyState title={`No ${activeTab} requests`} description="Try a different category or check back later." />
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
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <div className="flex items-center gap-1.5">
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
              </div>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
