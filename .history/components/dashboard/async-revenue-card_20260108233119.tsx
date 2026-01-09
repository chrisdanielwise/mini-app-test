import { AnalyticsService } from "@/lib/services/analytics.service";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { DollarSign, CreditCard, AlertCircle } from "lucide-react";

/**
 * 🚀 ASYNC REVENUE CARD
 * Fetches real-time financial data for the GreysuitFx dashboard.
 * Includes a 15s safety timeout to prevent infinite loading on Neon cold starts.
 */
export async function AsyncRevenueCard({ 
  merchantId, 
  type = "stats" 
}: { 
  merchantId: string, 
  type?: "stats" | "chart" 
}) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 🏁 TIMEOUT RACE: Prevent the infinite "Still Loading" hang
    const data = await Promise.race([
      AnalyticsService.getRevenueAnalytics(merchantId, {
        from: thirtyDaysAgo,
        to: new Date()
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("REVENUE_FETCH_TIMEOUT")), 15000)
      )
    ]) as any;

    if (type === "chart") {
      return (
        <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">
            Revenue Trend (30D)
          </h3>
          <RevenueChart data={data.dailyData} />
        </div>
      );
    }

    return (
      <>
        <StatsCard
          title="Total Revenue"
          // We use parseFloat + toLocaleString for clean financial formatting
          value={`$${parseFloat(data.total).toLocaleString(undefined, { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}`}
          change={12.5} // This could be calculated by comparing to previous 30 days
          icon={DollarSign}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Total Payments"
          value={data.transactionCount.toLocaleString()}
          change={2.4}
          icon={CreditCard}
          iconColor="text-violet-500"
        />
      </>
    );
  } catch (error) {
    console.error("❌ Revenue Card Error:", error);
    
    // Fallback UI so the dashboard doesn't stay on the loading screen
    return (
      <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mb-2 h-6 w-6 text-destructive" />
        <p className="text-[10px] font-black uppercase italic tracking-widest text-destructive">
          Revenue Data Unavailable
        </p>
        <p className="mt-1 text-[8px] font-bold uppercase text-muted-foreground">
          Database Handshake Timeout
        </p>
      </div>
    );
  }
}