"use client";

import { useState } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { AttendanceTrendsCard } from "@/components/reports/AttendanceTrendsCard";
import { LeaveDistributionCard } from "@/components/reports/LeaveDistributionCard";
import { RecentReportsTable } from "@/components/reports/RecentReportsTable";
import { ReportsFooterNote } from "@/components/reports/ReportsFooterNote";
import type { ReportRange } from "@/types";

/**
 * Page-level composition for the Reports (Departmental Analytics) page.
 * Unlike the other feature views this one is a Client Component: the
 * Weekly/Monthly/Quarterly toggle lives in the header but drives the
 * Attendance Trends chart below it, so the two need to share `range` state.
 *
 * Kept to 3 major sections (trends+leave row, recent reports, footer) for a
 * small single-department roster — the workload-intensity heatmap and
 * custom report builder were dropped as redundant/low-value clutter (the
 * Schedule page's Staff Workload Finder already covers per-person workload,
 * and the header's "Export Detailed Report" plus the footer's "New Report"
 * action already cover ad-hoc export).
 */
export function ReportsView() {
  const [range, setRange] = useState<ReportRange>("weekly");

  return (
    <div className="space-y-6 pb-10">
      <ReportsHeader range={range} onRangeChange={setRange} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AttendanceTrendsCard range={range} />
        </div>
        <LeaveDistributionCard />
      </div>

      <RecentReportsTable />

      <ReportsFooterNote />
    </div>
  );
}
