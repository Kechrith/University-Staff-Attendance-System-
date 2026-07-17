"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchNotificationPreferences, updateNotificationPreference } from "@/services/classMonitorService";

type Channel = "email" | "push" | "sms";

/** "Notifications" card: per-alert toggle switches plus the preferred delivery channel. */
export function MonitorNotificationsCard() {
  const { data, isLoading, error, refetch } = useAsyncData(fetchNotificationPreferences);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [channel, setChannel] = useState<Channel>("email");

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <Bell className="size-5 text-primary" /> Notifications
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={refetch} title="Couldn't load notification preferences" />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  checked={enabled[item.id] ?? item.enabled}
                  onCheckedChange={(checked) => {
                    setEnabled((prev) => ({ ...prev, [item.id]: checked }));
                    updateNotificationPreference(item.id, checked)
                      .then(() => toast.success(`${item.title} ${checked ? "enabled" : "disabled"}`))
                      .catch(() => {
                        setEnabled((prev) => ({ ...prev, [item.id]: !checked }));
                        toast.error(`Couldn't update ${item.title}`);
                      });
                  }}
                  aria-label={item.title}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border/60 pt-4">
            <p className="text-sm font-semibold text-foreground">Preferred Channel</p>
            <RadioGroup value={channel} onValueChange={(value) => setChannel(value as Channel)} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {([
                { value: "email", label: "Email" },
                { value: "push", label: "Push Notifications" },
                { value: "sms", label: "SMS (Mobile)" },
              ] satisfies { value: Channel; label: string }[]).map((option) => (
                <RadioGroupItem key={option.value} value={option.value} className="p-3">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input group-data-checked:border-primary">
                    <RadioGroupIndicator />
                  </span>
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                </RadioGroupItem>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
