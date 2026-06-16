import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent>
        <EmptyState
          icon={FileQuestion}
          title="Page not found"
          description="The page you're looking for doesn't exist or has moved."
          action={
            <Button size="sm" className="mt-2" render={<Link href="/Department-Head/Dashboard">Back to Dashboard</Link>} />
          }
        />
      </CardContent>
    </Card>
  );
}
