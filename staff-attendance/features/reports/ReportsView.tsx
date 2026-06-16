"use client";

import { useState } from "react";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { AttendanceTrendsCard } from "@/components/reports/AttendanceTrendsCard";
import { LeaveDistributionCard } from "@/components/reports/LeaveDistributionCard";
import { StaffWorkloadIntensityCard } from "@/components/reports/StaffWorkloadIntensityCard";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { RecentReportsTable } from "@/components/reports/RecentReportsTable";
import { ReportsFooterNote } from "@/components/reports/ReportsFooterNote";
import type { ReportRange } from "@/types";

/**
 * Page-level composition for the Reports (Departmental Analytics) page.
 * Unlike the other feature views this one is a Client Component: the
 * Weekly/Monthly/Quarterly toggle lives in the header but drives the
 * Attendance Trends chart below it, so the two need to share `range` state.
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

      <StaffWorkloadIntensityCard />

      <CustomReportBuilder />

      <RecentReportsTable />

      <ReportsFooterNote />
    </div>
  );
}
