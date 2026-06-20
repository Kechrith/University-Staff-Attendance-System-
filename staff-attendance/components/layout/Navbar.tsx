"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell, HelpCircle, LogOut, Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAsyncData } from "@/hooks/use-async-data";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { getRoleConfig, getRoleKey } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

/**
 * Slim top bar: just search + bell / help / profile. The page title, date,
 * and primary actions live in `PageHeader` inside the content area instead.
 * The signed-in user, notifications, and the Settings deep-link are all
 * resolved from the URL's role segment (see `lib/roles.ts`).
 */
export function Navbar({ onSearch }: NavbarProps) {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const hasMounted = useHasMounted();
  const router = useRouter();
  const pathname = usePathname();
  const roleKey = getRoleKey(pathname);
  const role = getRoleConfig(pathname);

  const { data: currentUser } = useAsyncData(role.fetchCurrentUser, [roleKey]);
  const { data: notifications } = useAsyncData(role.fetchNotifications, [roleKey]);
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-blur:bg-background/80 sm:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search staff or records…"
          className="rounded-full pl-9"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          aria-label="Global search"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
                <Bell className="size-4.5" />
                {unreadCount > 0 ? <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-secondary" /> : null}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                {unreadCount > 0 ? <Badge className="bg-primary text-primary-foreground">{unreadCount} new</Badge> : null}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {!notifications || notifications.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2">
                  <span className={cn("text-sm font-medium", !n.read && "text-foreground")}>{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.description}</span>
                  <span className="text-[11px] text-muted-foreground">{n.timestamp}</span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link href="/notifications" className="justify-center text-sm font-medium text-primary">
                  View all notifications
                </Link>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Help"
          onClick={() => toast.message("Help center", { description: "Documentation and support links go here." })}
        >
          <HelpCircle className="size-4.5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 rounded-full px-1.5 sm:px-2" aria-label="Profile menu">
                <Avatar className="size-8">
                  <AvatarImage src={currentUser?.avatar || undefined} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name ? currentUser.name.slice(0, 2) : "—"}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{currentUser?.name || "Account"}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link href={role.settingsHref}>
                  <Settings className="size-4" /> Settings
                </Link>
              }
            />
            <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {hasMounted && resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {hasMounted && resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => router.push("/")}>
              <LogOut className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
