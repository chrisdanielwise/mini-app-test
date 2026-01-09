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
} from "lucide-react";

export default async function DashboardPage() {
  /**
   * 1. AUTHENTICATION & LOOP PROTECTION
   * Uses requireMerchantSession which is now synchronized with our 
   * stateless JWT middleware to prevent redirect loops.
   */
  const session = await requireMerchantSession();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  /**
   * 2. PARALLEL DATA FETCHING
   * We trigger all DB queries simultaneously to avoid "waterfall" delays.
   */
  const [dashboardStats, revenueAnalytics, subscriberGrowth] =
    await Promise.all([
      MerchantService.getDashboardStats(session.merchant.id),
      AnalyticsService.getRevenueAnalytics(session.merchant.id, {
        from: thirtyDaysAgo,
        to: new Date(),
      }),
      AnalyticsService.getSubscriberGrowth(session.merchant.id, {
        from: thirtyDaysAgo,
        to: new Date(),
      }),
    ]);

  return (
    <div className="space-y-8 p-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Command Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back,{" "}
          <span className="font-bold text-foreground">
            {session.user.fullName || "Merchant"}
          </span>
          . Here is your business at a glance.
        </p>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${parseFloat(revenueAnalytics.total).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
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
        <div className="rounded-[2.5rem] border border-border bg-card p-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">Revenue Flow</h3>
          <RevenueChart data={revenueAnalytics.dailyData} />
        </div>
        <div className="rounded-[2.5rem] border border-border bg-card p-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">Subscriber Growth</h3>
          <SubscribersChart data={subscriberGrowth.dailyData} />
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Payments - Span 2 columns */}
        <div className="lg:col-span-2">
          <RecentPayments payments={dashboardStats.recentPayments as any} />
        </div>

        {/* Action Center - Span 1 column */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-black uppercase italic tracking-tight">
                Quick Actions
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Manage your operations
              </p>
            </div>

            <div className="grid gap-4">
              <a
                href="/dashboard/services/new"
                className="group flex items-center gap-4 rounded-2xl border border-border p-4 transition-all hover:bg-muted/50 active:scale-95"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-tight">
                    New Service
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Setup a subscription plan
                  </p>
                </div>
              </a>

              <a
                href="/dashboard/coupons/new"
                className="group flex items-center gap-4 rounded-2xl border border-border p-4 transition-all hover:bg-muted/50 active:scale-95"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                  <TicketPercent className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-tight">
                    Create Coupon
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Run a promotional offer
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Business Health Tip */}
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 fill-current" />
              <h4 className="font-black uppercase italic text-sm tracking-widest">
                Merchant Tip
              </h4>
            </div>
            <p className="text-xs font-bold leading-relaxed opacity-90">
              Users are 40% more likely to renew when you offer a yearly
              discount tier. Check your Service settings to add a "Lifetime" or
              "Yearly" option.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}