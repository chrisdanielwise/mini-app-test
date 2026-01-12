import { Suspense } from "react";
import Link from "next/link";
import {
  PlusCircle,
  TicketPercent,
  Zap,
  Activity,
  Terminal,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

// 🔐 Staff Identity Handshake
import { getMerchantSession } from "@/lib/auth/merchant-session";

// 🏗️ Layout & Shell Nodes
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatsCardSkeleton } from "@/components/dashboard/stats-card";

// 📊 Async Data Hydration
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";
import { cn } from "@/lib/utils";

/**
 * 🛰️ MERCHANT COMMAND CENTER (Tactical Medium)
 * Normalized: World-standard fluid scaling for institutional oversight.
 * Optimized: High-density layout to prevent metric cropping.
 */
export default async function DashboardPage() {
  // 🔐 1. Verify Identity on the Server
  const session = await getMerchantSession();

  // 🛡️ SECURITY GUARD: Institutional Bounce if session is invalid
  if (!session) {
    redirect("/dashboard/login?reason=session_invalid");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="border-b border-border/40 pb-6">
        <DashboardHeader
          title="Command Center"
          subtitle={`Node Session: ${session.user.fullName || "Authorized Staff"}`}
        />
        <div className="flex items-center gap-2 mt-2 opacity-30">
          <Terminal className="h-3 w-3" />
          <p className="text-[8px] font-black uppercase tracking-[0.3em] italic">
            Cluster: {session.config.companyName || "ROOT_NODE"} // V2.26
          </p>
        </div>
      </div>

      {/* 📊 TACTICAL STATS LEDGER (High Density) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncRevenueCard merchantId={session.merchantId} />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncSubscribersCard merchantId={session.merchantId} />
        </Suspense>
        {/* Growth Nodes: Scaled for density */}
        <div className="hidden lg:flex items-center justify-center border border-border/10 rounded-2xl bg-muted/5 opacity-40 italic">
          <p className="text-[9px] font-black uppercase tracking-widest">Telemetry_Pending</p>
        </div>
        <div className="hidden lg:flex items-center justify-center border border-border/10 rounded-2xl bg-muted/5 opacity-40 italic">
          <p className="text-[9px] font-black uppercase tracking-widest">Signal_Offline</p>
        </div>
      </div>

      {/* 📈 TELEMETRY VISUALIZATION: COMPACT GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/10 bg-card/40 p-6 shadow-xl backdrop-blur-xl">
           <div className="flex items-center gap-2 mb-4 opacity-60">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Revenue Velocity</h3>
           </div>
           <Suspense fallback={<ChartPlaceholder />}>
             <AsyncRevenueCard type="chart" merchantId={session.merchantId} />
           </Suspense>
        </div>

        <div className="rounded-2xl border border-border/10 bg-card/40 p-6 shadow-xl backdrop-blur-xl">
           <div className="flex items-center gap-2 mb-4 opacity-60">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Subscriber Spread</h3>
           </div>
           <Suspense fallback={<ChartPlaceholder />}>
             <AsyncSubscribersCard type="chart" merchantId={session.merchantId} />
           </Suspense>
        </div>
      </div>

      {/* --- OPERATIONAL FEED & RAPID COMMANDS --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Operational Feed: 2-Column Span */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/10 bg-card/40 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/10 bg-muted/10 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inbound Telemetry</h3>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <Suspense fallback={<ActivityPlaceholder />}>
              <AsyncActivityFeed merchantId={session.merchantId} />
            </Suspense>
          </div>
        </div>

        {/* Rapid Protocol Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-md p-5 md:p-6 shadow-lg">
            <h3 className="text-xs font-black uppercase italic tracking-widest mb-4 flex items-center gap-2 text-foreground/80">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Quick Actions
            </h3>
            <div className="grid gap-2">
              <ActionBtn
                href="/dashboard/services"
                icon={PlusCircle}
                title="New Service"
                sub="Setup subscription"
              />
              <ActionBtn
                href="/dashboard/coupons"
                icon={TicketPercent}
                title="Create Coupon"
                sub="Run promotion"
              />
            </div>
          </div>

          {/* Node Status Indicator: Tactical Scale */}
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-xl relative overflow-hidden group">
            <Zap className="absolute -bottom-2 -right-2 h-12 w-12 opacity-10 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <h4 className="font-black uppercase italic text-[9px] tracking-widest">
                  Identity Verified
                </h4>
              </div>
              <p className="text-[9px] font-bold leading-relaxed opacity-80 uppercase tracking-widest">
                Node_Stable: {session.config.companyName || "ROOT"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 🛠️ UI HELPERS: Tactical Fallbacks */
function ChartPlaceholder() {
  return (
    <div className="h-[250px] md:h-[300px] w-full animate-pulse rounded-xl bg-muted/5 border border-border/5" />
  );
}

function ActivityPlaceholder() {
  return (
    <div className="h-[300px] md:h-[400px] w-full animate-pulse bg-transparent" />
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border/10 p-3.5 transition-all hover:bg-primary/5 active:scale-[0.98] bg-muted/5"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-tight italic text-foreground group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
          {sub}
        </p>
      </div>
    </Link>
  );
}