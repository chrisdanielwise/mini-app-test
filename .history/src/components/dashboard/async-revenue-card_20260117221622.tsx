import { getRevenueAnalytics } from "@/lib/services/analytics.service";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { getSession } from "@/lib/auth/session";
import {
  AlertCircle,
  Terminal,
  TrendingUp,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 💰 ASYNC_REVENUE_NODE (Institutional v16.16.23)
 * Logic: Role-Aware Telemetry with Cold-Start Resilience.
 * Strategy: Vertical Compression & Protocol Race Guard.
 */
export async function AsyncRevenueCard({
  merchantId: propMerchantId,
  type = "stats",
}: {
  merchantId?: string;
  type?: "stats" | "chart";
}) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  // 🛡️ 2. SECURITY GATE: Prevent unauthorized layout rendering
  if (!session) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-card/40 p-8 text-center backdrop-blur-3xl">
        <Lock className="h-6 w-6 text-muted-foreground/10 mb-3 animate-pulse" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
          Identity_Handshake_Required
        </p>
      </div>
    );
  }

  // 🛰️ 3. NODE RESOLUTION: Implicit Multi-Tenant Guard
  // Logic: Staff can oversight anyone; Merchants are locked to their own node.
  const isGlobalOversight = session.isStaff && !propMerchantId;
  const targetId = session.isStaff ? propMerchantId : session.merchantId;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    /** 🏁 PROTOCOL RACE: Neon DB Cold-Start Resilience (25s) */
    const data = (await Promise.race([
      getRevenueAnalytics(targetId, {
        from: thirtyDaysAgo,
        to: new Date(),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("REVENUE_FETCH_TIMEOUT")), 25000)
      ),
    ])) as any;

    // --- 📊 CHART_MODE_EXECUTION ---
    if (type === "chart") {
      const dailyData = data?.dailyData || [];
      return (
        <div
          className={cn(
            "rounded-[2.5rem] md:rounded-[3rem] border p-6 sm:p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative group animate-in fade-in zoom-in-95 duration-1000",
            isGlobalOversight
              ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5"
              : "bg-card/40 border-white/5"
          )}
        >
          {/* Background Watermark */}
          <TrendingUp className="absolute -bottom-10 -right-10 h-48 w-48 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

          <div className="flex flex-row items-center justify-between mb-8 relative z-10">
            <div className="space-y-1.5 leading-none">
              <div className="flex items-center gap-2 italic opacity-30">
                {isGlobalOversight ? (
                  <Globe className="h-2.5 w-2.5 text-amber-500 animate-pulse" />
                ) : (
                  <Zap className="h-2.5 w-2.5 text-primary animate-pulse" />
                )}
                <h3
                  className={cn(
                    "text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]",
                    isGlobalOversight ? "text-amber-500" : "text-primary"
                  )}
                >
                  {isGlobalOversight
                    ? "Platform_Global_Vector"
                    : "Cluster_Revenue_Vector"}
                </h3>
              </div>
              <p className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                {isGlobalOversight ? "Global" : "Revenue"}{" "}
                <span
                  className={
                    isGlobalOversight ? "text-amber-500" : "text-primary"
                  }
                >
                  Trend
                </span>
              </p>
            </div>

            <div
              className={cn(
                "h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner",
                isGlobalOversight
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  : "bg-primary/10 border-primary/20 text-primary"
              )}
            >
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="h-[200px] md:h-[280px] w-full relative z-10">
            <RevenueChart
              data={dailyData}
              theme={isGlobalOversight ? "amber" : "emerald"}
            />
          </div>
        </div>
      );
    }

    // --- 🔢 STATS_MODE_EXECUTION ---
    const totalRev = parseFloat(data?.total || "0");
    const transCount = data?.transactionCount || 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full animate-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title={isGlobalOversight ? "Global Gross Revenue" : "Gross Revenue"}
          value={`$${totalRev.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          change={0.0}
          iconType="revenue"
          iconColor={isGlobalOversight ? "text-amber-500" : "text-emerald-500"}
        />
        <StatsCard
          title={isGlobalOversight ? "Global Tx Volume" : "Node Transactions"}
          value={transCount.toLocaleString()}
          change={0.0}
          iconType="payments"
          iconColor={isGlobalOversight ? "text-amber-400" : "text-violet-500"}
        />
      </div>
    );
  } catch (error: any) {
    // 🕵️ ERROR RECOVERY LOGIC
    return (
      <div className="flex flex-col h-full min-h-[200px] items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-6 text-center backdrop-blur-3xl animate-in fade-in duration-500">
        <div className="mb-4 rounded-2xl bg-destructive/10 p-4 shadow-lg">
          <AlertCircle className="h-6 w-6 text-destructive animate-pulse" />
        </div>
        <h3 className="text-[10px] font-black uppercase italic tracking-[0.4em] text-destructive">
          Telemetry_Link_Offline
        </h3>

        <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 border border-white/5">
          <Terminal className="h-3 w-3 text-muted-foreground/30 shrink-0" />
          <p className="text-[7px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] italic">
            {error.message === "REVENUE_FETCH_TIMEOUT"
              ? "Neon_Cold_Start_Wait"
              : "Node_Identity_Failure"}
          </p>
        </div>
      </div>
    );
  }
}
