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

export function PaymentsLedger({ transactions = [] }: { transactions?: any[] }) {
  const { impact } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  const hasTransactions = Array.isArray(transactions) && transactions.length > 0;

  if (!isReady) return <div className="h-full w-full bg-card/10 animate-pulse rounded-2xl border border-white/5" />;

  // 🛡️ ZERO TELEMETRY STATE
  if (!hasTransactions) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-white/5 bg-black/40 p-8 text-center backdrop-blur-3xl">
        <Activity className={cn("size-8 mb-4 opacity-20", isStaffTheme ? "text-amber-500" : "text-primary")} />
        <h3 className="text-[9px] font-black uppercase italic tracking-[0.4em] opacity-30">
          Zero_Settlement_Telemetry
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden bg-black/20 rounded-3xl border border-white/5 shadow-2xl">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div className={cn(
        "shrink-0 z-30 border-b p-5 md:p-6 transition-all duration-700",
        isStaffTheme ? "border-amber-500/10 bg-amber-500/[0.02]" : "border-white/5 bg-white/[0.02]"
      )}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 leading-none">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <Terminal className={cn("size-2.5", isStaffTheme ? "text-amber-500" : "text-primary")} />
              <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Settlement_Ledger_v16.31</span>
            </div>
            <h2 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
              Payments <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Traffic</span>
            </h2>
          </div>

          {/* Tactical Filters: Compressed h-9 */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 opacity-20 group-focus-within:opacity-100 transition-opacity" />
              <input 
                placeholder="FIND_TX..." 
                className="h-9 w-full bg-black/60 border border-white/5 rounded-lg px-9 text-[8px] font-black uppercase tracking-widest outline-none focus:border-primary/20 transition-all placeholder:opacity-10"
              />
            </div>
            <button className="h-9 px-3 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all">
              <Filter className="size-3.5 opacity-30" />
            </button>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Signal Stream --- */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-2">
        {transactions.map((tx, i) => (
          <div 
            key={tx.id}
            onMouseEnter={() => impact("light")}
            className="group flex items-center justify-between py-3 px-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={cn(
                "size-9 shrink-0 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                isStaffTheme ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                <DollarSign className="size-4" />
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-xs md:text-sm font-black uppercase italic tracking-tighter text-foreground/80 truncate">
                  {tx.customerName || "Anonymous_Node"}
                </span>
                <span className="text-[7px] font-bold text-muted-foreground/20 uppercase tracking-[0.1em] mt-0.5 truncate italic">
                  ID: {tx.id.slice(0, 16).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-4 leading-none">
              <p className="text-base font-black italic tracking-tighter text-foreground tabular-nums">
                +${parseFloat(tx.amount).toFixed(2)}
              </p>
              <div className="flex items-center gap-2 opacity-20 italic">
                <Clock className="size-2.5" />
                <span className="text-[6.5px] font-black uppercase tracking-widest">
                  {format(new Date(tx.createdAt), "HH:mm // MMM dd")}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Footer Signal */}
        <div className="flex items-center justify-center gap-3 pt-6 pb-2 opacity-5 italic">
          <CheckCircle2 className="size-2.5" />
          <p className="text-[6.5px] font-black uppercase tracking-[0.4em]">All_Nodes_Synchronized</p>
        </div>
      </div>
    </div>
  );
}