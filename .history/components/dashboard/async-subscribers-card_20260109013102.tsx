import { AnalyticsService } from "@/lib/services/analytics.service";
import { getMerchantActivity } from "@/lib/services/merchant.service";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import { Users, MessageSquare, AlertCircle } from "lucide-react";

/**
 * 🚀 ASYNC SUBSCRIBERS CARD
 * Fetches subscriber growth and support ticket counts.
 * Protected against Neon cold starts via 15s timeout.
 */
export async function AsyncSubscribersCard({
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
    // Ensures that even if the DB is slow, the dashboard unblocks.
    const [growth, stats] = (await Promise.race([
      Promise.all([
        AnalyticsService.getSubscriberGrowth(merchantId, {
          from: thirtyDaysAgo,
          to: new Date(),
        }),
        getMerchantActivity.getDashboardStats(merchantId),
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SUBSCRIBER_FETCH_TIMEOUT")), 15000)
      ),
    ])) as [any, any];

    if (type === "chart") {
      return (
        <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">
            User Growth (30D)
          </h3>
          <SubscribersChart data={growth.dailyData} />
        </div>
      );
    }

    return (
      <>
        <StatsCard
          title="Active Subscribers"
          // Using the 149 count verified by our diagnostic
          value={stats.activeSubscriptions.toLocaleString()}
          change={8.2}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Open Tickets"
          value={stats.pendingTickets}
          icon={MessageSquare}
          iconColor="text-orange-500"
          changeLabel="requires attention"
          // If tickets > 0, we can color this differently
          className={stats.pendingTickets > 0 ? "border-orange-500/20" : ""}
        />
      </>
    );
  } catch (error) {
    console.error("❌ Subscribers Card Error:", error);

    // Fallback UI to prevent infinite loading screen
    return (
      <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mb-2 h-6 w-6 text-destructive" />
        <p className="text-[10px] font-black uppercase italic tracking-widest text-destructive">
          Subscriber Stats Offline
        </p>
        <p className="mt-1 text-[8px] font-bold uppercase text-muted-foreground">
          Connection Reset by Peer
        </p>
      </div>
    );
  }
}
