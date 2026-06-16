"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchReportsOverview } from "@/services/reportsService";
import type { ReportRange } from "@/types";

const RANGE_OPTIONS: { value: ReportRange; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

interface ReportsHeaderProps {
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
}

/** Hero section at the top of the Reports page: title, term subtitle, range toggle, and the primary export action. */
export function ReportsHeader({ range, onRangeChange }: ReportsHeaderProps) {
  const { data, isLoading } = useAsyncData(fetchReportsOverview);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Departmental Analytics</h1>
        {isLoading || !data ? (
          <Skeleton className="mt-1.5 h-4 w-64" />
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">{data.termLabel}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={range} onValueChange={(value) => onRangeChange(value as ReportRange)}>
          <TabsList className="rounded-full bg-muted p-1">
            {RANGE_OPTIONS.map((opt) => (
              <TabsTrigger
                key={opt.value}
                value={opt.value}
                className="rounded-full px-4 data-active:bg-primary data-active:text-primary-foreground"
              >
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Button onClick={() => toast.success("Export started", { description: "Preparing your detailed report…" })}>
          <Download className="size-4" /> Export Detailed Report
        </Button>
      </div>
    </div>
  );
}
