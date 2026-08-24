import { LecturerSettingsHeader } from "@/components/lecturer/settings/LecturerSettingsHeader";
import { LecturerProfileCard } from "@/components/lecturer/settings/LecturerProfileCard";
import { LecturerAccessCard } from "@/components/lecturer/settings/LecturerAccessCard";
import { LecturerSecurityCard } from "@/components/lecturer/settings/LecturerSecurityCard";
import { LecturerSettingsActionBar } from "@/components/lecturer/settings/LecturerSettingsActionBar";

/**
 * Page-level composition for the Lecturer Settings page: header, profile
 * paired with the merged notifications/access panel, security & access, and
 * a bottom save bar. (Notification preferences live inside
 * `LecturerAccessCard` alongside the session info — see that component for
 * why they were merged.)
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

      <LecturerSecurityCard />

      <LecturerSettingsActionBar />
    </div>
  );
}
