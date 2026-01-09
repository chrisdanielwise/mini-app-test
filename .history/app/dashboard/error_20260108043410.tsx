"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the actual error to your terminal/console
    console.error("Dashboard Route Error:", error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <p className="text-[10px] font-mono text-muted-foreground/50">
          ID: {error.digest}
        </p>
      </div>
      <Button onClick={() => reset()} className="mt-4 gap-2">
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}