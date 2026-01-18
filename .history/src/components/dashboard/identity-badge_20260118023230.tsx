"use client";

import * as React from "react";
import { Crown, ShieldCheck, LifeBuoy, Zap, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface IdentityBadgeProps {
  role: string;
  isLive?: boolean;
}

/**
 * 🛰️ IDENTITY_BADGE (Hardened v16.16.58)
 * Strategy: Vertical Compression & Kinetic Telemetry.
 * Feature: Role-based accent colors with hardware haptic sync.
 */
export function IdentityBadge({ role, isLive = true }: IdentityBadgeProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  // 🛡️ ROLE TOPOLOGY (Standardized v2026.1.20)
  const profiles: Record<string, { label: string; level: string; color: string; icon: any }> = {
    super_admin: {
      label: "Root",
      level: "L100",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      icon: Crown,
    },
    platform_manager: {
      label: "Admin",
      level: "L80",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      icon: ShieldCheck,
    },
    platform_support: {
      label: "Support",
      level: "L40",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      icon: LifeBuoy,
    },
    merchant: {
      label: "Cluster",
      level: "L10",
      color: "text-primary bg-primary/10 border-primary/20",
      icon: Zap,
    },
  };

  const active = profiles[role.toLowerCase()] || {
    label: "Node",
    level: "L00",
    color: "text-muted-foreground bg-white/5 border-white/10",
    icon: Fingerprint,
  };

  const Icon = active.icon;

  // 🛡️ HYDRATION SHIELD: Prevents "Layout Snap" during device handshake
  if (!isReady) return (
    <div className="h-8 w-20 bg-white/5 animate-pulse rounded-lg border border-white/5" />
  );

  return (
    <div 
      onClick={() => impact("light")}
      className={cn(
        "group relative inline-flex items-center backdrop-blur-3xl border transition-all duration-500",
        "rounded-lg select-none active:scale-90 leading-none",
        // 📐 TACTICAL COMPRESSION: h-8 matches the global HUD baseline
        isMobile ? "h-8 px-2.5 gap-2" : "h-9 px-3 gap-3",
        active.color
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE: Chromatic Bleed */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.01] to-transparent pointer-events-none rounded-lg" />
      
      <div className="relative shrink-0 flex items-center justify-center">
         <Icon className={cn(
           "transition-all duration-300",
           isMobile ? "size-3" : "size-3.5",
           "drop-shadow-[0_0_8px_currentColor]"
         )} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className={cn(
          "font-black uppercase italic tracking-[0.1em] text-foreground leading-none",
          isMobile ? "text-[8px]" : "text-[9px]"
        )}>
          {active.level}
        </span>
        <span className={cn(
          "font-black uppercase tracking-[0.2em] opacity-30 mt-0.5",
          isMobile ? "text-[6px]" : "text-[7px]"
        )}>
          {active.label}
        </span>
      </div>

      {/* 🚀 STATUS PULSE: Morphological Signal */}
      {isLive && (
        <div className="ml-0.5 flex items-center justify-center">
          <div className={cn(
            "rounded-full animate-pulse",
            isMobile ? "size-1" : "size-1.5",
            "bg-current shadow-[0_0_8px_currentColor]"
          )} />
        </div>
      )}
    </div>
  );
}