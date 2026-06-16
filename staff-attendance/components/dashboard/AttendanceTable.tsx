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
import { ArrowUpDown, Download, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAsyncData } from "@/hooks/use-async-data";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fetchAttendanceRecords } from "@/services/dashboardService";
import type { AttendanceRecord, AttendanceStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-success/10 text-success border-success/30",
  late: "bg-warning/10 text-warning border-warning/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
  leave: "bg-info/10 text-info border-info/30",
};

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  leave: "Leave",
};

const PAGE_SIZE = 4;

export function AttendanceTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchAttendanceRecords);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        accessorKey: "staffName",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Staff Name <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarImage src={row.original.avatar} alt={row.original.staffName} />
              <AvatarFallback>{row.original.staffName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="truncate font-medium text-foreground">{row.original.staffName}</span>
          </div>
        ),
      },
      {
        accessorKey: "position",
        header: "Designation",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.position}</span>,
      },
      {
        accessorKey: "checkIn",
        header: "Check-in",
        cell: ({ row }) => row.original.checkIn ?? <span className="text-muted-foreground">—</span>,
      },
      {
        accessorKey: "checkOut",
        header: "Check-out",
        cell: ({ row }) => row.original.checkOut ?? <span className="text-muted-foreground">—</span>,
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
            {STATUS_LABEL[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={() => toast.message(`Showing logs for ${row.original.staffName}`)}
                >
                  View Logs
                </Button>
              }
            />
            <TooltipContent>
              {row.original.employeeId} · {row.original.workingHours} worked
            </TooltipContent>
          </Tooltip>
        ),
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((record) => {
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesSearch =
        debouncedSearch.trim() === "" ||
        record.staffName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [data, statusFilter, debouncedSearch]);

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
    <SectionCard
      title="Department Staff Attendance Overview"
      description="Today's check-in / check-out activity for your department"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff…"
              className="h-9 w-40 rounded-full pl-8 sm:w-48"
              aria-label="Search attendance table"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AttendanceStatus | "all")}>
            <SelectTrigger size="default" className="h-9 w-9 rounded-full p-0 [&>svg]:hidden" aria-label="Filter by status">
              <Filter className="size-4 text-muted-foreground" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label="Export attendance"
                  onClick={() => toast.success("Export started", { description: "Preparing attendance data…" })}
                >
                  <Download className="size-4" />
                </Button>
              }
            />
            <TooltipContent>Export</TooltipContent>
          </Tooltip>
        </div>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load attendance records" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No attendance records yet" description="Records will appear here once staff start checking in." />
      ) : filteredData.length === 0 ? (
        <EmptyState title="No matching records" description="Try adjusting your search or status filter." />
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
              Showing {rangeStart}-{rangeEnd} of {filteredData.length} staff members
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Prev
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
