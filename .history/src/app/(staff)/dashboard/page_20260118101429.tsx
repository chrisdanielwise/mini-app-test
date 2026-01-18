import { Suspense } from "react";
import Link from "next/link";
import {
  PlusCircle,
  TicketPercent,
  Zap,
  Terminal,
  MessageSquare,
  Crown,
  Activity,
  Cpu,
  Layers,
  Activity as ActivityIcon
} from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// 🏗️ Institutional UI & Shell Nodes
import { StatsCard } from "@/components/dashboard/stats-card";

// 📊 Async Data Hydration: Staggered Ingress
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
// import { AsyncActivityFeed } from "@/components/dashboard/async-activity-feed";
import { cn } from "@/lib/utils";

/**
 * 🛰️ DASHBOARD_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Fix: High-density geometry prevents vertical blowout of stats and operational feeds.
 */
export default async function DashboardPage() {
  const headerList = await headers();
  
  const userId = headerList.get("x-user-id");
  const role = (headerList.get("x-user-role") || "user").toLowerCase();
  const fullName = headerList.get("x-user-name") || "Verified_Merchant";
  const userAgent = headerList.get("user-agent") || "";
  
  const isMobile = /Mobile|Android|iPhone|Telegram/i.test(userAgent);
  const realMerchantId = userId; 

  if (!userId) {
    redirect("/login?reason=session_invalid");
  }

  const isSuperAdmin = role === "super_admin";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  const isMerchant = role === "merchant" || role === "owner";

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? "0.5rem" : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <div className={cn(
                "flex items-center gap-2 px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-[0.3em] shadow-sm",
                isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                {isSuperAdmin ? <Crown className="size-2.5" /> : <ActivityIcon className="size-2.5 animate-pulse" />}
                {role.replace('_', ' ')}
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">Node_Identity_Active</span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              {isPlatformStaff ? "Platform" : "Merchant"} <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Terminal</span>
            </h1>
            
            <div className="flex items-center gap-3 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-3" />
              <span>Verified Node: {fullName} // ID: {realMerchantId?.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Stats grid and operational feed --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar px-6 py-6 space-y-6">
        
        {/* 📊 TACTICAL STATS LEDGER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Suspense fallback={<StatsCardSkeleton />}>
            <AsyncRevenueCard merchantId={realMerchantId} />
          </Suspense>

          <Suspense fallback={<StatsCardSkeleton />}>
            <AsyncSubscribersCard merchantId={realMerchantId} />
          </Suspense>

          <StatusNode 
            title={isPlatformStaff ? "Platform Integrity" : "Node Status"} 
            status="Healthy" 
            sub={isPlatformStaff ? "Sync: Optimal" : "Protocol: V2"} 
            isAmber={isPlatformStaff}
          />
          
          <StatusNode 
            title="Cluster Health" 
            status="Stable" 
            sub="Mesh: Active" 
            isAmber={isPlatformStaff}
          />
        </div>

        {/* --- OPERATIONAL FEED & RAPID COMMANDS --- */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className={cn(
              "rounded-[2rem] border backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col",
              isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
            )}>
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3 opacity-30">
                   <Layers className="size-3.5" />
                   <h3 className="text-[8px] font-black uppercase tracking-[0.4em] italic">
                    {isPlatformStaff ? "Global_Telemetry" : "Local_Telemetry_Feed"}
                  </h3>
                </div>
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse",
                  isPlatformStaff ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                )} />
              </div>
              
              <Suspense fallback={<ActivityPlaceholder />}>
                <AsyncActivityFeed merchantId={realMerchantId} />
              </Suspense>
            </div>
          </div>

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
                  Audit and resolve incoming tickets across all cluster nodes.
                </p>
                <Link
                  href="/dashboard/support"
                  className="group flex h-12 w-full items-center justify-center bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-amber-400 transition-all active:scale-95 shadow-lg"
                >
                  Launch Resolution Core
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER SIGNAL */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-4 pb-12">
          <Cpu className="size-3.5" />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">
            Command Center Synchronized // [v16.31_STABLE]
          </p>
        </div>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC NODES */

function StatusNode({ title, status, sub, isAmber }: { title: string, status: string, sub: string, isAmber: boolean }) {
  return (
    <div className={cn(
      "rounded-[1.8rem] border p-6 flex flex-col justify-between shadow-inner transition-all",
      isAmber ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-white/[0.01] border-white/5"
    )}>
      <p className={cn("text-[7px] font-black uppercase tracking-[0.3em] italic opacity-30", isAmber && "text-amber-500 opacity-50")}>
        {title}
      </p>
      <div className="space-y-1 mt-6">
        <p className={cn("text-2xl font-black italic uppercase leading-none tracking-tighter tabular-nums", isAmber ? "text-foreground" : "text-emerald-500")}>
          {status}
        </p>
        <p className="text-[7px] font-bold text-muted-foreground/20 uppercase tracking-[0.1em] leading-none">
          {sub}
        </p>
      </div>
    </div>
  );
}

function StatsCardSkeleton() {
  return <div className="min-h-[140px] rounded-[1.8rem] bg-white/[0.01] border border-white/5 animate-pulse" />;
}

function ActivityPlaceholder() {
  return (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-white/[0.01] border border-white/5" />
      ))}
    </div>
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-white/5 p-4 transition-all duration-500 hover:bg-primary/5 hover:border-primary/20 bg-white/[0.01] active:scale-95"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-all group-hover:bg-primary/20 shadow-inner">
        <Icon className="size-4 text-primary transition-transform group-hover:rotate-12" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest italic text-foreground group-hover:text-primary transition-colors leading-none">
          {title}
        </p>
        <p className="text-[7px] text-muted-foreground/20 font-bold uppercase tracking-[0.1em] mt-1 italic leading-none">
          {sub}
        </p>
      </div>
    </Link>
  );
}