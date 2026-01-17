"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Globe, ArrowUpRight, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  createdAt: string | Date;
  merchant?: { companyName: string };
}

interface RecentPaymentsProps {
  payments: Payment[];
  isStaff?: boolean;
}

/**
 * 🌊 RECENT_ACTIVITY_NODE (v16.16.12)
 * Logic: Role-Gated Ledger Sync with Subsurface Glass Morphology.
 * Design: High-Density Telemetry with Kinetic Hover States.
 */
export function RecentPayments({ payments = [], isStaff = false }: RecentPaymentsProps) {
  const { impact } = useHaptics();
  
  const renderedPayments = useMemo(() => {
    if (payments.length === 0) return null;

    return payments.map((payment) => {
      const isSuccess = payment.status === "SUCCESS";
      const isFailed = ["FAILED", "REFUNDED"].includes(payment.status);

      return (
        <div 
          key={payment.id} 
          onClick={() => impact("light")}
          className="group relative flex items-center justify-between p-4 hover:bg-white/[0.03] rounded-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-white/5 active:scale-[0.98]"
        >
          {/* Kinetic Ingress Indicator */}
          <div className={cn(
            "absolute left-0 w-1 h-0 group-hover:h-1/2 rounded-r-full transition-all duration-500 top-1/2 -translate-y-1/2",
            isStaff ? "bg-amber-500/50" : "bg-emerald-500/50"
          )} />

          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black uppercase italic tracking-tighter flex items-center gap-2">
                <span className="text-[10px] opacity-20 not-italic font-black">{payment.currency}</span>
                {parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              
              {isStaff && payment.merchant && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/5 border border-amber-500/10">
                  <Globe className="size-2 text-amber-500/60" />
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] text-amber-500/60 truncate max-w-[100px]">
                    {payment.merchant.companyName}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-40">
              <Activity className="size-2.5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
                {format(new Date(payment.createdAt), "MMM dd • HH:mm:ss")}
              </span>
            </div>
          </div>

          <Badge 
            className={cn(
              "text-[9px] font-black uppercase px-3 py-1 rounded-lg border shadow-none transition-all duration-500",
              isSuccess && !isStaff && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
              isSuccess && isStaff && "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
              isFailed && "bg-rose-500/10 text-rose-500 border-rose-500/20",
              !isSuccess && !isFailed && "bg-white/5 text-muted-foreground border-white/5 opacity-40"
            )}
          >
            {isSuccess && <ShieldCheck className="size-2.5 mr-1.5 inline-block" />}
            {payment.status}
          </Badge>
        </div>
      );
    });
  }, [payments, isStaff, impact]);

  if (!renderedPayments) {
    return (
      <div className="rounded-[3rem] border-2 border-dashed border-white/5 p-20 text-center bg-card/5 backdrop-blur-xl">
        <div className="space-y-4">
          <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto opacity-20">
            <Activity className="size-6" />
          </div>
          <p className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-[0.5em] italic">
            Signal_Silence // Node_Inactive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-module p-8 space-y-8 rounded-[3rem]">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-8 rounded-xl flex items-center justify-center border",
            isStaff ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
          )}>
            <ArrowUpRight className={cn("size-4", isStaff ? "text-amber-500" : "text-emerald-500")} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground italic">
              {isStaff ? "Global_Ledger_Sync" : "Recent_Activity"}
            </h3>
            <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              Live_Telemetry_Stream
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
            <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Stream_Health</p>
            <p className="text-[9px] font-black text-emerald-500 uppercase italic tracking-tighter">99.9%_Uptime</p>
          </div>
          <div className={cn(
            "size-2 rounded-full animate-pulse shadow-lg",
            isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-emerald-500 shadow-emerald-500/20"
          )} />
        </div>
      </div>
      
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderedPayments}
      </div>
    </div>
  );
}