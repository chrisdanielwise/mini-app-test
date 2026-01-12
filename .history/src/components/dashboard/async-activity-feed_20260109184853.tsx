import { getMerchantActivity } from "@/src/lib/services/merchant.service";
import { format } from "date-fns";
import { Badge } from "@/src/components/ui/badge";
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from "lucide-react";

/**
 * 🚀 ASYNC ACTIVITY FEED
 * Fetches and displays the most recent merchant transactions.
 * FIXED: Direct array access and null-safety for new merchant profiles.
 */
export default async function AsyncActivityFeed({
  merchantId,
}: {
  merchantId: string;
}) {
  // 🏁 1. Fetch real data from the database
  // The service returns the sanitized array directly, not an object with recentPayments
  const data = await getMerchantActivity(merchantId);
  
  // 🛡️ 2. Fallback to empty array if data is null or undefined to prevent .length crash
  const activities = data || [];

  if (activities.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border p-12 text-center bg-card/50">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-black uppercase italic tracking-tight">
          No Activity Yet
        </h3>
        <p className="max-w-[200px] text-xs font-bold text-muted-foreground uppercase leading-tight mt-2">
          Your transaction history will appear here once customers start
          subscribing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[400px] rounded-[2.5rem] border border-border bg-card p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </h3>
        <a
          href="/dashboard/payments"
          className="text-[10px] font-black uppercase italic text-primary hover:underline flex items-center gap-1"
        >
          View All <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((item: any) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-4 hover:bg-muted/50 rounded-3xl transition-all border border-transparent hover:border-border/50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${getStatusColor(item.status || 'PENDING')}`}
              >
                {getStatusIcon(item.status || 'PENDING')}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase italic tracking-tight">
                  {item.user?.fullName || "Anonymous User"}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  {item.service?.name || "Digital Service"} •{" "}
                  {item.createdAt ? format(new Date(item.createdAt), "HH:mm, MMM dd") : "Just now"}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-sm font-black italic">
                {/* Safe price display using tier price or fallback */}
                +${parseFloat(item.serviceTier?.price || "0").toFixed(2)}
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] uppercase font-black px-2 py-0 border-none ${getStatusText(
                  item.status || 'PENDING'
                )}`}
              >
                {item.status || 'PENDING'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 🛠️ UI HELPERS: Status Styling (Stays outside the component to avoid re-renders)
 */
function getStatusIcon(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return <CheckCircle2 className="h-4 w-4" />;
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    case "REJECTED":
    case "FAILED":
    case "EXPIRED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-500";
    case "PENDING":
      return "bg-orange-500/10 text-orange-500";
    case "REJECTED":
    case "FAILED":
    case "EXPIRED":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return "text-emerald-500";
    case "PENDING":
      return "text-orange-500";
    default:
      return "text-muted-foreground";
  }
}