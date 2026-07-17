"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { fetchDepartmentSectors } from "@/services/reportsService";

/** Centered form for configuring and exporting an ad-hoc report. */
export function CustomReportBuilder() {
  const { data: sectors, isLoading } = useAsyncData(fetchDepartmentSectors);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sector, setSector] = useState("all");

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="space-y-6 text-center">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Custom Report Builder</h2>
          <p className="mt-1 text-sm text-muted-foreground">Configure parameters to generate specialized data exports</p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="report-start-date">Date Range</Label>
            <div className="flex items-center gap-2">
              <Input
                id="report-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Start date"
              />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="End date" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-sector">Department Sector</Label>
            {isLoading || !sectors ? (
              <Skeleton className="h-8 w-full rounded-lg" />
            ) : (
              <Select value={sector} onValueChange={(value) => setSector(value ?? "all")}>
                <SelectTrigger id="report-sector" className="w-full" aria-label="Department sector">
                  <SelectValue>{(value: string) => (value === "all" ? "All Sectors" : value)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => toast.message("Preview Excel", { description: "Available once report generation is connected." })}
          >
            <FileSpreadsheet className="size-4" /> Preview Excel
          </Button>
          <Button onClick={() => toast.success("Generating PDF document", { description: "Your report will be ready shortly." })}>
            <FileText className="size-4" /> Generate PDF Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
