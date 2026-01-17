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
 * 🌊 IDENTITY_BADGE (Institutional Apex v2026.1.16)
 * Strategy: High-density clinical branding with Restored Chroma Protocol.
 * Fix: Vibrant role-based colors with fixed tactical clamping.
 */
export function IdentityBadge({ role, isLive = true }: IdentityBadgeProps) {
  const { impact } = useHaptics();
  const { isReady, screenSize } = useDeviceContext();

  // 🛡️ INSTITUTIONAL ROLE TOPOLOGY (v16.31 Protocol)
  const profiles: Record<string, { label: string; level: string; color: string; icon: any }> = {
    super_admin: {
      label: "Root_Protocol",
      level: "LVL_100",
      color: "text-rose-500 bg-rose-500/15 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
      icon: Crown,
    },
    platform_manager: {
      label: "Platform_Mgr",
      level: "LVL_80",
      color: "text-amber-500 bg-amber-500/15 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
      icon: ShieldCheck,
    },
    platform_support: {
      label: "Support_Desk",
      level: "LVL_40",
      color: "text-blue-500 bg-blue-500/15 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
      icon: LifeBuoy,
    },
    merchant: {
      label: "Cluster_Owner",
      level: "LVL_10",
      color: "text-primary bg-primary/15 border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      icon: Zap,
    },
  };

  const active = profiles[role.toLowerCase()] || {
    label: "Guest_Node",
    level: "LVL_00",
    color: "text-muted-foreground/40 bg-white/5 border-white/10",
    icon: Fingerprint,
  };

  const Icon = active.icon;

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />;

  const isXS = screenSize === 'xs';

  return (
    <div 
      onMouseEnter={() => impact("light")}
      className={cn(
        "group relative inline-flex items-center backdrop-blur-3xl border transition-all duration-700",
        "rounded-lg md:rounded-xl cursor-none select-none active:scale-95",
        isXS ? "px-2.5 py-1 gap-2 h-8" : "px-3.5 py-1.5 gap-3 h-10",
        active.color
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE: Restored Glow */}
      <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <div className="relative shrink-0 flex items-center justify-center">
         <Icon className={cn(
           "transition-all duration-700 group-hover:rotate-12 group-hover:scale-110",
           isXS ? "size-3.5" : "size-4"
         )} />
      </div>

      <div className="flex flex-col min-w-0 pr-1">
        <span className={cn(
          "font-black uppercase italic tracking-[0.2em] leading-none mb-1 text-foreground",
          isXS ? "text-[7px]" : "text-[9px]"
        )}>
          {active.level}
        </span>
        <div className="flex items-center gap-2">
          {!isXS && <Activity className="size-2 opacity-30 animate-pulse" />}
          <span className={cn(
            "font-black uppercase tracking-widest opacity-40 truncate transition-opacity group-hover:opacity-70",
            isXS ? "text-[5px]" : "text-[7px]"
          )}>
            {active.label}
          </span>
        </div>
      </div>

      {/* 🚀 KINETIC STATUS PULSE: Color-Matched */}
      {isLive && (
        <span className={cn("relative flex", isXS ? "size-1.5" : "size-2")}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-20 duration-[2000ms]"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-current shadow-[0_0_8px_currentColor]"></span>
        </span>
      )}
    </div>
  );
}