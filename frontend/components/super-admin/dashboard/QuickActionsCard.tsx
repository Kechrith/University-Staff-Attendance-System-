"use client";

import Link from "next/link";
import { ChevronRight, Gavel, UserCog } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  { id: "add-user-account", label: "Add User Account", icon: UserCog, href: "/Super-Admin/User-Management" },
  { id: "review-disputes", label: "Review Disputes", icon: Gavel, href: "/Super-Admin/Disputes" },
] as const;

/** Shortcut list linking into the other Super Admin sections. */
export function QuickActionsCard() {
  return (
    <SectionCard title="Quick Actions">
      <div className="space-y-2">
        {ACTIONS.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="w-full justify-between"
            nativeButton={false}
            render={
              <Link href={action.href}>
                <span className="flex items-center gap-2">
                  <action.icon className="size-4 text-muted-foreground" /> {action.label}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            }
          />
        ))}
      </div>
    </SectionCard>
  );
}
