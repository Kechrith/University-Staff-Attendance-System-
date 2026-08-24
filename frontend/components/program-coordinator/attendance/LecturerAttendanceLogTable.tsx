"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
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
import { fetchLecturerAttendanceLog } from "@/services/programCoordinatorService";
import type { LecturerAttendanceLogEntry, LecturerAttendanceStatus } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

const STATUS_STYLES: Record<LecturerAttendanceStatus, string> = {
  present: "bg-success/10 text-success border-success/30",
  late: "bg-warning/10 text-warning border-warning/30",
  absent: "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_LABEL: Record<LecturerAttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

type FilterTab = "all" | "flagged";

/** The "Detailed Attendance Log" table: lecturer, course, time slot, status, check-in method. */
export function LecturerAttendanceLogTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchLecturerAttendanceLog);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (filterTab === "all") return data;
    return data.filter((entry) => entry.status !== "present");
  }, [data, filterTab]);

  const columns = useMemo<ColumnDef<LecturerAttendanceLogEntry>[]>(
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
              <p className="truncate text-xs text-muted-foreground">{row.original.position}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "course",
        header: "Course / Class",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.original.course}</p>
            <p className="text-xs text-muted-foreground">{row.original.classCode}</p>
          </div>
        ),
      },
      {
        accessorKey: "timeSlotLabel",
        header: "Time Slot",
        cell: ({ row }) => (
          <div>
            <p className="whitespace-nowrap text-foreground">{row.original.timeSlotLabel}</p>
            <p className="text-xs text-muted-foreground">{row.original.checkInLabel}</p>
          </div>
        ),
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
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.method}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`More actions for ${row.original.lecturerName}`}
            onClick={() => toast.message(`Actions for ${row.original.lecturerName}`)}
          >
            <MoreVertical className="size-4" />
          </Button>
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
      title="Detailed Attendance Log"
      action={
        <Tabs value={filterTab} onValueChange={(value) => setFilterTab(value as FilterTab)}>
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="all" className="rounded-full px-4 data-active:bg-primary data-active:text-primary-foreground">
              All
            </TabsTrigger>
            <TabsTrigger value="flagged" className="rounded-full px-4 data-active:bg-primary data-active:text-primary-foreground">
              Flagged
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the attendance log" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No attendance logged yet" description="Lecturer check-ins will appear here once classes begin." />
      ) : filteredData.length === 0 ? (
        <EmptyState title="No flagged entries" description="Late or absent lecturers will appear here." />
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
              Showing 1-{Math.min(PAGE_SIZE, filteredData.length)} of {filteredData.length} lecturers
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
