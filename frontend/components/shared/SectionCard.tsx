import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  /** Usually a string; can be a node (e.g. an icon + text) when callers need a leading icon. */
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/** Consistent rounded-2xl card chrome used by every dashboard section. */
export function SectionCard({ title, description, action, children, className, contentClassName }: SectionCardProps) {
  return (
    <Card className={cn("rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0 w-full sm:w-auto">{action}</div> : null}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
