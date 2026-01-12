import { AnalyticsService } from "@/lib/services/analytics.service";
import { getDashboardStats } from "@/lib/services/merchant.service";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import { AlertCircle, Loader2, Users, TicketCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ ASYNC SUBSCRIBERS NODE (Tier 2)
 * Handles real-time user growth telemetry and support ticket auditing.
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

    /**
     * 🏁 PROTOCOL RACE: 30s timeout
     * Uses allSettled to ensure partial data (like stats) still renders even if chart data hangs.
     */
    const results = (await Promise.race([
      Promise.allSettled([
        AnalyticsService.getSubscriberGrowth(merchantId, {
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
          <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-md">
            <Loader2 className="h-6 w-6 animate-spin text-primary opacity-40" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">
              Syncing Growth Data...
            </p>
          </div>
        );
      }

      const dailyData = growth?.dailyData || [];
      return (
        <div className="rounded-[2.5rem] border border-border/40 bg-card/40 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in duration-1000">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
                Network Expansion
              </h3>
              <p className="text-sm font-black uppercase italic tracking-tighter">
                User <span className="text-primary">Growth</span> (30D)
              </p>
            </div>
            <Users className="h-4 w-4 text-primary opacity-40" />
          </div>
          <SubscribersChart data={dailyData} />
        </div>
      );
    }

    // 🛡️ DATA NORMALIZATION
    const activeCount = stats?.activeSubscriptions ?? 0;
    const ticketCount = stats?.pendingTickets ?? 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-in slide-in-from-bottom-4 duration-700">
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
    console.error("❌ Subscribers Node Error:", error.message);

    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-10 text-center backdrop-blur-md">
        <div className="mb-4 rounded-2xl bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-sm font-black uppercase italic tracking-tighter text-destructive">
          Database Handshake Delayed
        </h3>
        <p className="mt-2 text-[9px] font-bold uppercase text-muted-foreground tracking-[0.1em]">
          Neon Cloud Provisioning in progress...
        </p>
      </div>
    );
  }
}
