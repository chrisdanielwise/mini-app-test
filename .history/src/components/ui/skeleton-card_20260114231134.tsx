"use client";

import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/providers/telegram-provider";

interface SkeletonCardProps {
  className?: string;
  isMerchant?: boolean;
}

/**
 * 🛰️ SKELETON CARD (Institutional v16.16.12)
 * Logic: Role-Aware Pre-Painting with Shimmer Ingress.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function SkeletonCard({ className, isMerchant }: SkeletonCardProps) {
  return (
    <div 
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Base
        "relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] border p-5 md:p-8",
        "bg-card/40 backdrop-blur-sm",
        // 🚀 THE SHIMMER ENGINE: v9.5.8 Fluidity
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r",
        "before:from-transparent before:via-white/[0.03] before:to-transparent",
        isMerchant ? "border-amber-500/10" : "border-border/10",
        className
      )}
    >
      {/* Tactical Status Bar Placeholder */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1 md:w-1.5 opacity-30",
        isMerchant ? "bg-amber-500" : "bg-muted-foreground/20"
      )} />

      <div className="flex items-start justify-between gap-4 md:gap-6">
        <div className="flex-1 space-y-5">
          {/* Top: Identity Block */}
          <div className="space-y-3">
            <div className="h-5 md:h-6 w-1/3 rounded-lg bg-foreground/5" />
            <div className="h-3 w-1/4 rounded-md bg-foreground/[0.03]" />
          </div>

          {/* Middle: Resource Pills */}
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-xl bg-foreground/5" />
            <div className="h-8 w-32 rounded-xl bg-foreground/5" />
          </div>
        </div>

        {/* Action Node Placeholder */}
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-foreground/5 shrink-0" />
      </div>
    </div>
  );
}

/**
 * 🛰️ SKELETON LIST (Institutional Ingress)
 * Logic: Atomic Role Detection to prevent layout flash.
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  const { auth } = useTelegramContext();
  
  // 🛡️ RBAC SYNC: Institutional Standard v9.4.4
  const isMerchant = auth.user?.role?.toUpperCase() === "MERCHANT";

  return (
    <div className="space-y-4" data-slot="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} isMerchant={isMerchant} />
      ))}
    </div>
  );
}