import { getMerchantActivity, getGlobalPlatformActivity } from "@/lib/services/merchant.service";
import { format } from "date-fns";
import { getSession } from "@/lib/auth/session";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Activity,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ ASYNC_ACTIVITY_FEED (Hardened v2026.1.18)
 * Strategy: Dual-Ingress Telemetry with Case-Insensitive Normalization.
 * Fix: Added BigInt safety to prevent serialization crashes on Telegram IDs.
 */
export default async function AsyncActivityFeed({
  merchantId,
}: {
  merchantId?: string;
}) {
  // 🔐 1. IDENTITY_HANDSHAKE: Fail-safe session resolution
  const session = await getSession().catch(() => null);
  
  // 🛡️ 2. PROTOCOL_RESOLUTION
  const isStaffOversight = !merchantId && session?.isStaff;
  const targetId = merchantId || session?.merchantId;

  let activities: any[] = []; 
  
  try {
    if (isStaffOversight) {
      activities = await getGlobalPlatformActivity();
    } else if (targetId) {
      activities = await getMerchantActivity(targetId);
    }

    // 🧹 ATOMIC_CLEANUP: Hydrate BigInts and Decimals for safe Client handover
    activities = JSON.parse(JSON.stringify(activities, (_, v) => 
      typeof v === 'bigint' ? v.toString() : v
    ));

  } catch (error) {
    console.error("🔐 [Telemetry_Sync_Failure]:", error);
    activities = []; // Recovery fallback
  }

  // 🏜️ EMPTY_STATE: Optimized for Zero Results
  if (!activities || activities.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-white/5 bg-card/20 p-8 text-center backdrop-blur-3xl animate-in fade-in duration-700">
        <Activity className="h-10 w-10 text-muted-foreground/10 animate-pulse mb-6" />
        <h3 className="text-[10px] font-black uppercase italic tracking-[0.4em] opacity-40 text-foreground">
          Zero_Telemetry_Detected
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-[2.5rem] border border-white/5 bg-card/30 p-6 md:p-8 shadow-2xl backdrop-blur-3xl overflow-hidden relative group">
      {/* 🌫️ VAPOUR RADIANCE: Identity Awareness */}
      <div className={cn(
        "absolute -top-20 -right-20 h-64 w-64 blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000",
        isStaffOversight ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ FIXED HUD --- */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className={cn("h-2.5 w-2.5 animate-pulse", isStaffOversight ? "text-amber-500" : "text-primary")} />
            <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 italic">
              Node_Operations
            </h3>
          </div>
          <p className="text-lg font-black uppercase italic tracking-tighter text-foreground">
            Identity <span className={isStaffOversight ? "text-amber-500" : "text-primary"}>Pulse</span>
          </p>
        </div>
        
        <a href="/dashboard/payouts" className={cn(
            "group text-[9px] font-black uppercase italic tracking-widest transition-all flex items-center gap-1.5",
            isStaffOversight ? "text-amber-500/60 hover:text-amber-500" : "text-primary/60 hover:text-primary"
          )}>
          {isStaffOversight ? "Global_Audit" : "Full_Ledger"}
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* --- 🚀 INTERNAL SCROLL --- */}
      <div className="space-y-3 overflow-y-auto pr-2 relative z-10 flex-1 scrollbar-hide">
        {activities.map((item, index) => {
          // ✅ NORMALIZATION: Handles 'active' vs 'ACTIVE' discrepancies
          const currentStatus = (item.status || "SUCCESS").toUpperCase();
          const styles = getStatusStyles(currentStatus);

          return (
            <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center gap-4 min-w-0">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105", styles.container)}>
                  {getStatusIcon(currentStatus)}
                </div>
                <div className="flex flex-col min-w-0 leading-none">
                  <span className="text-xs font-black uppercase italic tracking-tighter text-foreground truncate">
                    {item.user?.fullName || "Anonymous_Node"}
                  </span>
                  <span className="text-[7px] font-bold text-muted-foreground/30 uppercase tracking-[0.1em] mt-1.5 italic truncate">
                     {item.service?.name || "Access_Handshake"} • {format(new Date(item.createdAt), "HH:mm")}
                  </span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end shrink-0 leading-none">
                <span className="text-sm font-black italic tracking-tighter text-foreground tabular-nums">
                  +${parseFloat(String(item.serviceTier?.price || "0")).toFixed(2)}
                </span>
                <div className={cn("text-[6px] tracking-[0.3em] font-black px-1.5 py-0.5 rounded border mt-1.5", styles.badge)}>
                  {currentStatus}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 🏛️ HELPERS: STATUS MORPHOLOGY */
function getStatusIcon(status: string) {
  if (status === "SUCCESS" || status === "ACTIVE") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === "PENDING") return <Clock className="h-3.5 w-3.5 animate-pulse" />;
  return <XCircle className="h-3.5 w-3.5" />;
}

function getStatusStyles(status: string) {
  if (status === "SUCCESS" || status === "ACTIVE") return {
    container: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    badge: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
  };
  if (status === "PENDING") return {
    container: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    badge: "bg-amber-500/5 text-amber-500 border-amber-500/10"
  };
  return {
    container: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    badge: "bg-rose-500/5 text-rose-500 border-rose-500/10"
  };
}