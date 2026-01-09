import { AnalyticsService } from "@/lib/services/analytics.service";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { DollarSign, CreditCard } from "lucide-react";

export async function AsyncRevenueCard({ merchantId, type = "stats" }: { merchantId: string, type?: "stats" | "chart" }) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const data = await AnalyticsService.getRevenueAnalytics(merchantId, {
    from: thirtyDaysAgo,
    to: new Date()
  });

  if (type === "chart") {
    return (
      <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Revenue Growth</h3>
        <RevenueChart data={data.dailyData} />
      </div>
    );
  }

  return (
    <>
      <StatsCard
        title="Total Revenue"
        value={`$${parseFloat(data.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        change={12.5}
        icon={DollarSign}
        iconColor="text-emerald-500"
      />
      <StatsCard
        title="Transactions"
        value={data.transactionCount}
        change={-3.1}
        icon={CreditCard}
        iconColor="text-violet-500"
      />
    </>
  );
}