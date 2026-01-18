"use client";

import * as React from "react";
import { format } from "date-fns";
import { 
  DollarSign, 
  Activity, 
  Terminal, 
  ArrowUpRight, 
  Clock,
  Search,
  Filter,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ PAYMENTS_LEDGER (Refined v16.16.74)
 * Strategy: High-Density Signal Stream & Independent Tactical Volume.
 * Fix: Standardized mobile text baselines for 2026 OLED contrast.
 */
export function PaymentsLedger({ transactions = [] }: { transactions?: any[] }) {
  const { impact } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  if (!isReady) return <div className="h-64 w-full bg-white/[0.02] animate-pulse rounded-3xl border border-white/5" />;

  return (
    <div className="w-full h-full flex flex-col min-w-0 bg-black/40 rounded-[2rem] border border-white/5 shadow-3xl overflow-hidden backdrop-blur-xl">
      
      {/* --- 🛡️ FIXED COMMAND HUD --- */}
      <div className={cn(
        "shrink-0 p-5 md:p-6 border-b transition-colors duration-700",
        isStaffTheme ? "border-amber-500/10 bg-amber-500/[0.01]" : "border-white/5 bg-white/[0.01]"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 opacity-30 italic">
              <Terminal className={cn("size-2.5", isStaffTheme ? "text-amber-500" : "text-primary")} />
              <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Traffic_Ingress_v16.74</span>
            </div>
            <h2 className="text-sm md:text-xl font-black uppercase italic tracking-tighter text-foreground">
              Payments <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Pulse</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-30">
               <Filter className="size-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* --- 🚀 LAMINAR STREAM --- */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 space-y-2.5 scrollbar-hide">
        {transactions.map((tx, i) => (
          <div 
            key={tx.id}
            onClick={() => impact("light")}
            style={{ animationDelay: `${i * 30}ms` }}
            className="group flex items-center justify-between py-3.5 px-4 rounded-2xl border border-white/5 bg-white/[0.02] active:bg-white/[0.05] transition-all animate-in fade-in slide-in-from-bottom-1"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={cn(
                "size-10 shrink-0 rounded-xl flex items-center justify-center border shadow-xl transition-all",
                isStaffTheme ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
              )}>
                <ArrowUpRight className="size-4.5 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col min-w-0 leading-none gap-1">
                <span className="text-[11px] font-black uppercase italic tracking-tighter text-foreground/90 truncate">
                  {tx.customerName || tx.user?.username || "Anonymous_Node"}
                </span>
                <span className="text-[6.5px] font-mono text-muted-foreground/20 uppercase tracking-[0.2em] italic">
                  ID: {tx.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1 shrink-0 ml-4 leading-none">
              <p className="text-sm md:text-base font-black italic tracking-tighter text-foreground tabular-nums">
                +${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[6px] font-black uppercase tracking-[0.2em] opacity-10">
                {format(new Date(tx.createdAt), "HH:mm // dd.MM")}
              </span>
            </div>
          </div>
        ))}
        
        {/* Signal Footer */}
        <div className="flex items-center justify-center gap-3 py-6 opacity-5 italic">
          <Activity className="size-2.5 animate-pulse" />
          <p className="text-[7px] font-black uppercase tracking-[0.4em]">Mesh_Telemetry_Terminal</p>
        </div>
      </div>
    </div>
  );
}