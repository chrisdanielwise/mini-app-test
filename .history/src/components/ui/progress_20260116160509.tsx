"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ PROGRESS (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Kinetic Synchronization.
 * Fix: Tactical h-1.5 height and clinical radii prevent layout blowout.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const { isMobile } = useDeviceContext();

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 40%
        "relative w-full overflow-hidden border transition-all duration-500",
        "bg-zinc-950/40 backdrop-blur-xl border-white/5 shadow-inner",
        isMobile ? "h-1 rounded-sm" : "h-1.5 rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          // 🚀 KINETIC SYNC: High-velocity transition (500ms)
          "duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          // 🌫️ LAMINAR RADIANCE: HUD signal leak
          "shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
        )}
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          // 📐 TACTICAL GRADIENT: Stationary signal logic
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 100%), hsl(var(--primary))`
        }}
      />
      
      {/* 📏 STATIONARY GRID SHIMMER: Low-frequency technical "Liveness" */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-[shimmer_4s_infinite]" />
    </ProgressPrimitive.Root>
  );
}

export { Progress };