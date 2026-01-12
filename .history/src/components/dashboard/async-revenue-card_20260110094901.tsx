import { AnalyticsService } from "@/lib/services/analytics.service";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { AlertCircle, Terminal, TrendingUp } from "lucide-react";

/**
 * 💰 ASYNC REVENUE NODE (Tier 2)
 * Orchestrates financial telemetry and historical trend visualization.
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

    // 🏁 PROTOCOL RACE: 15s timeout to maintain dashboard responsiveness
    const data = (await Promise.race([
      AnalyticsService.getRevenueAnalytics(merchantId, {
        from: thirtyDaysAgo,
        to: new Date(),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("REVENUE_FETCH_TIMEOUT")), 15000)
      ),
    ])) as any;

    if (type === "chart") {
      const dailyData = data?.dailyData || [];
      return (
        <div className="rounded-[2.5rem] border border-border/40 bg-card/40 p-8 backdrop-blur-xl shadow-2xl animate-in fade-in duration-1000">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
                Financial Vector
              </h3>
              <p className="text-sm font-black uppercase italic tracking-tighter">
                Revenue <span className="text-primary">Trend</span>
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary opacity-40" />
          </div>
          <RevenueChart data={dailyData} />
        </div>
      );
    }

    // 🛡️ DATA NORMALIZATION: Precision handling for Decimal strings
    const totalRev = parseFloat(data?.total || "0");
    const transCount = data?.transactionCount || 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-in slide-in-from-bottom-4 duration-700">
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
  } catch (error) {
    console.error("❌ Revenue Node Failure:", error);

    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-10 text-center backdrop-blur-md">
        <div className="mb-4 rounded-2xl bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-sm font-black uppercase italic tracking-tighter text-destructive">
          Telemetry Offline
        </h3>
        <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-lg bg-card/50 border border-border/40">
           <Terminal className="h-3 w-3 text-muted-foreground" />
           <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">
            Handshake Timeout: Neon_DB_Provisioning
          </p>
        </div>
      </div>
    );
  }
}