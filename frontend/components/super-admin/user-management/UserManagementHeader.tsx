"use client";

import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Hero section at the top of the Super Admin User Management page. */
export function UserManagementHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create, update, and deactivate accounts across every role.</p>
      </div>

      <Button onClick={() => toast.success("Add Account", { description: "Available once this flow is connected." })}>
        <UserPlus className="size-4" /> Add Account
      </Button>
    </div>
  );
}
