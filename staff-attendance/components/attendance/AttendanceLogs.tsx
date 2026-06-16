"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, CalendarDays, MoreVertical, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAttendanceLogs } from "@/services/attendanceService";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-success/10 text-success border-success/30",
  late: "bg-warning/10 text-warning border-warning/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  leave: "bg-info/10 text-info border-info/30",
};

const STATUS_FILTER_LABEL: Record<AttendanceStatus | "all", string> = {
  all: "All Status",
  present: "Present",
  late: "Late",
  absent: "Absent",
  leave: "Leave",
};

const PAGE_SIZE = 5;

function statusLabel(record: AttendanceRecord): string {
  if (record.status === "late") return record.lateMinutes ? `Late (${record.lateMinutes}m)` : "Late";
  return record.status.charAt(0).toUpperCase() + record.status.slice(1);
}

export function AttendanceLogs() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchAttendanceLogs);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const roleOptions = useMemo(() => Array.from(new Set((data ?? []).map((r) => r.position))).sort(), [data]);
  const hasActiveFilters = roleFilter !== "all" || statusFilter !== "all";

  function clearAll() {
    setRoleFilter("all");
    setStatusFilter("all");
  }

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        accessorKey: "staffName",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Staff Member <ArrowUpDown className="size-3.5" />
          </Button>
        ),
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
        accessorKey: "position",
        header: "Role",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.position}</span>,
      },
      {
        accessorKey: "checkIn",
        header: "Check-In",
        cell: ({ row }) => row.original.checkIn ?? <span className="text-muted-foreground">--:--</span>,
      },
      {
        accessorKey: "checkOut",
        header: "Check-Out",
        cell: ({ row }) => row.original.checkOut ?? <span className="text-muted-foreground">--:--</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("rounded-full", STATUS_STYLES[row.original.status])}>
            {statusLabel(row.original)}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => toast.message(`Viewing logs for ${row.original.staffName}`)}
          >
            View Logs
          </Button>
        ),
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((record) => {
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesRole = roleFilter === "all" || record.position === roleFilter;
      return matchesStatus && matchesRole;
    });
  }, [data, statusFilter, roleFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = Math.max(table.getPageCount(), 1);
  const rangeStart = filteredData.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const rangeEnd = Math.min((pageIndex + 1) * PAGE_SIZE, filteredData.length);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</p>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value ?? "all")}>
              <SelectTrigger size="sm" className="w-44" aria-label="Filter by role">
                <SelectValue>{(value: string) => (value === "all" ? "All Roles" : value)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AttendanceStatus | "all")}>
              <SelectTrigger size="sm" className="w-36" aria-label="Filter by status">
                <SelectValue>{(value: AttendanceStatus | "all") => STATUS_FILTER_LABEL[value]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date Range</p>
            <Button
              variant="outline"
              size="sm"
              className="w-56 justify-start font-normal text-muted-foreground"
              onClick={() => toast.message("Date range picker", { description: "Available once attendance history is connected." })}
            >
              <CalendarDays className="size-4" /> All time
            </Button>
          </div>

          {hasActiveFilters ? (
            <Button variant="link" size="sm" className="ml-auto h-9 text-primary" onClick={clearAll}>
              Clear all
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Logs table */}
      <SectionCard
        title="Attendance Logs"
        action={
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Table options"><MoreVertical className="size-4" /></Button>} />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={refetch}>
                <RefreshCw className="size-4" /> Refresh
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Export started", { description: "Preparing CSV download…" })}>
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {error ? (
          <ErrorState onRetry={refetch} title="Couldn't load attendance logs" />
        ) : isLoading || !data ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState title="No attendance logs yet" description="Logs will appear here once staff start checking in." />
        ) : filteredData.length === 0 ? (
          <EmptyState title="No matching records" description="Try adjusting your filters." />
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
                Showing {rangeStart} to {rangeEnd} of {filteredData.length} entries
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
    </div>
  );
}
