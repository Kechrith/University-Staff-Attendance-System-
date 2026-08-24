"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import { useAsyncData } from "@/hooks/use-async-data";
import { getRoleConfig, getRoleKey } from "@/lib/roles";

interface SidebarProps {
  /** Called after a nav item is clicked — used to close the mobile sheet. */
  onNavigate?: () => void;
  className?: string;
}

/**
 * Sidebar navigation shared between the desktop fixed rail and the mobile
 * sheet (see Navbar.tsx). Pure presentational + routing logic only. Nav
 * items and the signed-in user are resolved from the URL's role segment
 * (see `lib/roles.ts`) so the same component serves every role's pages.
 */
export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const roleKey = getRoleKey(pathname);
  const role = getRoleConfig(pathname);
  const { data: currentUser } = useAsyncData(role.fetchCurrentUser, [roleKey]);

  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground", className)}>
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- static svg logo, no benefit from next/image's optimizer */}
        <img src="/logo/rupp_logo.svg" alt={`${BRAND.name} seal`} className="h-14 w-14 shrink-0" />
        <div className="flex min-w-0 flex-col gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- static svg wordmark, no benefit from next/image's optimizer */}
          <img src="/logo/word-rupp.svg" alt="Royal University of Phnom Penh" className="h-7 w-auto" />
          {role.key !== "Super-Admin" && currentUser?.department ? (
            <span className="truncate text-[11px] text-sidebar-foreground/60">{currentUser.department}</span>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Main navigation">
        {role.navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <Button
          className="w-full justify-start gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            onNavigate?.();
            router.push("/");
          }}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
