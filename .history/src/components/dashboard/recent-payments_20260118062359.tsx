"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Activity,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

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
 * 🛰️ RECENT_PAYMENTS_LEDGER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware Bridge Sync.
 * Integration: Merged Legacy Logic with Hardened 2026 Chassis.
 */
export function RecentPayments({ payments, className }: RecentPaymentsProps) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION_SHIELD: Prevents layout shift during client-side hydration
  if (!isReady) return (
    <div className={cn("h-64 w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-[2rem]", className)} />
  );

  return (
    <div className={cn(
      "relative group flex flex-col overflow-hidden border backdrop-blur-3xl shadow-2xl transition-all duration-700",
      "rounded-[2rem] md:rounded-[2.5rem]",
      isStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/40 border-white/5",
      className
    )}>
      
      {/* 🌫️ ATMOSPHERIC RADIANCE */}
      <div className={cn(
        "absolute -right-16 -top-16 size-48 blur-[100px] opacity-20 pointer-events-none transition-all",
        isStaff ? "bg-amber-500/30" : "bg-primary/20"
      )} />

      {/* --- 🛡️ FIXED HUD: Compressed Strategic Header --- */}
      <div className="shrink-0 border-b border-white/5 px-6 py-5 flex items-center justify-between bg-white/[0.02] relative z-10 leading-none">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 italic opacity-30">
            {isStaff ? (
              <Globe className="size-3 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="size-3 text-primary animate-pulse" />
            )}
            <h3 className={cn(
              "text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]",
              isStaff ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaff ? "Global_Node_Liquidity" : "Liquidity_Vector"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Recent <span className={isStaff ? "text-amber-500" : "text-primary"}>Ledger</span>
          </p>
        </div>
        <div className={cn(
          "size-10 md:size-12 rounded-2xl flex items-center justify-center shadow-inner border transition-all",
          isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
        )}>
           <DollarSign className="size-5 md:size-6" />
        </div>
      </div>

      {/* --- 🚀 TRANSACTION STREAM: High-Density Tactical Ingress --- */}
      <div className="p-4 md:p-6 relative z-10">
        <div className="space-y-2.5">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 opacity-10 border-2 border-dashed border-white/5 rounded-3xl">
              <Clock className="size-8 mb-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] italic text-center px-4">Awaiting_Sync_Protocol</p>
            </div>
          ) : (
            payments.map((payment, index) => (
              <div
                key={payment.id}
                onMouseEnter={() => !isMobile && impact("light")}
                onClick={() => { selectionChange(); impact("medium"); }}
                style={{ animationDelay: `${index * 40}ms` }}
                className="group/item flex items-center justify-between p-3.5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all animate-in fade-in slide-in-from-bottom-2 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div className={cn(
                      "flex size-11 items-center justify-center rounded-xl border text-sm font-black italic shadow-inner transition-all group-hover/item:scale-110",
                      isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                    )}>
                      {(payment.user.fullName || payment.user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-4.5 rounded-full bg-black flex items-center justify-center border border-white/10 shadow-lg">
                      <ShieldCheck className={cn("size-3", isStaff ? "text-amber-500" : "text-primary")} />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0 leading-tight">
                    <p className="text-sm font-black uppercase italic tracking-tighter text-foreground/90 group-hover/item:text-primary transition-colors truncate">
                      {payment.user.fullName || payment.user.username || "Legacy_Node"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 opacity-30 italic">
                       <TrendingUp className={cn("size-2.5", isStaff ? "text-amber-500" : "text-primary")} />
                       <p className="text-[8px] font-black uppercase tracking-[0.1em] truncate">
                        {payment.service?.name || "Mesh_Signal_Node"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end shrink-0 ml-4 leading-none">
                  <p className="text-base md:text-lg font-black italic tracking-tighter text-foreground tabular-nums">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                      minimumFractionDigits: 2
                    }).format(parseFloat(payment.amount))}
                  </p>
                  <p className="text-[7.5px] font-black text-muted-foreground/20 uppercase tracking-[0.1em] mt-2 italic">
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- VIEW ALL ACTION: Global Telemetry Bridge --- */}
        {payments.length > 0 && (
          <button 
            onClick={() => impact("heavy")}
            className={cn(
              "mt-8 w-full group flex items-center justify-center gap-3 h-12 rounded-2xl border transition-all active:scale-[0.97]",
              isStaff ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20 shadow-lg shadow-amber-500/5" : "bg-white/[0.01] border-white/5 hover:border-white/10"
            )}
          >
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.3em] italic",
              isStaff ? "text-amber-500/40 group-hover:text-amber-500" : "text-muted-foreground/40 group-hover:text-primary"
            )}>
              {isStaff ? "Access_Global_Ledger" : "Access_Full_Stream"}
            </span>
            <ArrowUpRight className={cn(
              "size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1",
              isStaff ? "text-amber-500" : "text-primary"
            )} />
          </button>
        )}
      </div>
    </div>
  );
}