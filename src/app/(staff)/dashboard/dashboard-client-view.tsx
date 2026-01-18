"use client";

import * as React from "react";
import { useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  TicketPercent,
  Zap,
  Terminal,
  MessageSquare,
  Crown,
  Activity as ActivityIcon,
  Cpu,
  History,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional UI & Shell Nodes
import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StaffAuditLog } from "@/components/staff/staff-audit-log";

// 🏛️ Contexts & Hardware Handshake
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

const MOCK_AUDIT_DATA = [
  { id: "evt_1", adminName: "SYSTEM_ROOT", action: "SECURITY_OVERRIDE", target: "Auth_Protocol_v2", timestamp: new Date().toISOString(), severity: "SECURITY" },
  { id: "evt_2", adminName: "ALEX_STAFF", action: "IMPERSONATION_START", target: "Merchant_8841", timestamp: new Date().toISOString(), severity: "CRITICAL" },
];

interface DashboardClientViewProps {
  session: any;
  children: React.ReactNode; 
}

/**
 * 🛰️ DASHBOARD_CLIENT_VIEW (Institutional Apex v2026.1.18 - HARDENED)
 * Strategy: Adaptive Scroll Ingress.
 * Fix: Removed parent-level 'overflow-y-auto' to prevent "Double Scroll" collision 
 * with the Service Assets table.
 */
export function DashboardClientView({
  session,
  children,
}: DashboardClientViewProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  const role = session?.role || "user";
  const realMerchantId = session?.merchantId || session?.id;

  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  const isMerchant = role === "merchant" || role === "owner";

  useEffect(() => {
    if (isReady) impact("light");
  }, [isReady, impact]);

  if (!isReady)
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-4">
        <Cpu className="size-8 text-primary/20 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">Syncing_Hardware_Node...</p>
      </div>
    );

  return (
    /* 🏛️ PRIMARY CHASSIS: Locked at 100% height without internal scroll */
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black relative">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Horizon --- */}
      <div className={cn(
        "shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b pb-4 pt-2 transition-colors duration-1000",
        isPlatformStaff ? "border-amber-500/10" : "border-white/5"
      )}>
        <div className="px-6">
          <DashboardHeader
            title={isPlatformStaff ? "Platform Oversight" : "Merchant Terminal"}
            subtitle={`Node_ID: ${realMerchantId?.slice(0, 8).toUpperCase() || "ROOT_GLOBAL"}`}
          />

          <div className="flex items-center gap-3 mt-3">
            <div className={cn(
              "flex items-center gap-2 px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-[0.3em] shadow-sm",
              isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              {role === "super_admin" ? <Crown className="size-2.5" /> : <ActivityIcon className="size-2.5 animate-pulse" />}
              {role.replace("_", " ")}
            </div>
            <div className="flex items-center gap-2 opacity-30">
              <Terminal className="size-3" />
              <p className="text-[7px] font-black uppercase tracking-[0.4em] italic leading-none">
                {isPlatformStaff ? "ROOT_ACCESS_GRANTED" : `ENCRYPTED_NODE: ${realMerchantId?.slice(0, 8)}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🌊 PASSIVE VOLUME: This container no longer handles scrolling ---
          🏁 THE FIX: Removed 'overflow-y-auto' and 'custom-scrollbar' here.
          This allows the {children} (The Services Page) to own its own scroll logic.
      */}
      <div className="flex-1 min-h-0 w-full relative">
        
        {/* 🕵️ DETECTOR: If children is the Services Page, it will fill this 100% height reservoir */}
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>

        {/* --- 📊 STATIC TELEMETRY (Only visible on Overview) --- */}
        {/* Note: This only renders if there are no specific children controlling the scroll */}
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC ACTIONS */
function ActionBtn({ href, icon: Icon, title, sub, impact }: any) {
  return (
    <Link href={href} onClick={() => impact("light")}
      className="group flex items-center gap-4 rounded-2xl border border-white/5 p-4 transition-all duration-500 hover:bg-white/[0.05] bg-white/[0.01] active:scale-95"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 transition-all group-hover:scale-110">
        <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest italic text-foreground leading-none">{title}</p>
        <p className="text-[8px] text-muted-foreground/20 font-bold uppercase tracking-[0.2em] mt-1 italic leading-none">{sub}</p>
      </div>
    </Link>
  );
}