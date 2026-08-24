"use client";

import { OrganizationHeader } from "@/components/super-admin/organization/OrganizationHeader";
import { OrgHierarchyList } from "@/components/super-admin/organization/OrgHierarchyList";
import { useAsyncData } from "@/hooks/use-async-data";
import { createClass, fetchOrgHierarchy } from "@/services/superAdminService";

/**
 * Page-level composition for the Super Admin Organization page: header and
 * the org hierarchy list. "Add Unit" creates the class on the real backend,
 * then refetches so the tree reflects the database as the source of truth.
 */
export function OrganizationView() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchOrgHierarchy);

  async function handleAddClass(className: string) {
    await createClass(className);
    refetch();
  }

  return (
    <div className="space-y-6 pb-10">
      <OrganizationHeader onAddClass={handleAddClass} />

      <OrgHierarchyList data={data} isLoading={isLoading} error={error} onRetry={refetch} />
    </div>
  );
}
