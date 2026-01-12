"use client";

import { useApi } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
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

export default function HistoryPage() {
  const { auth, isReady } = useTelegramContext();

  // 🛡️ AUTHENTICATED FETCH
  // The useApi hook will now only trigger the fetch if isAuthenticated is true.
  const { data, isLoading, error } = useApi<{ payments: Payment[] }>(
    auth.isAuthenticated ? "/api/user/payments" : null
  );

  // 1. SYSTEM INITIALIZATION: Wait for Telegram SDK handshake
  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Establishing Secure Tunnel..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unauthorized identity nodes
  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] px-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative h-16 w-16 rounded-2xl bg-card border border-primary/20 flex items-center justify-center shadow-2xl">
            <Lock className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-foreground">
            Identity Node <span className="text-primary">Offline</span>
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed max-w-[240px] mx-auto opacity-60">
            Authorization required to access the encrypted financial ledger.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
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
          class: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          glow: "shadow-[0_0_10px_rgba(16,185,129,0.05)]"
        };
      case "FAILED":
      case "REJECTED":
        return { 
          icon: <XCircle className="h-3 w-3" />, 
          class: "text-rose-500 bg-rose-500/10 border-rose-500/20",
          glow: ""
        };
      default:
        return { 
          icon: <RefreshCcw className="h-3 w-3 animate-spin-slow" />, 
          class: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          glow: "shadow-[0_0_10px_rgba(245,158,11,0.05)]"
        };
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header className="sticky top-0 z-30 bg-background/80 px-4 py-3 md:py-4 backdrop-blur-xl border-b border-border/10">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 opacity-60">
              <Fingerprint className="h-3 w-3 text-primary" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">
                Secure Audit
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black uppercase italic tracking-tight leading-none text-foreground">
              Financial <span className="text-primary/40">Ledger</span>
            </h1>
          </div>
          <button className="h-9 w-9 rounded-lg bg-muted/10 border border-border/10 flex items-center justify-center text-muted-foreground active:scale-90 transition-all">
             <Search className="h-4 w-4 opacity-40" />
          </button>
        </div>
      </header>

      <main className="px-4 py-4 pb-24 md:pb-12">
        {isLoading ? (
          <div className="space-y-3">
             <SkeletonList count={6} />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-dashed border-rose-500/20 bg-rose-500/5 p-8 text-center space-y-4 shadow-inner">
            <ShieldCheck className="mx-auto h-8 w-8 text-rose-500 opacity-20" />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase italic tracking-widest text-rose-500">
                Sync Failure
              </p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                Node unreachable. Re-syncing...
              </p>
            </div>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => {
              const config = getStatusConfig(payment.status);
              return (
                <div
                  key={payment.id}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border/40 bg-card/40 p-4 md:p-5 transition-all active:scale-[0.98] backdrop-blur-md shadow-sm",
                    config.glow
                  )}
                >
                  <ArrowDownLeft className="absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.03] -rotate-12 pointer-events-none" />

                  <div className="flex items-start justify-between relative z-10 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-inner",
                        config.class
                      )}>
                        {config.icon}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="text-sm md:text-base font-black uppercase italic tracking-tight text-foreground leading-none truncate group-hover:text-primary transition-colors">
                          {payment.service.name}
                        </h3>
                        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                          NODE: {payment.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1 shrink-0">
                      <p className="text-base md:text-lg font-black italic tracking-tighter leading-none tabular-nums">
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: payment.currency,
                          currencyDisplay: 'narrowSymbol'
                        }).format(parseFloat(payment.amount))}
                      </p>
                      <Badge variant="outline" className={cn(
                        "text-[7px] font-black uppercase tracking-widest px-1.5 py-0 rounded border shadow-sm",
                        config.class
                      )}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 opacity-30 italic">
                       <Clock className="h-2.5 w-2.5" />
                       <span className="text-[8px] font-bold uppercase tracking-widest">
                         {new Date(payment.createdAt).toLocaleString(undefined, {
                           day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                         })}
                       </span>
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/20">
                      Ledger_Node_V2
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border/10 bg-card/10 p-12 text-center relative overflow-hidden">
            <Terminal className="mx-auto mb-4 h-10 w-10 text-primary opacity-5" />
            <div className="space-y-1 relative z-10">
               <h3 className="text-sm font-black uppercase italic tracking-tight text-foreground/60">Zero Ingress Detected</h3>
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-30">
                 No financial signals recorded.
               </p>
            </div>
          </div>
        )}
      </main>

      <footer className="flex items-center justify-center gap-3 opacity-20 py-4 mt-auto">
         <Globe className="h-2.5 w-2.5 text-muted-foreground" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Audit Core synchronized // State: Optimal
         </p>
      </footer>
    </div>
  );
}