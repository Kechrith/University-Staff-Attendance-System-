/**
 * Shared domain types for the Department Head Dashboard.
 * Kept framework-agnostic so they can be reused by services, hooks, and UI.
 */

export type AttendanceStatus = "present" | "late" | "absent" | "leave";

export type LeaveType = "Sick Leave" | "Annual Leave" | "Maternity Leave" | "Emergency Leave" | "Unpaid Leave" | "Research";

export type Priority = "high" | "medium" | "low";

export type ScheduleEventType = "meeting" | "class" | "event" | "deadline";

export type ActivityType =
  | "check-in"
  | "check-out"
  | "leave-approved"
  | "leave-rejected"
  | "attendance-updated"
  | "report-generated"
  | "staff-added";

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: "active" | "inactive";
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  employeeId: string;
  avatar: string;
  position: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string;
  status: AttendanceStatus;
  date: string;
  /** Minutes late, only meaningful when `status === "late"`. */
  lateMinutes?: number;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  employeeId: string;
  avatar: string;
  position: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  /** ISO timestamp; rendered as a relative label like "2 hours ago". */
  requestedAt: string;
}

/** Avatar shown in the "Currently on Leave" strip on the Leave Management page. */
export interface CurrentlyOnLeaveStaff {
  id: string;
  name: string;
  avatar: string;
}

/** Summary cards + roster on the Leave Management page. */
export interface LeaveManagementSummary {
  staffOnLeaveToday: number;
  pendingApprovalCount: number;
  currentlyOnLeave: CurrentlyOnLeaveStaff[];
}

export interface WeeklyTrendDatum {
  day: string;
  /** Present-staff count for working days; total roster size for non-working days. */
  value: number;
  isWorkingDay: boolean;
}

export interface AttendanceTrendDatum {
  label: string;
  attendanceRate: number;
}

export interface DepartmentAttendanceDatum {
  department: string;
  value: number;
  color: string;
}

export interface LeaveTypeDatum {
  type: LeaveType;
  value: number;
  color: string;
}

export interface MonthlyAttendanceDatum {
  month: string;
  attendance: number;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: ScheduleEventType;
  time: string;
  date: string;
  location: string;
  priority: Priority;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  actor: string;
  avatar: string;
  timestamp: string;
}

export interface PerformanceOverview {
  bestAttendanceStaff: { name: string; avatar: string; rate: number };
  mostLateStaff: { name: string; avatar: string; lateCount: number };
  departmentAttendanceRate: number;
  averageCheckInTime: string;
}

export interface DashboardSummary {
  totalStaff: number;
  totalStaffGrowth: number;
  presentToday: number;
  presentPercentage: number;
  onLeave: number;
  pendingLeave: number;
  lateArrivals: number;
  lateArrivalsAlert: boolean;
}

/** The signed-in department head, shown in the sidebar and navbar profile menu. */
export interface CurrentUser {
  name: string;
  position: string;
  avatar: string;
  department: string;
  online: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

/** Summary cards on the Attendance overview page. */
export interface AttendanceOverviewSummary {
  totalStaff: number;
  totalStaffTrend: number;
  presentToday: number;
  presentRate: number;
  lateArrivals: number;
  lateIsHighPriority: boolean;
  absentToday: number;
  absentTrend: number;
}

export interface StatusDistributionDatum {
  status: AttendanceStatus;
  percentage: number;
}

/**
 * Domain types for the Department Schedule page: room availability, the
 * weekly class grid, the unassigned-classes queue, and the staff workload
 * finder.
 */

export type RoomStatus = "occupied" | "available";

export interface RoomAvailability {
  id: string;
  /** e.g. "Room 301 (A-Block)" */
  name: string;
  /** e.g. "Capacity: 45 students" */
  capacityLabel: string;
  status: RoomStatus;
}

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type WeeklyScheduleSlotStatus = "class" | "meeting" | "unassigned";

export interface WeeklyScheduleSlot {
  id: string;
  day: WeekDay;
  /** Must match one of the grid's `timeSlots`, e.g. "08:00 AM". */
  time: string;
  title: string;
  /** e.g. "Dr. Sovan • R301" */
  subtitle: string;
  status: WeeklyScheduleSlotStatus;
}

export interface WeeklyScheduleGrid {
  /** e.g. "Oct 23 - 29, 2023" */
  weekRangeLabel: string;
  timeSlots: string[];
  slots: WeeklyScheduleSlot[];
}

export type UnassignedClassCategory = "general" | "language" | "science";

export interface UnassignedClass {
  id: string;
  /** e.g. "CS401: Advanced Algorithms" */
  courseLabel: string;
  /** e.g. "Thursdays, 1:30 PM - 3:30 PM" */
  scheduleLabel: string;
  category: UnassignedClassCategory;
}

export type StaffPresence = "online" | "away" | "offline";

export interface StaffWorkload {
  id: string;
  name: string;
  avatar: string;
  /** e.g. "ML" or "NoSQL" — short department/subject code */
  departmentCode: string;
  hoursPerWeek: number;
  /** 0-100, drives the workload bar fill. */
  workloadPercent: number;
  presence: StaffPresence;
}

export interface ScheduleOverview {
  /** e.g. "Semester II, Academic Year 2023-2024" */
  termLabel: string;
  /** e.g. "Today, 09:42 AM" */
  lastUpdatedLabel: string;
  unassignedCriticalCount: number;
}

/**
 * Domain types for the Reports (Departmental Analytics) page: the
 * attendance trend chart, the leave distribution donut, the staff workload
 * heatmap, the custom report builder, and the recent-reports list.
 */

export type ReportRange = "weekly" | "monthly" | "quarterly";

export interface ReportsOverview {
  /** e.g. "Comprehensive reporting for Academic Year 2023-2024" */
  termLabel: string;
}

export interface AttendanceTrendPoint {
  /** Day/week/month label, depending on the selected `ReportRange`. */
  label: string;
  present: number;
  late: number;
}

export type LeaveDistributionCategory = "Medical" | "Personal" | "Other";

export interface LeaveDistributionSlice {
  category: LeaveDistributionCategory;
  percentage: number;
  color: string;
}

export interface LeaveDistributionSummary {
  totalPending: number;
  breakdown: LeaveDistributionSlice[];
}

export interface WorkloadIntensityCell {
  id: string;
  /** 0-100; drives the heatmap shade from "Low Intensity" to "Overloaded". */
  intensity: number;
}

export interface WorkloadIntensityGrid {
  columns: number;
  cells: WorkloadIntensityCell[];
}

export type ReportFormat = "PDF" | "Excel";

export interface GeneratedReport {
  id: string;
  name: string;
  dateGeneratedLabel: string;
  format: ReportFormat;
}

/**
 * Domain types for the Department Settings page: profile, attendance
 * policy, leave approval rules, and the department staff roster.
 */

export interface DepartmentProfile {
  departmentName: string;
  deptCode: string;
  establishedYear: string;
  /** Object URL or remote URL of the uploaded signature image, if any. */
  signatureUrl: string | null;
}

export type GracePeriodMode = "fixed" | "class-specific";

export interface AttendancePolicy {
  /** 0-60 */
  lateThresholdMinutes: number;
  gracePeriodMode: GracePeriodMode;
}

export interface LeaveApprovalRules {
  autoApprovePersonalLeave: boolean;
  mandatoryMedicalDocumentation: boolean;
  /** e.g. "Direct to Department Head" */
  escalationHierarchy: string;
}

export interface DepartmentStaffMember {
  id: string;
  name: string;
  avatar: string;
  /** e.g. "Professor", "Lecturer", "Admin Assistant" */
  role: string;
}
