import { UserManagementHeader } from "@/components/super-admin/user-management/UserManagementHeader";
import { UserAccountsTable } from "@/components/super-admin/user-management/UserAccountsTable";
import { ClassMonitorAssignmentCard } from "@/components/super-admin/user-management/ClassMonitorAssignmentCard";

/**
 * Page-level composition for the Super Admin User Management page: header,
 * the all-accounts table, then the class monitor assignment roster. Server
 * Component — interactivity and data fetching live in the client
 * components under `components/super-admin/user-management/`.
 */
export function UserManagementView() {
  return (
    <div className="space-y-6 pb-10">
      <UserManagementHeader />

      <UserAccountsTable />

      <ClassMonitorAssignmentCard />
    </div>
  );
}
