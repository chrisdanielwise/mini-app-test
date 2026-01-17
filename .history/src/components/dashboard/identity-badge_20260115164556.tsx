"use client";

import * as React from "react";
import { Crown, ShieldCheck, LifeBuoy, Zap, Fingerprint, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface IdentityBadgeProps {
  role: string;
  isLive?: boolean;
}

/**
 * 🌊 IDENTITY_BADGE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware RBAC scaling with role-flavored haptics.
 */
export function IdentityBadge({ role, isLive = true }: IdentityBadgeProps) {
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();

  // 🛡️ INSTITUTIONAL ROLE TOPOLOGY (v16.31)
  const profiles: Record<string, { label: string; level: string; color: string; icon: any }> = {
    super_admin: {
      label: "Root_Protocol",
      level: "LVL_100",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-apex-rose",
      icon: Crown,
    },
    platform_manager: {
      label: "Platform_Mgr",
      level: "LVL_80",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-apex-amber",
      icon: ShieldCheck,
    },
    platform_support: {
      label: "Support_Desk",
      level: "LVL_40",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-apex-blue",
      icon: LifeBuoy,
    },
    merchant: {
      label: "Cluster_Owner",
      level: "LVL_10",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-apex-emerald",
      icon: Zap,
    },
  };

  const active = profiles[role] || {
    label: "Guest_Node",
    level: "LVL_00",
    color: "text-muted-foreground/40 bg-white/5 border-white/5 shadow-none",
    icon: Fingerprint,
  };

  const Icon = active.icon;

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="h-10 w-24 bg-card/20 animate-pulse rounded-xl" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: Balancing geometry for 6-tier hardware spectrum.
   */
  const isXS = screenSize === 'xs';

  return (
    <div 
      onMouseEnter={() => impact("light")}
      className={cn(
        "group relative inline-flex items-center backdrop-blur-3xl border transition-all duration-1000",
        "rounded-xl md:rounded-2xl cursor-none select-none active:scale-95",
        isXS ? "px-2 py-1 gap-2" : "px-4 py-2 gap-4",
        active.color
      )}
    >
      {/* 🌫️ VAPOUR MASK: Subsurface Kinetic Radiance */}
      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <div className="relative shrink-0 flex items-center justify-center">
         <Icon className={cn(
           "transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_0_8px_currentColor]",
           isXS ? "size-3.5" : "size-4.5"
         )} />
      </div>

      <div className="flex flex-col min-w-0 pr-1">
        <span className={cn(
          "font-black uppercase italic tracking-[0.3em] leading-none mb-1 text-foreground",
          isXS ? "text-[8px]" : "text-[10px]"
        )}>
          {active.level}
        </span>
        <div className="flex items-center gap-2">
          {!isXS && <Activity className="size-2 opacity-20" />}
          <span className={cn(
            "font-black uppercase tracking-widest opacity-30 truncate transition-opacity group-hover:opacity-60",
            isXS ? "text-[6px]" : "text-[8px]"
          )}>
            {active.label}
          </span>
        </div>
      </div>

      {/* 🚀 KINETIC STATUS PULSE */}
      {isLive && (
        <span className={cn("relative flex", isXS ? "size-1.5" : "size-2.5")}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-20 duration-[2000ms]"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-current shadow-[0_0_12px_currentColor]"></span>
        </span>
      )}
    </div>
  );
}