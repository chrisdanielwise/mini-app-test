import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { MerchantService } from "@/lib/services/merchant.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CreditCard, Activity } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/analytics-chart";

export default async function AnalyticsPage() {
  const session = await requireMerchantSession();

  // Fetch real metrics from your service
  const stats = await MerchantService.getStats(session.merchant.id);

  // Sample data format (In production, MerchantService.getGrowthData would return this)
  const chartData = [
    { date: "Jan", revenue: 400 },
    { date: "Feb", revenue: 700 },
    { date: "Mar", revenue: 600 },
    { date: "Apr", revenue: 1200 },
    { date: "May", revenue: 1100 },
    { date: "Jun", revenue: 1800 },
  ];

  return (
    <div className="space-y-8 p-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Performance tracking for {session.merchant.companyName}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-primary/10 bg-gradient-to-b from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">${stats.totalRevenue}</div>
          </CardContent>
        </Card>
        {/* Add more metric cards here */}
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 italic uppercase">
            <Activity className="h-5 w-5 text-primary" />
            Revenue Growth
          </h2>
        </div>

        {/* The Client Chart Component */}
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}
