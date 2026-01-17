"use client";

import { cn } from "@/lib/utils";

/**
 * 🛰️ TACTICAL SKELETON (Institutional v16.16.12)
 * Logic: Velocity-Aware Shimmer for masking DB latency.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Base
        "relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-sm",
        // 🚀 THE SHIMMER ENGINE: v9.5.8 Fluidity
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r",
        "before:from-transparent before:via-white/5 before:to-transparent",
        "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };