"use client";

import { useApi } from "@/src/lib/hooks/use-api";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { SkeletonList } from "@/src/components/ui/skeleton-card";
import { Badge } from "@/src/components/ui/badge";
import { 
  Receipt, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Info, 
  ShieldCheck, 
  ArrowDownLeft, 
  Fingerprint,
  RefreshCcw,
  Search
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "SUCCESS" | "FAILED" | "REJECTED" | "PENDING" | "REFUNDED" | "COMPLETED";
  gatewayProvider: string;
  createdAt: string;
  service: {
    name: string;
  };
  merchant: {
    companyName?: string;
  };
}

/**
 * 🛰️ USER LEDGER HISTORY (Staff Tier)
 * Institutional-grade financial audit node for subscribers.
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
          icon: <CheckCircle className="h-4 w-4" />, 
          class: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        };
      case "FAILED":
      case "REJECTED":
        return { 
          icon: <XCircle className="h-4 w-4" />, 
          class: "text-rose-500 bg-rose-500/10 border-rose-500/20",
          glow: ""
        };
      default:
        return { 
          icon: <RefreshCcw className="h-4 w-4 animate-spin-slow" />, 
          class: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        };
    }
  };

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-1000">
      
      {/* --- STICKY HUD HEADER --- */}
      <header className="sticky top-0 z-30 space-y-3 bg-background/60 p-8 pb-6 backdrop-blur-2xl border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Secure Audit
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              Financial <span className="text-muted-foreground/40">Ledger</span>
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-muted/10 border border-border/40 flex items-center justify-center text-muted-foreground">
             <Search className="h-5 w-5 opacity-40" />
          </div>
        </div>
      </header>

      {/* --- MAIN AUDIT CONTENT --- */}
      <main className="px-6 pb-32">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : error ? (
          <div className="rounded-[3rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-6">
            <ShieldCheck className="mx-auto h-12 w-12 text-rose-500 opacity-30" />
            <div className="space-y-2">
              <p className="text-sm font-black uppercase italic tracking-tighter text-rose-500">
                Data Synchronisation Failure
              </p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Ledger Node unreachable. Attempting auto-recovery...
              </p>
            </div>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-6">
            {payments.map((payment) => {
              const config = getStatusConfig(payment.status);
              return (
                <div
                  key={payment.id}
                  className={cn(
                    "group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-8 transition-all active:scale-[0.97] hover:border-primary/30 backdrop-blur-md shadow-2xl",
                    config.glow
                  )}
                >
                  {/* Subtle Background Icon */}
                  <ArrowDownLeft className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.02] -rotate-12 pointer-events-none" />

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors shadow-inner",
                        config.class
                      )}>
                        {config.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground leading-none">
                          {payment.service.name}
                        </h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                          ID: {payment.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <p className="text-2xl font-black italic tracking-tighter leading-none">
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: payment.currency,
                          currencyDisplay: 'narrowSymbol'
                        }).format(parseFloat(payment.amount))}
                      </p>
                      <Badge variant="outline" className={cn(
                        "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-sm",
                        config.class
                      )}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-40 italic">
                       <Clock className="h-3 w-3" />
                       <span className="text-[9px] font-black uppercase tracking-widest">
                         {new Date(payment.createdAt).toLocaleString(undefined, {
                           day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                         })}
                       </span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-20">
                      Zipha_Secure_Node
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-[4rem] border border-dashed border-border/40 bg-card/20 p-20 text-center backdrop-blur-xl relative overflow-hidden">
            <Receipt className="mx-auto mb-6 h-16 w-16 text-primary opacity-10" />
            <div className="space-y-4 relative z-10">
               <h3 className="text-xl font-black uppercase italic tracking-tighter">Zero Ingress</h3>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto opacity-60">
                 No financial handshakes have been recorded on this identity node.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}