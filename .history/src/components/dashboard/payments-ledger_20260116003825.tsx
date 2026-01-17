"use client";

import * as React from "react";
import { format } from "date-fns";
import { 
  DollarSign, 
  Activity, 
  Terminal, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock,
  Search,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

export function PaymentsLedger({ transactions = [] }: { transactions?: any[] }) {
  const { impact } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  // 🛡️ CRASH PREVENTION: Defensive check for undefined transactions
  const hasTransactions = React.useMemo(() => 
    Array.isArray(transactions) && transactions.length > 0, 
    [transactions]
  );

  if (!isReady) return <div className="h-96 w-full bg-card/10 animate-pulse rounded-[2rem] md:rounded-[3rem]" />;

  // 🛰️ ZERO TELEMETRY STATE: Replaces the "Something went wrong" crash
  if (!hasTransactions) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-black/40 p-12 text-center backdrop-blur-3xl animate-in fade-in duration-1000">
        <div className={cn(
          "mb-8 rounded-2xl p-8 border animate-pulse",
          isStaffTheme ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/10 border-primary/20"
        )}>
          <Activity className={cn("size-10", isStaffTheme ? "text-amber-500" : "text-primary")} />
        </div>
        <h3 className="text-[12px] font-black uppercase italic tracking-[0.5em] opacity-30">
          Zero_Settlement_Telemetry
        </h3>
        <p className="max-w-[280px] text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] leading-relaxed mt-6 italic">
          No transaction nodes detected in the current cluster. Data will manifest upon successful handshake.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* 🚀 LEDGER HUD: Restored Chroma Glow */}
      <div className={cn(
        "relative overflow-hidden border backdrop-blur-3xl p-6 md:p-10 transition-all duration-700",
        "rounded-[2.5rem] md:rounded-[3rem] shadow-2xl",
        isStaffTheme ? "border-amber-500/20 bg-amber-500/[0.03]" : "border-primary/20 bg-primary/[0.03]"
      )}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 italic opacity-30">
              <Terminal className={cn("size-3", isStaffTheme ? "text-amber-500" : "text-primary")} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Settlement_Ledger_v16.31</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
              Payments <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Traffic</span>
            </h2>
          </div>

          {/* Tactical Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20" />
              <input 
                placeholder="FIND_TX..." 
                className="h-10 w-full bg-black/40 border border-white/5 rounded-xl px-10 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all"
              />
            </div>
            <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all">
              <Filter className="size-4 opacity-40" />
            </button>
          </div>
        </div>

        {/* 📊 RESTORED DATA GRID */}
        <div className="mt-10 space-y-3">
          {transactions.map((tx, i) => (
            <div 
              key={tx.id}
              onMouseEnter={() => impact("light")}
              className="group flex items-center justify-between p-5 rounded-[1.8rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500"
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "size-10 md:size-12 rounded-xl flex items-center justify-center border shadow-inner",
                  isStaffTheme ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  <DollarSign className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm md:text-base font-black uppercase italic tracking-tighter text-foreground/80">{tx.customerName || "Anonymous_User"}</span>
                  <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-1">ID: {tx.id.slice(0, 12)}</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-base md:text-lg font-black italic tracking-tighter text-foreground leading-none">
                  +${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-end gap-2 opacity-30 italic">
                  <Clock className="size-2.5" />
                  <span className="text-[7px] font-black uppercase">{format(new Date(tx.createdAt), "MMM dd, HH:mm")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}