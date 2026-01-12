"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/src/components/ui/badge";
import { hapticFeedback } from "@/src/lib/telegram/webapp";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  createdAt: string | Date;
}

/**
 * 🛰️ RECENT ACTIVITY NODE (Apex Tier)
 * Real-time ledger telemetry with memoized rendering.
 */
export function RecentPayments({ payments = [] }: { payments: Payment[] }) {
  // 🏁 PERFORMANCE: Memoize the list to prevent re-renders when the parent layout shifts
  const renderedPayments = useMemo(() => {
    if (payments.length === 0) return null;

    return payments.map((payment) => {
      const isSuccess = payment.status === "SUCCESS";
      const isFailed = payment.status === "FAILED" || payment.status === "REFUNDED";

      return (
        <div 
          key={payment.id} 
          onClick={() => hapticFeedback("light")}
          className="group flex items-center justify-between p-3 hover:bg-muted/30 rounded-[1.25rem] transition-all duration-300 cursor-pointer border border-transparent hover:border-border/40"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-black uppercase italic tracking-tight flex items-center gap-1.5">
              <span className="text-[10px] opacity-40 not-italic">{payment.currency}</span>
              {parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {format(new Date(payment.createdAt), "MMM dd • HH:mm")}
            </span>
          </div>

          <Badge 
            variant={isSuccess ? "default" : isFailed ? "destructive" : "outline"}
            className="text-[9px] font-black uppercase px-3 py-1 rounded-lg"
          >
            {payment.status}
          </Badge>
        </div>
      );
    });
  }, [payments]);

  if (!renderedPayments) {
    return (
      <div className="rounded-[2.5rem] border-2 border-dashed border-border/40 p-12 text-center bg-muted/5">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic">
          No Signal Detected in Ledger
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] border border-border/60 bg-card/40 backdrop-blur-xl p-8 shadow-apex">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">
          Recent Activity
        </h3>
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {renderedPayments}
      </div>
    </div>
  );
}