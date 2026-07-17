"use client";

import { useMemo } from "react";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchAuditLogEntries } from "@/services/superAdminService";
import type { AuditLogEntry } from "@/types";
import { cn } from "@/lib/utils";
import type { AuditLogActionFilter } from "@/components/super-admin/audit-log/AuditLogHeader";

const ACTION_STYLES: Record<AuditLogEntry["action"], string> = {
  create: "bg-success/10 text-success border-success/30",
  update: "bg-info/10 text-info border-info/30",
  delete: "bg-destructive/10 text-destructive border-destructive/30",
  login: "bg-muted text-muted-foreground border-border",
  export: "bg-warning/10 text-warning border-warning/30",
};

const ACTION_LABEL: Record<AuditLogEntry["action"], string> = {
  create: "Create",
  update: "Update",
  delete: "Delete",
  login: "Login",
  export: "Export",
};

interface AuditLogTableProps {
  search: string;
  actionType: AuditLogActionFilter;
}

/** The read-only "Activity Log" table: timestamp, actor, role, action, target — no actions column per FR-36. */
export function AuditLogTable({ search, actionType }: AuditLogTableProps) {
  const { data, isLoading, error, refetch } = useAsyncData(fetchAuditLogEntries);

  const filteredData = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLowerCase();
    return data.filter((entry) => {
      const matchesAction = actionType === "all" || entry.action === actionType;
      const matchesSearch = query.length === 0 || entry.actor.toLowerCase().includes(query) || entry.target.toLowerCase().includes(query);
      return matchesAction && matchesSearch;
    });
  }, [data, search, actionType]);

  const columns = useMemo<ColumnDef<AuditLogEntry>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ row }) => <span className="whitespace-nowrap text-muted-foreground">{row.original.timestamp}</span>,
      },
      {
        accessorKey: "actor",
        header: "Actor",
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.actor}</span>,
      },
      {
        accessorKey: "actorRole",
        header: "Role",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.actorRole}</span>,
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("rounded-full", ACTION_STYLES[row.original.action])}>
            {ACTION_LABEL[row.original.action]}
          </Badge>
        ),
      },
      {
        accessorKey: "target",
        header: "Target",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.target}</span>,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <SectionCard title="Activity Log">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load the audit log" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <EmptyState title="No audit log entries" description="Significant system actions will appear here." />
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
