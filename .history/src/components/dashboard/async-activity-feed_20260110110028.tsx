import { getMerchantActivity } from "@/lib/services/merchant.service";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ ASYNC ACTIVITY FEED (Tier 2)
 * High-fidelity telemetry of merchant transactions and node activations.
 */
export default async function AsyncActivityFeed({
  merchantId,
}: {
  merchantId: string;
}) {
  const data = await getMerchantActivity(merchantId);
  const activities = data || [];

  if (activities.length === 0) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/40 bg-card/20 p-12 text-center backdrop-blur-xl">
        <div className="mb-6 rounded-[2rem] bg-muted/30 p-5 border border-border/40">
          <Activity className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-sm font-black uppercase italic tracking-tighter">
          Zero Telemetry Detected
        </h3>
        <p className="max-w-[180px] text-[10px] font-bold text-muted-foreground uppercase leading-tight mt-2 opacity-50 tracking-widest">
          Transaction logs will manifest once users synchronize with your nodes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[450px] rounded-[2.5rem] border border-border/40 bg-card/40 p-8 shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in duration-1000">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
            Node Operations
          </h3>
          <p className="text-sm font-black uppercase italic tracking-tighter">
            Recent <span className="text-primary">Activity</span>
          </p>
        </div>
        <a
          href="/dashboard/payments"
          className="group text-[10px] font-black uppercase italic text-primary hover:scale-105 transition-all flex items-center gap-1.5"
        >
          Full Ledger{" "}
          <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((item: any) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-5 hover:bg-primary/[0.03] rounded-[1.8rem] transition-all border border-transparent hover:border-primary/10"
          >
            <div className="flex items-center gap-5">
              <div
                className={cn(
                  "p-3.5 rounded-2xl shadow-inner transition-transform group-hover:scale-110",
                  getStatusColor(item.status || "PENDING")
                )}
              >
                {getStatusIcon(item.status || "PENDING")}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                  {item.user?.fullName || "Anonymous Node"}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">
                  {item.service?.name || "Digital Service"} •{" "}
                  {item.createdAt
                    ? format(new Date(item.createdAt), "HH:mm, MMM dd")
                    : "Just now"}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5">
              <span className="text-base font-black italic tracking-tighter">
                +${parseFloat(item.serviceTier?.price || "0").toFixed(2)}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8px] uppercase font-black px-2.5 py-0.5 border shadow-sm tracking-[0.1em]",
                  getStatusBadgeStyles(item.status || "PENDING")
                )}
              >
                {item.status || "PENDING"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 🛠️ UI HELPERS: Refactored for the V2 Aesthetic
 */
function getStatusIcon(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return <CheckCircle2 className="h-4 w-4" />;
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    default:
      return <XCircle className="h-4 w-4" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    default:
      return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  }
}

function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return "bg-emerald-500/5 text-emerald-500 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/5 text-amber-500 border-amber-500/20";
    default:
      return "bg-rose-500/5 text-rose-500 border-rose-500/20";
  }
}
