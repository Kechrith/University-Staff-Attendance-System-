import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl border-border/60 shadow-sm">
        <CardContent>
          <EmptyState
            icon={FileQuestion}
            title="Page not found"
            description="The page you're looking for doesn't exist or has moved."
            action={<Button size="sm" className="mt-2" render={<Link href="/">Back to role selection</Link>} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
