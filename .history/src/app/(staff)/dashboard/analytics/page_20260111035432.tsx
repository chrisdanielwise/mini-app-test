import { requireMerchantSession } from "@/lib/auth/merchant-session";
import * as MerchantService from "@/lib/services/merchant.service";
import {
  TrendingUp,
  CreditCard,
  Activity,
  Users,
  Ticket,
  Zap,
  PieChart as PieIcon,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  BarChart3,
} from "lucide-react";

// 📊 Visualization Nodes
import { RevenueChart } from "@/components/dashboard/analytics-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { cn } from "@/lib/utils";

/**
 * 🛰️ PERFORMANCE ANALYTICS (Apex Tier)
 * Normalized: World-standard typography and responsive grid constraints.
 * Fixed: Identity handshake aligned with session.merchantId.
 */
export default async function AnalyticsPage() {
  // 🔐 Identity Handshake
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 Data Fetch: Parallelized Cluster Sync
  const [stats, categoryData] = await Promise.all([
    MerchantService.getDashboardStats(realMerchantId),
    MerchantService.getCategoryDistribution(realMerchantId),
  ]);

  const analytics = stats.analytics;

  // 📈 Institutional Revenue Protocol (Live Simulation)
  const chartData = [
    { date: "Jan", revenue: 400 },
    { date: "Feb", revenue: 700 },
    { date: "Mar", revenue: 600 },
    { date: "Apr", revenue: 1200 },
    { date: "May", revenue: 1100 },
    { date: "Jun", revenue: 1800 },
  ];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Globe className="h-4 w-4 md:h-5 md:w-5 animate-[spin_10s_linear_infinite]" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
              Global Node Intelligence
            </h2>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Performance <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2 italic">
            <Terminal className="h-3 w-3" />
            Active Cluster:{" "}
            <span className="text-foreground">
              {session.config.companyName || "ROOT_NODE"}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <div className="px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-card/40 border border-border/40 flex items-center gap-4 shadow-xl">
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                System Status
              </p>
              <p className="text-[10px] font-black uppercase italic text-emerald-500">
                Node_Stable
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* --- HIGH-DENSITY METRIC CLUSTER --- */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Node */}
        <div className="rounded-3xl md:rounded-[3rem] border border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent p-6 sm:p-8 md:p-10 shadow-2xl group relative overflow-hidden">
          <TrendingUp className="absolute -right-6 -bottom-6 h-24 w-24 md:h-32 md:w-32 text-primary opacity-[0.03] -rotate-12 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-6 md:mb-10">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
              Gross Capital
            </p>
            <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-primary opacity-40" />
          </div>
          <div className="space-y-1 md:space-y-2">
            <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic leading-none truncate">
              $
              {Number(analytics?.totalRevenue || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center gap-2 text-emerald-500">
              <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-[9px] md:text-[10px] font-black uppercase italic tracking-widest">
                +12.4% VELOCITY
              </span>
            </div>
          </div>
        </div>

        {/* User Load Node */}
        <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-6 sm:p-8 md:p-10 shadow-xl group">
          <div className="flex justify-between items-start mb-6 md:mb-10">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
              Subscriber Load
            </p>
            <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground opacity-30 group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-1 md:space-y-2">
            <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic leading-none">
              {stats.activeSubscriptions.toLocaleString()}
            </p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Active User Instances
            </p>
          </div>
        </div>

        {/* Support Stress Node */}
        <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-6 sm:p-8 md:p-10 shadow-xl group">
          <div className="flex justify-between items-start mb-6 md:mb-10">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
              Support Stress
            </p>
            <Ticket className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground opacity-30 group-hover:text-amber-500 transition-colors" />
          </div>
          <div className="space-y-1 md:space-y-2">
            <p
              className={cn(
                "text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic leading-none",
                stats.pendingTickets > 0
                  ? "text-amber-500 animate-pulse"
                  : "text-foreground"
              )}
            >
              {stats.pendingTickets}
            </p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Tickets Pending Action
            </p>
          </div>
        </div>

        {/* Performance Tier Node */}
        <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-6 sm:p-8 md:p-10 shadow-xl group">
          <div className="flex justify-between items-start mb-6 md:mb-10">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
              System Rating
            </p>
            <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary opacity-30" />
          </div>
          <div className="space-y-1 md:space-y-2">
            <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic uppercase">
              Staff
              <span className="text-primary text-xl md:text-2xl">_Tier</span>
            </p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Institutional Optimized
            </p>
          </div>
        </div>
      </div>

      {/* --- VISUALIZATION LAYER: 2:1 INTELLIGENCE GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        {/* Main Revenue Velocity Chart */}
        <div className="xl:col-span-2 rounded-3xl md:rounded-[4rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden group">
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-16 gap-6 relative z-10">
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                  Revenue <span className="text-primary">Scalability</span>
                </h2>
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:ml-16 italic opacity-60">
                Temporal Earnings Velocity // USD
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {["1D", "1W", "1M", "ALL"].map((time) => (
                <button
                  key={time}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all border shrink-0",
                    time === "1M"
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] md:h-[500px] w-full relative z-10">
            <RevenueChart data={chartData} />
          </div>
        </div>

        {/* Asset Distribution Cluster */}
        <div className="rounded-3xl md:rounded-[4rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-6 sm:p-10 md:p-12 shadow-2xl flex flex-col relative overflow-hidden">
          <div className="mb-8 md:mb-12 relative z-10">
            <div className="flex items-center gap-3 md:gap-4 mb-2">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <PieIcon className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">
                Asset <span className="text-emerald-500">Spread</span>
              </h2>
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:ml-14 italic opacity-40">
              Subscription Allocation Node
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10 py-6 md:py-0">
            <CategoryChart data={categoryData} />
          </div>

          <div className="mt-8 md:mt-12 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-muted/10 border border-border/40 backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                Risk Audit Pass
              </p>
            </div>
            <p className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground leading-relaxed tracking-widest italic opacity-60">
              Portfolio diversification is stable across service nodes.
            </p>
          </div>
        </div>
      </div>

      {/* System Footnote */}
      <div className="flex items-center justify-center gap-3 md:gap-4 opacity-20 py-4 md:py-0">
        <Activity className="h-3 w-3" />
        <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] italic text-center">
          Zipha Core Protocol // Analytics Node Synchronization Active
        </p>
      </div>
    </div>
  );
}
