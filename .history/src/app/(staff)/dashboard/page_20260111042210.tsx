import { Suspense } from "react";
import Link from "next/link";
import {
  PlusCircle,
  TicketPercent,
  Zap,
  Activity,
  Terminal,
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
 * 🛰️ MERCHANT COMMAND CENTER (V2.6 Apex Tier)
 * Fixed: Resilient grid and fluid padding to eliminate metric cropping.
 * Optimized: Streaming parallel hydration for institutional performance.
 */
export default async function DashboardPage() {
  // 🔐 1. Verify Identity on the Server
  const session = await getMerchantSession();

  // 🛡️ SECURITY GUARD: Institutional Bounce if session is invalid
  if (!session) {
    redirect("/dashboard/login?reason=session_invalid");
  }

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      {/* --- Apex Header --- */}
      <DashboardHeader
        title="Command Center"
        subtitle={`Welcome back, ${
          session.user.fullName || "Authorized Staff"
        }`}
      />

      {/* 📊 Tier 2 Stats Ledger (Fluid Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncRevenueCard merchantId={session.merchantId} />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <AsyncSubscribersCard merchantId={session.merchantId} />
        </Suspense>
        {/* Placeholder for future growth nodes */}
        <div className="hidden lg:block h-full border border-border/5 rounded-[2rem] bg-muted/5 opacity-20" />
        <div className="hidden lg:block h-full border border-border/5 rounded-[2rem] bg-muted/5 opacity-20" />
      </div>

      {/* 📈 Analytics Visualization Clusters */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        <Suspense fallback={<ChartPlaceholder />}>
          <AsyncRevenueCard type="chart" merchantId={session.merchantId} />
        </Suspense>
        <Suspense fallback={<ChartPlaceholder />}>
          <AsyncSubscribersCard type="chart" merchantId={session.merchantId} />
        </Suspense>
      </div>

      {/* --- Activity & Rapid Protocol Actions --- */}
      <div className="grid gap-6 md:gap-10 lg:grid-cols-3">
        {/* Main Operational Feed */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ActivityPlaceholder />}>
            <AsyncActivityFeed merchantId={session.merchantId} />
          </Suspense>
        </div>

        {/* Rapid Protocol Sidebar */}
        <div className="space-y-6 md:space-y-8">
          <div className="rounded-[2rem] md:rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-md p-6 md:p-8 shadow-2xl">
            <h3 className="text-base md:text-lg font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Quick Actions
            </h3>
            <div className="grid gap-3 md:gap-4">
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
          <div className="rounded-[2rem] md:rounded-[2.5rem] bg-primary p-6 md:p-8 text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Zap className="h-16 w-16 md:h-20 md:w-20 fill-current" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 fill-current opacity-80" />
                <h4 className="font-black uppercase italic text-[10px] md:text-xs tracking-[0.2em]">
                  Node Stability: High
                </h4>
              </div>
              <p className="text-[10px] md:text-[11px] font-bold leading-relaxed opacity-90 uppercase tracking-tight">
                Institutional protocol verified for {session.config.companyName}
                . v2.6 Operational.
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
    <div className="h-[280px] md:h-[320px] w-full animate-pulse rounded-[2rem] md:rounded-[2.5rem] bg-muted/10 border border-border/5" />
  );
}

function ActivityPlaceholder() {
  return (
    <div className="h-[350px] md:h-[450px] w-full animate-pulse rounded-[2rem] md:rounded-[2.5rem] bg-muted/10 border border-border/5" />
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 md:gap-5 rounded-[1.5rem] md:rounded-[2rem] border border-border/10 p-4 md:p-5 transition-all hover:bg-primary/5 active:scale-95"
    >
      <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-tight italic truncate">
          {title}
        </p>
        <p className="text-[8px] md:text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60 truncate">
          {sub}
        </p>
      </div>
    </Link>
  );
}
