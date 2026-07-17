"use client";

import { useState } from "react";
import { AuditLogHeader, type AuditLogActionFilter } from "@/components/super-admin/audit-log/AuditLogHeader";
import { AuditLogTable } from "@/components/super-admin/audit-log/AuditLogTable";

/**
 * Page-level composition for the Super Admin Audit Log page: header hosting
 * the search + action-type filters, and the read-only activity table. Client
 * Component — owns the shared filter state passed down to both children so
 * filtering happens against the already-fetched array, not per keystroke.
 */
export function AuditLogView() {
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState<AuditLogActionFilter>("all");

  return (
    <div className="space-y-6 pb-10">
      <AuditLogHeader search={search} onSearchChange={setSearch} actionType={actionType} onActionTypeChange={setActionType} />

      <AuditLogTable search={search} actionType={actionType} />
    </div>
  );
}
