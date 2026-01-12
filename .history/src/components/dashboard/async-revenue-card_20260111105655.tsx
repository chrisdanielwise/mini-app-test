import { AnalyticsService } from "@/lib/services/analytics.service";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { AlertCircle, Terminal, TrendingUp, Activity, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 💰 ASYNC REVENUE NODE (Apex Tier)
 * RBAC Calibrated: Automatically switches to Global Oversight if merchantId is null.
 * Hardened: Prevents "Invalid UUID" crashes by handling undefined identity.
 */
export async function AsyncRevenueCard({
  merchantId,
  type = "stats",
}: {
  merchantId?: string; 
  type?: "stats" | "chart";
}) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 🛡️ STAFF DETECTION: Determine if we are in "Global Oversight" mode
    // If merchantId is undefined (Staff), we query the whole platform.
    const isGlobalOversight = !merchantId;

    /** 🏁 PROTOCOL RACE: 25s timeout
     * Logic: Aggregates across the database table (Neon-Resilient).
     */
    const data = (await Promise.race([
      getRevenueAnalytics(merchantId, {
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
        <div className={cn(
          "rounded-[2.5rem] md:rounded-[3rem] border p-5 sm:p-8 backdrop-blur-3xl shadow-2xl animate-in fade-in duration-1000 overflow-hidden relative group",
          isGlobalOversight 
            ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" 
            : "bg-card/40 border-border/10"
        )}>
           {/* Visual Telemetry Watermark */}
           <TrendingUp className="absolute -bottom-10 -right-10 h-48 w-48 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
           
           <div className="flex flex-row items-center justify-between mb-8 px-1 md:px-2 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 italic opacity-40">
                {isGlobalOversight 
                   ? <Globe className="h-3 w-3 text-amber-500 animate-pulse" /> 
                   : <Zap className="h-3 w-3 text-primary animate-pulse" />
                }
                <h3 className={cn(
                  "text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]",
                  isGlobalOversight ? "text-amber-500" : "text-primary"
                )}>
                  {isGlobalOversight ? "Platform_Global_Vector" : "Cluster_Financial_Vector"}
                </h3>
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                {isGlobalOversight ? "Global" : "Revenue"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Trend</span>
              </p>
            </div>
            <div className={cn(
              "h-10 w-10 md:h-12 md:w-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner",
              isGlobalOversight 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                : "bg-primary/10 border-primary/20 text-primary"
            )}>
               <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
            </div>
          </div>

          <div className="h-[220px] md:h-[280px] w-full relative z-10">
            {/* Theme property ensures the chart lines turn Amber for Staff */}
            <RevenueChart data={dailyData} theme={isGlobalOversight ? "amber" : "emerald"} />
          </div>
        </div>
      );
    }

    const totalRev = parseFloat(data?.total || "0");
    const transCount = data?.transactionCount || 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full animate-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title={isGlobalOversight ? "Platform Gross Revenue" : "Gross Revenue"}
          value={`$${totalRev.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change={0.0}
          iconType="revenue"
          iconColor={isGlobalOversight ? "text-amber-500" : "text-emerald-500"}
        />
        <StatsCard
          title={isGlobalOversight ? "Platform Tx Volume" : "Transaction Volume"}
          value={transCount.toLocaleString()}
          change={0.0}
          iconType="payments"
          iconColor={isGlobalOversight ? "text-amber-400" : "text-violet-500"}
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
            {error.message === "REVENUE_FETCH_TIMEOUT" ? "Neon_Cold_Start_Retry" : "Identity_Sync_Failure"}
          </p>
        </div>
        
        <Activity className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] text-destructive rotate-12" />
      </div>
    );
  }
}