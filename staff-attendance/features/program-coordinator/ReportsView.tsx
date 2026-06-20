"use client";

import { useState } from "react";
import { CoordinatorReportsHeader, type ReportsTab } from "@/components/program-coordinator/reports/CoordinatorReportsHeader";
import { CoordinatorKpiCards } from "@/components/program-coordinator/reports/CoordinatorKpiCards";
import { AcademicPerformanceTrendChart } from "@/components/program-coordinator/reports/AcademicPerformanceTrendChart";
import { LecturerAdherenceList } from "@/components/program-coordinator/reports/LecturerAdherenceList";
import { WeeklyAttendanceBreakdownTable } from "@/components/program-coordinator/reports/WeeklyAttendanceBreakdownTable";

/**
 * Page-level composition for the Program Coordinator Reports page. Client
 * Component: the Overview/Academic Analytics/Staff Efficiency tabs live in
 * the header (display-only for now — every tab currently shows the same
 * Academic Analytics content, matching the reference mockup).
 */
export function ReportsView() {
  const [tab, setTab] = useState<ReportsTab>("academic-analytics");

  return (
    <div className="space-y-6 pb-10">
      <CoordinatorReportsHeader tab={tab} onTabChange={setTab} />

      <CoordinatorKpiCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AcademicPerformanceTrendChart />
        </div>
        <LecturerAdherenceList />
      </div>

      <WeeklyAttendanceBreakdownTable />
    </div>
  );
}
