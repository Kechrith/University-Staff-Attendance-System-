import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { DepartmentProfileCard } from "@/components/settings/DepartmentProfileCard";
import { AttendancePolicyCard } from "@/components/settings/AttendancePolicyCard";
import { LeaveApprovalRulesCard } from "@/components/settings/LeaveApprovalRulesCard";
import { DepartmentStaffCard } from "@/components/settings/DepartmentStaffCard";
import { SettingsActionBar } from "@/components/settings/SettingsActionBar";

/**
 * Page-level composition for the Department Settings page: header, profile
 * + attendance policy, leave approval rules + staff roster, and a bottom
 * save/reset bar. Server Component — interactivity and data fetching live
 * in the client components under `components/settings/`.
 */
export function SettingsView() {
  return (
    <div className="space-y-6 pb-10">
      <SettingsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DepartmentProfileCard />
        <AttendancePolicyCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LeaveApprovalRulesCard />
        <DepartmentStaffCard />
      </div>

      <SettingsActionBar />
    </div>
  );
}
