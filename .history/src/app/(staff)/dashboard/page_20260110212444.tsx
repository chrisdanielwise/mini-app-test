import { Suspense } from "react";
import Link from "next/link";
import { PlusCircle, TicketPercent, Zap } from "lucide-react";
import { redirect } from "next/navigation";

// 🔐 Staff Identity Handshake
import { getMerchantSession } from "@/src/lib/auth/merchant-session";

// 🏗️ Layout & Shell Nodes
// We use the refined DashboardHeader to solve text-cropping
import { DashboardHeader } from "@/src/components/dashboard/dashboard-shell";
import { StatsCardSkeleton } from "@/src/components/dashboard/stats-card";

// 📊 Async Data Hydration
import { AsyncRevenueCard } from "@/src/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/src/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/src/components/dashboard/async-activity-feed";

/**
 * 🛰️ MERCHANT COMMAND CENTER (V2.6)
 * Optimized: Parallel streaming for institutional metrics.
 * Fixed: Integrated with Unified Shell to prevent UI overlap.
 */
export default async function DashboardPage() {
  // 🔐 1. Verify Identity on the Server
  const session = await getMerchantSession();

  // 🛡️ SECURITY GUARD: Institutional Bounce if session is invalid
  if (!session) {
    redirect("/dashboard/login?reason=session_invalid");
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- Apex Header --- 
          Fixed: Uses the clamp-responsive header to stop mobile cropping.
      */}
      <DashboardHeader 
        title="Command Center" 
        subtitle={`Welcome back, ${session.user.fullName || "Authorized Staff"}`} 
      />

      {/* 📊 Tier 2 Stats Ledger (Streaming Nodes) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncRevenueCard merchantId={session.merchantId} />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncSubscribersCard merchantId={session.merchantId} />
        </Suspense>
        {/* You can add more metric nodes here like 'Active Signals' or 'Open Tickets' */}
      </div>

      {/* 📈 Analytics Visualization Clusters */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Suspense fallback={<ChartPlaceholder />}>
          <AsyncRevenueCard type="chart" merchantId={session.merchantId} />
        </Suspense>
        <Suspense fallback={<ChartPlaceholder />}>
          <AsyncSubscribersCard type="chart" merchantId={session.merchantId} />
        </Suspense>
      </div>

      {/* --- Activity & Rapid Protocol Actions --- */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Main Operational Feed */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ActivityPlaceholder />}>
            <AsyncActivityFeed merchantId={session.merchantId} />
          </Suspense>
        </div>

        {/* Rapid Protocol Sidebar */}
        <div className="space-y-8">
          <div className="rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-md p-8 shadow-2xl">
            <h3 className="text-lg font-black uppercase italic tracking-tighter mb-6">
              Quick Actions
            </h3>
            <div className="grid gap-4">
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

          {/* Node Status Indicator */}
          <div className="rounded-[2.5rem] bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Zap className="h-20 w-20 fill-current" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 fill-current" />
                <h4 className="font-black uppercase italic text-xs tracking-[0.2em]">
                  Node Stability: High
                </h4>
              </div>
              <p className="text-[11px] font-bold leading-relaxed opacity-90 uppercase tracking-tight">
                Handshake verified for {session.config.companyName}. Protocol V2.6 Operational.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 🛠️ UI HELPERS: Specialized Fallbacks */
function ChartPlaceholder() {
  return (
    <div className="h-[320px] w-full animate-pulse rounded-[2.5rem] bg-muted/10 border border-border/5" />
  );
}

function ActivityPlaceholder() {
  return (
    <div className="h-[450px] w-full animate-pulse rounded-[2.5rem] bg-muted/10 border border-border/5" />
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 rounded-[2rem] border border-border/10 p-5 transition-all hover:bg-primary/5 active:scale-95"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-tight italic">{title}</p>
        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{sub}</p>
      </div>
    </Link>
  );
}