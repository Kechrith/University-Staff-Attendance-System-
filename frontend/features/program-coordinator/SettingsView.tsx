import { CoordinatorSettingsHeader } from "@/components/program-coordinator/settings/CoordinatorSettingsHeader";
import { PersonalProfileCard } from "@/components/program-coordinator/settings/PersonalProfileCard";
import { CoordinatorAccessCard } from "@/components/program-coordinator/settings/CoordinatorAccessCard";
import { CoordinationPoliciesCard } from "@/components/program-coordinator/settings/CoordinationPoliciesCard";
import { AlertPreferencesCard } from "@/components/program-coordinator/settings/AlertPreferencesCard";
import { CoordinatorSettingsActionBar } from "@/components/program-coordinator/settings/CoordinatorSettingsActionBar";

/**
 * Page-level composition for the Program Coordinator Settings page: header,
 * profile paired with the access/duty-status panel, coordination policies
 * paired with alert preferences, and a bottom save bar. Dropped the generic
 * Security & Access card (password/2FA/login history — not coordination-
 * specific) to trim the page from 5 card sections to 4.
 */
export function SettingsView() {
  return (
    <div className="space-y-6 pb-10">
      <CoordinatorSettingsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PersonalProfileCard />
        </div>
        <CoordinatorAccessCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CoordinationPoliciesCard />
        <AlertPreferencesCard />
      </div>

      <CoordinatorSettingsActionBar />
    </div>
  );
}
