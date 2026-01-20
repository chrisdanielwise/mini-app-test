// ✅ FIX: Resolve TS2304 by importing the generated model type
import { Payment } from "@/generated/prisma";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";
import { useMemo } from "react";

/**
 * 🛰️ FINANCIAL_LEDGER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Safe Area Synchronization.
 * Fix: Applied safeArea.top to header and safeArea.bottom to main padding.
 */
export default function HistoryPage() {
  const { isAuthenticated, isLocked, user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  const { isMobile, isDesktop, isTablet, isPortrait, safeArea, isReady } = useDeviceContext();

  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error } = useInstitutionalFetch<{ payments: Payment[] }>(
    isAuthenticated ? "/api/user/payments" : null
  );

  // ✅ FIX: Explicitly typed 'p' to resolve TS7006
  const payments = useMemo(() => 
    data?.payments?.filter((p: Payment) => 
      (p as any).service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
  [data, searchQuery]);

  if (!isReady || isLocked) return <LoadingScreen message="SYNCING_AUDIT_LEDGER..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  // ✅ FIX: Status extraction from imported Payment type
  const getStatusConfig = (status: Payment["status"]) => {
    const isPositive = status === "SUCCESS" || status === "COMPLETED";
    const isNegative = status === "FAILED" || status === "REJECTED";
    
    return {
      icon: isPositive ? <CheckCircle className="size-3.5" /> : isNegative ? <XCircle className="size-3.5" /> : <RefreshCcw className="size-3.5 animate-spin-slow" />,
      color: isPositive ? "text-emerald-500" : isNegative ? "text-rose-500" : "text-amber-500",
      bg: isPositive ? "bg-emerald-500/10" : isNegative ? "bg-rose-500/10" : "bg-amber-500/10"
    };
  };

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 max-w-5xl mx-auto leading-none">
      
      {/* 🛡️ FIXED HUD: Safe-Area Compliant Header */}
      <header 
        className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 rounded-b-2xl px-5 shadow-2xl transition-all"
        style={{ paddingTop: `calc(${safeArea.top}px + 0.75rem)`, paddingBottom: "1rem" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 opacity-10 italic">
              <Fingerprint className="size-2.5 text-primary" />
              <span className="text-[7px] font-black uppercase tracking-[0.3em]">Audit_Ledger_v16</span>
            </div>
            <h1 className="text-base md:text-lg font-black uppercase italic tracking-tighter text-foreground">
              Financial <span className="opacity-20">Nodes</span>
            </h1>
          </div>
          
          <div className={cn(
            "relative flex items-center bg-black/40 border border-white/5 rounded-xl transition-all h-10 px-3",
            isMobile ? "w-10 justify-center" : "w-64"
          )} onClick={() => isMobile && impact("light")}>
            <Search className="size-3.5 opacity-20" />
            {!isMobile && (
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="FILTER_HASH..."
                className="flex-1 bg-transparent border-none font-mono text-[9px] uppercase tracking-widest outline-none ml-2 placeholder:text-muted-foreground/10"
              />
            )}
          </div>
        </div>
      </header>

      {/* 🚀 MAIN CONTENT: Scrollable with Bottom Padding for Home Indicator */}
      <main 
        className="flex-1 px-5 py-8"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 6rem)` }}
      >
        {loading ? (
          <div className="space-y-4"><SkeletonList count={6} /></div>
        ) : error ? (
          <SyncErrorState />
        ) : payments.length > 0 ? (
          <div className={cn(
            "grid gap-3",
            (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2" : "grid-cols-1"
          )}>
            {/* ✅ FIX: Explicitly typed 'payment' and 'idx' to resolve TS7006 */}
            {payments.map((payment: Payment, idx: number) => {
              const config = getStatusConfig(payment.status);
              return (
                <div 
                  key={payment.id} 
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-950/40 p-4 md:p-5 transition-all shadow-lg hover:border-primary/20"
                >
                  <div className="flex items-start justify-between relative z-10 gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={cn(
                        "size-9 shrink-0 rounded-lg border flex items-center justify-center shadow-inner",
                        config.bg, config.color, "border-white/5"
                      )}>
                        {config.icon}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-foreground truncate">
                          {(payment as any).service?.name || "Protocol_Asset"}
                        </h3>
                        <p className="text-[7.5px] font-black text-muted-foreground/20 uppercase tracking-[0.2em]">
                          NODE_{payment.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1.5 shrink-0">
                      <p className="text-lg md:text-xl font-black italic tracking-tighter tabular-nums text-foreground">
                        ${parseFloat(payment.amount.toString()).toFixed(2)}
                      </p>
                      <Badge className={cn("text-[6.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border-none", config.bg, config.color)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 opacity-10 italic">
                       <Clock className="size-2.5" />
                       <span className="text-[7.5px] font-black uppercase">
                         {new Date(payment.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-5">
                      <Activity className="size-2.5 animate-pulse" />
                      <span className="text-[7px] font-mono tracking-widest uppercase">SYNC_OK</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyLedgerState />
        )}
      </main>

      <footer className="flex flex-col items-center gap-2 py-8 mt-auto opacity-10 italic">
         <Globe className="size-4" />
         <p className="text-[7px] font-black uppercase tracking-[0.4em] text-center px-10">
           Audit_Core // Synchronized_Node_{user?.id?.slice(0, 6)}
         </p>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS: Tactical Scaling ---

function IdentityNullFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center animate-in fade-in duration-700 leading-none">
      <div className="relative mb-6">
        <div className="size-16 rounded-xl bg-zinc-950/60 border border-white/10 flex items-center justify-center shadow-2xl">
          <Lock className="size-7 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Identity <span className="text-primary/60">Locked</span></h2>
        <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] max-w-[220px] italic">
          Authorization required for financial telemetry egress.
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-8 h-10 px-8 bg-primary text-primary-foreground rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
      >
        Initiate_Resync
      </button>
    </div>
  );
}

function SyncErrorState() {
  return (
    <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-12 text-center space-y-3 shadow-inner">
      <Terminal className="mx-auto size-8 text-rose-500 opacity-20 animate-pulse" />
      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-rose-500">Sync_Protocol_Failure</p>
    </div>
  );
}

function EmptyLedgerState() {
  return (
    <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-950/40 p-16 text-center relative overflow-hidden">
      <h3 className="text-base font-black uppercase italic tracking-tighter text-foreground/10">Zero_Ingress_Detected</h3>
    </div>
  );
}