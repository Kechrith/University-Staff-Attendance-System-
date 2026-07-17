import { DisputesHeader } from "@/components/super-admin/disputes/DisputesHeader";
import { DisputeQueueTable } from "@/components/super-admin/disputes/DisputeQueueTable";

/**
 * Page-level composition for the Super Admin Disputes page: header with
 * inline stat chips followed by the escalated disputes queue table. Server
 * Component — interactivity and data fetching live in the client components
 * under `components/super-admin/disputes/`.
 */
export function DisputesView() {
  return (
    <div className="space-y-6 pb-10">
      <DisputesHeader />

      <DisputeQueueTable />
    </div>
  );
}
