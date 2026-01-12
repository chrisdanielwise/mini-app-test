"use client";

import { useApi } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowDownLeft, 
  Fingerprint,
  RefreshCcw,
  Search,
  ShieldCheck
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

/**
 * 🛰️ USER LEDGER HISTORY (Apex Tier)
 * Normalized: Fixed fluid typography and responsive grid constraints.
 * Optimized: Sticky-HUD and tactile feedback for mobile mini-app constraints.
 */
export default function HistoryPage() {
  const { auth, isReady } = useTelegramContext();

  const { data, isLoading, error } = useApi<{ payments: Payment[] }>(
    auth.isAuthenticated ? "/api/user/payments" : null
  );

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Ledger Nodes..." />;
  }

  const payments = data?.payments || [];

  const getStatusConfig = (status: Payment["status"]) => {
    switch (status) {
      case "SUCCESS":
      case "COMPLETED":
        return { 
          icon: <CheckCircle className="h-3.5 w-3.5" />, 
          class: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        };
      case "FAILED":
      case "REJECTED":
        return { 
          icon: <XCircle className="h-3.5 w-3.5" />, 
          class: "text-rose-500 bg-rose-500/10 border-rose-500/20",
          glow: ""
        };
      default:
        return { 
          icon: <RefreshCcw className="h-3.5 w-3.5 animate-spin-slow" />, 
          class: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        };
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-4 md:space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      
      {/* --- STICKY HUD HEADER --- */}
      <header className="sticky top-0 z-30 space-y-3 bg-background/80 px-4 py-6 md:p-8 md:pb-6 backdrop-blur-2xl border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Secure Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
              Financial <span className="text-muted-foreground/40">Ledger</span>
            </h1>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-muted/10 border border-border/40 flex items-center justify-center text-muted-foreground group active:scale-95 transition-all">
             <Search className="h-4 w-4 md:h-5 md:w-5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </header>

      {/* --- MAIN AUDIT CONTENT --- */}
      <main className="px-4 sm:px-6 pb-32">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : error ? (
          <div className="rounded-3xl md:rounded-[3rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-12 md:p-16 text-center space-y-6 shadow-inner">
            <ShieldCheck className="mx-auto h-10 w-10 md:h-12 md:w-12 text-rose-500 opacity-30" />
            <div className="space-y-2">
              <p className="text-sm font-black uppercase italic tracking-widest text-rose-500">
                Synchronisation Failure
              </p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] max-w-[200px] mx-auto">
                Ledger Node unreachable. Auto-recovery active.
              </p>
            </div>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {payments.map((payment) => {
              const config = getStatusConfig(payment.status);
              return (
                <div
                  key={payment.id}
                  className={cn(
                    "group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-border/40 bg-card/40 p-5 md:p-8 transition-all active:scale-[0.98] hover:border-primary/30 backdrop-blur-md shadow-2xl",
                    config.glow
                  )}
                >
                  {/* Subtle Background Icon */}
                  <ArrowDownLeft className="absolute -bottom-4 -right-4 h-20 w-20 md:h-24 md:w-24 opacity-[0.02] -rotate-12 pointer-events-none" />

                  <div className="flex items-start justify-between relative z-10 gap-4">
                    <div className="flex items-center gap-3 md:gap-5 min-w-0">
                      <div className={cn(
                        "flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl md:rounded-2xl border transition-colors shadow-inner",
                        config.class
                      )}>
                        {config.icon}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base md:text-lg font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
                          {payment.service.name}
                        </h3>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                          NODE_ID: {payment.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1.5 md:space-y-2 shrink-0">
                      <p className="text-xl md:text-2xl font-black italic tracking-tighter leading-none">
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: payment.currency,
                          currencyDisplay: 'narrowSymbol'
                        }).format(parseFloat(payment.amount))}
                      </p>
                      <Badge variant="outline" className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-sm",
                        config.class
                      )}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-40 italic">
                       <Clock className="h-3 w-3" />
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                         {new Date(payment.createdAt).toLocaleString(undefined, {
                           day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                         })}
                       </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-20">
                      Zipha_Ledger_v2
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-[2.5rem] md:rounded-[4rem] border border-dashed border-border/40 bg-card/20 p-12 md:p-20 text-center backdrop-blur-xl relative overflow-hidden">
            <Receipt className="mx-auto mb-4 md:mb-6 h-12 w-12 md:h-16 md:w-16 text-primary opacity-10" />
            <div className="space-y-3 relative z-10">
               <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none">Zero Ingress Detected</h3>
               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto opacity-40">
                 No financial handshakes recorded on this identity node.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}