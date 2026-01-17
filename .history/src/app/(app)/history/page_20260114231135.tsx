"use client";

import { useApi } from "@/lib/hooks/use-telemetry";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowDownLeft, 
  Fingerprint,
  RefreshCcw,
  Search,
  ShieldCheck,
  Globe,
  Terminal,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "SUCCESS" | "FAILED" | "REJECTED" | "PENDING" | "REFUNDED" | "COMPLETED";
  gatewayProvider: string;
  createdAt: string;
  service: { name: string; };
  merchant: { companyName?: string; };
}

/**
 * 🛰️ FINANCIAL LEDGER TERMINAL (Institutional v12.19.0)
 * Architecture: Soft Session Identity Handshake.
 * Logic: Bypasses SDK hangs if Bearer Recovery is already active.
 */
export default function HistoryPage() {
  const { auth, isReady, mounted } = useTelegramContext();
  const [tunnelReady, setTunnelReady] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  // 🛡️ HYDRATION & TIMEOUT SHIELD
  useEffect(() => {
    if (mounted) setTunnelReady(true);
    
    // Safety Net: If Telegram SDK hangs, allow UI transition if Auth is verified
    const timer = setTimeout(() => {
       if (!isReady) {
         console.warn("🛰️ [Ledger_Node] SDK Handshake timed out. Proceeding with Auth State.");
         setIsStuck(true);
       }
    }, 4000);

    return () => clearTimeout(timer);
  }, [mounted, isReady]);

  const { data, isLoading, error } = useApi<{ payments: Payment[] }>(
    auth?.isAuthenticated ? "/api/user/payments" : null
  );

  // 1. INITIALIZATION: Loader only shows if we have NO auth status yet
  if (!auth.isAuthenticated && (!isReady && !isStuck || !tunnelReady || auth.isLoading)) {
    return <LoadingScreen message="RETRIEVING AUDIT LEDGER..." subtext="SECURE TUNNEL ACTIVE" />;
  }

  // 2. CRYPTOGRAPHIC GATE: Identity Null Fallback
  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] px-8 text-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative h-20 w-20 rounded-[2rem] bg-card border border-primary/20 flex items-center justify-center shadow-2xl">
            <Lock className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Identity Node <span className="text-primary">Offline</span></h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] leading-relaxed max-w-[260px] mx-auto opacity-50">
            Authorization required to access the encrypted financial ledger.
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="mt-10 px-8 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
          Initiate Resync
        </button>
      </div>
    );
  }

  const payments = data?.payments || [];

  const getStatusConfig = (status: Payment["status"]) => {
    switch (status) {
      case "SUCCESS":
      case "COMPLETED":
        return { 
          icon: <CheckCircle className="h-3 w-3" />, 
          class: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        };
      case "FAILED":
      case "REJECTED":
        return { 
          icon: <XCircle className="h-3 w-3" />, 
          class: "text-rose-500 bg-rose-500/5 border-rose-500/20",
          glow: ""
        };
      default:
        return { 
          icon: <RefreshCcw className="h-3 w-3 animate-spin-slow" />, 
          class: "text-amber-500 bg-amber-500/5 border-amber-500/20",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        };
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground">
      
      <header className="sticky top-0 z-30 bg-background/80 px-4 py-4 backdrop-blur-2xl border-b border-border/10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 opacity-50">
              <Fingerprint className="h-3.5 w-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Audit_Protocol</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none">Financial <span className="text-primary/40">Ledger</span></h1>
          </div>
          <button className="h-11 w-11 rounded-xl bg-muted/10 border border-border/10 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-90">
             <Search className="h-5 w-5 opacity-60" />
          </button>
        </div>
      </header>

      <main className="px-4 py-6 pb-32">
        {isLoading ? (
          <div className="space-y-4"><SkeletonList count={6} /></div>
        ) : error ? (
          <div className="rounded-[2rem] border border-dashed border-rose-500/20 bg-rose-500/5 p-12 text-center space-y-4 shadow-inner">
            <ShieldCheck className="mx-auto h-10 w-10 text-rose-500 opacity-20" />
            <p className="text-sm font-black uppercase italic tracking-widest text-rose-500">Sync_Failure</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => {
              const config = getStatusConfig(payment.status);
              return (
                <div key={payment.id} className={cn("group relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-5 md:p-6 transition-all active:scale-[0.98] backdrop-blur-3xl shadow-lg", config.glow)}>
                  <ArrowDownLeft className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.02] -rotate-12 pointer-events-none transition-transform group-hover:scale-110" />
                  <div className="flex items-start justify-between relative z-10 gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-inner", config.class)}>{config.icon}</div>
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base md:text-lg font-black uppercase italic tracking-tight leading-none truncate group-hover:text-primary">{payment.service.name}</h3>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">NODE: {payment.id.toUpperCase().slice(-12)}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2 shrink-0">
                      <p className="text-lg md:text-xl font-black italic tracking-tighter leading-none tabular-nums">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency, currencyDisplay: 'narrowSymbol' }).format(parseFloat(payment.amount))}
                      </p>
                      <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg", config.class)}>{payment.status}</Badge>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-40 italic">
                       <Clock className="h-3 w-3" />
                       <span className="text-[9px] font-bold uppercase tracking-widest">
                         {new Date(payment.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                       </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">Ledger_Sync_V2</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-[2.5rem] border border-dashed border-border/10 bg-card/10 p-20 text-center relative overflow-hidden">
            <Terminal className="mx-auto mb-6 h-12 w-12 text-primary opacity-5 animate-pulse" />
            <h3 className="text-lg font-black uppercase italic tracking-tight text-foreground/40 leading-none">Zero Ingress Detected</h3>
          </div>
        )}
      </main>

      <footer className="flex items-center justify-center gap-3 opacity-20 py-8 mt-auto">
         <Globe className="h-4 w-4" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center leading-none">Audit Core synchronized // NODE_ID: {auth?.user?.id?.slice(0, 8) || "ROOT"}</p>
      </footer>
    </div>
  );
}