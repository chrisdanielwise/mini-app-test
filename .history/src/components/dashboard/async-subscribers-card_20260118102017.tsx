import { getSubscriberGrowth } from "@/lib/services/analytics.service";
import {
  getDashboardStats,
  getGlobalPlatformStats,
} from "@/lib/services/merchant.service";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import { getSession } from "@/lib/auth/session";
import {
  AlertCircle,
  Loader2,
  Users,
  Terminal,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ ASYNC_SUBSCRIBERS_NODE
 * Strategy: Latency-Resilient Handshake.
 * Fix: Prevents "Double-Handshake" lag and stops the /unauthorized redirect loop.
 */
export default async function AsyncSubscribersCard({
  merchantId: propMerchantId,
  type = "stats",
}: {
  merchantId?: string;
  type?: "stats" | "chart";
}) {
  /**
   * 🔐 1. IDENTITY_HANDSHAKE
   * Safe-fail: If getSession() lags or fails, return an inline Lockout
   * instead of letting the entire page throw a 500 error.
   */
  const session = await getSession().catch(() => null);

  if (!session) {
    return <IdentityRequiredUI />;
  }

  // 🛰️ 2. NODE RESOLUTION
  const isGlobalOversight = session.isStaff && !propMerchantId;
  const targetId = session.isStaff ? propMerchantId : session.merchantId;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    /** * 🏁 PROTOCOL RACE: 15s Latency Guard
     * We reduce the timeout from 30s to 15s to beat the NGROK/Gateway timeout.
     */
    const results = await Promise.race([
      Promise.allSettled([
        getSubscriberGrowth(targetId!, { from: thirtyDaysAgo, to: new Date() }),
        isGlobalOversight ? getGlobalPlatformStats() : getDashboardStats(targetId!),
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("LATENCY_TIMEOUT")), 15000)
      ),
    ]) as any[];

    // Extracting results safely from Settled Promises
    const growth = results[0]?.status === "fulfilled" ? results[0].value : null;
    const stats = results[1]?.status === "fulfilled" ? results[1].value : null;

    // --- 📊 CHART_MODE_EXECUTION ---
    if (type === "chart") {
      if (!growth) return <GrowthOfflineUI isGlobal={isGlobalOversight} />;

      return (
        <div className={cn(
          "rounded-[2.5rem] border p-6 md:p-7 shadow-2xl backdrop-blur-3xl animate-in fade-in duration-1000 overflow-hidden relative group",
          isGlobalOversight ? "bg-amber-500/[0.02] border-amber-500/20" : "bg-card/40 border-white/5"
        )}>
          <div className="flex flex-row items-center justify-between mb-6 relative z-10">
            <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter">
              {isGlobalOversight ? "Total" : "User"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Growth</span>
            </p>
          </div>
          <div className="h-[220px] md:h-[280px] w-full relative z-10">
            <SubscribersChart data={growth?.dailyData || []} theme={isGlobalOversight ? "amber" : "emerald"} />
          </div>
        </div>
      );
    }

    // --- 🔢 STATS_MODE_EXECUTION ---
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full animate-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title={isGlobalOversight ? "Platform Users" : "Active Subscribers"}
          value={(stats?.activeSubscriptions ?? 0).toLocaleString()}
          iconType="users"
          iconColor={isGlobalOversight ? "text-amber-500" : "text-blue-500"}
        />
        <StatsCard
          title={isGlobalOversight ? "System Tickets" : "Open Tickets"}
          value={(stats?.pendingTickets ?? 0).toString()}
          iconType="tickets"
          iconColor={isGlobalOversight ? "text-amber-600" : "text-orange-500"}
        />
      </div>
    );

  } catch (error: any) {
    // ✅ CRITICAL FIX: Returns a safe offline UI instead of crashing the RSC tree.
    return <TelemetryDelayedUI error={error.message} />;
  }
}

/** 🛠️ SUB-COMPONENTS: Isolated UI for Resilience */

function IdentityRequiredUI() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-black/40 p-8 text-center backdrop-blur-3xl">
      <Lock className="h-6 w-6 text-muted-foreground/10 mb-3" />
      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity_Node_Required</p>
    </div>
  );
}

function GrowthOfflineUI({ isGlobal }: { isGlobal: boolean }) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-card/20 backdrop-blur-3xl">
      <Loader2 className="h-5 w-5 animate-spin text-primary opacity-20" />
      <p className="mt-4 text-[8px] font-black uppercase tracking-[0.3em] opacity-20 italic">
        {isGlobal ? "Resolving_Global_Mesh..." : "Syncing_Growth_Node..."}
      </p>
    </div>
  );
}

function TelemetryDelayedUI({ error }: { error: string }) {
  return (
    <div className="flex flex-col h-full min-h-[200px] items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-6 text-center backdrop-blur-3xl animate-in fade-in duration-500">
      <AlertCircle className="h-6 w-6 text-destructive mb-4 animate-pulse" />
      <h3 className="text-[10px] font-black uppercase italic tracking-[0.4em] text-destructive">Handshake_Delayed</h3>
      <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 border border-white/5">
        <Terminal className="h-3 w-3 text-muted-foreground/30" />
        <p className="text-[7px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] italic">{error}</p>
      </div>
    </div>
  );
}