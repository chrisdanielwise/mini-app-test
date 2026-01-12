import { AnalyticsService } from "@/lib/services/analytics.service";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { AlertCircle, Terminal, TrendingUp, DollarSign, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 💰 ASYNC REVENUE NODE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Fixed: Precision scaling for financial metrics to eliminate mobile cropping.
 */
export async function AsyncRevenueCard({
  merchantId,
  type = "stats",
}: {
  merchantId: string;
  type?: "stats" | "chart";
}) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    /** 🏁 PROTOCOL RACE: 25s timeout
     * Hardened to account for Neon DB Cold Starts.
     */
    const data = (await Promise.race([
      AnalyticsService.getRevenueAnalytics(merchantId, {
        from: thirtyDaysAgo,
        to: new Date(),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("REVENUE_FETCH_TIMEOUT")), 25000)
      ),
    ])) as any;

    if (type === "chart") {
      const dailyData = data?.dailyData || [];
      return (
        <div className="rounded-[2.5rem] md:rounded-[3rem] border border-border/10 bg-card/40 p-5 sm:p-8 backdrop-blur-3xl shadow-2xl animate-in fade-in duration-1000 overflow-hidden relative group">
           {/* Visual Telemetry Watermark */}
           <TrendingUp className="absolute -bottom-10 -right-10 h-48 w-48 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
           
           <div className="flex flex-row items-center justify-between mb-8 px-1 md:px-2 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 italic opacity-40">
                <Zap className="h-3 w-3 text-primary animate-pulse" />
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Financial Vector</h3>
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                Revenue <span className="text-primary">Trend</span>
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
               <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
            </div>
          </div>

          <div className="h-[220px] md:h-[280px] w-full relative z-10">
            <RevenueChart data={dailyData} />
          </div>
        </div>
      );
    }

    // 🛡️ DATA NORMALIZATION: Precision handling for Decimal strings
    const totalRev = parseFloat(data?.total || "0");
    const transCount = data?.transactionCount || 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full animate-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title="Gross Revenue"
          value={`$${totalRev.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change={0.0}
          iconType="revenue"
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Transaction Volume"
          value={transCount.toLocaleString()}
          change={0.0}
          iconType="payments"
          iconColor="text-violet-500"
        />
      </div>
    );
  } catch (error: any) {
    console.error("❌ Revenue Node Failure:", error.message);

    return (
      <div className="flex flex-col h-full min-h-[200px] md:min-h-[280px] items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-6 md:p-8 text-center backdrop-blur-3xl shadow-inner relative overflow-hidden">
        <div className="mb-4 rounded-xl md:rounded-2xl bg-destructive/10 p-4 shrink-0 shadow-lg">
          <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-destructive animate-pulse" />
        </div>
        <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-destructive">
          Telemetry Offline
        </h3>
        
        <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 border border-border/10 max-w-full shadow-sm">
          <Terminal className="h-3 w-3 text-muted-foreground shrink-0 opacity-40" />
          <p className="text-[7px] md:text-[8px] font-black uppercase text-muted-foreground tracking-[0.2em] truncate">
            {error.message === "REVENUE_FETCH_TIMEOUT" ? "Neon_DB_Cold_Start" : "Cluster_Sync_Error"}
          </p>
        </div>
        
        <Activity className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] text-destructive rotate-12" />
      </div>
    );
  }
}