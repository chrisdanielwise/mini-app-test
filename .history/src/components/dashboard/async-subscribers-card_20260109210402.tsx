import { AnalyticsService } from "@/lib/services/analytics.service";
import { getDashboardStats } from "@/lib/services/merchant.service";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import { AlertCircle, Loader2 } from "lucide-react";

/**
 * 🚀 ASYNC SUBSCRIBERS CARD
 * Fetches subscriber growth and support ticket counts.
 * UPDATED: Optimized for high-latency Ngrok/Neon environments using allSettled.
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
     * 🏁 RESILIENT PARALLEL FETCH
     * Increased timeout to 30s for Ngrok stability.
     * uses allSettled so numeric stats don't die if the chart is slow.
     */
    const results = await Promise.race([
      Promise.allSettled([
        AnalyticsService.getSubscriberGrowth(merchantId, {
          from: thirtyDaysAgo,
          to: new Date(),
        }),
        getDashboardStats(merchantId)
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DATABASE_LATENCY_TIMEOUT")), 30000)
      ),
    ]) as any[];

    // Extract values safely from Settled results
    const growth = results[0]?.status === 'fulfilled' ? results[0].value : null;
    const stats = results[1]?.status === 'fulfilled' ? results[1].value : null;

    if (type === "chart") {
      if (!growth) {
        return (
          <div className="flex h-48 flex-col items-center justify-center rounded-[2.5rem] border border-border bg-card/50">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground opacity-20" />
            <p className="mt-2 text-[8px] font-black uppercase tracking-widest opacity-30">Analyzing Growth Tiers...</p>
          </div>
        );
      }

      const dailyData = growth?.dailyData || [];
      return (
        <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">
            User Growth (30D)
          </h3>
          <SubscribersChart data={dailyData} />
        </div>
      );
    }

    // 🛡️ FALLBACKS: Logic-safe values for fresh merchant profiles
    const activeCount = stats?.activeSubscriptions ?? 0;
    const ticketCount = stats?.pendingTickets ?? 0;

    return (
      <>
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
          changeLabel="requires attention"
          className={ticketCount > 0 ? "border-orange-500/20" : ""}
        />
      </>
    );
  } catch (error: any) {
    console.error("❌ Subscribers Card Error:", error.message);

    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in duration-500">
        <AlertCircle className="mb-2 h-6 w-6 text-destructive" />
        <p className="text-[10px] font-black uppercase italic tracking-widest text-destructive">
          Database Handshake Delayed
        </p>
        <p className="mt-1 text-[8px] font-bold uppercase text-muted-foreground">
          Neon is provisioning compute...
        </p>
      </div>
    );
  }
}