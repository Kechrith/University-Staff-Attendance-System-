"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchLeaveQueue } from "@/services/programCoordinatorService";
import type { LeaveQueueEntry } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;

type SortMode = "all" | "recent";

const STATUS_STYLES: Record<LeaveQueueEntry["status"], string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_LABEL: Record<LeaveQueueEntry["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function formatDateRange(startIso: string, endIso: string): string {
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  return `${fmt(startIso)} - ${fmt(endIso)}`;
}

/** The "Leave Request Queue" table: lecturer, program, duration, type, status. */
export function LeaveRequestQueueTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLeaveQueue);
  const [sortMode, setSortMode] = useState<SortMode>("all");

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (sortMode === "all") return data;
    return [...data].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [data, sortMode]);

  const columns = useMemo<ColumnDef<LeaveQueueEntry>[]>(
    () => [
      {
        accessorKey: "lecturerName",
        header: "Lecturer",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarImage src={row.original.lecturerAvatar} alt={row.original.lecturerName} />
              <AvatarFallback>{row.original.lecturerName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{row.original.lecturerName}</p>
              <p className="truncate text-xs text-muted-foreground">ID: {row.original.employeeId}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "program",
        header: "Program",
        cell: ({ row }) => (
          <div>
            <p className="text-foreground">{row.original.program}</p>
            <p className="text-xs text-muted-foreground">{row.original.programDetail}</p>
          </div>
        ),
      },
      {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <div>
            <p className="whitespace-nowrap font-medium text-foreground">{formatDateRange(row.original.startDate, row.original.endDate)}</p>
            <p className="text-xs text-muted-foreground">{row.original.duration}</p>
          </div>
        ),
      },
      {
        accessorKey: "leaveType",
        header: "Type",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.leaveType}</span>,
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
        cell: ({ row }) =>
          row.original.status === "pending" ? null : (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`View ${row.original.lecturerName}'s request`}
              onClick={() => toast.message(`Viewing ${row.original.lecturerName}'s request`)}
            >
              <Eye className="size-4" />
            </Button>
          ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <SectionCard
      title="Leave Request Queue"
      action={
        <Tabs value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="all" className="rounded-full px-4 data-active:bg-primary data-active:text-primary-foreground">
              All Programs
            </TabsTrigger>
            <TabsTrigger value="recent" className="rounded-full px-4 data-active:bg-primary data-active:text-primary-foreground">
              Recent First
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the leave queue" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No leave requests yet" description="Requests from your managed lecturers will appear here." />
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
              Showing 1 to {Math.min(PAGE_SIZE, sortedData.length)} of {sortedData.length} requests
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
