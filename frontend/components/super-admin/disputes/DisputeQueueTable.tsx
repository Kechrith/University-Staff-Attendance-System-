"use client";

import { useMemo } from "react";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Gavel } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchEscalatedDisputes } from "@/services/superAdminService";
import type { EscalatedDisputeEntry } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<EscalatedDisputeEntry["status"], string> = {
  escalated: "bg-destructive/10 text-destructive border-destructive/30",
  "in-review": "bg-warning/10 text-warning border-warning/30",
  resolved: "bg-success/10 text-success border-success/30",
};

const STATUS_LABEL: Record<EscalatedDisputeEntry["status"], string> = {
  escalated: "Escalated",
  "in-review": "In Review",
  resolved: "Resolved",
};

/** The "Escalated Disputes" table: subject, raised by, department, status, days open, actions. */
export function DisputeQueueTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchEscalatedDisputes);

  const columns = useMemo<ColumnDef<EscalatedDisputeEntry>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.subject}</span>,
      },
      {
        accessorKey: "raisedBy",
        header: "Raised By",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.raisedBy}</span>,
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.department}</span>,
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
        accessorKey: "daysOpen",
        header: "Days Open",
        cell: ({ row }) => <span className="text-foreground">{row.original.daysOpen}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.message(`Reviewing "${row.original.subject}"`, { description: "Available once dispute review is connected." })
            }
          >
            <Gavel className="size-4" /> Review
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
  });

  return (
    <SectionCard title="Escalated Disputes">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load escalated disputes" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No escalated disputes" description="Disputes needing your final decision will appear here." />
      ) : (
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
      )}
    </SectionCard>
  );
}
