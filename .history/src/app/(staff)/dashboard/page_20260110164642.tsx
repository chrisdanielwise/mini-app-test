import { Suspense } from "react";
import Link from "next/link";
import { PlusCircle, TicketPercent, Zap } from "lucide-react";
import { redirect } from "next/navigation";

// 🔐 Staff Identity Handshake
import { getMerchantSession } from "@/src/lib/auth/merchant-session";

// 🏗️ Layout & Shell
import { DashboardShell } from "@/src/components/dashboard/dashboard-shell";
import { StatsCardSkeleton } from "@/src/components/dashboard/stats-card";

// 📊 Async Data Nodes
import { AsyncRevenueCard } from "@/src/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/src/components/dashboard/async-subscribers-card";
import AsyncActivityFeed from "@/src/components/dashboard/async-activity-feed";

/**
 * 🛰️ MERCHANT COMMAND CENTER (Staff Tier)
 * Fixed Pathing: Uses session.merchantId and session.config
 */
export default async function DashboardPage() {
  // 🔐 1. Verify Identity on the Server
  const session = await getMerchantSession();

  // 🛡️ SECURITY GUARD: Institutional Bounce if session is invalid
  if (!session) {
    redirect("/dashboard/login?reason=session_invalid");
  }

  return (
    <DashboardShell>
      <div className="space-y-8 p-6 pb-20 animate-in fade-in duration-700">
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Welcome back,{" "}
            <span className="font-bold text-foreground">
              {session.user.fullName || "Authorized Staff"}
            </span>
            .
          </p>
        </div>

        {/* 📊 Tier 2 Stats Ledger (Async Parallel Fetch) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<StatsCardSkeleton />}>
            {/* ✅ FIXED: Accessing merchantId directly */}
            <AsyncRevenueCard merchantId={session.merchantId} />
          </Suspense>
          <Suspense fallback={<StatsCardSkeleton />}>
            {/* ✅ FIXED: Accessing merchantId directly */}
            <AsyncSubscribersCard merchantId={session.merchantId} />
          </Suspense>
        </div>

        {/* 📈 Analytics Visualization Nodes */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Suspense fallback={<ChartPlaceholder />}>
            <AsyncRevenueCard type="chart" merchantId={session.merchantId} />
          </Suspense>
          <Suspense fallback={<ChartPlaceholder />}>
            <AsyncSubscribersCard
              type="chart"
              merchantId={session.merchantId}
            />
          </Suspense>
        </div>

        {/* --- Bottom Section: Activity & Actions --- */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Ledger Feed */}
          <div className="lg:col-span-2">
            <Suspense fallback={<ActivityPlaceholder />}>
              <AsyncActivityFeed merchantId={session.merchantId} />
            </Suspense>
          </div>

          {/* Sidebar Protocols */}
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase italic tracking-tight mb-6">
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

            {/* Status Indicator */}
            <div className="rounded-[2.5rem] bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 fill-current" />
                <h4 className="font-black uppercase italic text-sm tracking-widest">
                  Native App Active
                </h4>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-90">
                {/* ✅ FIXED: Accessing companyName via config */}
                Full-screen immersion active. {session.config.companyName}{" "}
                dashboard is live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

/** * 🛠️ UI HELPERS: Specialized Fallbacks */
function ChartPlaceholder() {
  return (
    <div className="h-[300px] w-full animate-pulse rounded-[2.5rem] bg-muted/50 border border-border/50" />
  );
}

function ActivityPlaceholder() {
  return (
    <div className="h-[400px] w-full animate-pulse rounded-[2.5rem] bg-muted/50 border border-border/50" />
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl border border-border p-4 transition-all hover:bg-muted/50 active:scale-95"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-tight">{title}</p>
        <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>
      </div>
    </Link>
  );
}
