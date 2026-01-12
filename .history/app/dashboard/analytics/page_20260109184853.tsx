import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
/** * ✅ ARCHITECTURAL SYNC:
 * Using Namespace Import to resolve 'MerchantService doesn't exist' error.
 */
import * as MerchantService from "@/src/lib/services/merchant.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  TrendingUp,
  CreditCard,
  Activity,
  Users,
  Ticket,
  Zap,
  PieChart as PieIcon,
} from "lucide-react";
import { RevenueChart } from "@/src/components/dashboard/analytics-chart";
import { CategoryChart } from "@/src/components/dashboard/category-chart";
import { cn } from "@/src/lib/utils";

export default async function AnalyticsPage() {
  // 🔐 1. Identity Handshake
  const session = await requireMerchantSession();

  // 🏁 2. Data Fetch: Synchronized Parallel Execution
  const [stats, categoryData] = await Promise.all([
    MerchantService.getDashboardStats(session.merchant.id),
    MerchantService.getCategoryDistribution(session.merchant.id),
  ]);

  const analytics = stats.analytics;

  // 📈 3. Revenue Protocol (Sync with real ledger data in future turns)
  const chartData = [
    { date: "Jan", revenue: 400 },
    { date: "Feb", revenue: 700 },
    { date: "Mar", revenue: 600 },
    { date: "Apr", revenue: 1200 },
    { date: "May", revenue: 1100 },
    { date: "Jun", revenue: 1800 },
  ];

  return (
    <div className="space-y-10 p-4 sm:p-8 pb-32 animate-in fade-in duration-700">
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">
              Live Node Analytics
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
            Performance
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-70">
            Cluster:{" "}
            <span className="text-foreground">
              {session.merchant.companyName || "Global Root"}
            </span>
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary/10 border border-primary/20 shadow-xl shadow-primary/5">
          <TrendingUp className="h-7 w-7 text-primary" />
        </div>
      </div>

      {/* --- METRIC GRID --- */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2.5rem] border-primary/20 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent shadow-2xl shadow-primary/5 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-8 px-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Gross Revenue
            </CardTitle>
            <CreditCard className="h-5 w-5 text-primary opacity-50 group-hover:rotate-12 transition-transform" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-4xl font-black tracking-tighter italic">
              $
              {Number(analytics?.totalRevenue || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-500">
              <Zap className="h-3 w-3 fill-emerald-500" />
              <p className="text-[9px] font-black uppercase tracking-widest">
                +12.4% Momentum
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-md shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-8 px-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Active Nodes
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground opacity-30" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-4xl font-black tracking-tighter italic">
              {stats.activeSubscriptions.toLocaleString()}
            </div>
            <p className="text-[9px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60">
              Verified User Instances
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-md shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-8 px-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Pending Tickets
            </CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground opacity-30" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div
              className={cn(
                "text-4xl font-black tracking-tighter italic",
                stats.pendingTickets > 0 ? "text-amber-500" : "text-foreground"
              )}
            >
              {stats.pendingTickets}
            </div>
            <p className="text-[9px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-60">
              Protocol Support Queue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- VISUALIZATION LAYER: 2:1 GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Velocity Chart */}
        <div className="lg:col-span-2 rounded-[3rem] border border-border/50 bg-card/30 backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 relative">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-3 italic uppercase tracking-tighter">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                Revenue Scalability
              </h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mt-1 ml-11">
                Cluster Earnings Velocity (Last 6 Months)
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-[9px] font-black uppercase tracking-widest">
              Protocol: USD
            </div>
          </div>

          <div className="h-[400px] w-full relative">
            <RevenueChart data={chartData} />
          </div>
        </div>

        {/* Category Breakdown Node */}
        <div className="rounded-[3rem] border border-border/50 bg-card/30 backdrop-blur-xl p-8 shadow-2xl flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-black flex items-center gap-3 italic uppercase tracking-tighter">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <PieIcon className="h-4 w-4 text-emerald-500" />
              </div>
              Asset Spread
            </h2>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 ml-11 opacity-60">
              Subscription Distribution
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <CategoryChart data={categoryData} />
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-muted/20 border border-border/50">
            <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest text-center">
              Portfolio diversification provides risk mitigation across asset
              categories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
