import { MonitorSettingsHeader } from "@/components/class-monitor/settings/MonitorSettingsHeader";
import { MonitorProfileCard } from "@/components/class-monitor/settings/MonitorProfileCard";
import { MonitorIdentityCard } from "@/components/class-monitor/settings/MonitorIdentityCard";
import { MonitorSecurityCard } from "@/components/class-monitor/settings/MonitorSecurityCard";
import { MonitorNotificationsCard } from "@/components/class-monitor/settings/MonitorNotificationsCard";
import { MonitorDangerZoneCard } from "@/components/class-monitor/settings/MonitorDangerZoneCard";

/**
 * Page-level composition for the Class Monitor Settings page: header,
 * profile form paired with the identity/avatar sidebar, security paired
 * with notifications, and the danger zone.
 */
export function SettingsView() {
  return (
    <div className="space-y-6 pb-10">
      <MonitorSettingsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonitorProfileCard />
        </div>
        <MonitorIdentityCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MonitorSecurityCard />
        <MonitorNotificationsCard />
      </div>

      <MonitorDangerZoneCard />
    </div>
  );
}
