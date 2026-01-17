"use client";

import * as React from "react";
import { Crown, ShieldCheck, LifeBuoy, Zap, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID IDENTITY BADGE (Institutional v16.16.12)
 * RBAC CALIBRATION: Super_Admin (100) | Mgr (80) | Support (40) | Merchant (10)
 * Design: v9.9.1 Hardened Glassmorphism with Kinetic Aura.
 */
export function IdentityBadge({ role }: { role: string }) {
  const { impact } = useHaptics();

  // 🛡️ INSTITUTIONAL ROLE MAPPING
  const profiles: Record<string, { label: string; level: string; color: string; icon: any }> = {
    super_admin: {
      label: "Root Protocol",
      level: "LVL_100",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
      icon: Crown,
    },
    platform_manager: {
      label: "Platform Mgr",
      level: "LVL_80",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
      icon: ShieldCheck,
    },
    platform_support: {
      label: "Support Desk",
      level: "LVL_40",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      icon: LifeBuoy,
    },
    merchant: {
      label: "Cluster Owner",
      level: "LVL_10",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      icon: Zap,
    },
  };

  const active = profiles[role] || {
    label: "Guest Node",
    level: "LVL_00",
    color: "text-muted-foreground bg-muted/10 border-white/5 shadow-none",
    icon: Fingerprint,
  };

  const Icon = active.icon;

  return (
    <div 
      onMouseEnter={() => impact("light")}
      className={cn(
        "group relative inline-flex items-center gap-3 px-3 py-1.5 rounded-xl border backdrop-blur-md",
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:scale-[1.05] hover:bg-opacity-20 cursor-crosshair select-none",
        active.color
      )}
    >
      {/* 🌊 HOLOGRAPHIC INGRESS: Gradient wash on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-1000 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
      
      <div className="relative size-4 flex items-center justify-center shrink-0">
         <Icon className="size-3.5 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_0_5px_currentColor]" />
      </div>

      <div className="flex flex-col leading-none min-w-0 pr-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic leading-none mb-1">
          {active.level}
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.1em] opacity-30 truncate">
          {active.label}
        </span>
      </div>

      {/* 🚀 KINETIC STATUS: Synchronized pulse */}
      <span className="relative flex size-2 ml-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40 duration-1000"></span>
        <span className="relative inline-flex rounded-full size-2 bg-current shadow-[0_0_8px_currentColor]"></span>
      </span>
    </div>
  );
}