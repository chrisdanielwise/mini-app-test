import { AnalyticsService } from "@/src/lib/services/analytics.service";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { AlertCircle, Terminal, TrendingUp, DollarSign } from "lucide-react";

/**
 * 💰 ASYNC REVENUE NODE (Tier 2)
 * Fixed: Responsive scaling for mobile viewports and hardened fetch protocol.
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
     * Extended to 25s to account for Neon DB Cold Starts (as seen in your logs).
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
        <div className="rounded-[2.5rem] border border-border/40 bg-card/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-in fade-in duration-1000 overflow-hidden">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                Financial Vector
              </h3>
              <p className="text-[clamp(1.2rem,4vw,1.8rem)] font-black uppercase italic tracking-tighter leading-none">
                Revenue <span className="text-primary">Trend</span>
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-primary opacity-40 shrink-0" />
          </div>
          {/* Ensure the chart container has a responsive height */}
          <div className="h-[250px] w-full">
            <RevenueChart data={dailyData} />
          </div>
        </div>
      );
    }

    // 🛡️ DATA NORMALIZATION: Precision handling for Decimal strings
    const totalRev = parseFloat(data?.total || "0");
    const transCount = data?.transactionCount || 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full animate-in slide-in-from-bottom-4 duration-700">
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
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-md">
        <div className="mb-4 rounded-2xl bg-destructive/10 p-4 shrink-0">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-[clamp(0.8rem,3vw,1rem)] font-black uppercase italic tracking-tighter text-destructive">
          Telemetry Offline
        </h3>
        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/50 border border-border/40 max-w-full">
          <Terminal className="h-3 w-3 text-muted-foreground shrink-0" />
          <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-[0.15em] truncate">
            {error.message === "REVENUE_FETCH_TIMEOUT" ? "Neon_DB_Cold_Start" : "Cluster_Sync_Error"}
          </p>
        </div>
      </div>
    );
  }
}