"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { DollarSign, Clock, User, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { hapticFeedback } from "@/lib/telegram/webapp";

interface Payment {
  id: string;
  amount: string; // Decimal string from Prisma 7
  currency: string;
  createdAt: string; 
  user: {
    fullName: string | null;
    username: string | null;
  };
  service: {
    name: string;
  } | null;
}

interface RecentPaymentsProps {
  payments: Payment[];
  className?: string;
}

/**
 * 💹 RECENT PAYMENTS LEDGER (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive safe-zones and institutional touch-targets for mobile telemetry.
 */
export function RecentPayments({ payments, className }: RecentPaymentsProps) {
  return (
    <div className={cn(
      "rounded-[2rem] md:rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000", 
      className
    )}>
      {/* --- HEADER NODE --- */}
      <div className="border-b border-border/40 p-5 md:p-8 flex items-center justify-between bg-muted/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 italic opacity-40">
            <Zap className="h-3 w-3 text-primary animate-pulse" />
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground">
              Node Liquidity
            </h3>
          </div>
          <p className="text-xs md:text-sm font-black uppercase italic tracking-tighter leading-none">
            Recent <span className="text-primary">Ledger</span>
          </p>
        </div>
        <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20 shrink-0">
           <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="space-y-3 md:space-y-4">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center border-2 border-dashed border-border/10 rounded-2xl md:rounded-[2rem] bg-muted/5">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-muted/20 mb-4 flex items-center justify-center border border-border/10 opacity-30">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
              </div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic opacity-40 px-6">
                Awaiting First Protocol Sync
              </p>
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                onClick={() => hapticFeedback("light")}
                className="group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 border border-transparent hover:border-border/10 hover:bg-primary/[0.03] active:scale-[0.98] cursor-default"
              >
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                  {/* Avatar Node */}
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-xs md:text-sm font-black text-primary italic shadow-inner group-hover:scale-105 transition-transform">
                      {(payment.user.fullName || payment.user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 rounded-full bg-background flex items-center justify-center border border-border/10 shadow-sm">
                      <ShieldCheck className="h-2.5 w-2.5 md:h-3 md:w-3 text-emerald-500" />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <p className="text-xs md:text-sm font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate">
                      {payment.user.fullName || payment.user.username || "Legacy Node"}
                    </p>
                    <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-40 flex items-center gap-1.5 truncate">
                      <span className="h-1 w-1 rounded-full bg-border shrink-0" />
                      {payment.service?.name || "Global Signal Node"}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 md:gap-1.5 shrink-0 ml-3">
                  <p className="text-sm md:text-base font-black italic tracking-tighter leading-none">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                    }).format(parseFloat(payment.amount))}
                  </p>
                  <p className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-[0.1em] italic opacity-30 whitespace-nowrap">
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- VIEW ALL ACTION --- */}
        {payments.length > 0 && (
          <button 
            onClick={() => hapticFeedback("medium")}
            className="mt-6 md:mt-8 w-full group flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl md:rounded-2xl border border-border/10 bg-muted/10 hover:bg-primary/5 hover:border-primary/20 active:scale-[0.98] transition-all"
          >
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
              Full Telemetry Ledger
            </span>
            <ArrowUpRight className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        )}
      </div>
    </div>
  );
}