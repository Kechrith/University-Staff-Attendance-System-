import { SuperAdminSettingsHeader } from "@/components/super-admin/settings/SuperAdminSettingsHeader";
import { PersonalProfileCard } from "@/components/super-admin/settings/PersonalProfileCard";
import { SystemConfigurationCard } from "@/components/super-admin/settings/SystemConfigurationCard";
import { SecurityAccessCard } from "@/components/super-admin/settings/SecurityAccessCard";
import { SettingsActionBar } from "@/components/super-admin/settings/SettingsActionBar";

/**
 * Page-level composition for the Super Admin Settings page: header, personal
 * profile, system configuration, security & access, and a bottom save bar.
 */
export function SettingsView() {
  return (
    <div className="space-y-6 pb-10">
      <SuperAdminSettingsHeader />

      <PersonalProfileCard />

      <SystemConfigurationCard />

      <SecurityAccessCard />

      <SettingsActionBar />
    </div>
  );
}
