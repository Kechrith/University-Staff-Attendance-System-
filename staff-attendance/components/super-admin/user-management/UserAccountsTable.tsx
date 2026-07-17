"use client";

import { useMemo } from "react";
import { type ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil, UserX, Users } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchUserAccounts } from "@/services/superAdminService";
import type { UserAccountRole, UserAccountRow, UserAccountStatus } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

const ROLE_STYLES: Record<UserAccountRole, string> = {
  "Department-Head": "bg-primary/10 text-primary border-primary/30",
  "Program-Coordinator": "bg-info/10 text-info border-info/30",
  Lecturer: "bg-success/10 text-success border-success/30",
  "Class-Monitor": "bg-warning/10 text-warning border-warning/30",
  "Super-Admin": "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_STYLES: Record<UserAccountStatus, string> = {
  active: "bg-success/10 text-success border-success/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
  pending: "bg-warning/10 text-warning border-warning/30",
};

const STATUS_LABEL: Record<UserAccountStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  pending: "Pending",
};

/** The "All Accounts" table: every user account across every role, with edit/deactivate actions. */
export function UserAccountsTable() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchUserAccounts);

  const columns = useMemo<ColumnDef<UserAccountRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant="outline" className={cn("rounded-full", ROLE_STYLES[row.original.role])}>
            {row.original.role}
          </Badge>
        ),
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => toast.message(`Editing ${row.original.name}`, { description: "Available once this flow is connected." })}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Deactivate ${row.original.name}`}
              onClick={() => toast.message(`Deactivating ${row.original.name}`, { description: "Available once this flow is connected." })}
            >
              <UserX className="size-4" />
            </Button>
          </div>
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
    <SectionCard title="All Accounts">
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load user accounts" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Users} title="No accounts yet" description="Accounts created across every role will appear here." />
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
              Showing 1 to {Math.min(PAGE_SIZE, data.length)} of {data.length} accounts
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
