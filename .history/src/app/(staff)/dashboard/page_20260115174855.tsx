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
  Layers
} from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// 🏗️ Institutional UI & Shell Nodes
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatsCard } from "@/components/dashboard/stats-card";

// 📊 Async Data Hydration: Staggered Ingress
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import { AsyncActivityFeed } from "@/components/dashboard/async-activity-feed";
import { cn } from "@/lib/utils";

/**
 * 🌊 MERCHANT_COMMAND_CENTER (Institutional Apex v2026.1.15)
 * Architecture: Header-Hydrated Ingress with Laminar Component Streaming.
 */
export default async function DashboardPage() {
  const headerList = await headers();
  
  // 🛡️ 1. IDENTITY HANDSHAKE: Zero-Latency Proxy Extraction
  const userId = headerList.get("x-user-id");
  const role = (headerList.get("x-user-role") || "user").toLowerCase();
  const fullName = headerList.get("x-user-name") || "Verified_Merchant";
  
  // Tactical ID for merchant components
  const realMerchantId = userId; 

  // 🛡️ 2. SECURITY GUARD: Immediate Edge Exit
  if (!userId) {
    redirect("/login?reason=session_invalid");
  }

  // 🛡️ 3. ROLE_AUTHORIZATION_PROCOCOL
  const isSuperAdmin = role === "super_admin";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  const isMerchant = role === "merchant" || role === "owner";

  return (
    <div className={cn(
      "max-w-7xl mx-auto space-y-8 md:space-y-12 pb-24",
      "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
    )}>
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="relative group p-8 md:p-0">
        <DashboardHeader
          title={isPlatformStaff ? "Platform Oversight" : "Merchant Terminal"}
          subtitle={`Verified Node: ${fullName}`}
        />
        
        <div className="flex items-center gap-4 mt-6">
          <div className={cn(
            "flex items-center gap-3 px-4 py-1.5 rounded-2xl border text-[9px] font-black uppercase tracking-[0.3em] italic shadow-apex",
            isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            {isSuperAdmin ? <Crown className="size-3" /> : <Activity className="size-3 animate-pulse" />}
            {role.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-3 opacity-20">
            <Terminal className="size-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] italic">
              Node_ID: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT_GLOBAL"}
            </p>
          </div>
        </div>
      </div>

      {/* 📊 TACTICAL STATS LEDGER: Kinetic Row --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-6 md:px-0">
        {/* 🚀 LAMINAR STREAMING: DB IO happens inside these via Suspense */}
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncRevenueCard merchantId={realMerchantId} />
        </Suspense>

        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncSubscribersCard merchantId={realMerchantId} />
        </Suspense>

        <StatusNode 
          title={isPlatformStaff ? "Platform Integrity" : "Node Status"} 
          status="Healthy" 
          sub={isPlatformStaff ? "Sync_State: Optimal" : "Protocol: V2_Live"} 
          isAmber={isPlatformStaff}
        />
        
        <StatusNode 
          title="Cluster Health" 
          status="Stable" 
          sub="Mesh_Link: Active" 
          isAmber={isPlatformStaff}
        />
      </div>

      {/* --- OPERATIONAL FEED & RAPID COMMANDS --- */}
      <div className="grid gap-8 lg:grid-cols-3 px-6 md:px-0">
        {/* TELEMETRY FEED: 2/3 Width */}
        <div className="lg:col-span-2">
          <div className="rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl shadow-apex overflow-hidden transition-all duration-1000">
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <Layers className="size-4 text-muted-foreground/30" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
                  {isPlatformStaff ? "Global Network Activity" : "Local Telemetry Feed"}
                </h3>
              </div>
              <div className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                isPlatformStaff ? "bg-amber-500 shadow-apex-amber" : "bg-emerald-500 shadow-apex-emerald"
              )} />
            </div>
            
            <Suspense fallback={<ActivityPlaceholder />}>
              <AsyncActivityFeed merchantId={realMerchantId} />
            </Suspense>
          </div>
        </div>

        {/* QUICK COMMANDS: 1/3 Width */}
        <div className="space-y-8">
          {isMerchant && (
            <div className="rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl p-8 shadow-apex">
              <h3 className="text-[11px] font-black uppercase italic tracking-[0.4em] mb-8 flex items-center gap-4 text-primary">
                <Zap className="size-5 fill-current animate-pulse" />
                Quick Deployment
              </h3>
              <div className="grid gap-4">
                <ActionBtn href="/dashboard/services" icon={PlusCircle} title="New Service" sub="Node Expansion" />
                <ActionBtn href="/dashboard/coupons" icon={TicketPercent} title="Campaign Init" sub="Incentive Node" />
              </div>
            </div>
          )}

          {isPlatformStaff && (
            <div className="rounded-[3rem] border border-amber-500/10 bg-amber-500/[0.03] p-8 shadow-apex">
              <h3 className="text-[11px] font-black uppercase italic tracking-[0.4em] mb-6 flex items-center gap-4 text-amber-500">
                <MessageSquare className="size-5 animate-bounce" />
                Support Queue
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase leading-relaxed tracking-widest mb-8 italic">
                Audit and resolve incoming tickets across all merchant business nodes.
              </p>
              <Link
                href="/dashboard/support"
                className="group flex h-16 w-full items-center justify-center bg-amber-500 text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-amber-400 transition-all active:scale-95 shadow-apex-amber"
              >
                Launch Resolution Core
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC NODES */

function StatusNode({ title, status, sub, isAmber }: { title: string, status: string, sub: string, isAmber: boolean }) {
  return (
    <div className={cn(
      "rounded-[2.5rem] border p-8 flex flex-col justify-between shadow-inner transition-all duration-700",
      isAmber ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-white/[0.02] border-white/5"
    )}>
      <p className={cn("text-[9px] font-black uppercase tracking-[0.4em] italic", isAmber ? "text-amber-500/40" : "text-muted-foreground/30")}>
        {title}
      </p>
      <div className="space-y-2 mt-6">
        <p className={cn("text-4xl font-black italic uppercase leading-none tracking-tighter", isAmber ? "text-foreground" : "text-emerald-500")}>
          {status}
        </p>
        <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] leading-none">
          {sub}
        </p>
      </div>
    </div>
  );
}

function StatsCardSkeleton() {
  return <div className="min-h-[220px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />;
}

function ActivityPlaceholder() {
  return (
    <div className="p-8 space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 w-full animate-pulse rounded-[1.8rem] bg-white/[0.02] border border-white/5" />
      ))}
    </div>
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-6 rounded-[1.8rem] border border-white/5 p-6 transition-all duration-700 hover:bg-primary/5 hover:border-primary/20 bg-white/[0.02] active:scale-95"
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-700 group-hover:bg-primary/20 shadow-inner">
        <Icon className="size-6 text-primary transition-transform duration-700 group-hover:rotate-12" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-widest italic text-foreground group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-[9px] text-muted-foreground/30 font-bold uppercase tracking-[0.2em] mt-1 italic">
          {sub}
        </p>
      </div>
    </Link>
  );
}