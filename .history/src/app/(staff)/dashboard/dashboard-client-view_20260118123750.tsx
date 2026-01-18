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

// 🕵️ Staff Logic Nodes (UI-only or Mock-safe)
import { StaffAuditLog } from "@/components/staff/staff-audit-log";

// 🏛️ Contexts & Hardware Handshake
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

const MOCK_AUDIT_DATA = [
  {
    id: "evt_1",
    adminName: "SYSTEM_ROOT",
    action: "SECURITY_OVERRIDE",
    target: "Auth_Protocol_v2",
    timestamp: new Date().toISOString(),
    severity: "SECURITY",
  },
  {
    id: "evt_2",
    adminName: "ALEX_STAFF",
    action: "IMPERSONATION_START",
    target: "Merchant_8841",
    timestamp: new Date().toISOString(),
    severity: "CRITICAL",
  },
];

interface DashboardClientViewProps {
  session: any;
  children: React.ReactNode; // 🛰️ INJECTED SERVER NODES (Revenue, Subs, Activity)
}

/**
 * 🛰️ DASHBOARD_CLIENT_VIEW (Institutional Apex v2026.1.18)
 * Strategy: Composition Boundary Enforcement.
 * Mission: Fix the redirect loop by rendering the shell before the data exists.
 */
export function DashboardClientView({
  session,
  children,
}: DashboardClientViewProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  // 🔐 IDENTITY RESOLUTION
  // Note: Matching the structure from your [Proxy_Handshake] logs
  const role = session?.role || "user";
  const realMerchantId = session?.merchantId || session?.id;

  const isPlatformStaff = [
    "super_admin",
    "platform_manager",
    "platform_support",
    "amber",
  ].includes(role);
  const isMerchant = role === "merchant" || role === "owner";

  // ⚡ HARDWARE_BRIDGE_INIT
  useEffect(() => {
    if (isReady) impact("light");
  }, [isReady, impact]);

  // 🛡️ HYDRATION_SHIELD: Prevents "Flash of Unstyled Content" during sync
  if (!isReady)
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-4">
        <Cpu className="size-8 text-primary/20 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
          Syncing_Hardware_Node...
        </p>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Layer --- */}
      <div
        className={cn(
          "shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b pb-4 pt-2 transition-colors duration-1000",
          isPlatformStaff ? "border-amber-500/10" : "border-white/5"
        )}
      >
        <div className="px-6">
          <DashboardHeader
            title={isPlatformStaff ? "Platform Oversight" : "Merchant Terminal"}
            subtitle={`Node_ID: ${
              realMerchantId?.slice(0, 8).toUpperCase() || "ROOT_GLOBAL"
            }`}
          />

          <div className="flex items-center gap-3 mt-3">
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-[0.3em] shadow-sm",
                isPlatformStaff
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                  : "bg-primary/10 border-primary/20 text-primary"
              )}
            >
              {role === "super_admin" ? (
                <Crown className="size-2.5" />
              ) : (
                <ActivityIcon className="size-2.5 animate-pulse" />
              )}
              {role.replace("_", " ")}
            </div>
            <div className="flex items-center gap-2 opacity-30">
              <Terminal className="size-3" />
              <p className="text-[7px] font-black uppercase tracking-[0.4em] italic">
                {isPlatformStaff
                  ? "ROOT_ACCESS_GRANTED"
                  : `ENCRYPTED_NODE: ${realMerchantId?.slice(0, 8)}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Staggered Ingress --- */}
      <div
        className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar overscroll-contain px-6 py-6 space-y-8"
        style={{
          paddingBottom: isMobile
            ? `calc(${safeArea.bottom}px + 8.5rem)`
            : "4rem",
        }}
      >
        {/* 🛰️ SERVER-SIDE TELEMETRY NODES (Injected via children) */}
        {children}

        {/* --- 📊 STATIC INTEGRITY LEDGER --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={isPlatformStaff ? "Cluster Integrity" : "Node Status"}
            value={isPlatformStaff ? "Healthy" : "Stable"}
            iconType="telemetry"
            change={0}
            changeLabel="LATENCY_SYNC_OK"
          />
          <StatsCard
            title="Mesh Health"
            value="Active"
            iconType="telemetry"
            change={100}
            changeLabel="UPTIME_VERIFIED"
          />
        </div>

        {/* --- 🚀 FORENSIC LAYER / COMMANDS --- */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {isPlatformStaff && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <History className="size-3 text-amber-500 opacity-40" />
                  <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">
                    Recent_Platform_Audit
                  </h3>
                </div>
                <div className="h-[400px] w-full">
                  <StaffAuditLog entries={MOCK_AUDIT_DATA as any} />
                </div>
              </div>
            )}
          </div>

          {/* --- SIDEBAR COMMANDS --- */}
          <div className="space-y-6">
            {isMerchant && (
              <div className="rounded-[2.5rem] border border-white/5 bg-card/30 backdrop-blur-3xl p-6 shadow-2xl">
                <h3 className="text-[9px] font-black uppercase italic tracking-[0.4em] mb-6 flex items-center gap-3 text-primary opacity-40">
                  <Zap className="size-4 fill-current animate-pulse" />
                  Quick Deployment
                </h3>
                <div className="grid gap-3">
                  <ActionBtn
                    href="/dashboard/services"
                    icon={PlusCircle}
                    title="New Service"
                    sub="Expansion"
                    impact={impact}
                  />
                  <ActionBtn
                    href="/dashboard/coupons"
                    icon={TicketPercent}
                    title="Campaign"
                    sub="Incentive"
                    impact={impact}
                  />
                </div>
              </div>
            )}

            {isPlatformStaff && (
              <div className="rounded-[2.5rem] border border-amber-500/10 bg-amber-500/[0.03] p-6 shadow-2xl">
                <h3 className="text-[9px] font-black uppercase italic tracking-[0.4em] mb-4 flex items-center gap-3 text-amber-500 opacity-40">
                  <MessageSquare className="size-4" />
                  Support Queue
                </h3>
                <p className="text-[8px] font-bold text-muted-foreground/30 uppercase leading-relaxed tracking-widest mb-6 italic">
                  Audit and resolve incoming tickets across all global nodes.
                </p>
                <Link
                  href="/dashboard/support"
                  onClick={() => impact("medium")}
                  className="group flex h-12 w-full items-center justify-center bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  Launch Resolution Core
                </Link>
              </div>
            )}

            {/* 🏎️ PERFORMANCE HUD */}
            <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-black uppercase tracking-widest opacity-20">
                  Hardware_Sync
                </span>
                <Globe
                  className={cn(
                    "size-3",
                    isPlatformStaff ? "text-amber-500" : "text-primary"
                  )}
                />
              </div>
              <div className="space-y-1">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full w-[88%] animate-pulse",
                      isPlatformStaff ? "bg-amber-500" : "bg-primary"
                    )}
                  />
                </div>
                <div className="flex justify-between text-[6px] font-black uppercase tracking-[0.4em] opacity-10 italic">
                  <span>Node_Vector</span>
                  <span>88% Load</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER SIGNAL */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-4 pb-4">
          <Cpu className="size-3.5" />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic text-center">
            Terminal_State: Synchronized // [v16.32_STABLE]
          </p>
        </div>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC ACTIONS */
function ActionBtn({ href, icon: Icon, title, sub, impact }: any) {
  return (
    <Link
      href={href}
      onClick={() => impact("light")}
      className="group flex items-center gap-4 rounded-2xl border border-white/5 p-4 transition-all duration-500 hover:bg-white/[0.05] bg-white/[0.01] active:scale-95"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 transition-all group-hover:scale-110">
        <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest italic text-foreground leading-none">
          {title}
        </p>
        <p className="text-[8px] text-muted-foreground/20 font-bold uppercase tracking-[0.2em] mt-1 italic leading-none">
          {sub}
        </p>
      </div>
    </Link>
  );
}
