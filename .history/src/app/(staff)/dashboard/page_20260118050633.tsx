"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import {
  PlusCircle,
  TicketPercent,
  Zap,
  Terminal,
  MessageSquare,
  Crown,
  Layers,
  Activity as ActivityIcon,
  Cpu,
  History
} from "lucide-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

// 🏗️ Institutional UI & Shell Nodes
import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";

// 📊 Async Data Hydration
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";

// 🕵️ Staff Logic Nodes
import { StaffAuditLog } from "@/components/staff/staff-audit-log";

// 🏛️ Contexts & Hardware Handshake
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛡️ MOCK_AUDIT: Hydrated for Staff oversight
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

export default function DashboardPage({ session }: { session: any }) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!session) redirect("/login?reason=session_invalid");

  const { role } = session.user;
  const realMerchantId = session.merchantId; 

  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  const isMerchant = role === "merchant" || role === "owner";

  if (!isReady) return <div className="h-screen w-full bg-black/40 animate-pulse" />;

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
      {/* --- 🛡️ FIXED COMMAND HUD --- */}
      <div className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2">
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
              {role.replace('_', ' ')}
            </div>
            <div className="flex items-center gap-2 opacity-30">
              <Terminal className="size-3" />
              <p className="text-[7px] font-black uppercase tracking-[0.4em] italic">
                {isPlatformStaff ? "ROOT_ACCESS_GRANTED" : `NODE: ${realMerchantId?.slice(0,8)}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME --- */}
      <div 
        className="flex-1 min-h-0 w-full relative overflow-y-auto scrollbar-hide overscroll-contain px-6 py-6 space-y-8"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 8.5rem)` : "4rem" }}
      >
        
        {/* 📊 TACTICAL STATS LEDGER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Suspense fallback={<StatsCardSkeleton />}>
            <AsyncRevenueCard merchantId={isPlatformStaff ? null : realMerchantId} />
          </Suspense>

          <Suspense fallback={<StatsCardSkeleton />}>
            <AsyncSubscribersCard merchantId={isPlatformStaff ? null : realMerchantId} />
          </Suspense>

          <StatsCard 
            title={isPlatformStaff ? "Platform Integrity" : "Node Status"} 
            value={isPlatformStaff ? "Healthy" : "Stable"} 
            subValue={isPlatformStaff ? "Sync: Optimal" : "Protocol: V2"} 
            isAmber={isPlatformStaff}
            variant="status"
          />
          
          <StatsCard 
            title="Cluster Health" 
            value="Stable" 
            subValue="Mesh: Active" 
            isAmber={isPlatformStaff}
            variant="status"
          />
        </div>

        {/* --- 🚀 STAFF FORENSIC LAYER / MERCHANT ACTIVITY --- */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            
            {/* 🛡️ STAFF ONLY: AUDIT LOG INTEGRATION */}
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

            {/* 📊 MERCHANT ACTIVITY FEED */}
            <div className={cn(
              "rounded-[2rem] border backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col",
              isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
            )}>
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3 opacity-30">
                   <Layers className="size-3.5" />
                   <h3 className="text-[8px] font-black uppercase tracking-[0.4em] italic">
                    {isPlatformStaff ? "Network_Telemetry" : "Activity_Feed"}
                  </h3>
                </div>
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse",
                  isPlatformStaff ? "bg-amber-500" : "bg-emerald-500"
                )} />
              </div>
              
              <Suspense fallback={<ActivityPlaceholder />}>
                <AsyncActivityFeed merchantId={realMerchantId} />
              </Suspense>
            </div>
          </div>

          {/* --- SIDEBAR COMMANDS --- */}
          <div className="space-y-6">
            {isMerchant && (
              <div className="rounded-[2rem] border border-white/5 bg-card/30 backdrop-blur-3xl p-6 shadow-2xl">
                <h3 className="text-[9px] font-black uppercase italic tracking-[0.4em] mb-6 flex items-center gap-3 text-primary opacity-40">
                  <Zap className="size-4 fill-current animate-pulse" />
                  Quick Deployment
                </h3>
                <div className="grid gap-3">
                  <ActionBtn href="/dashboard/services" icon={PlusCircle} title="New Service" sub="Expansion" />
                  <ActionBtn href="/dashboard/coupons" icon={TicketPercent} title="Campaign" sub="Incentive" />
                </div>
              </div>
            )}

            {isPlatformStaff && (
              <div className="rounded-[2rem] border border-amber-500/10 bg-amber-500/[0.03] p-6 shadow-2xl">
                <h3 className="text-[9px] font-black uppercase italic tracking-[0.4em] mb-4 flex items-center gap-3 text-amber-500 opacity-40">
                  <MessageSquare className="size-4" />
                  Support Queue
                </h3>
                <p className="text-[8px] font-bold text-muted-foreground/30 uppercase leading-relaxed tracking-widest mb-6 italic">
                  Audit and resolve incoming tickets across all business nodes.
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
          </div>
        </div>

        {/* FOOTER SIGNAL */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-4 pb-4">
          <Cpu className="size-3.5" />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic text-center">
            Terminal_State: Verified // [v16.32_STABLE]
          </p>
        </div>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC NODES */
function StatsCardSkeleton() {
  return <div className="min-h-[140px] rounded-[1.8rem] bg-white/[0.01] border border-white/5 animate-pulse" />;
}

function ActivityPlaceholder() {
  return (
    <div className="p-8 space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-muted/10 border border-border/5" />
      ))}
    </div>
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  const { impact } = useHaptics();
  return (
    <Link
      href={href}
      onClick={() => impact("light")}
      className="group flex items-center gap-4 rounded-xl border border-white/5 p-4 transition-all duration-500 hover:bg-primary/5 hover:border-primary/20 bg-white/[0.01] active:scale-95"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-all group-hover:bg-primary/20 shadow-inner">
        <Icon className="size-4 text-primary transition-transform group-hover:rotate-12" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest italic text-foreground group-hover:text-primary transition-colors leading-none">
          {title}
        </p>
        <p className="text-[8px] text-muted-foreground/20 font-bold uppercase tracking-[0.2em] mt-1 italic leading-none">
          {sub}
        </p>
      </div>
    </Link>
  );
}