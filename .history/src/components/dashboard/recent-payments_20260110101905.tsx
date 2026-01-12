"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/src/lib/utils";
import { DollarSign, Clock, User, ArrowUpRight, ShieldCheck } from "lucide-react";

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
 * 💹 RECENT PAYMENTS LEDGER (Tier 2)
 * High-resiliency transaction feed with Decimal-safe parsing.
 */
export function RecentPayments({ payments, className }: RecentPaymentsProps) {
  return (
    <div className={cn(
      "rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in duration-1000", 
      className
    )}>
      {/* --- HEADER NODE --- */}
      <div className="border-b border-border/40 p-8 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
            Node Liquidity
          </h3>
          <p className="text-sm font-black uppercase italic tracking-tighter">
            Recent <span className="text-primary">Ledger</span>
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
           <DollarSign className="h-5 w-5" />
        </div>
      </div>

      <div className="p-8">
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/20 rounded-[2rem] bg-muted/5">
              <div className="h-14 w-14 rounded-2xl bg-muted/30 mb-4 flex items-center justify-center border border-border/40">
                <Clock className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
                Awaiting First Protocol Sync
              </p>
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-border/40 hover:bg-muted/30"
              >
                <div className="flex items-center gap-5">
                  {/* Avatar Node */}
                  <div className="relative">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-sm font-black text-primary italic shadow-inner group-hover:scale-105 transition-transform">
                      {(payment.user.fullName || payment.user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background flex items-center justify-center border border-border/40">
                      <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                      {payment.user.fullName || payment.user.username || "Legacy Node"}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-border" />
                      {payment.service?.name || "Global Signal Node"}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-base font-black italic tracking-tighter leading-none">
                    {/* Safe Decimal Parsing Protocol */}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                    }).format(parseFloat(payment.amount))}
                  </p>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.1em] italic opacity-40">
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- VIEW ALL ACTION --- */}
        {payments.length > 0 && (
          <button className="mt-8 w-full group flex items-center justify-center gap-2 py-4 rounded-2xl border border-border/40 bg-muted/10 hover:bg-primary/5 hover:border-primary/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary">
              Full Transaction Telemetry
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        )}
      </div>
    </div>
  );
}