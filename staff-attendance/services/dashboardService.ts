/**
 * API layer — currently stubbed out (no mock data, no backend wired up yet).
 *
 * Every function below keeps its real signature and is still `async`, so
 * the hooks/components that call them don't need to change once a real
 * backend exists. Replace each function body with a real `fetch(...)` call
 * to your API and remove the `delay(...)` wrapper.
 */
import type {
  AttendanceRecord,
  CurrentUser,
  DashboardSummary,
  LeaveRequest,
  NotificationItem,
  PerformanceOverview,
  ScheduleEvent,
  Staff,
  WeeklyTrendDatum,
  ActivityItem,
  AttendanceTrendDatum,
  DepartmentAttendanceDatum,
  LeaveTypeDatum,
  MonthlyAttendanceDatum,
} from "@/types";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

export type AttendanceRange = "7d" | "1m" | "1y";

// Department roster (6 people): Hout Bunthoeun (Department Head), Chan Pisey
// (Program Coordinator), Ly Sochea & Vann Kimheng (Lecturers), Prum Sophea &
// Meas Ratana (Class Monitors) — all under the Department of Data Science
// and Engineering, Faculty of Engineering.

const SAMPLE_SUMMARY: DashboardSummary = {
  totalStaff: 6,
  totalStaffGrowth: 1,
  presentToday: 4,
  presentPercentage: 66.7,
  onLeave: 1,
  pendingLeave: 1,
  lateArrivals: 1,
  lateArrivalsAlert: false,
};

const SAMPLE_CURRENT_USER: CurrentUser = {
  name: "Hout Bunthoeun",
  position: "Department Head, Data Science and Engineering",
  avatar: "https://i.pravatar.cc/150?u=hout.bunthoeun",
  department: "Data Science and Engineering (DSE)",
  online: true,
};

const SAMPLE_PERFORMANCE_OVERVIEW: PerformanceOverview = {
  bestAttendanceStaff: { name: "Ly Sochea", avatar: "https://i.pravatar.cc/150?u=ly.sochea", rate: 98 },
  mostLateStaff: { name: "Meas Ratana", avatar: "https://i.pravatar.cc/150?u=meas.ratana", lateCount: 3 },
  departmentAttendanceRate: 91,
  averageCheckInTime: "8:04 AM",
};

// TODO: replace with `fetch('/api/dashboard/summary')`
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return delay(SAMPLE_SUMMARY);
}

// TODO: replace with `fetch(`/api/attendance/weekly?range=${range}`)`
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site/type compatibility until wired up
export async function fetchWeeklyAttendance(range: AttendanceRange = "7d"): Promise<WeeklyTrendDatum[]> {
  return delay([
    { day: "Mon", value: 5, isWorkingDay: true },
    { day: "Tue", value: 4, isWorkingDay: true },
    { day: "Wed", value: 6, isWorkingDay: true },
    { day: "Thu", value: 5, isWorkingDay: true },
    { day: "Fri", value: 4, isWorkingDay: true },
    { day: "Sat", value: 6, isWorkingDay: false },
    { day: "Sun", value: 6, isWorkingDay: false },
  ]);
}

// TODO: replace with `fetch('/api/leave-requests')`
export async function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  return delay([
    {
      id: "lr-1",
      staffId: "stf-2",
      staffName: "Vann Kimheng",
      employeeId: "EMP-1042",
      avatar: "https://i.pravatar.cc/150?u=vann.kimheng",
      position: "Lecturer, Data Science and Engineering",
      leaveType: "Sick Leave",
      startDate: "2026-07-18",
      endDate: "2026-07-19",
      duration: "2 days",
      reason: "Flu and fever, doctor advised rest.",
      status: "pending",
      requestedAt: "2026-07-16T08:30:00+07:00",
    },
    {
      id: "lr-2",
      staffId: "stf-1",
      staffName: "Ly Sochea",
      employeeId: "EMP-1010",
      avatar: "https://i.pravatar.cc/150?u=ly.sochea",
      position: "Lecturer, Data Science and Engineering",
      leaveType: "Research",
      startDate: "2026-07-10",
      endDate: "2026-07-12",
      duration: "3 days",
      reason: "Presenting a paper at a regional conference.",
      status: "approved",
      requestedAt: "2026-07-05T09:00:00+07:00",
    },
  ]);
}

// TODO: replace with `fetch('/api/attendance/today')`
export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  return delay([
    {
      id: "att-1",
      staffId: "stf-1",
      staffName: "Ly Sochea",
      employeeId: "EMP-1010",
      avatar: "https://i.pravatar.cc/150?u=ly.sochea",
      position: "Lecturer, Data Science and Engineering",
      checkIn: "07:52 AM",
      checkOut: "04:30 PM",
      workingHours: "8h 38m",
      status: "present",
      date: "2026-07-16",
    },
    {
      id: "att-2",
      staffId: "stf-4",
      staffName: "Meas Ratana",
      employeeId: "EMP-1077",
      avatar: "https://i.pravatar.cc/150?u=meas.ratana",
      position: "Class Monitor, Data Science and Engineering",
      checkIn: "08:14 AM",
      checkOut: "04:45 PM",
      workingHours: "8h 31m",
      status: "late",
      date: "2026-07-16",
      lateMinutes: 14,
    },
    {
      id: "att-3",
      staffId: "stf-2",
      staffName: "Vann Kimheng",
      employeeId: "EMP-1042",
      avatar: "https://i.pravatar.cc/150?u=vann.kimheng",
      position: "Lecturer, Data Science and Engineering",
      checkIn: null,
      checkOut: null,
      workingHours: "—",
      status: "leave",
      date: "2026-07-16",
    },
    {
      id: "att-4",
      staffId: "stf-3",
      staffName: "Prum Sophea",
      employeeId: "EMP-1091",
      avatar: "https://i.pravatar.cc/150?u=prum.sophea",
      position: "Class Monitor, Data Science and Engineering",
      checkIn: "07:48 AM",
      checkOut: "04:20 PM",
      workingHours: "8h 32m",
      status: "present",
      date: "2026-07-16",
    },
  ]);
}

// TODO: replace with `fetch('/api/staff')`
export async function fetchStaffList(): Promise<Staff[]> {
  return delay([
    {
      id: "stf-1",
      employeeId: "EMP-1010",
      name: "Ly Sochea",
      avatar: "https://i.pravatar.cc/150?u=ly.sochea",
      position: "Lecturer",
      department: "Department of Data Science and Engineering",
      email: "sochea.ly@rupp.edu.kh",
      phone: "012 345 678",
      joinedAt: "2019-09-02",
      status: "active",
    },
    {
      id: "stf-2",
      employeeId: "EMP-1042",
      name: "Vann Kimheng",
      avatar: "https://i.pravatar.cc/150?u=vann.kimheng",
      position: "Lecturer",
      department: "Department of Data Science and Engineering",
      email: "kimheng.vann@rupp.edu.kh",
      phone: "017 223 344",
      joinedAt: "2020-01-13",
      status: "active",
    },
    {
      id: "stf-3",
      employeeId: "EMP-1091",
      name: "Prum Sophea",
      avatar: "https://i.pravatar.cc/150?u=prum.sophea",
      position: "Class Monitor",
      department: "Department of Data Science and Engineering",
      email: "sophea.prum@rupp.edu.kh",
      phone: "011 998 776",
      joinedAt: "2023-08-21",
      status: "active",
    },
    {
      id: "stf-6",
      employeeId: "EMP-1099",
      name: "Hout Bunthoeun",
      avatar: "https://i.pravatar.cc/150?u=hout.bunthoeun",
      position: "Department Head",
      department: "Department of Data Science and Engineering",
      email: "bunthoeun.hout@rupp.edu.kh",
      phone: "016 554 332",
      joinedAt: "2015-10-05",
      status: "active",
    },
  ]);
}

// TODO: replace with `fetch('/api/analytics')`
export async function fetchAnalytics(): Promise<{
  attendanceTrend: AttendanceTrendDatum[];
  departmentAttendance: DepartmentAttendanceDatum[];
  leaveTypeBreakdown: LeaveTypeDatum[];
  monthlyAttendance: MonthlyAttendanceDatum[];
}> {
  return delay({
    attendanceTrend: [
      { label: "Week 1", attendanceRate: 92 },
      { label: "Week 2", attendanceRate: 89 },
      { label: "Week 3", attendanceRate: 94 },
      { label: "Week 4", attendanceRate: 91 },
    ],
    // Single-department app now — this breaks down attendance by staff
    // category within Data Science and Engineering instead of comparing
    // across departments.
    departmentAttendance: [
      { department: "Lecturers", value: 94, color: "#2563eb" },
      { department: "Class Monitors", value: 89, color: "#16a34a" },
      { department: "Coordination", value: 92, color: "#f59e0b" },
    ],
    leaveTypeBreakdown: [
      { type: "Sick Leave", value: 2, color: "#ef4444" },
      { type: "Annual Leave", value: 3, color: "#3b82f6" },
      { type: "Research", value: 1, color: "#8b5cf6" },
    ],
    monthlyAttendance: [
      { month: "Apr", attendance: 88 },
      { month: "May", attendance: 93 },
      { month: "Jun", attendance: 92 },
      { month: "Jul", attendance: 94 },
    ],
  });
}

// TODO: replace with `fetch('/api/schedule')`
export async function fetchScheduleEvents(): Promise<ScheduleEvent[]> {
  return delay([
    {
      id: "sch-1",
      title: "DSE-301 Software Engineering for Data Systems",
      type: "class",
      time: "08:00 AM - 09:30 AM",
      date: "2026-07-17",
      location: "Room A201",
      priority: "medium",
    },
    {
      id: "sch-2",
      title: "Department Staff Meeting",
      type: "meeting",
      time: "02:00 PM - 03:00 PM",
      date: "2026-07-17",
      location: "Room A105",
      priority: "high",
    },
    {
      id: "sch-3",
      title: "Mid-term Grade Submission Deadline",
      type: "deadline",
      time: "05:00 PM",
      date: "2026-07-20",
      location: "Online",
      priority: "high",
    },
  ]);
}

// TODO: replace with `fetch('/api/activity')`
export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  return delay([
    {
      id: "act-1",
      type: "check-in",
      message: "checked in for DSE-301 Software Engineering for Data Systems",
      actor: "Ly Sochea",
      avatar: "https://i.pravatar.cc/150?u=ly.sochea",
      timestamp: "2026-07-16T07:52:00+07:00",
    },
    {
      id: "act-2",
      type: "leave-approved",
      message: "approved a Research leave request",
      actor: "Hout Bunthoeun",
      avatar: "https://i.pravatar.cc/150?u=hout.bunthoeun",
      timestamp: "2026-07-15T16:20:00+07:00",
    },
    {
      id: "act-3",
      type: "report-generated",
      message: "generated the June attendance report",
      actor: "Hout Bunthoeun",
      avatar: "https://i.pravatar.cc/150?u=hout.bunthoeun",
      timestamp: "2026-07-14T09:40:00+07:00",
    },
  ]);
}

// TODO: replace with `fetch('/api/performance-overview')`
export async function fetchPerformanceOverview(): Promise<PerformanceOverview> {
  return delay(SAMPLE_PERFORMANCE_OVERVIEW);
}

// TODO: replace with `fetch('/api/me')` (the authenticated department head)
export async function fetchCurrentUser(): Promise<CurrentUser> {
  return delay(SAMPLE_CURRENT_USER);
}

// TODO: replace with `fetch('/api/notifications')`
export async function fetchNotifications(): Promise<NotificationItem[]> {
  return delay([
    {
      id: "notif-1",
      title: "New leave request",
      description: "Vann Kimheng requested 2 days of Sick Leave.",
      timestamp: "2026-07-16T08:30:00+07:00",
      read: false,
    },
    {
      id: "notif-2",
      title: "Late arrival flagged",
      description: "Meas Ratana checked in 14 minutes late today.",
      timestamp: "2026-07-16T08:15:00+07:00",
      read: false,
    },
    {
      id: "notif-3",
      title: "Report ready",
      description: "The June departmental attendance report has been generated.",
      timestamp: "2026-07-14T09:40:00+07:00",
      read: true,
    },
  ]);
}
