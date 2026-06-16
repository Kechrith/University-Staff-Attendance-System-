import {
  CalendarClock,
  CalendarRange,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/Department-Head/Dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/Department-Head/Attendance", icon: ClipboardList },
  { label: "Leave Management", href: "/Department-Head/Leave-Management", icon: CalendarRange },
  { label: "Schedule", href: "/Department-Head/Schedule", icon: CalendarClock },
  { label: "Reports", href: "/Department-Head/Reports", icon: FileBarChart },
  { label: "Settings", href: "/Department-Head/Settings", icon: Settings },
];

export const DEPARTMENT_NAME = "Computer Science Department";

export const BRAND = {
  name: "RUPP Staff",
  tagline: "Management Portal",
};
