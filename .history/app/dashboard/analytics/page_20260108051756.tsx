import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, CreditCard, Activity } from "lucide-react"

export default async function AnalyticsPage() {
  const session = await requireMerchantSession()
  
  // Fetch high-level stats for the merchant
  const stats = await MerchantService.getStats(session.merchant.id)

  return (
    <div className="space-y-8 p-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Analytics</h1>
        <p className="text-muted-foreground">Track your revenue and signal performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">Across all signal tiers</p>
          </CardContent>
        </Card>
        
        {/* Additional stats cards can be added here */}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Growth Trends
        </h2>
        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground italic">Revenue Chart Placeholder (Integration with Recharts)</p>
        </div>
      </div>
    </div>
  )
}