"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  createdAt: string | Date;
  merchant?: { companyName: string }; // Injected for Staff View
}

interface RecentPaymentsProps {
  payments: Payment[];
  isStaff?: boolean; // Controls the theme and visibility of merchant origin
}

/**
 * 🛰️ RECENT ACTIVITY NODE
 * Optimized: Role-aware telemetry with staff-specific identity mapping.
 */
export function RecentPayments({ payments = [], isStaff = false }: RecentPaymentsProps) {
  
  const renderedPayments = useMemo(() => {
    if (payments.length === 0) return null;

    return payments.map((payment) => {
      const isSuccess = payment.status === "SUCCESS";
      const isFailed = ["FAILED", "REFUNDED"].includes(payment.status);

      return (
        <div 
          key={payment.id} 
          onClick={() => hapticFeedback("light")}
          className="group flex items-center justify-between p-3.5 hover:bg-muted/30 rounded-[1.25rem] transition-all duration-300 cursor-pointer border border-transparent hover:border-border/40"
        >
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase italic tracking-tight flex items-center gap-1.5">
                <span className="text-[10px] opacity-40 not-italic font-bold">{payment.currency}</span>
                {parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              
              {/* 🛡️ STAFF OVERLAY: Identify the merchant origin of the signal */}
              {isStaff && payment.merchant && (
                <div className="flex items-center gap-1 text-amber-500/50">
                  <Globe className="h-2.5 w-2.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest truncate max-w-[80px]">
                    {payment.merchant.companyName}
                  </span>
                </div>
              )}
            </div>

            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              {format(new Date(payment.createdAt), "MMM dd • HH:mm")}
            </span>
          </div>

          <Badge 
            variant={isSuccess ? "default" : isFailed ? "destructive" : "outline"}
            className={cn(
              "text-[9px] font-black uppercase px-3 py-1 rounded-lg border-none shadow-sm",
              isSuccess && !isStaff && "bg-emerald-500/10 text-emerald-500",
              isSuccess && isStaff && "bg-amber-500/10 text-amber-500",
              !isSuccess && !isFailed && "opacity-40"
            )}
          >
            {payment.status}
          </Badge>
        </div>
      );
    });
  }, [payments, isStaff]);

  if (!renderedPayments) {
    return (
      <div className="rounded-[2.5rem] border-2 border-dashed border-border/20 p-16 text-center bg-card/10 backdrop-blur-sm">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-40">
          Signal Silence // No Ingress Detected
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl p-6 md:p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 leading-none">
            {isStaff ? "Global Ledger Sync" : "Recent Activity"}
          </h3>
          <ArrowUpRight className={cn("h-3 w-3 opacity-30", isStaff ? "text-amber-500" : "text-primary")} />
        </div>
        <div className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse",
          isStaff ? "bg-amber-500" : "bg-emerald-500"
        )} />
      </div>
      
      <div className="space-y-1 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {renderedPayments}
      </div>
    </div>
  );
}