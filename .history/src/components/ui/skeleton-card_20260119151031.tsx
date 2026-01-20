"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

// ✅ FIX: TS2322 - Extending HTMLAttributes to permit 'style' and native props
interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isStaff?: boolean;
}

/**
 * 🛰️ SKELETON_CARD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Ingress.
 */
export function SkeletonCard({ className, isStaff, style, ...props }: SkeletonCardProps) {
  const { isReady, isMobile } = useDeviceContext();

  // 🛡️ HYDRATION GUARD
  if (!isReady) return null;

  // 🕵️ GEOMETRY LOCK: Clinical mass shrunken by 20%
  const cardRadius = isMobile ? "rounded-xl" : "rounded-2xl";
  const padding = isMobile ? "p-4" : "p-6";

  return (
    <div 
      // ✅ RESOLVED: 'style' is now explicitly handled
      style={style}
      className={cn(
        "relative overflow-hidden border transition-all duration-500",
        cardRadius,
        padding,
        "bg-zinc-950/20 backdrop-blur-3xl",
        // 🧪 THE SHIMMER ENGINE: v2026.1.20 Sequential Pulse
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r",
        "before:from-transparent before:via-white/[0.02] before:to-transparent",
        isStaff ? "border-amber-500/10" : "border-white/5",
        className
      )}
      {...props}
    >
      {/* --- TACTICAL STATUS BAR --- */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-0.5 opacity-20 transition-colors",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
            <div className="h-4 md:h-5 w-1/3 rounded bg-white/5" />
            <div className="h-2.5 md:h-3 w-1/4 rounded bg-white/[0.02]" />
          </div>

          <div className="flex gap-2">
            <div className="h-8 md:h-9 w-24 md:w-28 rounded-md bg-white/[0.03]" />
            <div className="h-8 md:h-9 w-16 md:w-20 rounded-md bg-white/[0.03]" />
          </div>

          <div className="h-10 md:h-12 w-full rounded-lg bg-white/[0.01] border border-white/5" />
        </div>

        <div className={cn(
          "shrink-0 rounded-lg bg-white/[0.04] transition-all",
          isMobile ? "size-10" : "size-14"
        )} />
      </div>
    </div>
  );
}

/**
 * 🛰️ SKELETON_LIST (Institutional Ingress)
 * Logic: Cascading entrance to simulate sequential terminal hydration.
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  const { user } = useTelegramContext();
  const { isDesktop, isTablet, isPortrait } = useDeviceContext();
  
  // ✅ FIX: Safe-check user role to prevent "undefined" crashes
  const userRole = user?.role?.toUpperCase() || "";
  const isStaff = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER", "AMBER"].includes(userRole);

  // 🕵️ MORPHOLOGY RESOLUTION
  const gridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1";

  return (
    <div className={cn("grid gap-4 md:gap-6 w-full animate-in fade-in duration-500", gridCols)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard 
          key={i} 
          isStaff={isStaff} 
          className="animate-in slide-in-from-bottom-2"
          // ✅ WORKS: 'style' is now accepted by SkeletonCard
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}