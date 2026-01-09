import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { AnalyticsService } from "@/lib/services/analytics.service"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { SubscribersChart } from "@/components/dashboard/subscribers-chart"
import { RecentPayments } from "@/components/dashboard/recent-payments"
import { DollarSign, Users, CreditCard, MessageSquare, PlusCircle, TicketPercent } from "lucide-react"

export default async function DashboardPage() {
  // 1. Authenticate session - session.merchant.id is a validated UUID
  const session = await requireMerchantSession()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // 2. Parallel data fetching for maximum performance
  // All services now return JSON-safe strings for BigInt and Decimal types
  const [dashboardStats, revenueAnalytics, subscriberGrowth] = await Promise.all([
    MerchantService.getDashboardStats(session.merchant.id),
    AnalyticsService.getRevenueAnalytics(session.merchant.id, {
      from: thirtyDaysAgo,
      to: new Date(),
    }),
    AnalyticsService.getSubscriberGrowth(session.merchant.id, {
      from: thirtyDaysAgo,
      to: new Date(),
    }),
  ])

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.fullName || "Merchant"}. Here is what's happening with your business.
        </p>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          // revenueAnalytics.total is a string from Prisma 7 Decimal
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
        <RevenueChart data={revenueAnalytics.dailyData} />
        <SubscribersChart data={subscriberGrowth.dailyData} />
      </div>

      {/* Bottom Section: Recent Activity & Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Payments - Span 2 columns */}
        <div className="lg:col-span-2">
          <RecentPayments payments={dashboardStats.recentPayments as any} />
        </div>

        {/* Action Center - Span 1 column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Manage your operations</p>
            </div>
            
            <div className="grid gap-4">
              <a
                href="/dashboard/services/new"
                className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 hover:border-primary/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">New Service</p>
                  <p className="text-xs text-muted-foreground">Setup a subscription plan</p>
                </div>
              </a>

              <a
                href="/dashboard/coupons/new"
                className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 hover:border-emerald-500/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                  <TicketPercent className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold">Create Coupon</p>
                  <p className="text-xs text-muted-foreground">Run a promotional offer</p>
                </div>
              </a>
            </div>
          </div>

          {/* Business Health Tip */}
          <div className="rounded-xl bg-primary p-6 text-primary-foreground">
            <h4 className="font-bold">Merchant Tip</h4>
            <p className="mt-2 text-sm opacity-90">
              Users are 40% more likely to renew when you offer a yearly discount tier. Check your Service settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}