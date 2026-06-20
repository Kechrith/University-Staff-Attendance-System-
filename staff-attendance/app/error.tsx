"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production this would report to an error tracking service.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl border-border/60 shadow-sm">
        <CardContent>
          <ErrorState
            title="Something went wrong"
            description="An unexpected error occurred while loading this page."
            onRetry={reset}
          />
        </CardContent>
      </Card>
    </div>
  );
}
