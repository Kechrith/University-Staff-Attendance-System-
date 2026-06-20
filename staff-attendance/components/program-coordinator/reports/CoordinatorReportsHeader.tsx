"use client";

import { toast } from "sonner";
import { Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ReportsTab = "overview" | "academic-analytics" | "staff-efficiency";

const TABS: { value: ReportsTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "academic-analytics", label: "Academic Analytics" },
  { value: "staff-efficiency", label: "Staff Efficiency" },
];

interface CoordinatorReportsHeaderProps {
  tab: ReportsTab;
  onTabChange: (tab: ReportsTab) => void;
}

/** Hero section: title, the Overview/Academic Analytics/Staff Efficiency tabs, and export/filter actions. */
export function CoordinatorReportsHeader({ tab, onTabChange }: CoordinatorReportsHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Program Performance Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comprehensive analytics for your managed programs.</p>

        <Tabs value={tab} onValueChange={(value) => onTabChange(value as ReportsTab)} className="mt-3">
          <TabsList variant="line" className="h-auto border-b border-border/60 pb-px">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-3 py-2 text-sm">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => toast.message("Custom filter", { description: "Available once report filtering is connected." })}
        >
          <SlidersHorizontal className="size-4" /> Custom Filter
        </Button>
        <Button onClick={() => toast.success("Export started", { description: "Preparing your PDF…" })}>
          <Download className="size-4" /> Export PDF
        </Button>
      </div>
    </div>
  );
}
