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
 * 🛰️ IDENTITY_BADGE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density padding (py-1) and standardized h-8/h-9 profile prevents header blowout.
 */
export function IdentityBadge({ role, isLive = true }: IdentityBadgeProps) {
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();

  // 🛡️ ROLE TOPOLOGY
  const profiles: Record<string, { label: string; level: string; color: string; icon: any }> = {
    super_admin: {
      label: "Root",
      level: "L100",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-sm",
      icon: Crown,
    },
    platform_manager: {
      label: "Admin",
      level: "L80",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-sm",
      icon: ShieldCheck,
    },
    platform_support: {
      label: "Support",
      level: "L40",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-sm",
      icon: LifeBuoy,
    },
    merchant: {
      label: "Cluster",
      level: "L10",
      color: "text-primary bg-primary/10 border-primary/20 shadow-sm",
      icon: Zap,
    },
  };

  const active = profiles[role.toLowerCase()] || {
    label: "Node",
    level: "L00",
    color: "text-muted-foreground/30 bg-white/5 border-white/10",
    icon: Fingerprint,
  };

  const Icon = active.icon;

  if (!isReady) return <div className="h-8 w-20 bg-white/5 animate-pulse rounded-lg" />;

  return (
    <div 
      onMouseEnter={() => impact("light")}
      className={cn(
        "group relative inline-flex items-center backdrop-blur-xl border transition-all duration-500",
        "rounded-lg cursor-none select-none active:scale-95 leading-none",
        isMobile ? "h-8 px-2 gap-2" : "h-9 px-2.5 gap-2.5",
        active.color
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative shrink-0">
         <Icon className={cn(
           "transition-transform group-hover:scale-110",
           isMobile ? "size-3" : "size-3.5"
         )} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className={cn(
          "font-black uppercase italic tracking-[0.1em] text-foreground opacity-90",
          isMobile ? "text-[7px]" : "text-[8px]"
        )}>
          {active.level}
        </span>
        <span className={cn(
          "font-black uppercase tracking-widest opacity-30 truncate",
          isMobile ? "text-[5px]" : "text-[6.5px]"
        )}>
          {active.label}
        </span>
      </div>

      {/* 🚀 STATUS PULSE */}
      {isLive && (
        <span className={cn("relative flex", isMobile ? "size-1" : "size-1.5")}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-20"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-current shadow-[0_0_6px_currentColor]"></span>
        </span>
      )}
    </div>
  );
}