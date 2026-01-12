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
// import { RevenueChart } from "@/components/dashboard/analytics-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { cn } from "@/lib/utils";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

/**
 * 🛰️ PERFORMANCE ANALYTICS (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Fixed: Comprehensive flex-wrap logic for zero-crop headers.
 */
export default async function AnalyticsPage() {
  // 🔐 Identity Handshake: Institutional Scoping
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 Data Fetch: Parallelized Cluster Sync
  const [stats, categoryData] = await Promise.all([
    MerchantService.getDashboardStats(realMerchantId),
    MerchantService.getCategoryDistribution(realMerchantId),
  ]);

  const analytics = stats.analytics;

  // 📈 Institutional Revenue Protocol (Historical Telemetry)
  const chartData = [
    { date: "Jan", revenue: 400 },
    { date: "Feb", revenue: 700 },
    { date: "Mar", revenue: 600 },
    { date: "Apr", revenue: 1200 },
    { date: "May", revenue: 1100 },
    { date: "Jun", revenue: 1800 },
  ];

  return (
    <div className="max-w-full overflow-x-hidden space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
      
      {/* --- COMMAND HUD HEADER: INTRINSIC WRAP --- */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-8 w-full border-b border-border/40 pb-8 md:pb-12 px-1">
        <div className="flex flex-col gap-4 min-w-fit flex-1">
          <div className="flex items-center gap-3 text-primary">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner shrink-0">
              <Globe className="h-4 w-4 md:h-5 md:w-5 animate-[spin_10s_linear_infinite]" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80 whitespace-nowrap">
              Global Node Intelligence
            </span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] uppercase italic leading-[0.8] text-foreground whitespace-normal break-words max-w-[90vw]">
              Performance <span className="text-primary">Intelligence</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2 italic opacity-40 leading-none">
              <Terminal className="h-3 w-3" />
              Cluster: {session.config.companyName || "ROOT_NODE"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 lg:mt-auto">
          <div className="px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-card/40 border border-border/40 flex items-center gap-3 shadow-xl backdrop-blur-md">
            <div className="text-right hidden sm:block">
              <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground opacity-40">System</p>
              <p className="text-[9px] font-black uppercase italic text-emerald-500">Stable</p>
            </div>
            <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* --- HIGH-DENSITY METRIC CLUSTER --- */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Node */}
        <div className="rounded-2xl md:rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent p-6 md:p-8 shadow-2xl relative overflow-hidden group">
          <TrendingUp className="absolute -right-4 -bottom-4 h-24 w-24 text-primary opacity-[0.03] -rotate-12 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary italic">Gross Capital</p>
            <CreditCard className="h-4 w-4 text-primary opacity-40" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter italic leading-none truncate tabular-nums">
              ${Number(analytics?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 text-emerald-500 pt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span className="text-[8px] md:text-[9px] font-black uppercase italic tracking-widest">Inflow_Velocity_Positive</span>
            </div>
          </div>
        </div>

        {/* User Load Node */}
        <div className="rounded-2xl md:rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-6 md:p-8 shadow-xl group">
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Subscriber Load</p>
            <Users className="h-4 w-4 text-muted-foreground opacity-30 group-hover:text-primary transition-all" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter italic leading-none tabular-nums">
              {stats.activeSubscriptions.toLocaleString()}
            </p>
            <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic pt-1">Active Broadcasters</p>
          </div>
        </div>

        {/* Support Stress Node */}
        <div className="rounded-2xl md:rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-6 md:p-8 shadow-xl group">
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Support Stress</p>
            <Ticket className="h-4 w-4 text-muted-foreground opacity-30 group-hover:text-amber-500 transition-all" />
          </div>
          <div className="space-y-1">
            <p className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter italic leading-none tabular-nums",
                stats.pendingTickets > 0 ? "text-amber-500 animate-pulse" : "text-foreground"
              )}>
              {stats.pendingTickets}
            </p>
            <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic pt-1">Critical_Tasks_Pending</p>
          </div>
        </div>

        {/* System Rating Node */}
        <div className="rounded-2xl md:rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-6 md:p-8 shadow-xl group">
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Node Rating</p>
            <Zap className="h-4 w-4 text-primary opacity-30 group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter italic uppercase leading-none">
              APEX<span className="text-primary text-xl lg:text-2xl">_Tier</span>
            </p>
            <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic pt-1">Institutional_High_Trust</p>
          </div>
        </div>
      </div>

      {/* --- VISUALIZATION LAYER: 2:1 INTELLIGENCE GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        
        {/* Main Revenue Velocity Chart */}
        <div className="xl:col-span-2 rounded-2xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 md:mb-14 gap-6 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-10 w-10 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none whitespace-normal">
                  Revenue <span className="text-primary">Scalability</span>
                </h2>
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:ml-16 italic opacity-60">
                Temporal Earnings Velocity // USD
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide shrink-0">
              {["1D", "1W", "1M", "ALL"].map((time) => (
                <button
                  key={time}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all border shrink-0",
                    time === "1M"
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-muted/10 border-border/10 text-muted-foreground hover:bg-muted/20"
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
        <div className="rounded-2xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-6 sm:p-10 md:p-12 shadow-2xl flex flex-col relative overflow-hidden">
          <div className="mb-10 md:mb-12 relative z-10">
            <div className="flex items-center gap-3 md:gap-4 mb-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <PieIcon className="h-4 w-4 text-emerald-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">
                Asset <span className="text-emerald-500">Spread</span>
              </h2>
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:ml-12 italic opacity-40">
              Identity Allocation Node
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10 min-h-[300px]">
            <CategoryChart data={categoryData} />
          </div>

          <div className="mt-8 p-6 rounded-2xl md:rounded-[2rem] bg-muted/10 border border-border/10 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                Risk Audit Neutral
              </p>
            </div>
            <p className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground leading-relaxed tracking-widest italic opacity-50">
              Identity diversification stable across nodes.
            </p>
          </div>
        </div>
      </div>

      {/* SYSTEM FOOTNOTE: ZERO-BLEED ALIGNMENT */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
        <Activity className="h-3 w-3 animate-pulse" />
        <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] italic text-center">
          Zipha Core Intelligence // Sync_Node_{realMerchantId.slice(0, 8)}
        </p>
      </div>
    </div>
  );
}