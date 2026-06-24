import {
  Building2,
  CalendarClock,
  CalendarRange,
  ClipboardList,
  Eye,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { CurrentUser, NotificationItem } from "@/types";
import { fetchCurrentUser as fetchDepartmentHeadCurrentUser, fetchNotifications as fetchDepartmentHeadNotifications } from "@/services/dashboardService";
import {
  fetchCurrentUser as fetchProgramCoordinatorCurrentUser,
  fetchNotifications as fetchProgramCoordinatorNotifications,
} from "@/services/programCoordinatorService";
<<<<<<< HEAD
import { fetchCurrentUser as fetchLecturerCurrentUser, fetchNotifications as fetchLecturerNotifications } from "@/services/lecturerService";
=======
>>>>>>> 71f104520d9c19e097b9152d9a4d098e6859c6bc
import {
  fetchCurrentUser as fetchClassMonitorCurrentUser,
  fetchNotifications as fetchClassMonitorNotifications,
} from "@/services/classMonitorService";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface RoleConfig {
  /** URL path segment identifying this role, e.g. "Department-Head". */
  key: string;
  /** Display name shown on the role picker, e.g. "Department Head". */
  label: string;
  description: string;
  icon: LucideIcon;
  navItems: NavItem[];
  settingsHref: string;
  fetchCurrentUser: () => Promise<CurrentUser>;
  fetchNotifications: () => Promise<NotificationItem[]>;
}

const DEPARTMENT_HEAD_KEY = "Department-Head";

/**
 * One entry per teammate's role folder under `app/`. Add a new entry here
 * (and point it at that role's own service module) whenever a new role is
 * added — the shared Sidebar/Navbar pick the right one from the URL.
 */
export const ROLES: Record<string, RoleConfig> = {
  [DEPARTMENT_HEAD_KEY]: {
    key: DEPARTMENT_HEAD_KEY,
    label: "Department Head",
    description: "Oversee department-wide attendance, leave, schedule, and staff.",
    icon: Building2,
    navItems: [
      { label: "Dashboard", href: "/Department-Head/Dashboard", icon: LayoutDashboard },
      { label: "Attendance", href: "/Department-Head/Attendance", icon: ClipboardList },
      { label: "Leave Management", href: "/Department-Head/Leave-Management", icon: CalendarRange },
      { label: "Schedule", href: "/Department-Head/Schedule", icon: CalendarClock },
      { label: "Reports", href: "/Department-Head/Reports", icon: FileBarChart },
      { label: "Settings", href: "/Department-Head/Settings", icon: Settings },
    ],
    settingsHref: "/Department-Head/Settings",
    fetchCurrentUser: fetchDepartmentHeadCurrentUser,
    fetchNotifications: fetchDepartmentHeadNotifications,
  },
  "Program-Coordinator": {
    key: "Program-Coordinator",
    label: "Program Coordinator",
    description: "Coordinate lecturer schedules, attendance, and program leave.",
    icon: CalendarRange,
    navItems: [
      { label: "Dashboard", href: "/Program-Coordinator/Dashboard", icon: LayoutDashboard },
      { label: "Attendance", href: "/Program-Coordinator/Attendance", icon: ClipboardList },
      { label: "Leave Management", href: "/Program-Coordinator/Leave-Management", icon: CalendarRange },
      { label: "Schedule", href: "/Program-Coordinator/Schedule", icon: CalendarClock },
      { label: "Reports", href: "/Program-Coordinator/Reports", icon: FileBarChart },
      { label: "Settings", href: "/Program-Coordinator/Settings", icon: Settings },
    ],
    settingsHref: "/Program-Coordinator/Settings",
    fetchCurrentUser: fetchProgramCoordinatorCurrentUser,
    fetchNotifications: fetchProgramCoordinatorNotifications,
  },
<<<<<<< HEAD
  Lecturer: {
    key: "Lecturer",
    label: "Lecturer",
    description: "Review your attendance records and lesson logs, and flag inaccuracies.",
    icon: GraduationCap,
    navItems: [
      { label: "Dashboard", href: "/Lecturer/Dashboard", icon: LayoutDashboard },
      { label: "My Records", href: "/Lecturer/My-Records", icon: ClipboardList },
      { label: "Leave Requests", href: "/Lecturer/Leave-Requests", icon: CalendarRange },
      { label: "My Schedule", href: "/Lecturer/My-Schedule", icon: CalendarClock },
      { label: "Settings", href: "/Lecturer/Settings", icon: Settings },
    ],
    settingsHref: "/Lecturer/Settings",
    fetchCurrentUser: fetchLecturerCurrentUser,
    fetchNotifications: fetchLecturerNotifications,
  },
=======
>>>>>>> 71f104520d9c19e097b9152d9a4d098e6859c6bc
  "Class-Monitor": {
    key: "Class-Monitor",
    label: "Class Monitor",
    description: "Track classroom attendance, lecturer check-ins, and room sessions.",
    icon: Eye,
    navItems: [
      { label: "Dashboard", href: "/Class-Monitor/Dashboard", icon: LayoutDashboard },
      { label: "Attendance", href: "/Class-Monitor/Attendance", icon: ClipboardList },
      { label: "Leave Management", href: "/Class-Monitor/Leave-Management", icon: CalendarRange },
      { label: "Schedule", href: "/Class-Monitor/Schedule", icon: CalendarClock },
      { label: "Reports", href: "/Class-Monitor/Reports", icon: FileBarChart },
      { label: "Settings", href: "/Class-Monitor/Settings", icon: Settings },
    ],
    settingsHref: "/Class-Monitor/Settings",
    fetchCurrentUser: fetchClassMonitorCurrentUser,
    fetchNotifications: fetchClassMonitorNotifications,
  },
};

/** Extracts the role key from a pathname like "/Program-Coordinator/Dashboard", falling back to Department-Head. */
export function getRoleKey(pathname: string): string {
  const segment = pathname.split("/")[1];
  return segment && segment in ROLES ? segment : DEPARTMENT_HEAD_KEY;
}

export function getRoleConfig(pathname: string): RoleConfig {
  return ROLES[getRoleKey(pathname)];
}

/** True for any URL under a known role's folder, e.g. "/Program-Coordinator/Dashboard". */
export function isRolePath(pathname: string): boolean {
  return Object.keys(ROLES).some((key) => pathname === `/${key}` || pathname.startsWith(`/${key}/`));
}
