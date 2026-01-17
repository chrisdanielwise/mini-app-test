"use client";

import { cn } from "@/lib/utils";

/**
 * 🛰️ SKELETON (Institutional Apex v2026.1.20)
 * Strategy: Vertical Velocity & Sequential Hydration.
 * Fix: Tactical background scale prevents layout flash on high-speed hardware.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass standard
        "relative overflow-hidden rounded-lg bg-white/5",
        
        // 🧪 THE SHIMMER ENGINE: v2026.1.20 Sequential Pulse
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r",
        "before:from-transparent before:via-white/[0.03] before:to-transparent",
        
        // 🌫️ LAMINAR PULSE: Low-frequency HUD "Liveness"
        "animate-pulse duration-[3000ms]",
        
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };