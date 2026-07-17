"use client";

import { Building2, Landmark, MapPin, Users, type LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrgUnitNode, OrgUnitType } from "@/types";

const UNIT_ICONS: Record<OrgUnitType, LucideIcon> = {
  faculty: Landmark,
  department: Building2,
  center: MapPin,
  class: Users,
};

function OrgUnitRow({ node, depth }: { node: OrgUnitNode; depth: number }) {
  const Icon = UNIT_ICONS[node.type];

  return (
    <div>
      <div className="flex items-center gap-2 rounded-md py-2 pr-2 text-sm hover:bg-muted/50" style={{ paddingLeft: depth * 20 }}>
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-medium text-foreground">{node.name}</span>
      </div>
      {node.children.map((child) => (
        <OrgUnitRow key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

interface OrgHierarchyListProps {
  data: OrgUnitNode[] | null;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

/** Recursive faculty → department → center → class hierarchy list. Presentational — state lives in `OrganizationView`. */
export function OrgHierarchyList({ data, isLoading, error, onRetry }: OrgHierarchyListProps) {
  return (
    <SectionCard title="Organization Hierarchy">
      {error ? (
        <ErrorState onRetry={onRetry} title="Couldn't load the organization hierarchy" />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No organization units yet" />
      ) : (
        <div className="space-y-0.5">
          {data.map((node) => (
            <OrgUnitRow key={node.id} node={node} depth={0} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
