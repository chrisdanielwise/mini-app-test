import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { MerchantService } from "@/lib/services/merchant.service";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SubscribersChart } from "@/components/dashboard/subscribers-chart";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DollarSign,
  Users,
  CreditCard,
  MessageSquare,
  PlusCircle,
  TicketPercent,
  Zap,
  RefreshCcw,
} from "lucide-react";

/**
 * 🚀 MERCHANT COMMAND CENTER (Bot API 8.0 Ready)
 * Optimized for stateless JWT auth and Neon Serverless resilience.
 */
export default async function DashboardPage() {
  // 1. Authenticate - uses the high-speed stateless JWT check
  const session = await requireMerchantSession();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    /**
     * 🏁 THE NEON RACE (Cold Start Resilience)
     * Parallel fetching with a 15s safety net.
     * Neon typically wakes up in 5-10s; 15s ensures a successful handshake.
     */
    const [dashboardStats, revenueAnalytics, subscriberGrowth] =
      (await Promise.race([
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
          setTimeout(
            () => reject(new Error("DATABASE_CONNECTION_TIMEOUT")),
            15000 // 🏁 Optimal window for serverless wake-up
          )
        ),
      ])) as any;

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

          {/* Stats Overview Grid with Safe Fallbacks */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Revenue"
              value={`$${parseFloat(revenueAnalytics?.total || 0).toLocaleString(
                undefined,
                { minimumFractionDigits: 2 }
              )}`}
              change={12.5}
              icon={DollarSign}
              iconColor="text-emerald-500"
            />
            <StatsCard
              title="Active Subscribers"
              value={dashboardStats?.activeSubscriptions || 0}
              change={8.2}
              icon={Users}
              iconColor="text-blue-500"
            />
            <StatsCard
              title="Transactions"
              value={revenueAnalytics?.transactionCount || 0}
              change={-3.1}
              icon={CreditCard}
              iconColor="text-violet-500"
            />
            <StatsCard
              title="Pending Tickets"
              value={dashboardStats?.pendingTickets || 0}
              icon={MessageSquare}
              iconColor="text-orange-500"
            />
          </div>

          {/* Main Analytics Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                Revenue Growth
              </h3>
              <RevenueChart data={revenueAnalytics?.dailyData || []} />
            </div>
            <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                User Growth
              </h3>
              <SubscribersChart data={subscriberGrowth?.dailyData || []} />
            </div>
          </div>

          {/* Bottom Section: Recent Activity & Actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentPayments payments={dashboardStats?.recentPayments || []} />
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <h3 className="text-lg font-black uppercase italic tracking-tight mb-6">
                  Quick Actions
                </h3>
                <div className="grid gap-4">
                  <ActionBtn
                    href="/dashboard/services/new"
                    icon={PlusCircle}
                    title="New Service"
                    sub="Setup subscription"
                  />
                  <ActionBtn
                    href="/dashboard/coupons/new"
                    icon={TicketPercent}
                    title="Create Coupon"
                    sub="Run promotion"
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 fill-current" />
                  <h4 className="font-black uppercase italic text-sm tracking-widest">
                    Native App Active
                  </h4>
                </div>
                <p className="text-xs font-bold leading-relaxed opacity-90">
                  Full-screen immersion active. Swipe gestures are locked for session security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  } catch (error) {
    /**
     * 🛡️ WAKE-UP UI
     * Displays a professional retry screen if Neon takes longer than 15s.
     */
    return (
      <div className="flex flex-col items-center justify-center min-h-[100vh] text-center space-y-6 bg-background p-6">
        <div className="p-6 bg-orange-500/10 rounded-full">
          <RefreshCcw className="h-12 w-12 text-orange-500 animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            Establishing Secure Link
          </h2>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm font-medium">
            The database is waking up from an idle state. This usually takes 5-10 seconds.
          </p>
        </div>
        <a
          href="/dashboard"
          className="px-10 py-4 bg-primary text-primary-foreground font-black uppercase italic rounded-2xl active:scale-95 transition-all shadow-lg shadow-primary/25"
        >
          Wake Up Database
        </a>
      </div>
    );
  }
}

function ActionBtn({ href, icon: Icon, title, sub }: any) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border p-4 transition-all hover:bg-muted/50 active:scale-95"
    >
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