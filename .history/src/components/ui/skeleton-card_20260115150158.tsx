"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

interface SkeletonCardProps {
  className?: string;
  isStaff?: boolean;
}

/**
 * 🌊 SKELETON_CARD (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl).
 * Logic: morphology-aware pre-painting with kinetic water-ease shimmer.
 */
export function SkeletonCard({ className, isStaff }: SkeletonCardProps) {
  const { screenSize, isReady } = useDeviceContext();

  // 🛡️ HYDRATION GUARD
  if (!isReady) return null;

  // 🕵️ MORPHOLOGY RESOLUTION
  const cardRadius = screenSize === 'xs' ? "rounded-[1.5rem]" : "rounded-[2.5rem] md:rounded-[3.5rem]";
  const padding = screenSize === 'xs' ? "p-5" : "p-8 md:p-10";

  return (
    <div 
      className={cn(
        "relative overflow-hidden border shadow-apex transition-all duration-1000",
        cardRadius,
        padding,
        "bg-card/40 backdrop-blur-3xl",
        // 🧪 THE SHIMMER ENGINE: v16.16.30 Kinetic Flow
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2.5s_infinite] before:bg-gradient-to-r",
        "before:from-transparent before:via-white/[0.04] before:to-transparent",
        isStaff ? "border-amber-500/15" : "border-white/5",
        className
      )}
    >
      {/* --- TACTICAL STATUS BAR: Morphology Sync --- */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1 md:w-2 opacity-30 transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      <div className="flex items-start justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-6">
          {/* Top: Identity Block Placeholder */}
          <div className="space-y-4">
            <div className="h-6 md:h-8 w-1/3 rounded-xl bg-foreground/[0.05]" />
            <div className="h-3 md:h-4 w-1/4 rounded-lg bg-foreground/[0.03]" />
          </div>

          {/* Middle: Resource Metrics Placeholder */}
          <div className="flex gap-3">
            <div className="h-10 md:h-12 w-28 md:w-36 rounded-2xl bg-foreground/[0.04]" />
            <div className="h-10 md:h-12 w-20 md:w-24 rounded-2xl bg-foreground/[0.04]" />
          </div>

          {/* Bottom: Action Placeholder (Fluid expansion) */}
          <div className="h-14 md:h-20 w-full rounded-3xl bg-foreground/[0.02] border border-white/5" />
        </div>

        {/* Tactical Icon Node Placeholder */}
        <div className={cn(
          "shrink-0 rounded-2xl md:rounded-3xl bg-foreground/[0.05] transition-all",
          screenSize === 'xs' ? "size-12" : "size-16 md:size-24"
        )} />
      </div>
    </div>
  );
}

/**
 * 🛰️ SKELETON_LIST (Institutional Ingress)
 * Logic: Cascading entrance to simulate liquid data streams.
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  const { user } = useTelegramContext(); // Fix: auth.user -> user (Flattened)
  const { screenSize, isDesktop, isTablet, isPortrait } = useDeviceContext();
  
  const isStaff = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(user?.role?.toUpperCase());

  // 🕵️ MORPHOLOGY RESOLUTION: Grid sync with ServiceCard/Infrastructure
  const gridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1";

  return (
    <div className={cn("grid gap-6 md:gap-8 w-full animate-in fade-in duration-1000", gridCols)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard 
          key={i} 
          isStaff={isStaff} 
          className="animate-in slide-in-from-bottom-4"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}