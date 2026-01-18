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
 * 💰 ASYNC_REVENUE_NODE (Institutional v2026.1.18)
 * Strategy: Latency-Resilient Handshake.
 * Fix: Prevents "Double-Handshake" lag and stops the /unauthorized redirect loop.
 */
export async function AsyncRevenueCard({
  merchantId: propMerchantId,
  type = "stats",
}: {
  merchantId?: string;
  type?: "stats" | "chart";
}) {
  /** * 🔐 1. SHARED IDENTITY RESOLUTION
   * Logic: getSession() is cached in React, but the database lag is currently 5s.
   * If this fails, we return a "Lock" UI instead of throwing an error.
   */
  const session = await getSession().catch(() => null);

  if (!session) {
    return <IdentityLockoutUI />;
  }

  // 🛰️ 2. NODE RESOLUTION
  const isGlobalOversight = session.isStaff && !propMerchantId;
  const targetId = session.isStaff ? propMerchantId : session.merchantId;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    /** * 🏁 LATENCY RACE: Hardened 15s limit.
     * Your logs showed 30s hangs; we cut this in half to prevent Gateway Timeouts.
     */
    const data = await Promise.race([
      getRevenueAnalytics(targetId, {
        from: thirtyDaysAgo,
        to: new Date(),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TELEMETRY_SYNC_TIMEOUT")), 15000)
      ),
    ]).catch((err) => {
      console.warn(
        `🐢 [Physical_Lag]: Revenue Node Timed Out - ${err.message}`
      );
      return null; // Return null to trigger the "Offline" UI instead of crashing
    });

    if (!data) throw new Error("TELEMETRY_OFFLINE");

    // --- 📊 CHART_MODE_EXECUTION ---
    if (type === "chart") {
      return (
        <div
          className={cn(
            "rounded-[2.5rem] md:rounded-[3rem] border p-6 sm:p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative group animate-in fade-in duration-1000",
            isGlobalOversight
              ? "bg-amber-500/[0.03] border-amber-500/20"
              : "bg-card/40 border-white/5"
          )}
        >
          <div className="flex flex-row items-center justify-between mb-8 relative z-10">
            <div className="space-y-1.5 leading-none">
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
          </div>
          <div className="h-[200px] md:h-[280px] w-full relative z-10">
            <RevenueChart
              data={data?.dailyData || []}
              theme={isGlobalOversight ? "amber" : "emerald"}
            />
          </div>
        </div>
      );
    }

    // --- 🔢 STATS_MODE_EXECUTION ---
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full animate-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title={isGlobalOversight ? "Global Gross Revenue" : "Gross Revenue"}
          value={`$${parseFloat(data?.total || "0").toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          iconType="revenue"
          iconColor={isGlobalOversight ? "text-amber-500" : "text-emerald-500"}
        />
        <StatsCard
          title={isGlobalOversight ? "Global Tx Volume" : "Node Transactions"}
          value={(data?.transactionCount || 0).toLocaleString()}
          iconType="payments"
          iconColor={isGlobalOversight ? "text-amber-400" : "text-violet-500"}
        />
      </div>
    );
  } catch (error: any) {
    // ✅ FIX: Instead of crashing the page, we show a "Safe Offline" state.
    // This stops the redirect to /unauthorized.
    return <TelemetryOfflineUI message={error.message} />;
  }
}

/** 🛠️ SUB-COMPONENTS: Isolated UI for Error States */

function IdentityLockoutUI() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-card/40 p-8 text-center backdrop-blur-3xl">
      <Lock className="h-6 w-6 text-muted-foreground/10 mb-3 animate-pulse" />
      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
        Identity_Handshake_Required
      </p>
    </div>
  );
}

function TelemetryOfflineUI({ message }: { message: string }) {
  return (
    <div className="flex flex-col h-full min-h-[200px] items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-6 text-center backdrop-blur-3xl">
      <AlertCircle className="h-6 w-6 text-destructive mb-4 animate-pulse" />
      <h3 className="text-[10px] font-black uppercase italic tracking-[0.4em] text-destructive">
        Telemetry_Link_Offline
      </h3>
      <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 border border-white/5">
        <Terminal className="h-3 w-3 text-muted-foreground/30" />
        <p className="text-[7px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] italic">
          {message}
        </p>
      </div>
    </div>
  );
}
