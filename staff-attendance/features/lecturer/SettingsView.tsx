import { LecturerSettingsHeader } from "@/components/lecturer/settings/LecturerSettingsHeader";
import { LecturerProfileCard } from "@/components/lecturer/settings/LecturerProfileCard";
import { LecturerAccessCard } from "@/components/lecturer/settings/LecturerAccessCard";
import { LecturerAlertPreferencesCard } from "@/components/lecturer/settings/LecturerAlertPreferencesCard";
import { LecturerSecurityCard } from "@/components/lecturer/settings/LecturerSecurityCard";
import { LecturerSettingsActionBar } from "@/components/lecturer/settings/LecturerSettingsActionBar";

/**
 * Page-level composition for the Lecturer Settings page: header, profile
 * paired with the access/notification panel, alert preferences, security &
 * access, and a bottom save bar.
 */
export function SettingsView() {
  return (
    <div className="space-y-6 pb-10">
      <LecturerSettingsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LecturerProfileCard />
        </div>
        <LecturerAccessCard />
      </div>

      <LecturerAlertPreferencesCard />

      <LecturerSecurityCard />

      <LecturerSettingsActionBar />
    </div>
  );
}
