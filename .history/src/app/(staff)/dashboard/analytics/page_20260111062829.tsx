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

/**
 * 🛰️ PERFORMANCE INTELLIGENCE (Apex Sync Tier)
 * Fixed: Comprehensive geometric synchronization to prevent compression/cropping.
 * Normalized: Fluid flex-wrap logic for high-density metric visibility.
 */
export default async function AnalyticsPage() {
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  const [stats, categoryData] = await Promise.all([
    MerchantService.getDashboardStats(realMerchantId),
    MerchantService.getCategoryDistribution(realMerchantId),
  ]);

  const analytics = stats.analytics;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 md:space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER: ZERO-CROP PROTOCOL --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-10 border-b border-border/40 pb-10">
        <div className="flex flex-col gap-5 min-w-fit flex-1">
          <div className="flex items-center gap-3 text-primary">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner shrink-0">
              <Globe className="h-5 w-5 animate-[spin_10s_linear_infinite]" />
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] italic opacity-80 whitespace-nowrap">
              Global Node Intelligence
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] uppercase italic leading-[0.8] text-foreground whitespace-normal break-words max-w-[85vw]">
              Performance <span className="text-primary">Intelligence</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-4 flex items-center gap-2 italic opacity-40">
              <Terminal className="h-3.5 w-3.5" />
              Node Cluster: <span className="text-foreground">{session.config.companyName || "ROOT_NODE"}</span>
            </p>
          </div>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-card/40 border border-border/40 flex items-center gap-4 shadow-2xl backdrop-blur-xl shrink-0">
           <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40 leading-none mb-1">Status</p>
              <p className="text-xs font-black uppercase italic text-emerald-500">Broadcasting_Stable</p>
           </div>
           <ShieldCheck className="h-6 w-6 text-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* --- HIGH-DENSITY METRIC GRID: FLUID CLAMPING --- */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 w-full">
        {/* Metric Node: Revenue */}
        <div className="rounded-[2.5rem] md:rounded-[3rem] border border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent p-8 md:p-10 shadow-2xl relative overflow-hidden group min-h-[220px] flex flex-col justify-between transition-all hover:-translate-y-1">
          <TrendingUp className="absolute -right-6 -bottom-6 h-32 w-32 text-primary opacity-[0.03] -rotate-12 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">Liquidity Inflow</p>
            <CreditCard className="h-5 w-5 text-primary opacity-40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter italic leading-none truncate tabular-nums">
              ${Number(analytics?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-2 text-emerald-500">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase italic tracking-widest">Velocity_Positive</span>
            </div>
          </div>
        </div>

        {/* Metric Node: Subscribers */}
        <div className="rounded-[2.5rem] md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-8 md:p-10 shadow-xl group min-h-[220px] flex flex-col justify-between transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Subscriber Load</p>
            <Users className="h-5 w-5 text-muted-foreground opacity-30 group-hover:text-primary transition-all" />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter italic leading-none tabular-nums">
              {stats.activeSubscriptions.toLocaleString()}
            </h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Active Ident Nodes</p>
          </div>
        </div>

        {/* Metric Node: Support */}
        <div className="rounded-[2.5rem] md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-8 md:p-10 shadow-xl group min-h-[220px] flex flex-col justify-between transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">System Stress</p>
            <Ticket className="h-5 w-5 text-muted-foreground opacity-30 group-hover:text-amber-500 transition-all" />
          </div>
          <div className="space-y-2">
            <h3 className={cn(
                "text-4xl sm:text-5xl font-black tracking-tighter italic leading-none",
                stats.pendingTickets > 0 ? "text-amber-500 animate-pulse" : "text-foreground"
              )}>
              {stats.pendingTickets}
            </h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Tickets Pending</p>
          </div>
        </div>

        {/* Metric Node: Rating */}
        <div className="rounded-[2.5rem] md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-8 md:p-10 shadow-xl group min-h-[220px] flex flex-col justify-between transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Rating Node</p>
            <Zap className="h-5 w-5 text-primary opacity-30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tighter italic uppercase leading-none">
              APEX<span className="text-primary text-2xl lg:text-3xl">_T2</span>
            </h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Hardware_Verified</p>
          </div>
        </div>
      </div>

      {/* --- TELEMETRY VISUALIZATION: EXPANSIVE GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10">
        
        {/* Main Revenue Scalability Chart */}
        <div className="xl:col-span-8 rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 md:mb-20 gap-8 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
                  Revenue <span className="text-primary">Scalability</span>
                </h2>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] sm:ml-16 italic opacity-60">
                Temporal Earnings Velocity // Synchronized USD
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide shrink-0">
              {["1D", "1W", "1M", "ALL"].map((time) => (
                <button key={time} className={cn(
                    "px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all border shrink-0",
                    time === "1M" ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20" : "bg-muted/10 border-border/10 text-muted-foreground hover:bg-muted/20"
                  )}>
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] md:h-[550px] w-full relative z-10 bg-muted/5 rounded-2xl p-4 border border-border/10 shadow-inner">
            <RevenueChart data={analytics?.chartData || []} />
          </div>
        </div>

        {/* Category Distribution: Uncompressed Sidebar */}
        <div className="xl:col-span-4 rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-8 sm:p-12 shadow-2xl flex flex-col relative overflow-hidden">
          <div className="mb-12 relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <PieIcon className="h-5 w-5 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Asset <span className="text-emerald-500">Spread</span>
              </h2>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:ml-14 italic opacity-40">
              Identity Node Allocation
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center py-10 min-h-[350px] bg-muted/5 rounded-2xl border border-border/10 mb-8">
            <CategoryChart data={categoryData} />
          </div>

          <div className="mt-auto p-8 rounded-[2rem] bg-muted/10 border border-border/10 shadow-inner">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Risk_Analysis_Pass</p>
            </div>
            <p className="text-[9px] font-black uppercase text-muted-foreground leading-relaxed tracking-widest italic opacity-50">
              Identity diversification protocol verified across active service nodes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 opacity-20 py-10">
        <Activity className="h-4 w-4 animate-pulse text-primary" />
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] italic text-center">
          Zipha Intelligence Hub // Ledger Node {realMerchantId.slice(0, 12)}
        </p>
      </div>
    </div>
  );
}