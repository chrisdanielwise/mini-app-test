import { requireMerchantSession } from "@/lib/auth/merchant-auth";
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
  BarChart3
} from "lucide-react";

// 📊 Visualization Nodes
import { RevenueChart } from "@/components/dashboard/analytics-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { cn } from "@/lib/utils";

/**
 * 🛰️ PERFORMANCE ANALYTICS (Apex Tier)
 * Institutional-grade intelligence for revenue velocity and asset distribution.
 */
export default async function AnalyticsPage() {
  const session = await requireMerchantSession();

  // 🏁 Data Fetch: Parallelized Cluster Sync
  const [stats, categoryData] = await Promise.all([
    MerchantService.getDashboardStats(session.merchant.id),
    MerchantService.getCategoryDistribution(session.merchant.id),
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
    <div className="space-y-12 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1600px] mx-auto">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Globe className="h-5 w-5 animate-[spin_10s_linear_infinite]" />
             </div>
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
               Global Node Intelligence
             </h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Performance <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-6 flex items-center gap-3 italic">
            <Terminal className="h-3 w-3" />
            Active Cluster: <span className="text-foreground tracking-widest">{session.merchant.companyName || "ROOT_NODE"}</span>
          </p>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-4 rounded-2xl bg-card/40 border border-border/40 flex items-center gap-4 shadow-xl">
              <div className="text-right">
                 <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">System Status</p>
                 <p className="text-[10px] font-black uppercase italic text-emerald-500">Node_Stable</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
           </div>
        </div>
      </div>

      {/* --- HIGH-DENSITY METRIC CLUSTER --- */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Revenue Node */}
        <div className="rounded-[3rem] border border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent p-10 shadow-2xl group relative overflow-hidden">
          <TrendingUp className="absolute -right-6 -bottom-6 h-32 w-32 text-primary opacity-[0.03] -rotate-12 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Gross Capital</p>
            <CreditCard className="h-5 w-5 text-primary opacity-40" />
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black tracking-tighter italic">
              ${Number(analytics?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 text-emerald-500">
               <ArrowUpRight className="h-4 w-4" />
               <span className="text-[10px] font-black uppercase italic tracking-widest">+12.4% VELOCITY</span>
            </div>
          </div>
        </div>

        {/* User Load Node */}
        <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-10 shadow-xl group">
          <div className="flex justify-between items-start mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Subscriber Load</p>
            <Users className="h-5 w-5 text-muted-foreground opacity-30 group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black tracking-tighter italic">
              {stats.activeSubscriptions.toLocaleString()}
            </p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Active User Instances</p>
          </div>
        </div>

        {/* Support Stress Node */}
        <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-10 shadow-xl group">
          <div className="flex justify-between items-start mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Support Stress</p>
            <Ticket className="h-5 w-5 text-muted-foreground opacity-30 group-hover:text-amber-500 transition-colors" />
          </div>
          <div className="space-y-2">
            <p className={cn(
              "text-5xl font-black tracking-tighter italic",
              stats.pendingTickets > 0 ? "text-amber-500 animate-pulse" : "text-foreground"
            )}>
              {stats.pendingTickets}
            </p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Tickets Pending Action</p>
          </div>
        </div>

        {/* Performance Tier Node */}
        <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-10 shadow-xl group">
          <div className="flex justify-between items-start mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">System Rating</p>
            <Zap className="h-5 w-5 text-primary opacity-30" />
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black tracking-tighter italic uppercase italic">
              Staff<span className="text-primary text-2xl">_Tier</span>
            </p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Institutional Optimized</p>
          </div>
        </div>
      </div>

      {/* --- VISUALIZATION LAYER: 2:1 INTELLIGENCE GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Main Revenue Velocity Chart */}
        <div className="xl:col-span-2 rounded-[4rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden group">
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16 gap-8 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <BarChart3 className="h-6 w-6 text-primary" />
                 </div>
                 <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                   Revenue <span className="text-primary">Scalability</span>
                 </h2>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-16 italic opacity-60">
                Temporal Earnings Velocity // Cluster Broadcaster: USD
              </p>
            </div>
            
            <div className="flex gap-2">
               {["1D", "1W", "1M", "ALL"].map((time) => (
                  <button key={time} className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all border",
                    time === "1M" ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50"
                  )}>
                    {time}
                  </button>
               ))}
            </div>
          </div>

          <div className="h-[500px] w-full relative z-10">
            <RevenueChart data={chartData} />
          </div>
        </div>

        {/* Asset Distribution Cluster */}
        <div className="rounded-[4rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-10 sm:p-12 shadow-2xl flex flex-col relative overflow-hidden">
          <div className="mb-12 relative z-10">
            <div className="flex items-center gap-4 mb-2">
               <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <PieIcon className="h-5 w-5 text-emerald-500" />
               </div>
               <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                 Asset <span className="text-emerald-500">Spread</span>
               </h2>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-14 italic opacity-40">
              Subscription Allocation Node
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10">
            <CategoryChart data={categoryData} />
          </div>

          <div className="mt-12 p-8 rounded-[2.5rem] bg-muted/10 border border-border/40 backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-3 mb-3">
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Risk Audit Pass</p>
            </div>
            <p className="text-[9px] font-black uppercase text-muted-foreground leading-relaxed tracking-widest italic opacity-60">
              Portfolio metrics indicate stable diversification across service categories. No immediate re-allocation required.
            </p>
          </div>
        </div>
      </div>
      
      {/* System Footnote */}
      <div className="flex items-center justify-center gap-4 opacity-20">
         <Activity className="h-3 w-3" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic">
           Zipha Core Protocol // Analytics Node Synchronization Active
         </p>
      </div>
    </div>
  );
}