"use client";

import { toast } from "sonner";
import { CalendarPlus, CalendarRange, FileSpreadsheet, FileText, UserPlus, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

const ACTIONS: QuickAction[] = [
  { label: "Generate Attendance Report", icon: FileText, iconClassName: "bg-primary/10 text-primary" },
  { label: "Export Excel", icon: FileSpreadsheet, iconClassName: "bg-success/10 text-success" },
  { label: "Export PDF", icon: FileText, iconClassName: "bg-destructive/10 text-destructive" },
  { label: "Add Staff", icon: UserPlus, iconClassName: "bg-info/10 text-info" },
  { label: "Create Leave", icon: CalendarPlus, iconClassName: "bg-warning/10 text-warning" },
  { label: "Manage Schedule", icon: CalendarRange, iconClassName: "bg-secondary/10 text-secondary" },
];

export function QuickActions() {
  return (
    <SectionCard title="Quick Actions" description="Common tasks for managing your department">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACTIONS.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <Button
              variant="outline"
              className="h-auto w-full flex-col gap-2 rounded-xl py-4 hover:border-primary/40 hover:bg-accent"
              onClick={() => toast.success(`${action.label} started`)}
            >
              <span className={`flex size-10 items-center justify-center rounded-xl ${action.iconClassName}`}>
                <action.icon className="size-5" />
              </span>
              <span className="text-center text-xs font-medium leading-tight text-foreground">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}
