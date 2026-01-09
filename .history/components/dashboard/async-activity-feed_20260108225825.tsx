import { MerchantService } from "@/lib/services/merchant.service";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight 
} from "lucide-react";

/**
 * 🚀 ASYNC ACTIVITY FEED
 * Fetches and displays the most recent merchant transactions.
 * Uses the updated MerchantService with Schema V2.0.0 support.
 */
export async function AsyncActivityFeed({ merchantId }: { merchantId: string }) {
  // Fetch real data from the database
  const data = await MerchantService.getDashboardStats(merchantId);
  const payments = data.recentPayments;

  if (payments.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border p-12 text-center bg-card/50">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-black uppercase italic tracking-tight">No Activity Yet</h3>
        <p className="max-w-[200px] text-xs font-bold text-muted-foreground uppercase leading-tight mt-2">
          Your transaction history will appear here once customers start subscribing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-[2.5rem] border border-border bg-card p-6 shadow-sm overflow-hidden">
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

      <div className="space-y-3 overflow-y-auto pr-2">
        {payments.map((payment) => (
          <div 
            key={payment.id} 
            className="group flex items-center justify-between p-4 hover:bg-muted/50 rounded-3xl transition-all border border-transparent hover:border-border/50"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${getStatusColor(payment.status)}`}>
                {getStatusIcon(payment.status)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase italic tracking-tight">
                  {payment.user?.fullName || "Anonymous User"}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  {payment.service?.name || "Digital Service"} • {format(new Date(payment.createdAt), "HH:mm, MMM dd")}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-sm font-black italic">
                +${parseFloat(payment.amount).toFixed(2)}
              </span>
              <Badge 
                variant="outline" 
                className={`text-[9px] uppercase font-black px-2 py-0 border-none ${getStatusText(payment.status)}`}
              >
                {payment.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 🛠️ UI HELPERS: Status Styling
 */
function getStatusIcon(status: string) {
  switch (status) {
    case "SUCCESS": return <CheckCircle2 className="h-4 w-4" />;
    case "PENDING": return <Clock className="h-4 w-4" />;
    case "REJECTED":
    case "FAILED": return <XCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "SUCCESS": return "bg-emerald-500/10 text-emerald-500";
    case "PENDING": return "bg-orange-500/10 text-orange-500";
    case "REJECTED":
    case "FAILED": return "bg-red-500/10 text-red-500";
    default: return "bg-muted text-muted-foreground";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "SUCCESS": return "text-emerald-500";
    case "PENDING": return "text-orange-500";
    default: return "text-muted-foreground";
  }
}