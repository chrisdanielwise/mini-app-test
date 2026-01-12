"use client";

import { Crown, ShieldCheck, LifeBuoy, Zap, User, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ INSTITUTIONAL IDENTITY BADGE
 * RBAC CALIBRATION: Super Admin (100) | Platform Manager (80) | Platform Support (40) | Merchant (10)
 * Logic: Synchronized with the Universal Identity Protocol for 2026.
 */
export function IdentityBadge({ role }: { role: string }) {
  // 🛡️ ROLE MAPPING CONFIGURATION
  const profiles: Record<string, { label: string; level: string; color: string; icon: any }> = {
    super_admin: {
      label: "Root Protocol",
      level: "LVL_100",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
      icon: Crown,
    },
    platform_manager: {
      label: "Platform Mgr",
      level: "LVL_80",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
      icon: ShieldCheck,
    },
    platform_support: {
      label: "Support Desk",
      level: "LVL_40",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
      icon: LifeBuoy,
    },
    merchant: {
      label: "Cluster Owner",
      level: "LVL_10",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
      icon: Zap,
    },
  };

  // Safe fallback for unverified nodes
  const active = profiles[role] || {
    label: "Guest Node",
    level: "LVL_00",
    color: "text-muted-foreground bg-muted/10 border-border/10",
    icon: Fingerprint,
  };

  const Icon = active.icon;

  return (
    <div className={cn(
      "group relative inline-flex items-center gap-2.5 px-3 py-1 rounded-lg border shadow-sm transition-all duration-500 cursor-default hover:scale-[1.02]",
      active.color
    )}>
      {/* 🌌 Holographic Glow Effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-current to-transparent pointer-events-none" style={{ opacity: 0.03 }} />
      
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
         <Icon className="h-3.5 w-3.5 fill-current opacity-90 transition-transform group-hover:rotate-12" />
      </div>

      <div className="flex flex-col leading-none min-w-0 pr-1">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] italic leading-[0.8] mb-0.5">
          {active.level}
        </span>
        <span className="text-[7px] font-black uppercase tracking-tighter opacity-40 truncate">
          {active.label}
        </span>
      </div>

      {/* 🚀 Active Status Pulse */}
      <span className="relative flex h-1.5 w-1.5 ml-0.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-30"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
      </span>
    </div>
  );
}