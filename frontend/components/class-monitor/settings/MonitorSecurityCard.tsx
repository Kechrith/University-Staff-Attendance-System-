"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** "Account Security" card: password change form plus a two-factor authentication callout. */
export function MonitorSecurityCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SectionCard
      title={
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" /> Account Security
        </span>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="monitor-current-password">Current Password</Label>
          <Input
            id="monitor-current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monitor-new-password">New Password</Label>
          <Input id="monitor-new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monitor-confirm-password">Confirm New Password</Label>
          <Input
            id="monitor-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast.message("Update password", { description: "Available once password changes are connected." })}
        >
          Update Password
        </Button>

        <div className="space-y-1.5 rounded-lg border border-border/60 p-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <ShieldCheck className="size-4 text-muted-foreground" /> Two-Factor Authentication
          </p>
          <p className="text-xs text-muted-foreground">Currently disabled. We recommend enabling 2FA for enhanced security of administrative records.</p>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-primary"
            onClick={() => toast.message("Enable 2FA", { description: "Available once two-factor authentication is connected." })}
          >
            Enable Now
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
