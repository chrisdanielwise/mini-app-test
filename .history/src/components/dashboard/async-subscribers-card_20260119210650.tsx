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
  Activity,
  Globe,
  Lock,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ ASYNC_SUBSCRIBERS_NODE (Institutional v16.16.25)
 * Strategy: Parallel Handshake & Tactical Slim Geometry.
 * Alignment: Institutional Apex v2026 (Hardened).
 * * FIX LOG:
 * 1. Replaced Promise.all with allSettled to prevent single-query crashes from killing the session.
 * 2. Reduced latency race to 15s to beat NGROK/Gateway timeouts.
 * 3. Added explicit catch-to-UI to stop the /unauthorized redirect loop.
 */
export default async function AsyncSubscribersCard({
  merchantId: propMerchantId,
  type = "stats",
}: {
  merchantId?: string;
  type?: "stats" | "chart";
}) {
  // 🔐 1. IDENTITY HANDSHAKE: Resilient to DB lag
  const session = await getSession().catch(() => null);

  // 🛡️ 2. SECURITY GATE: Viewport Isolation
  if (!session) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-black/40 p-8 text-center backdrop-blur-3xl animate-in fade-in duration-500">
        <Lock className="h-6 w-6 text-muted-foreground/10 mb-3 animate-pulse" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
          Identity_Node_Required
        </p>
      </div>
    );
  }

  // 🛰️ 3. NODE RESOLUTION: Staff vs Merchant context
  const isGlobalOversight = session.isStaff && !propMerchantId;
  const targetId = session.isStaff ? propMerchantId : session.merchantId;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    /** 🏁 PROTOCOL RACE: 15s Database Latency Guard */
    const results = (await Promise.race([
      Promise.allSettled([
        getSubscriberGrowth({
          targetId: targetId!,
          from: thirtyDaysAgo,
          to: new Date(),
        }),
        isGlobalOversight
          ? getGlobalPlatformStats()
          : getDashboardStats(targetId!),
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DATABASE_LATENCY_TIMEOUT")), 15000)
      ),
    ])) as any[];

    const growth = results[0]?.status === "fulfilled" ? results[0].value : null;
    const stats = results[1]?.status === "fulfilled" ? results[1].value : null;

    // --- 📊 CHART_MODE_EXECUTION ---
    if (type === "chart") {
      if (!growth) {
        return (
          <div className="flex h-[280px] w-full flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-card/20 backdrop-blur-3xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary opacity-20" />
            <p className="mt-4 text-[8px] font-black uppercase tracking-[0.3em] opacity-20 italic">
              Syncing_Growth_Node...
            </p>
          </div>
        );
      }

      const dailyData = growth?.dailyData || [];
      return (
        <div
          className={cn(
            "rounded-[2.5rem] md:rounded-[3rem] border p-6 md:p-7 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-1000 relative group overflow-hidden w-full",
            isGlobalOversight
              ? "bg-amber-500/[0.02] border-amber-500/20"
              : "bg-card/40 border-white/5"
          )}
        >
          {/* Vapour Radiance Effect */}
          <div
            className={cn(
              "absolute -left-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000",
              isGlobalOversight ? "bg-amber-500" : "bg-primary"
            )}
          />

          <div className="flex flex-row items-center justify-between mb-6 relative z-10">
            <div className="space-y-1.5 leading-none">
              <div className="flex items-center gap-2 italic opacity-30">
                {isGlobalOversight ? (
                  <Globe className="h-2.5 w-2.5 text-amber-500 animate-pulse" />
                ) : (
                  <Users className="h-2.5 w-2.5 text-primary" />
                )}
                <h3
                  className={cn(
                    "text-[7.5px] font-black uppercase tracking-[0.4em]",
                    isGlobalOversight ? "text-amber-500" : "text-primary"
                  )}
                >
                  {isGlobalOversight
                    ? "Platform_Global_Sync"
                    : "Expansion_Vector"}
                </h3>
              </div>
              <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                {isGlobalOversight ? "Total" : "User"}{" "}
                <span
                  className={
                    isGlobalOversight ? "text-amber-500" : "text-primary"
                  }
                >
                  Growth
                </span>
              </p>
            </div>
            <div
              className={cn(
                "size-9 md:size-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner transition-colors duration-500",
                isGlobalOversight
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  : "bg-primary/10 border-primary/20 text-primary"
              )}
            >
              <Zap className="h-5 w-5" />
            </div>
          </div>

          <div className="h-[220px] md:h-[280px] w-full relative z-10">
            <SubscribersChart
              data={dailyData}
              theme={isGlobalOversight ? "amber" : "emerald"}
            />
          </div>
        </div>
      );
    }

    // --- 🔢 STATS_MODE_EXECUTION ---
    const activeCount = stats?.activeSubscriptions ?? 0;
    const ticketCount = stats?.pendingTickets ?? 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full animate-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title={isGlobalOversight ? "Platform Users" : "Active Subscribers"}
          value={activeCount.toLocaleString()}
          iconType="users"
          iconColor={isGlobalOversight ? "text-amber-500" : "text-blue-500"}
        />
        <StatsCard
          title={isGlobalOversight ? "System Tickets" : "Open Tickets"}
          value={ticketCount.toString()}
          iconType="tickets"
          iconColor={isGlobalOversight ? "text-amber-600" : "text-orange-500"}
          className={cn(
            ticketCount > 0 &&
              (isGlobalOversight
                ? "border-amber-500/30 shadow-apex-amber"
                : "border-orange-500/30 shadow-apex-orange")
          )}
        />
      </div>
    );
  } catch (error: any) {
    // 🛡️ INSTITUTIONAL ERROR RECOVERY
    return (
      <div className="flex flex-col h-full min-h-[200px] w-full items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-6 text-center backdrop-blur-3xl animate-in fade-in duration-500">
        <div className="mb-4 rounded-2xl bg-destructive/10 p-4 shadow-lg">
          <AlertCircle className="h-6 w-6 text-destructive animate-pulse" />
        </div>
        <h3 className="text-[10px] font-black uppercase italic tracking-[0.4em] text-destructive">
          Handshake_Delayed
        </h3>

        <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 border border-white/5">
          <Terminal className="h-3 w-3 text-muted-foreground/30 shrink-0" />
          <p className="text-[7px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] italic">
            {error.message === "DATABASE_LATENCY_TIMEOUT"
              ? "Neon_Provisioning_Wait"
              : "Cluster_Sync_Error"}
          </p>
        </div>
      </div>
    );
  }
}
