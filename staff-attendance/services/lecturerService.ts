/**
 * API layer for the Lecturer pages — currently stubbed out (no mock data,
 * no backend wired up yet), mirroring `services/programCoordinatorService.ts`.
 *
 * Every function below keeps its real signature and is still `async`, so
 * the hooks/components that call them don't need to change once a real
 * backend exists. Replace each function body with a real `fetch(...)` call
 * to your API and remove the `delay(...)` wrapper.
 */
import type {
  CurrentUser,
  LecturerAccessSession,
  LecturerAlertPreference,
  LecturerAttendanceRecord,
  LecturerDashboardSummary,
  LecturerLeaveRequest,
  LecturerLeaveSummary,
  LecturerProfile,
  LecturerSecurityItem,
  LecturerTodayClass,
  LecturerWeeklyScheduleGrid,
  LeaveType,
  NotificationItem,
} from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

const SAMPLE_CURRENT_USER: CurrentUser = {
  name: "Ly Sochea",
  position: "Lecturer",
  avatar: "",
  department: "Data Science and Engineering (DSE)",
  online: true,
};

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "ntf-1",
    title: "Dispute under review",
    description: "Your dispute for the Nov 4 DSE-301 session has been escalated to the Program Coordinator.",
    timestamp: "10 minutes ago",
    read: false,
  },
  {
    id: "ntf-2",
    title: "Leave request approved",
    description: "Your Annual Leave request for Oct 12–14 was approved by Hout Bunthoeun.",
    timestamp: "Yesterday",
    read: false,
  },
  {
    id: "ntf-3",
    title: "Weekly schedule updated",
    description: "Your Thu 09:00 slot now shows a Department Meeting in Room A105.",
    timestamp: "2 days ago",
    read: true,
  },
];

const SAMPLE_DASHBOARD_SUMMARY: LecturerDashboardSummary = {
  attendanceRate: 96,
  attendanceRateTrendLabel: "+2% vs last month",
  classesThisMonth: 18,
  classesThisMonthTrendLabel: "+3 vs last month",
  lateCount: 2,
  pendingDisputes: 1,
};

const SAMPLE_TODAYS_CLASSES: LecturerTodayClass[] = [
  {
    id: "today-1",
    course: "DSE-301 Software Engineering for Data Systems",
    classCode: "DSE-301",
    timeSlotLabel: "07:00 – 08:30",
    room: "A201",
    status: "completed",
  },
  {
    id: "today-2",
    course: "DSE-204 Data Structures",
    classCode: "DSE-204",
    timeSlotLabel: "09:00 – 10:30",
    room: "A201",
    status: "ongoing",
  },
  {
    id: "today-3",
    course: "DSE-101 Intro to Data Science",
    classCode: "DSE-101",
    timeSlotLabel: "13:00 – 14:30",
    room: "A105",
    status: "upcoming",
  },
];

const SAMPLE_ATTENDANCE_RECORDS: LecturerAttendanceRecord[] = [
  {
    id: "rec-1",
    date: "2026-11-11",
    course: "DSE-301 Software Engineering for Data Systems",
    classCode: "DSE-301",
    timeSlotLabel: "07:00 – 08:30",
    status: "present",
    lessonSummary: "Covered Chapter 5: Design Patterns — Observer and Strategy. Reviewed Lab 3 submissions.",
    loggedBy: "Prum Sophea",
    disputeStatus: "none",
  },
  {
    id: "rec-2",
    date: "2026-11-10",
    course: "DSE-204 Data Structures",
    classCode: "DSE-204",
    timeSlotLabel: "09:00 – 10:30",
    status: "present",
    lessonSummary: "Covered balanced binary search trees (AVL rotations) with worked examples. Assigned Problem Set 6.",
    loggedBy: "Prum Sophea",
    disputeStatus: "none",
  },
  {
    id: "rec-3",
    date: "2026-11-09",
    course: "DSE-101 Intro to Data Science",
    classCode: "DSE-101",
    timeSlotLabel: "13:00 – 14:30",
    status: "late",
    lessonSummary: "Covered exploratory data analysis with pandas: filtering, grouping, and merging datasets. Session started 10 minutes late due to a room change.",
    loggedBy: "Prum Sophea",
    disputeStatus: "none",
  },
  {
    id: "rec-4",
    date: "2026-11-06",
    course: "DSE-301 Software Engineering for Data Systems",
    classCode: "DSE-301",
    timeSlotLabel: "07:00 – 08:30",
    status: "present",
    lessonSummary: "Introduced SOLID principles with a refactoring exercise on the Lab 2 codebase.",
    loggedBy: "Prum Sophea",
    disputeStatus: "none",
  },
  {
    id: "rec-5",
    date: "2026-11-04",
    course: "DSE-301 Software Engineering for Data Systems",
    classCode: "DSE-301",
    timeSlotLabel: "07:00 – 08:30",
    status: "absent",
    lessonSummary: "No lesson summary recorded.",
    loggedBy: "Prum Sophea",
    disputeStatus: "flagged",
    disputeReason:
      "I was in class and taught the full session — Chapter 4: Design Patterns (Singleton and Factory). The Class Monitor's log for this session appears to be a mistake.",
  },
];

const SAMPLE_WEEKLY_SCHEDULE_GRID: LecturerWeeklyScheduleGrid = {
  weekRangeLabel: "Nov 2 – Nov 6, 2026",
  timeSlots: ["07:00 – 08:30", "09:00 – 10:30", "13:00 – 14:30"],
  slots: [
    { id: "slot-1", day: "Mon", time: "07:00 – 08:30", title: "DSE-301 Software Engineering for Data Systems", subtitle: "Room A201", status: "class" },
    { id: "slot-2", day: "Mon", time: "13:00 – 14:30", title: "Office Hours", subtitle: "Room A105", status: "office-hours" },
    { id: "slot-3", day: "Tue", time: "09:00 – 10:30", title: "DSE-204 Data Structures", subtitle: "Room A201", status: "class" },
    { id: "slot-4", day: "Wed", time: "07:00 – 08:30", title: "DSE-301 Software Engineering for Data Systems", subtitle: "Room A201", status: "class" },
    { id: "slot-5", day: "Wed", time: "13:00 – 14:30", title: "DSE-101 Intro to Data Science", subtitle: "Room A105", status: "class" },
    { id: "slot-6", day: "Thu", time: "09:00 – 10:30", title: "Department Meeting", subtitle: "Room A105", status: "meeting" },
    { id: "slot-7", day: "Fri", time: "07:00 – 08:30", title: "Office Hours", subtitle: "Room A105", status: "office-hours" },
  ],
};

const SAMPLE_PROFILE: LecturerProfile = {
  fullName: "Ly Sochea",
  position: "Lecturer",
  department: "Data Science and Engineering",
  universityEmail: "sochea.ly@rupp.edu.kh",
  employeeId: "EMP-2019-0143",
  phone: "+855 12 345 678",
  bio: "Lecturer in the Department of Data Science and Engineering, Faculty of Engineering, specializing in software engineering and data systems. Teaching DSE-301, DSE-204, and DSE-101 for Semester 1, 2026–2027.",
};

const SAMPLE_ACCESS_SESSION: LecturerAccessSession = {
  lastLoginLabel: "Today, 7:42 AM",
  notifyOnNewEntry: true,
};

const SAMPLE_ALERT_PREFERENCES: LecturerAlertPreference[] = [
  {
    id: "new-entry",
    title: "New Attendance Entry",
    description: "Get notified when a Class Monitor logs a new attendance record for your classes.",
  },
  {
    id: "dispute-update",
    title: "Dispute Status Updates",
    description: "Get notified when a flagged entry is reviewed or resolved.",
  },
  {
    id: "leave-decision",
    title: "Leave Request Decisions",
    description: "Get notified when your leave request is approved or rejected.",
  },
  {
    id: "schedule-change",
    title: "Schedule Changes",
    description: "Get notified when your weekly teaching schedule is updated.",
  },
];

const SAMPLE_SECURITY_ITEMS: LecturerSecurityItem[] = [
  {
    id: "password",
    title: "Change Password",
    description: "Last changed 3 months ago.",
    actionLabel: "Update password",
  },
  {
    id: "2fa",
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account.",
    actionLabel: "Enable 2FA",
  },
  {
    id: "login-history",
    title: "Login History",
    description: "Review recent sign-ins to your account.",
    actionLabel: "View history",
  },
];

const SAMPLE_LEAVE_SUMMARY: LecturerLeaveSummary = {
  remainingDays: 11,
  usedDays: 7,
  pendingCount: 1,
  approvedThisYear: 3,
};

const SAMPLE_LEAVE_REQUESTS: LecturerLeaveRequest[] = [
  {
    id: "lv-1",
    leaveType: "Sick Leave",
    startDate: "2026-11-17",
    endDate: "2026-11-17",
    duration: "1 day",
    reason: "Fever and flu symptoms; doctor recommended rest.",
    status: "pending",
    requestedAt: "2026-11-15T09:20:00",
  },
  {
    id: "lv-2",
    leaveType: "Annual Leave",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    duration: "3 days",
    reason: "Family event out of town.",
    status: "approved",
    requestedAt: "2026-09-28T14:00:00",
  },
  {
    id: "lv-3",
    leaveType: "Research",
    startDate: "2026-09-02",
    endDate: "2026-09-03",
    duration: "2 days",
    reason: "Presenting a paper at the ICT Research Symposium in Phnom Penh.",
    status: "approved",
    requestedAt: "2026-08-20T11:15:00",
  },
  {
    id: "lv-4",
    leaveType: "Emergency Leave",
    startDate: "2026-08-05",
    endDate: "2026-08-05",
    duration: "1 day",
    reason: "Family emergency requiring immediate travel.",
    status: "rejected",
    requestedAt: "2026-08-04T18:30:00",
  },
  {
    id: "lv-5",
    leaveType: "Unpaid Leave",
    startDate: "2026-06-15",
    endDate: "2026-06-16",
    duration: "2 days",
    reason: "Personal matters.",
    status: "approved",
    requestedAt: "2026-06-10T08:00:00",
  },
];

// TODO: replace with `fetch('/api/lecturer/me')`
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(SAMPLE_CURRENT_USER);
}

// TODO: replace with `fetch('/api/lecturer/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay(SAMPLE_NOTIFICATIONS);
}

// TODO: replace with `fetch('/api/lecturer/dashboard-summary')`
export async function fetchLecturerDashboardSummary(): Promise<LecturerDashboardSummary> {
  return delay(SAMPLE_DASHBOARD_SUMMARY);
}

// TODO: replace with `fetch('/api/lecturer/todays-classes')`
export async function fetchTodaysClasses(): Promise<LecturerTodayClass[]> {
  return delay(SAMPLE_TODAYS_CLASSES);
}

// TODO: replace with `fetch('/api/lecturer/attendance-records')`
export async function fetchLecturerAttendanceRecords(): Promise<LecturerAttendanceRecord[]> {
  return delay(SAMPLE_ATTENDANCE_RECORDS);
}

// TODO: replace with `fetch(`/api/lecturer/schedule-grid?week=${weekOffset}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchLecturerWeeklyScheduleGrid(weekOffset = 0): Promise<LecturerWeeklyScheduleGrid> {
  return delay(SAMPLE_WEEKLY_SCHEDULE_GRID);
}

// TODO: replace with `fetch('/api/lecturer/profile')`
export async function fetchLecturerProfile(): Promise<LecturerProfile> {
  return delay(SAMPLE_PROFILE);
}

// TODO: replace with `fetch('/api/lecturer/access-session')`
export async function fetchLecturerAccessSession(): Promise<LecturerAccessSession> {
  return delay(SAMPLE_ACCESS_SESSION);
}

// TODO: replace with `fetch('/api/lecturer/alert-preferences')`
export async function fetchLecturerAlertPreferences(): Promise<LecturerAlertPreference[]> {
  return delay(SAMPLE_ALERT_PREFERENCES);
}

// TODO: replace with `fetch('/api/lecturer/security')`
export async function fetchLecturerSecurityItems(): Promise<LecturerSecurityItem[]> {
  return delay(SAMPLE_SECURITY_ITEMS);
}

// TODO: replace with `fetch('/api/lecturer/attendance-records/:id/dispute', { method: 'POST', body: reason })`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function submitDispute(recordId: string, reason: string): Promise<void> {
  await delay(undefined, 400);
}

// TODO: replace with `fetch('/api/lecturer/leave/summary')`
export async function fetchLecturerLeaveSummary(): Promise<LecturerLeaveSummary> {
  return delay(SAMPLE_LEAVE_SUMMARY);
}

// TODO: replace with `fetch('/api/lecturer/leave/requests')`
export async function fetchLecturerLeaveRequests(): Promise<LecturerLeaveRequest[]> {
  return delay(SAMPLE_LEAVE_REQUESTS);
}

export interface LeaveRequestPayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

// TODO: replace with `fetch('/api/lecturer/leave/requests', { method: 'POST', body: payload })`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function submitLeaveRequest(payload: LeaveRequestPayload): Promise<void> {
  await delay(undefined, 400);
}
