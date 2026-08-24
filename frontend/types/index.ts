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

/**
 * Domain types for the Program Coordinator pages: dashboard, attendance,
 * leave management, schedule, reports, and settings. Kept separate from the
 * Department Head types above even where shapes are similar, so each role's
 * module can evolve independently.
 */

export interface CoordinatorDashboardSummary {
  managedPrograms: number;
  managedProgramsGrowthLabel: string;
  activeLecturers: number;
  activeLecturersRateLabel: string;
  absenceAlerts: number;
  roomUtilization: number;
  roomSeatCount: number;
}

export type CoordinatorLiveMonitorTone = "success" | "warning" | "info";

export interface CoordinatorLiveMonitorEvent {
  id: string;
  message: string;
  detail: string;
  timestamp: string;
  tone: CoordinatorLiveMonitorTone;
}

export type CoordinatorClassStatus = "present" | "late" | "upcoming";

export interface CoordinatorClassOverviewItem {
  id: string;
  department: string;
  studentCount: number;
  title: string;
  instructorName: string;
  instructorAvatar: string;
  scheduleLabel: string;
  status: CoordinatorClassStatus;
}

export interface CoordinatorDailyPulse {
  presentToday: number;
  totalLecturers: number;
  lateArrival: number;
  lateArrivalTrendLabel: string;
  absentOnLeave: number;
  preApprovedLeaveCount: number;
}

export interface CoordinatorTodaysFocus {
  monthLabel: string;
  sessionLabel: string;
  sessionTimeRangeLabel: string;
}

export interface CoordinatorProgramDistributionDatum {
  program: string;
  percentage: number;
}

export type LecturerAttendanceStatus = "present" | "late" | "absent";
export type LecturerCheckInMethod = "QR Scan" | "Biometric" | "—";

export interface LecturerAttendanceLogEntry {
  id: string;
  lecturerName: string;
  lecturerAvatar: string;
  position: string;
  course: string;
  classCode: string;
  timeSlotLabel: string;
  checkInLabel: string;
  status: LecturerAttendanceStatus;
  method: LecturerCheckInMethod;
}

export interface CoordinatorLeaveSummary {
  pendingCount: number;
  approvedMonthly: number;
  rejectedMonthly: number;
  totalManagedLecturers: number;
}

export interface LeaveQueueEntry {
  id: string;
  lecturerName: string;
  lecturerAvatar: string;
  employeeId: string;
  program: string;
  programDetail: string;
  startDate: string;
  endDate: string;
  duration: string;
  leaveType: LeaveType;
  status: "pending" | "approved" | "rejected";
}

export interface ProgramLeaveCoverageDatum {
  program: string;
  presentPercentage: number;
}

export interface CoordinatorHolidayInfo {
  name: string;
  dateRangeLabel: string;
  daysObserved: number;
}

export interface CoordinatorScheduleOverview {
  weekRangeLabel: string;
  conflictCount: number;
  conflictDetailLabel: string;
  roomUtilization: number;
  roomUtilizationTrendLabel: string;
  pendingActions: number;
  lastUpdatedLabel: string;
}

export type CoordinatorScheduleSlotStatus = "lecture" | "lab" | "conflict";

export interface CoordinatorScheduleSlot {
  id: string;
  day: WeekDay;
  /** Must match one of the grid's `timeSlots`. */
  time: string;
  title: string;
  subtitle: string;
  status: CoordinatorScheduleSlotStatus;
}

export interface CoordinatorWeeklyScheduleGrid {
  timeSlots: string[];
  slots: CoordinatorScheduleSlot[];
}

export interface CoordinatorKpis {
  attendanceRate: number;
  attendanceRateTrendLabel: string;
  gpaAverage: number;
  gpaTrendLabel: string;
  scheduleAdherence: number;
  scheduleAdherenceTrendLabel: string;
  totalEnrollment: number;
  totalEnrollmentTrendLabel: string;
}

export interface AcademicPerformanceTrendPoint {
  yearLabel: string;
  departmentValue: number;
  universityAverage: number;
}

export type LecturerAdherenceTone = "top" | "stable" | "action-required";

export interface LecturerAdherenceItem {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  percentage: number;
  tone: LecturerAdherenceTone;
}

export type AttendanceBreakdownStatus = "excellent" | "on-target" | "low-attendance";

export interface WeeklyAttendanceBreakdownRow {
  id: string;
  classCode: string;
  subjectName: string;
  lecturerName: string;
  enrolled: number;
  attendancePercentage: number;
  status: AttendanceBreakdownStatus;
}

export interface CoordinatorProfile {
  fullName: string;
  department: string;
  universityEmail: string;
  employeeId: string;
  bio: string;
}

export interface CoordinatorAccessSession {
  lastLoginLabel: string;
  onDuty: boolean;
}

export interface CoordinationPolicies {
  automaticScheduleConflictDetection: boolean;
  leaveRequestEscalation: boolean;
  auditLogVisibility: boolean;
}

export interface CoordinatorAlertPreference {
  id: string;
  title: string;
  description: string;
}

export interface CoordinatorSecurityItem {
  id: "password" | "2fa" | "login-history";
  title: string;
  description: string;
  actionLabel: string;
}

/**
 * Domain types for the Lecturer pages: personal dashboard, attendance
 * records with the flag/dispute workflow (FR-4/FR-5), weekly schedule, and
 * settings. Kept separate from the other roles' types even where shapes are
 * similar, so each role's module can evolve independently.
 */

export interface LecturerDashboardSummary {
  completedSessions: number;
  totalSemesterSessions: number;
  weeklyCount: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  permissionCount: number;
  pendingPermissions: number;
  pendingDisputes: number;

  /* Legacy fields for backward compatibility */
  attendanceRate?: number;
  attendanceRateTrendLabel?: string;
  classesThisMonth?: number;
  classesThisMonthTrendLabel?: string;
}

export type LecturerClassStatus = "upcoming" | "ongoing" | "completed";

export interface LecturerTodayClass {
  id: string;
  course: string;
  classCode: string;
  timeSlotLabel: string;
  room: string;
  status: LecturerClassStatus;
}

export type LecturerRecordStatus = "present" | "late" | "absent";
export type LecturerDisputeStatus = "none" | "flagged" | "resolved";

export interface LecturerAttendanceRecord {
  id: string;
  /** ISO date string. */
  date: string;
  course: string;
  classCode: string;
  timeSlotLabel: string;
  status: LecturerRecordStatus;
  lessonSummary: string;
  /** Name of the Class Monitor who logged this entry. */
  loggedBy: string;
  disputeStatus: LecturerDisputeStatus;
  disputeReason?: string;
}

export type LecturerScheduleSlotStatus = "class" | "office-hours" | "meeting";

export interface LecturerScheduleSlot {
  id: string;
  day: WeekDay;
  /** Must match one of the grid's `timeSlots`. */
  time: string;
  title: string;
  subtitle: string;
  status: LecturerScheduleSlotStatus;
}

export interface LecturerWeeklyScheduleGrid {
  weekRangeLabel: string;
  timeSlots: string[];
  slots: LecturerScheduleSlot[];
}

export interface LecturerProfile {
  fullName: string;
  position: string;
  department: string;
  universityEmail: string;
  employeeId: string;
  phone: string;
  bio: string;
}

export interface LecturerAlertPreference {
  id: string;
  title: string;
  description: string;
}

export interface LecturerSecurityItem {
  id: "password" | "2fa" | "login-history";
  title: string;
  description: string;
  actionLabel: string;
}

export interface LecturerAccessSession {
  lastLoginLabel: string;
  notifyOnNewEntry: boolean;
}

export interface LecturerLeaveSummary {
  remainingDays: number;
  usedDays: number;
  pendingCount: number;
  approvedThisYear: number;
}

export interface LecturerLeaveRequest {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  /** ISO timestamp; rendered as a relative label like "2 hours ago". */
  requestedAt: string;
}

/**
 * Domain types for the Class Monitor pages: dashboard, attendance (mark
 * attendance), leave management, schedule, reports, and settings. Kept
 * separate from the other roles' types above even where shapes are similar,
 * so this role's module can evolve independently.
 */

export type MonitorAlertTone = "warning" | "info";

export interface MonitorAlert {
  id: string;
  title: string;
  description: string;
  tone: MonitorAlertTone;
}

export type MonitorAttendanceMark = "present" | "late" | "absent" | null;

export interface MonitorDailyClassEntry {
  id: string;
  timeRangeLabel: string;
  room: string;
  lecturerName: string;
  lecturerAvatar: string;
  course: string;
  mark: MonitorAttendanceMark;
}

export type MonitorAssignedClassTone = "active" | "upcoming" | "evening";

export interface MonitorAssignedClass {
  id: string;
  groupLabel: string;
  programLabel: string;
  tone: MonitorAssignedClassTone;
}

export interface MonitorDutyStatus {
  onDuty: boolean;
  room: string;
  sessionEndsInLabel: string;
}

export interface MonitorDashboardSummary {
  alerts: MonitorAlert[];
  dailyClasses: MonitorDailyClassEntry[];
  assignedClasses: MonitorAssignedClass[];
  duty: MonitorDutyStatus;
}

export interface MonitorShiftStats {
  totalClassesToday: number;
  totalRoomsLabel: string;
  lecturerAttendanceRate: number;
  lecturerAttendanceTrendLabel: string;
  pendingRecords: number;
}

export type MonitorCurrentClassMark = "present" | "late" | "absent";

export interface MonitorCurrentClass {
  id: string;
  room: string;
  timeRangeLabel: string;
  course: string;
  lecturerName: string;
  marks: MonitorCurrentClassMark[];
}

export interface MonitorSessionLogEntry {
  id: string;
  message: string;
  detail: string;
  timestamp: string;
}

export interface MonitorCampusLoad {
  capacityPercentage: number;
  updatedLabel: string;
}

export interface MonitorLeaveBalance {
  type: "Annual" | "Sick" | "Other";
  remaining: number;
  total: number;
}

export interface MonitorLeaveStatus {
  isOnDuty: boolean;
  statusLabel: string;
  nextScheduledLeaveLabel: string;
}

export interface MonitorLeaveRequest {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export interface MonitorWeeklyScheduleEntry {
  id: string;
  day: WeekDay;
  timeLabel: string;
  title: string;
  detail: string;
  isToday?: boolean;
  isLate?: boolean;
}

export interface MonitorScheduleSummary {
  weekRangeLabel: string;
  assignedLecturers: number;
  activeMonitoringZones: number;
  weeklyCoveragePercentage: number;
}

export interface MonitorReportKpis {
  avgRecordingAccuracy: number;
  avgRecordingAccuracyTrendLabel: string;
  sessionCoverage: number;
  sessionCoverageTrendLabel: string;
  lateLogs: number;
  lateLogsTrendLabel: string;
  staffComplianceLabel: string;
  staffComplianceGradeLabel: string;
}

export interface MonitorPerformanceTrendPoint {
  monthLabel: string;
  accuracy: number;
}

export type MonitorErrorDistributionType = "manual-overrides" | "missed-scans" | "sync-delays";

export interface MonitorErrorDistributionDatum {
  type: MonitorErrorDistributionType;
  percentage: number;
}

export type MonitorDepartmentCoverageStatus = "optimal" | "warning";

export interface MonitorDepartmentCoverageRow {
  id: string;
  department: string;
  totalSessions: number;
  recorded: number;
  accuracyPercentage: number;
  status: MonitorDepartmentCoverageStatus;
}

export interface MonitorProfile {
  fullName: string;
  monitoringUnit: string;
  universityEmail: string;
  employeeId: string;
  bio: string;
}

export interface MonitorAccessSession {
  lastLoginLabel: string;
  checkInStatusLabel: string;
}

export interface MonitorNotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

/**
 * Domain types for the Super Admin pages: dashboard, user management,
 * organization, timetable, disputes, audit log, settings.
 */
export interface SuperAdminDashboardSummary {
  totalFaculties: number;
  totalDepartments: number;
  totalUserAccounts: number;
  activeDisputes: number;
  activeDisputesTrendLabel: string;
  sessionsThisWeek: number;
}

export type SystemActivityTone = "success" | "warning" | "info";

export interface SystemActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  tone: SystemActivityTone;
}

export type UserAccountRole = "Department-Head" | "Program-Coordinator" | "Lecturer" | "Class-Monitor" | "Super-Admin";

export type UserAccountStatus = "active" | "suspended" | "pending";

export interface UserAccountRow {
  id: string;
  name: string;
  email: string;
  role: UserAccountRole;
  department: string;
  status: UserAccountStatus;
}

export interface ClassMonitorAssignmentRow {
  id: string;
  className: string;
  department: string;
  currentMonitor: string | null;
  status: "assigned" | "unassigned";
}

export type OrgUnitType = "faculty" | "department" | "center" | "class";

export interface OrgUnitNode {
  id: string;
  name: string;
  type: OrgUnitType;
  children: OrgUnitNode[];
}

export interface OrgStats {
  facultyCount: number;
  departmentCount: number;
  centerCount: number;
  classCount: number;
}

export interface SuperAdminTimetableSlot {
  day: string;
  time: string;
  courseLabel: string;
  lecturerLabel: string;
  roomLabel: string;
}

export interface SuperAdminTimetableGrid {
  semesterLabel: string;
  timeSlots: string[];
  slots: SuperAdminTimetableSlot[];
}

export type TimetableChangeType = "added" | "moved" | "cancelled";

export interface TimetableChangeEntry {
  id: string;
  description: string;
  changeType: TimetableChangeType;
  timestamp: string;
}

export type DisputeStatus = "escalated" | "in-review" | "resolved";

export interface EscalatedDisputeEntry {
  id: string;
  subject: string;
  raisedBy: string;
  department: string;
  status: DisputeStatus;
  daysOpen: number;
}

export interface DisputeStats {
  openCount: number;
  resolvedThisMonth: number;
  overdueCount: number;
}

export type AuditLogActionType = "create" | "update" | "delete" | "login" | "export";

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: string;
  action: AuditLogActionType;
  target: string;
  timestamp: string;
}

export interface SuperAdminProfile {
  fullName: string;
  universityEmail: string;
  employeeId: string;
  bio: string;
}

export interface SystemConfiguration {
  attendanceWindowMinutes: number;
  disputeWindowDays: number;
  digestScheduleLabel: string;
  digestEnabled: boolean;
}

export interface SuperAdminSecurityItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}
