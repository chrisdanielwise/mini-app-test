"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID PROGRESS (Institutional v16.16.12)
 * Logic: Momentum-based filling with Subsurface Glow.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Reservoir
        "relative h-2.5 w-full overflow-hidden rounded-full border border-white/5 bg-card/40 backdrop-blur-md shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          // 🌊 WATER FLOW: Institutional Cubic-Bezier Momentum
          "duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]",
          // 🚀 SUBSURFACE GLOW: Makes the "liquid" feel energized
          "shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]"
        )}
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          // 🌊 FLUID TENSION: Slight gradient shift based on value
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 100%), hsl(var(--primary))`
        }}
      />
      
      {/* 🌊 AMBIENT LIGHT LEAK: High-performance light sweep for UX "Liveness" */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_3s_infinite]" />
    </ProgressPrimitive.Root>
  );
}

export { Progress };