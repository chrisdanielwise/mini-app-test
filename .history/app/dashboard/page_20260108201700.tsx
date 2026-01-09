import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { MerchantService } from "@/lib/services/merchant.service";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SubscribersChart } from "@/components/dashboard/subscribers-chart";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import {
  DollarSign,
  Users,
  CreditCard,
  MessageSquare,
  PlusCircle,
  TicketPercent,
  Zap,
  RefreshCcw
} from "lucide-react";

export default async function DashboardPage() {
  // 1. Authenticate - uses the stateless JWT check for speed
  const session = await requireMerchantSession();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    /**
     * 🏁 THE NEON RACE
     * We trigger parallel fetching but add a 10s timeout safety net.
     * This prevents the "Establishing Secure Link" hang from freezing the UI.
     */
    const [dashboardStats, revenueAnalytics, subscriberGrowth] = await Promise.race([
      Promise.all([
        MerchantService.getDashboardStats(session.merchant.id),
        AnalyticsService.getRevenueAnalytics(session.merchant.id, {
          from: thirtyDaysAgo,
          to: new Date(),
        }),
        AnalyticsService.getSubscriberGrowth(session.merchant.id, {
          from: thirtyDaysAgo,
          to: new Date(),
        }),
      ]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("DATABASE_CONNECTION_TIMEOUT")), 10000)
      )
    ]) as any;

    return (
      <div className="space-y-8 p-6 pb-20 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Welcome back, <span className="font-bold text-foreground">{session.user.fullName || "Merchant"}</span>.
          </p>
        </div>

        {/* Stats Overview Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${parseFloat(revenueAnalytics.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            change={12.5}
            icon={DollarSign}
            iconColor="text-emerald-500"
          />
          <StatsCard
            title="Active Subscribers"
            value={dashboardStats.activeSubscriptions}
            change={8.2}
            icon={Users}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Transactions"
            value={revenueAnalytics.transactionCount}
            change={-3.1}
            icon={CreditCard}
            iconColor="text-violet-500"
          />
          <StatsCard
            title="Pending Tickets"
            value={dashboardStats.pendingTickets}
            icon={MessageSquare}
            iconColor="text-orange-500"
          />
        </div>

        {/* Main Analytics Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Revenue Growth</h3>
            <RevenueChart data={revenueAnalytics.dailyData} />
          </div>
          <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">User Growth</h3>
            <SubscribersChart data={subscriberGrowth.dailyData} />
          </div>
        </div>

        {/* Bottom Section: Recent Activity & Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentPayments payments={dashboardStats.recentPayments as any} />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase italic tracking-tight mb-6">Quick Actions</h3>
              <div className="grid gap-4">
                <ActionBtn href="/dashboard/services/new" icon={PlusCircle} title="New Service" sub="Setup subscription" />
                <ActionBtn href="/dashboard/coupons/new" icon={TicketPercent} title="Create Coupon" sub="Run promotion" />
              </div>
            </div>

            <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 fill-current" />
                <h4 className="font-black uppercase italic text-sm tracking-widest">Merchant Tip</h4>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-90">
                Yearly tiers increase retention by 40%. Consider adding one today in service settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    /**
     * 🛡️ RETRY UI
     * Triggered if Neon is in a cold state or connection is jittery.
     */
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="p-6 bg-orange-500/10 rounded-full">
          <RefreshCcw className="h-12 w-12 text-orange-500 animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Connection Delayed</h2>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm">
            The secure link to Neon is taking longer than usual (Cold Start). 
            Please try waking the database.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-primary text-primary-foreground font-black uppercase italic rounded-2xl active:scale-95 transition-all shadow-lg shadow-primary/25"
        >
          Wake Up Database
        </button>
      </div>
    );
  }
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