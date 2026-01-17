"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🛰️ TACTICAL SPINNER (Institutional v16.16.12)
 * Logic: Velocity-Aware Ingress Indicator.
 * Design: v9.5.0 Fluid Animation.
 */

const spinnerVariants = cva(
  "animate-spin text-primary shrink-0",
  {
    variants: {
      size: {
        xs: "size-3",
        sm: "size-4",
        md: "size-6",
        lg: "size-10",
        xl: "size-16",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground/40",
        white: "text-white",
        amber: "text-amber-500",
      }
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
    },
  }
);

interface SpinnerProps 
  extends React.ComponentProps<"svg">, 
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    />
  );
}

/**
 * 🛰️ FULL-SCREEN LOADING NODE
 * Purpose: Used for initial app boot or hard identity-syncs.
 */
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">
          Synchronizing Node...
        </span>
      </div>
    </div>
  );
}

export { Spinner, LoadingScreen };