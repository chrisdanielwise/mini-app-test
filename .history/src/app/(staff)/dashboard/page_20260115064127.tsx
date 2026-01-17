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
} from "lucide-react";
import { redirect } from "next/navigation";

// 🔐 Staff Identity Handshake

// 🏗️ Layout & Shell Nodes
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatsCard } from "@/components/dashboard/stats-card";

// 📊 Async Data Hydration
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import { cn } from "@/lib/utils";
import { AsyncActivityFeed } from "@/components/dashboard/async-activity-feed";

/**
 * 🛰️ MERCHANT COMMAND CENTER (Institutional v9.4.8)
 * Architecture: Server-Side RBAC with Async Component Streaming.
 * Hardened: Unified Ingress for Staff (Amber) and Merchants (Emerald).
 */
export default async function DashboardPage() {

 const headerList = await headers();
  
  // 🛡️ 1. EXTRACT PROXY IDENTITY
  const userId = headerList.get("x-user-id");
  const role = (headerList.get("x-user-role") || "user").toLowerCase();
  const fullName = headerList.get("x-user-name") || "Administrative Staff";
  
  // 🚀 TACTICAL DEBUG
  console.log(`📄 [Page_Render]: User ${userId} (${role}) Ingress successful.`);

  // 🛡️ 2. SECURITY HANDSHAKE (No DB Call)
  if (!userId) {
    console.error("🚨 [Page_Error]: No Identity Header. Redirecting.");
    redirect("/login?reason=session_invalid");
  }

  // 🛡️ 3. ROLE LOGIC PROTOCOL
  const isSuperAdmin = role === "super_admin";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(role);
  const isMerchant = role === "merchant" || role === "owner";

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 px-4 md:px-8 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="border-b border-border/40 pb-6 relative overflow-hidden group">
        <DashboardHeader
          title={isPlatformStaff ? "Platform Oversight" : "Merchant Terminal"}
          subtitle={`Verified Node: ${session.user.fullName || "Administrative Staff"}`}
        />
        
        <div className="flex items-center gap-3 mt-3">
          <div className={cn(
            "flex items-center gap-2 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest italic",
            isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            {isSuperAdmin ? <Crown className="h-2.5 w-2.5" /> : <Activity className="h-2.5 w-2.5" />}
            {role.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-2 opacity-30">
            <Terminal className="h-3 w-3" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] italic">
              Node_ID: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT_GLOBAL"}
            </p>
          </div>
        </div>
      </div>

      {/* 📊 TACTICAL STATS LEDGER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* 🚀 ASYNC STREAMING:
            We pass the 'realMerchantId' (which is null for staff).
            Our components are built to interpret null as 'Fetch Global Data'.
        */}
        <Suspense fallback={<StatsCard />}>
          <AsyncRevenueCard merchantId={realMerchantId} />
        </Suspense>

        <Suspense fallback={<StatsCard />}>
          <AsyncSubscribersCard merchantId={realMerchantId} />
        </Suspense>

        {/* Global Platform Metric (Staff Only) */}
        {isPlatformStaff ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex flex-col justify-between shadow-inner">
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic">Platform Integrity</p>
            <div className="space-y-1">
              <p className="text-2xl font-black italic uppercase leading-none">Healthy</p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">Sync_State: Optimal</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/10 bg-card/40 p-5 flex flex-col justify-between shadow-sm">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">Node Status</p>
            <div className="space-y-1">
              <p className="text-2xl font-black italic uppercase leading-none text-emerald-500">Stable</p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">Protocol: V2_Live</p>
            </div>
          </div>
        )}
      </div>

      {/* --- OPERATIONAL FEED & RAPID COMMANDS --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-border/10 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border/10 bg-muted/10 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">
                {isPlatformStaff ? "Global Network Activity" : "Local Telemetry Feed"}
              </h3>
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

        {/* Rapid Protocol Sidebar */}
        <div className="space-y-6">
          {/* Action Gating: Standard Merchant Operations */}
          {isMerchant && (
            <div className="rounded-3xl border border-border/10 bg-card/40 backdrop-blur-md p-6 md:p-8 shadow-xl">
              <h3 className="text-xs font-black uppercase italic tracking-widest mb-6 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Quick Deployment
              </h3>
              <div className="grid gap-3">
                <ActionBtn
                  href="/dashboard/services"
                  icon={PlusCircle}
                  title="New Service"
                  sub="Node Expansion"
                />
                <ActionBtn
                  href="/dashboard/coupons"
                  icon={TicketPercent}
                  title="Deployment Promotion"
                  sub="Incentive Node"
                />
              </div>
            </div>
          )}

          {/* Platform Staff: Support Oversight */}
          {isPlatformStaff && (
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 shadow-xl">
              <h3 className="text-xs font-black uppercase italic tracking-widest mb-4 flex items-center gap-2 text-amber-500">
                <MessageSquare className="h-4 w-4" />
                Support Queue
              </h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest mb-6 opacity-60">
                Audit and resolve incoming tickets across all business nodes.
              </p>
              <Link
                href="/dashboard/support"
                className="block w-full py-4 bg-amber-500 text-black text-center text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
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

/** 🛠️ UI HELPERS: Tactical Fallbacks */
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
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border/10 p-4 transition-all hover:bg-primary/5 hover:border-primary/20 bg-muted/5 active:scale-95"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20 shadow-inner">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-tight italic text-foreground group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-30 mt-0.5">
          {sub}
        </p>
      </div>
    </Link>
  );
}