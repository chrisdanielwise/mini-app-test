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
  ArrowRight
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
 * 🛰️ RECENT_PAYMENTS (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density rows (p-3) and shrunken header (py-4) prevent blowout.
 */
export function RecentPayments({ payments, className }: RecentPaymentsProps) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return (
    <div className={cn("h-64 w-full bg-card/10 animate-pulse rounded-2xl", className)} />
  );

  return (
    <div className={cn(
      "relative group flex flex-col overflow-hidden border backdrop-blur-3xl shadow-2xl transition-all duration-700",
      "rounded-3xl",
      isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5",
      className
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE */}
      <div className={cn(
        "absolute -right-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none transition-all",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ FIXED HUD: Compressed Header --- */}
      <div className="shrink-0 border-b border-white/5 px-6 py-4 flex items-center justify-between bg-white/[0.02] relative z-10 leading-none">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 italic opacity-30">
            {isStaff ? (
              <Globe className="size-2.5 text-amber-500 animate-pulse" />
            ) : (
              <Activity className="size-2.5 text-primary animate-pulse" />
            )}
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "text-[7.5px] font-black uppercase tracking-[0.3em]",
                isStaff ? "text-amber-500" : "text-muted-foreground"
              )}>
                {isStaff ? "Global_Liquidity" : "Liquidity_Vector"}
              </h3>
            </div>
          </div>
          <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Recent <span className={isStaff ? "text-amber-500" : "text-primary"}>Ledger</span>
          </p>
        </div>
        <div className={cn(
          "size-9 md:size-10 rounded-xl flex items-center justify-center shadow-inner border transition-all",
          isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
        )}>
           <DollarSign className="size-5" />
        </div>
      </div>

      {/* --- 🚀 TRANSACTION STREAM: High Density --- */}
      <div className="p-4 md:p-5 relative z-10">
        <div className="space-y-2">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-10">
              <Clock className="size-6 mb-3" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] italic">Awaiting_Sync</p>
            </div>
          ) : (
            payments.map((payment, index) => (
              <div
                key={payment.id}
                onMouseEnter={() => impact("light")}
                onClick={() => { selectionChange(); impact("medium"); }}
                style={{ animationDelay: `${index * 30}ms` }}
                className="group/item flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar Node: Compressed size-10 */}
                  <div className="relative shrink-0">
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-lg border text-sm font-black italic shadow-inner transition-all group-hover/item:scale-105",
                      isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                    )}>
                      {(payment.user.fullName || payment.user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-background flex items-center justify-center border border-white/10">
                      <ShieldCheck className={cn("size-2.5", isStaff ? "text-amber-500" : "text-primary")} />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0 leading-tight">
                    <p className="text-sm font-black uppercase italic tracking-tighter text-foreground/80 group-hover/item:text-primary transition-colors truncate">
                      {payment.user.fullName || payment.user.username || "Legacy_Node"}
                    </p>
                    <div className="flex items-center gap-2 mt-1 opacity-20 italic">
                       <span className={cn("size-1 rounded-full", isStaff ? "bg-amber-500" : "bg-primary")} />
                       <p className="text-[7.5px] font-black uppercase tracking-[0.1em] truncate">
                        {payment.service?.name || "Mesh_Node"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end shrink-0 ml-4 leading-none">
                  <p className="text-base font-black italic tracking-tighter text-foreground tabular-nums">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                      minimumFractionDigits: 2
                    }).format(parseFloat(payment.amount))}
                  </p>
                  <p className="text-[7px] font-black text-muted-foreground/20 uppercase tracking-[0.1em] mt-1.5 italic">
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- VIEW ALL ACTION: Slim h-10 --- */}
        {payments.length > 0 && (
          <button 
            onClick={() => impact("medium")}
            className={cn(
              "mt-6 w-full group flex items-center justify-center gap-3 h-10 rounded-xl border transition-all",
              isStaff ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20" : "bg-white/[0.01] border-white/5 hover:border-white/10"
            )}
          >
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.2em] italic",
              isStaff ? "text-amber-500/40 group-hover:text-amber-500" : "text-muted-foreground/40 group-hover:text-primary"
            )}>
              {isStaff ? "Global_Ledger" : "Full_Stream"}
            </span>
            <ArrowRight className={cn(
              "size-3.5 transition-transform group-hover:translate-x-1",
              isStaff ? "text-amber-500" : "text-primary"
            )} />
          </button>
        )}
      </div>
    </div>
  );
}