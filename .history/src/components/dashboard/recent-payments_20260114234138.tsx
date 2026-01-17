"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { DollarSign, Clock, ArrowUpRight, ShieldCheck, Zap, Globe } from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface Payment {
  id: string;
  amount: string;
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
 * 🌊 FLUID PAYMENTS LEDGER (Institutional v16.16.12)
 * Logic: Haptic-synced transaction stream with Role-Aware Radiance.
 */
export function RecentPayments({ payments, className }: RecentPaymentsProps) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <div className={cn(
      "relative group flex flex-col overflow-hidden rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-black/20",
      className
    )}>
      
      {/* 🌊 AMBIENT RADIANCE: Oversight Vector Glow */}
      <div className={cn(
        "absolute -right-24 -top-24 size-64 blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- HEADER NODE --- */}
      <div className="border-b border-white/5 p-6 md:p-10 flex items-center justify-between bg-white/[0.02] relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 italic opacity-40">
            {isStaff ? (
              <Globe className="size-3.5 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="size-3.5 text-primary animate-pulse" />
            )}
            <h3 className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em]",
              isStaff ? "text-amber-500" : "text-foreground"
            )}>
              {isStaff ? "Global_Node_Liquidity" : "Node_Liquidity_Vector"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Recent <span className={isStaff ? "text-amber-500" : "text-primary"}>Ledger</span>
          </p>
        </div>
        <div className={cn(
          "size-12 rounded-2xl flex items-center justify-center shadow-inner border shrink-0 transition-transform group-hover:rotate-6",
          isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
        )}>
           <DollarSign className="size-6" />
        </div>
      </div>

      <div className="p-6 md:p-10 relative z-10">
        <div className="space-y-4 md:space-y-6">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
              <div className="size-16 rounded-2xl bg-white/5 mb-6 flex items-center justify-center border border-white/10 opacity-20">
                <Clock className="size-8" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                Awaiting_First_Protocol_Sync
              </p>
            </div>
          ) : (
            payments.map((payment, index) => (
              <div
                key={payment.id}
                onMouseEnter={() => impact("light")}
                onClick={() => selectionChange()}
                style={{ animationDelay: `${index * 50}ms` }}
                className="group/item flex items-center justify-between p-4 rounded-2xl transition-all duration-500 border border-transparent hover:border-white/10 hover:bg-white/[0.03] active:scale-[0.98] cursor-pointer animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-5 min-w-0">
                  {/* Avatar Node */}
                  <div className="relative shrink-0">
                    <div className={cn(
                      "flex size-12 md:size-14 items-center justify-center rounded-xl border text-base font-black italic shadow-inner transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-3",
                      isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                    )}>
                      {(payment.user.fullName || payment.user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-background flex items-center justify-center border border-white/10 shadow-2xl">
                      <ShieldCheck className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <p className="text-sm md:text-base font-black uppercase italic tracking-tighter leading-none group-hover/item:text-primary transition-colors truncate text-foreground/80">
                      {payment.user.fullName || payment.user.username || "Legacy Node"}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.15em] mt-2 italic flex items-center gap-2 truncate">
                      <span className={cn("size-1 rounded-full shrink-0", isStaff ? "bg-amber-500/40" : "bg-primary/40")} />
                      {payment.service?.name || "Global Signal Node"}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-4">
                  <p className="text-base md:text-lg font-black italic tracking-tighter leading-none text-foreground">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                    }).format(parseFloat(payment.amount))}
                  </p>
                  <p className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] italic whitespace-nowrap">
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
            onClick={() => impact("medium")}
            className={cn(
              "mt-10 w-full group flex items-center justify-center gap-3 py-5 rounded-2xl border transition-all duration-700",
              isStaff ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30" : "bg-white/5 border-white/5 hover:border-primary/20"
            )}
          >
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.3em] transition-all italic",
              isStaff ? "text-amber-500/40 group-hover:text-amber-500 group-hover:tracking-[0.4em]" : "text-muted-foreground/40 group-hover:text-primary group-hover:tracking-[0.4em]"
            )}>
              {isStaff ? "Global_Telemetry_Ledger" : "Full_Telemetry_Ledger"}
            </span>
            <ArrowUpRight className={cn(
              "size-4 transition-all group-hover:translate-x-1 group-hover:-translate-y-1",
              isStaff ? "text-amber-500" : "text-primary"
            )} />
          </button>
        )}
      </div>
    </div>
  );
}