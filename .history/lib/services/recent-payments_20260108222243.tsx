import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function RecentPayments({ payments = [] }: { payments: any[] }) {
  if (payments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-12 text-center">
        <p className="text-sm font-bold text-muted-foreground uppercase italic">No recent transactions found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-2xl transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase italic">${parseFloat(payment.amount).toFixed(2)} {payment.currency}</span>
              <span className="text-[10px] font-bold text-muted-foreground">{format(new Date(payment.createdAt), "MMM dd, HH:mm")}</span>
            </div>
            <Badge className={payment.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"}>
              {payment.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}