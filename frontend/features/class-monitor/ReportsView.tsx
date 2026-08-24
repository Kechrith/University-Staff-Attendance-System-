import { MonitorReportsHeader } from "@/components/class-monitor/reports/MonitorReportsHeader";
import { MonitorKpiCards } from "@/components/class-monitor/reports/MonitorKpiCards";
import { PerformanceTrendChart } from "@/components/class-monitor/reports/PerformanceTrendChart";
import { ErrorDistributionCard } from "@/components/class-monitor/reports/ErrorDistributionCard";
import { DepartmentalCoverageTable } from "@/components/class-monitor/reports/DepartmentalCoverageTable";

/**
 * Page-level composition for the Class Monitor Reports page: header, KPI
 * row, the performance trend chart paired with the error-distribution
 * panel, and the departmental coverage table.
 */
export function ReportsView() {
  return (
    <div className="space-y-6 pb-10">
      <MonitorReportsHeader />

      <MonitorKpiCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PerformanceTrendChart />
        </div>
        <ErrorDistributionCard />
      </div>

      <DepartmentalCoverageTable />
    </div>
  );
}
