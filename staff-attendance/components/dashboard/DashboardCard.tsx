"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  muted: "text-muted-foreground",
} as const;

interface DashboardCardProps {
  title: string;
  /** Numeric value is animated with a count-up effect; strings render as-is. */
  value: number | string;
  icon: LucideIcon;
  iconClassName?: string;
  /** Small colored label in the top-right corner, e.g. "+8% this month". */
  trendLabel?: string;
  trendTone?: keyof typeof TONE_CLASSES;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  trendLabel,
  trendTone = "muted",
  className,
}: DashboardCardProps) {
  const numericTarget = typeof value === "number" ? value : null;
  const animatedValue = useCountUp(numericTarget ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
    >
      <Card className={cn("rounded-xl border-border/60 shadow-sm transition-shadow hover:shadow-md", className)}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", iconClassName)}>
              <Icon className="size-4.5" />
            </span>
            {trendLabel ? (
              <span className={cn("text-xs font-semibold whitespace-nowrap", TONE_CLASSES[trendTone])}>{trendLabel}</span>
            ) : null}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {numericTarget !== null ? animatedValue.toLocaleString() : value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
