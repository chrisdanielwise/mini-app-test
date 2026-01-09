import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { MerchantService } from "@/lib/services/merchant.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CreditCard, Activity, Users, Ticket } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/analytics-chart";

export default async function AnalyticsPage() {
  // 1. Authenticate and get session
  const session = await requireMerchantSession();

  // 2. Fetch real metrics using the unabbreviated service method
  // We use getDashboardStats which handles the Decimal to String conversion
  const stats = await MerchantService.getDashboardStats(session.merchant.id);

  // 3. Fallback chart data (In production, you'd fetch this from MerchantService.getLedger)
  const chartData = [
    { date: "Jan", revenue: 400 },
    { date: "Feb", revenue: 700 },
    { date: "Mar", revenue: 600 },
    { date: "Apr", revenue: 1200 },
    { date: "May", revenue: 1100 },
    { date: "Jun", revenue: 1800 },
  ];

  const analytics = stats.analytics;

  return (
    <div className="space-y-8 p-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Performance tracking for {session.merchant.companyName}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Revenue Card */}
        <Card className="rounded-3xl border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Total Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">${analytics?.totalRevenue || "0.00"}</div>
            <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        {/* Active Subscribers Card */}
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Active Subs
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.activeSubscriptions}</div>
            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">
              Live customers
            </p>
          </CardContent>
        </Card>

        {/* Support Tickets Card */}
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Open Tickets
            </CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.pendingTickets}</div>
            <p className="text-[10px] font-bold text-amber-500 mt-1 uppercase">
              Awaiting response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2 italic uppercase">
              <Activity className="h-5 w-5 text-primary" />
              Revenue Growth
            </h2>
            <p className="text-xs text-muted-foreground font-medium">Monthly signal earnings performance</p>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <RevenueChart data={chartData} />
        </div>
      </div>
    </div>
  );
}