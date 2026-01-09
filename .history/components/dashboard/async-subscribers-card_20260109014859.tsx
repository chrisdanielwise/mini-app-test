import { AnalyticsService } from "@/lib/services/analytics.service";
import { getDashboardStats } from "@/lib/services/merchant.service";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import { AlertCircle } from "lucide-react";

/**
 * 🚀 ASYNC SUBSCRIBERS CARD
 * Fetches subscriber growth and support ticket counts.
 * FIXED: Prop serialization by using string keys for icons.
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

    // 🏁 PARALLEL FETCH WITH TIMEOUT RACE
    // Uses getDashboardStats for unified numeric metrics
    const [growth, stats] = (await Promise.race([
      Promise.all([
        AnalyticsService.getSubscriberGrowth(merchantId, {
          from: thirtyDaysAgo,
          to: new Date(),
        }),
        getDashboardStats(merchantId)
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SUBSCRIBER_FETCH_TIMEOUT")), 15000)
      ),
    ])) as [any, any];

    if (type === "chart") {
      // Ensure growth data exists before rendering chart
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

    // 🛡️ FALLBACKS: Prevent "undefined" crashes on new merchant profiles
    const activeCount = stats?.activeSubscriptions ?? 0;
    const ticketCount = stats?.pendingTickets ?? 0;

    return (
      <>
        <StatsCard
          title="Active Subscribers"
          // Safe access to numeric formatting
          value={activeCount.toLocaleString()}
          change={0.0}
          // 🔥 FIXED: Pass string key instead of function component
          iconType="users" 
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Open Tickets"
          value={ticketCount.toString()}
          // 🔥 FIXED: Pass string key instead of function component
          iconType="tickets"
          iconColor="text-orange-500"
          changeLabel="requires attention"
          className={ticketCount > 0 ? "border-orange-500/20" : ""}
        />
      </>
    );
  } catch (error) {
    console.error("❌ Subscribers Card Error:", error);

    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mb-2 h-6 w-6 text-destructive" />
        <p className="text-[10px] font-black uppercase italic tracking-widest text-destructive">
          Subscriber Stats Offline
        </p>
        <p className="mt-1 text-[8px] font-bold uppercase text-muted-foreground">
          Neon Connection Timeout
        </p>
      </div>
    );
  }
}