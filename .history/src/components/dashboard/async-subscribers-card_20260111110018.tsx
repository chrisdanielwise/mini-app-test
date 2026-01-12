import { getRevenueAnalytics, getSubscriberGrowth } from "@/lib/services/analytics.service";
import { getDashboardStats } from "@/lib/services/merchant.service";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import {
  AlertCircle,
  Loader2,
  Users,
  TicketCheck,
  Terminal,
  Zap,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ ASYNC SUBSCRIBERS NODE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Fixed: Precision scaling for growth metrics to eliminate mobile cropping.
 */
export default async function AsyncSubscribersCard({
  merchantId,
  type = "stats",
}: {
  merchantId: string;
  type?: "stats" | "chart";
}) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    /** 🏁 PROTOCOL RACE: 30s timeout
     * Ensures partial data renders even if chart hydration hangs.
     */
    const results = (await Promise.race([
      Promise.allSettled([
        getSubscriberGrowth(merchantId, {
          from: thirtyDaysAgo,
          to: new Date(),
        }),
        getDashboardStats(merchantId),
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DATABASE_LATENCY_TIMEOUT")), 30000)
      ),
    ])) as any[];

    const growth = results[0]?.status === "fulfilled" ? results[0].value : null;
    const stats = results[1]?.status === "fulfilled" ? results[1].value : null;

    if (type === "chart") {
      if (!growth) {
        return (
          <div className="flex min-h-[300px] md:h-full flex-col items-center justify-center rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-3xl shadow-inner">
            <Loader2 className="h-6 w-6 animate-spin text-primary opacity-40" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">
              Syncing Growth Data...
            </p>
          </div>
        );
      }

      const dailyData = growth?.dailyData || [];
      return (
        <div className="rounded-[2.5rem] md:rounded-[3rem] border border-border/10 bg-card/40 p-5 md:p-8 shadow-2xl backdrop-blur-3xl animate-in fade-in duration-1000 relative group overflow-hidden">
          {/* Visual Telemetry Watermark */}
          <Activity className="absolute -bottom-10 -right-10 h-48 w-48 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="flex flex-row items-center justify-between mb-8 px-1 md:px-2 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 italic opacity-40">
                <Users className="h-3 w-3 text-primary" />
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">
                  Network Expansion
                </h3>
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                User <span className="text-primary">Growth</span>
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
              <Zap className="h-5 w-5 md:h-6 md:w-6" />
            </div>
          </div>

          <div className="h-[220px] md:h-[280px] w-full relative z-10">
            <SubscribersChart data={dailyData} />
          </div>
        </div>
      );
    }

    // 🛡️ DATA NORMALIZATION: Standardized metrics
    const activeCount = stats?.activeSubscriptions ?? 0;
    const ticketCount = stats?.pendingTickets ?? 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full animate-in slide-in-from-bottom-4 duration-700">
        <StatsCard
          title="Active Subscribers"
          value={activeCount.toLocaleString()}
          change={0.0}
          iconType="users"
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Open Tickets"
          value={ticketCount.toString()}
          iconType="tickets"
          iconColor="text-orange-500"
          changeLabel="Attention Required"
          className={cn(
            ticketCount > 0 &&
              "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          )}
        />
      </div>
    );
  } catch (error: any) {
    console.error("❌ Subscribers Node Failure:", error.message);

    return (
      <div className="flex flex-col h-full min-h-[200px] md:min-h-[280px] items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-6 md:p-10 text-center backdrop-blur-3xl shadow-inner relative overflow-hidden">
        <div className="mb-4 rounded-xl md:rounded-2xl bg-destructive/10 p-4 shrink-0 shadow-lg">
          <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-destructive animate-pulse" />
        </div>
        <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-destructive leading-none">
          Handshake Delayed
        </h3>

        <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 border border-border/10 max-w-full shadow-sm">
          <Terminal className="h-3 w-3 text-muted-foreground shrink-0 opacity-40" />
          <p className="text-[7px] md:text-[8px] font-black uppercase text-muted-foreground tracking-[0.2em] truncate">
            {error.message === "DATABASE_LATENCY_TIMEOUT"
              ? "Neon_Cloud_Provisioning"
              : "Cluster_Sync_Error"}
          </p>
        </div>

        <Zap className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] text-destructive rotate-12" />
      </div>
    );
  }
}
