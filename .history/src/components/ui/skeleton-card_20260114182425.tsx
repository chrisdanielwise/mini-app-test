"use client";

import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/telegram/telegram-provider";

interface SkeletonCardProps {
  className?: string;
  isMerchant?: boolean;
}

/**
 * 🛰️ SKELETON CARD (Tactical Node)
 * Design: Minimalist geometry with institutional border radii.
 * Logic: Adapts the pulse intensity based on the operator's clearance.
 */
export function SkeletonCard({ className, isMerchant }: SkeletonCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        "rounded-2xl md:rounded-[2.5rem] border p-5 md:p-8 animate-pulse",
        isMerchant 
          ? "border-amber-500/10 bg-amber-500/[0.02]" 
          : "border-border/40 bg-card/40",
        className
      )}
    >
      {/* Tactical Status Bar Placeholder */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1 md:w-1.5 opacity-20",
        isMerchant ? "bg-amber-500" : "bg-muted-foreground"
      )} />

      <div className="flex items-start justify-between gap-4 md:gap-6">
        <div className="flex-1 space-y-4 md:space-y-5">
          {/* Top: Identity Block */}
          <div className="space-y-2">
            <div className="h-5 md:h-6 w-1/3 rounded-lg bg-muted/20" />
            <div className="h-3 w-1/4 rounded-md bg-muted/10" />
          </div>

          {/* Middle: Resource Pills */}
          <div className="flex gap-2">
            <div className="h-7 w-20 md:w-24 rounded-lg md:rounded-xl bg-muted/15" />
            <div className="h-7 w-28 md:w-32 rounded-lg md:rounded-xl bg-muted/15" />
          </div>
        </div>

        {/* Action: Circular/Square Trigger Placeholder */}
        <div className="h-11 w-11 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-muted/20 shrink-0" />
      </div>
    </div>
  );
}

/**
 * 🛰️ SKELETON LIST (Institutional Ingress)
 * Logic: Detects user role to set the tactical theme before data arrival.
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  const { auth } = useTelegramContext();
  
  // 🏛️ ROLE-AWARE THEME SYNC
  const isMerchant = auth.user?.role?.toUpperCase() === "MERCHANT";

  return (
    <div className="space-y-4" data-slot="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} isMerchant={isMerchant} />
      ))}
    </div>
  );
}