import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";

interface ComingSoonProps {
  title: string;
  icon?: LucideIcon;
}

/** Placeholder for nav destinations outside the Department Head Dashboard scope. */
export function ComingSoon({ title, icon = Construction }: ComingSoonProps) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent>
        <EmptyState icon={icon} title={`${title} is coming soon`} description="This section is under construction. Check back later." />
      </CardContent>
    </Card>
  );
}
