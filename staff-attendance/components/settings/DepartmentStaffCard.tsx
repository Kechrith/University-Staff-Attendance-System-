"use client";

import { toast } from "sonner";
import { Pencil, UserPlus, Users } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchDepartmentStaff } from "@/services/settingsService";
import { cn } from "@/lib/utils";

const ROLE_BADGE_STYLES: Record<string, string> = {
  Professor: "bg-warning/10 text-warning border-warning/30",
  "Admin Assistant": "bg-warning/10 text-warning border-warning/30",
  Lecturer: "bg-muted text-muted-foreground border-border",
};
const DEFAULT_ROLE_STYLE = "bg-muted text-muted-foreground border-border";

/** Faculty roster for the department, with role badges and an inline edit action. */
export function DepartmentStaffCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchDepartmentStaff);

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <Users className="size-5 text-primary" /> Department Staff
        </span>
      }
      action={
        <Button size="sm" onClick={() => toast.message("Add staff", { description: "Available once staff management is connected." })}>
          <UserPlus className="size-4" /> Add Staff
        </Button>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load department staff" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Users} title="No staff added yet" description="Staff you add to this department will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Faculty Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback>{staff.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{staff.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-full", ROLE_BADGE_STYLES[staff.role] ?? DEFAULT_ROLE_STYLE)}>
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${staff.name}`}
                      onClick={() => toast.message(`Editing ${staff.name}`, { description: "Available once staff management is connected." })}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SectionCard>
  );
}
