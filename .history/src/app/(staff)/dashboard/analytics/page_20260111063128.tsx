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
 * 🛰️ PERFORMANCE INTELLIGENCE (Tactical Medium)
 * Normalized: Standard professional dashboard scales.
 * Fixed: Reduced card dimensions and typographic scales to prevent cropping.
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
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HUD HEADER: NORMALIZED --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary/60">
            <Globe className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic">
              Node Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic text-foreground">
            Performance <span className="text-primary">Intelligence</span>
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground opacity-40">
            <Terminal className="h-3 w-3" />
            <span>ID: {realMerchantId.slice(0, 8)} // Cluster_Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-muted/10 border border-border/40 px-4 py-2 rounded-xl">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase italic text-emerald-500">Node_Stable</p>
           </div>
           <ShieldCheck className="h-4 w-4 text-emerald-500" />
        </div>
      </div>

      {/* --- MEDIUM-DENSITY METRIC GRID --- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {/* Metric Node: Revenue */}
        <div className="rounded-2xl border border-primary/20 bg-card/40 p-5 shadow-lg relative overflow-hidden group min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 italic">Revenue</p>
            <CreditCard className="h-4 w-4 text-primary opacity-40" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic leading-none tabular-nums">
              ${Number(analytics?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1 text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <span className="text-[8px] font-bold uppercase tracking-tighter">+12% Velocity</span>
            </div>
          </div>
        </div>

        {/* Metric Node: Subscribers */}
        <div className="rounded-2xl border border-border/10 bg-card/40 p-5 shadow-sm group min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Subscribers</p>
            <Users className="h-4 w-4 text-muted-foreground opacity-30" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic leading-none tabular-nums">
            {stats.activeSubscriptions.toLocaleString()}
          </h3>
          <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40 italic">Active Ident Nodes</p>
        </div>

        {/* Metric Node: Support */}
        <div className="rounded-2xl border border-border/10 bg-card/40 p-5 shadow-sm group min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Tickets</p>
            <Ticket className="h-4 w-4 text-muted-foreground opacity-30" />
          </div>
          <h3 className={cn(
                "text-2xl md:text-3xl font-black tracking-tighter italic leading-none",
                stats.pendingTickets > 0 ? "text-amber-500" : "text-foreground"
              )}>
            {stats.pendingTickets}
          </h3>
          <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40 italic">Action Required</p>
        </div>

        {/* Metric Node: Rating */}
        <div className="rounded-2xl border border-border/10 bg-card/40 p-5 shadow-sm group min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Rating</p>
            <Zap className="h-4 w-4 text-primary opacity-30" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase leading-none">
            APEX<span className="text-primary text-sm">_T2</span>
          </h3>
          <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40 italic">Hardware_Verified</p>
        </div>
      </div>

      {/* --- VISUALIZATION LAYER: COMPACT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border/10 bg-card/40 p-6 shadow-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-black uppercase italic tracking-tight">Revenue Scalability</h2>
            </div>
            <div className="flex gap-1.5">
              {["1W", "1M", "ALL"].map((time) => (
                <button key={time} className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-bold transition-all border",
                    time === "1M" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/10 border-border/10 text-muted-foreground"
                  )}>
                  {time}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] md:h-[350px] w-full bg-muted/5 rounded-xl border border-border/10 p-2">
            <RevenueChart data={analytics?.chartData || []} />
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="rounded-2xl border border-border/10 bg-card/40 p-6 shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <PieIcon className="h-4 w-4 text-emerald-500" />
            <h2 className="text-lg font-black uppercase italic tracking-tight">Asset Spread</h2>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            <CategoryChart data={categoryData} />
          </div>
          <div className="mt-4 p-4 rounded-xl bg-muted/10 border border-border/10">
            <p className="text-[9px] font-bold uppercase text-muted-foreground/60 leading-relaxed tracking-wider italic">
              Verification protocol active across nodes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-6">
        <Activity className="h-3 w-3 text-primary" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] italic text-center">
          Zipha Intelligence Hub // Ledger_Node_{realMerchantId.slice(0, 6)}
        </p>
      </div>
    </div>
  );
}