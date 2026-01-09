import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { AnalyticsService } from "@/lib/services/analytics.service"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { SubscribersChart } from "@/components/dashboard/subscribers-chart"
import { RecentPayments } from "@/components/dashboard/recent-payments"
import { DollarSign, Users, CreditCard, MessageSquare } from "lucide-react"

export default async function DashboardPage() {
  const session = await requireMerchantSession()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session.user.fullName}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${revenueAnalytics.total.toFixed(2)}`}
          change={12}
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Active Subscribers"
          value={dashboardStats.activeSubscriptions}
          change={8}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Transactions"
          value={revenueAnalytics.transactionCount}
          change={-3}
          icon={CreditCard}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Open Tickets"
          value={dashboardStats.pendingTickets}
          icon={MessageSquare}
          iconColor="text-orange-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueAnalytics.dailyData} />
        <SubscribersChart data={subscriberGrowth.dailyData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentPayments payments={dashboardStats.recentPayments as any} />
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Common tasks</p>
          </div>
          <div className="grid gap-3">
            <a
              href="/dashboard/services/new"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Create New Service</p>
                <p className="text-sm text-muted-foreground">Add a subscription service</p>
              </div>
            </a>
            <a
              href="/dashboard/coupons/new"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CreditCard className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Create Coupon</p>
                <p className="text-sm text-muted-foreground">Offer discounts to customers</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
