"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BRAND, NAV_ITEMS } from "@/lib/constants";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchCurrentUser } from "@/services/dashboardService";

interface SidebarProps {
  /** Called after a nav item is clicked — used to close the mobile sheet. */
  onNavigate?: () => void;
  className?: string;
}

/**
 * Sidebar navigation shared between the desktop fixed rail and the mobile
 * sheet (see Navbar.tsx). Pure presentational + routing logic only.
 */
export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const { data: currentUser, isLoading } = useAsyncData(fetchCurrentUser);

  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground", className)}>
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{BRAND.name}</p>
          <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
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
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-10 border border-sidebar-border">
                <AvatarImage src={currentUser?.avatar || undefined} alt={currentUser?.name} />
                <AvatarFallback>{currentUser?.name ? currentUser.name.slice(0, 2) : "—"}</AvatarFallback>
              </Avatar>
              {currentUser?.online ? (
                <span
                  className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-sidebar bg-success"
                  aria-label="Online"
                  title="Online"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{currentUser?.name || "—"}</p>
              <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {currentUser?.position || "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
