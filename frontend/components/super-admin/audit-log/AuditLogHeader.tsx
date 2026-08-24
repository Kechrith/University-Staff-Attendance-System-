"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AuditLogActionType } from "@/types";

export type AuditLogActionFilter = AuditLogActionType | "all";

const ACTION_FILTER_OPTIONS: { value: AuditLogActionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "login", label: "Login" },
  { value: "export", label: "Export" },
];

interface AuditLogHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  actionType: AuditLogActionFilter;
  onActionTypeChange: (value: AuditLogActionFilter) => void;
}

/** Hero section at the top of the Super Admin Audit Log page, hosting the search + action-type filters. */
export function AuditLogHeader({ search, onSearchChange, actionType, onActionTypeChange }: AuditLogHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Audit Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">Read-only record of every significant system action.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search actor or target…"
            className="w-56 pl-8"
          />
        </div>

        <Select value={actionType} onValueChange={(value) => onActionTypeChange((value as AuditLogActionFilter) ?? "all")}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
