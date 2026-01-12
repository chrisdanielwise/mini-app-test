"use client";

import { Crown, ShieldCheck, LifeBuoy, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ INSTITUTIONAL IDENTITY BADGE (Four-Tier Calibration)
 * RBAC: Super Admin (100), Platform Manager (80), Platform Support (40), Merchant (10)
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

  const active = profiles[role] || {
    label: "Standard Node",
    level: "LVL_0",
    color: "text-muted-foreground bg-muted/10 border-border/10",
    icon: User,
  };

  const Icon = active.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-2 py-0.5 rounded-md border shadow-sm transition-all duration-500",
      active.color
    )}>
      <Icon className="h-2.5 w-2.5 fill-current opacity-80" />
      <div className="flex flex-col leading-none">
        <span className="text-[8px] font-black uppercase tracking-widest italic">
          {active.level}
        </span>
        <span className="text-[6px] font-bold uppercase tracking-tighter opacity-50 mt-0.5">
          {active.label}
        </span>
      </div>
    </div>
  );
}