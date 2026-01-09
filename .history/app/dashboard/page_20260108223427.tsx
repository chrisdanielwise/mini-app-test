import { Suspense } from "react";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatsCardSkeleton } from "@/components/dashboard/stats-skeleton";
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import { AsyncSubscribersCard } from "@/components/dashboard/async-subscribers-card";
import { AsyncActivityFeed } from "@/components/dashboard/async-activity-feed";
import { PlusCircle, TicketPercent, Zap } from "lucide-react";

export default async function DashboardPage() {
  // 🔐 Secure the session before rendering anything
  const session = await requireMerchantSession();

  return (
    <DashboardShell>
      <div className="space-y-8 p-6 pb-20 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Welcome back,{" "}
            <span className="font-bold text-foreground">
              {session.user.fullName || "Merchant"}
            </span>.
          </p>
        </div>

        {/* 📊 Main Stats Grid (Async) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<StatsCardSkeleton count={2} />}>
            <AsyncRevenueCard merchantId={session.merchant.id} />
          </Suspense>
          <Suspense fallback={<StatsCardSkeleton count={2} />}>
            <AsyncSubscribersCard merchantId={session.merchant.id} />
          </Suspense>
        </div>

        {/* 📉 Main Analytics Charts (Async) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-[2.5rem] bg-muted" />}>
            <AsyncRevenueCard type="chart" merchantId={session.merchant.id} />
          </Suspense>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-[2.5rem] bg-muted" />}>
            <AsyncSubscribersCard type="chart" merchantId={session.merchant.id} />
          </Suspense>
        </div>

        {/* Bottom Section: Activity & Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-[2.5rem] bg-muted" />}>
              <AsyncActivityFeed merchantId={session.merchant.id} />
            </Suspense>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase italic tracking-tight mb-6">
                Quick Actions
              </h3>
              <div className="grid gap-4">
                <ActionBtn href="/dashboard/services/new" icon={PlusCircle} title="New Service" sub="Setup subscription" />
                <ActionBtn href="/dashboard/coupons/new" icon={TicketPercent} title="Create Coupon" sub="Run promotion" />
              </div>
            </div>

            <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 fill-current" />
                <h4 className="font-black uppercase italic text-sm tracking-widest">Native App Active</h4>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-90">Full-screen immersion active. Swipe gestures are locked.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <a href={href} className="group flex items-center gap-4 rounded-2xl border border-border p-4 transition-all hover:bg-muted/50 active:scale-95">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-tight">{title}</p>
        <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>
      </div>
    </a>
  );
}