import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Top-level dashboard frame: a fixed sidebar on desktop (lg+) and a
 * sticky navbar above the scrollable content area. The sidebar collapses
 * into a Sheet on smaller screens (handled inside Navbar).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand accent strip, always pinned above the rest of the chrome. */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-primary" aria-hidden="true" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border lg:flex">
        <Sidebar className="w-72" />
      </aside>

      <div className="flex min-h-screen w-full flex-1 flex-col lg:ml-72">
        <Navbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
