import { getMerchantActivity, getGlobalPlatformActivity } from "@/lib/services/merchant.service";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Activity,
  Terminal,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ ASYNC ACTIVITY FEED
 * Logic: Synchronized with Universal Identity. Supports Global Staff Oversight.
 */
export default async function AsyncActivityFeed({
  merchantId,
}: {
  merchantId?: string;
}) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();
  
  // 🛡️ 2. DATA RESOLUTION
  // If no merchantId is provided and user is Staff, fetch Global Telemetry.
  // Otherwise, fallback to session.merchantId or the provided prop.
  const isStaffOversight = !merchantId && session?.isStaff;
  const targetId = merchantId || session?.merchantId;

  let activities = [];
  try {
    if (isStaffOversight) {
      activities = await getGlobalPlatformActivity();
    } else if (targetId) {
      activities = await getMerchantActivity(targetId);
    }
  } catch (error) {
    console.error("[Telemetry_Sync_Failure]:", error);
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex min-h-[400px] md:h-[500px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/40 bg-card/20 p-8 md:p-12 text-center backdrop-blur-3xl shadow-inner">
        <div className="mb-6 rounded-[2rem] bg-muted/30 p-5 border border-border/10">
          <Activity className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/20" />
        </div>
        <h3 className="text-sm font-black uppercase italic tracking-tighter opacity-40 text-foreground">
          Zero Telemetry Detected
        </h3>
        <p className="max-w-[200px] text-[9px] md:text-[10px] font-black text-muted-foreground uppercase leading-tight mt-3 opacity-20 tracking-widest">
          {isStaffOversight 
            ? "Global network logs will manifest once nodes process transactions." 
            : "Transaction logs will manifest once users synchronize with your nodes."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[450px] rounded-[2.5rem] md:rounded-[3rem] border border-border/10 bg-card/40 p-5 md:p-8 shadow-2xl backdrop-blur-3xl overflow-hidden animate-in fade-in duration-1000 relative">
      {/* Background Watermark */}
      <Terminal className="absolute -bottom-10 -left-10 h-48 w-48 opacity-[0.02] -rotate-12 pointer-events-none text-primary" />

      <div className="flex flex-row items-center justify-between mb-8 px-2 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground opacity-40 italic">
              Node Operations
            </h3>
            {isStaffOversight && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[7px] font-black px-1.5 py-0">
                GLOBAL_SYNC
              </Badge>
            )}
          </div>
          <p className="text-base md:text-lg font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
            Recent <span className={cn(isStaffOversight ? "text-amber-500" : "text-primary")}>Activity</span>
          </p>
        </div>
        <a
          href="/dashboard/payouts"
          className={cn(
            "group text-[9px] md:text-[10px] font-black uppercase italic hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0",
            isStaffOversight ? "text-amber-500" : "text-primary"
          )}
        >
          Full Ledger{" "}
          <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      <div className="space-y-3 md:space-y-4 overflow-y-auto pr-1 md:pr-2 custom-scrollbar relative z-10 flex-1">
        {activities.map((item: any) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-4 md:p-5 hover:bg-muted/5 active:scale-[0.99] rounded-2xl md:rounded-[2rem] transition-all border border-transparent hover:border-border/10 shadow-sm md:shadow-none"
          >
            <div className="flex items-center gap-3 md:gap-5 min-w-0">
              <div
                className={cn(
                  "flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl shadow-inner transition-transform group-hover:scale-105",
                  getStatusColor(item.status || "PENDING")
                )}
              >
                {getStatusIcon(item.status || "PENDING")}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs md:text-sm font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate text-foreground">
                  {item.user?.fullName || "Anonymous Node"}
                </span>
                <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-40 italic truncate">
                  {item.merchant?.companyName ? `[${item.merchant.companyName}] ` : ""}
                  {item.service?.name || "Digital Service"} •{" "}
                  {item.createdAt
                    ? format(new Date(item.createdAt), "HH:mm, MMM dd")
                    : "Just now"}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-sm md:text-base font-black italic tracking-tighter leading-none text-foreground">
                +${parseFloat(String(item.serviceTier?.price || "0")).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[7px] md:text-[8px] uppercase font-black px-2 py-0.5 border shadow-sm tracking-widest",
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
 * 🛠️ UI HELPERS
 */
function getStatusIcon(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />;
    case "PENDING":
      return <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />;
    default:
      return <XCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />;
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
      return "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]";
    case "PENDING":
      return "bg-amber-500/5 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]";
    default:
      return "bg-rose-500/5 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)]";
  }
}