"use client";

import { useState } from "react";
import { LecturerLeaveHeader } from "@/components/lecturer/leave/LecturerLeaveHeader";
import { LecturerLeaveSummaryCards } from "@/components/lecturer/leave/LecturerLeaveSummaryCards";
import { LecturerLeaveRequestsTable } from "@/components/lecturer/leave/LecturerLeaveRequestsTable";
import type { LecturerLeaveRequest } from "@/types";

/**
 * Page-level composition for the Lecturer "Leave Requests" page. Client
 * Component: a newly submitted request needs to show up in the history
 * table immediately, so the two share `submittedRequests` state (same
 * lifted-state pattern as the Schedule page's `weekOffset`).
 */
export function LeaveRequestsView() {
  const [submittedRequests, setSubmittedRequests] = useState<LecturerLeaveRequest[]>([]);

  return (
    <div className="space-y-6 pb-10">
      <LecturerLeaveHeader onRequestSubmitted={(request) => setSubmittedRequests((prev) => [request, ...prev])} />

      <LecturerLeaveSummaryCards />

      <LecturerLeaveRequestsTable extraRequests={submittedRequests} />
    </div>
  );
}
