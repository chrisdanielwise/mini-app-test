import { AnalyticsService } from "@/lib/services/analytics.service";
import { MerchantService } from "@/lib/services/merchant.service";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import { Users, MessageSquare } from "lucide-react";

export async function AsyncSubscribersCard({ merchantId, type = "stats" }: { merchantId: string, type?: "stats" | "chart" }) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [growth, stats] = await Promise.all([
    AnalyticsService.getSubscriberGrowth(merchantId, { from: thirtyDaysAgo, to: new Date() }),
    MerchantService.getDashboardStats(merchantId)
  ]);

  if (type === "chart") {
    return (
      <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">User Growth</h3>
        <SubscribersChart data={growth.dailyData} />
      </div>
    );
  }

  return (
    <>
      <StatsCard
        title="Active Subscribers"
        value={stats.activeSubscriptions}
        change={8.2}
        icon={Users}
        iconColor="text-blue-500"
      />
      <StatsCard
        title="Pending Tickets"
        value={stats.pendingTickets}
        icon={MessageSquare}
        iconColor="text-orange-500"
      />
    </>
  );
}