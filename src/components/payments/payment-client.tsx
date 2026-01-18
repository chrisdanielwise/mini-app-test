"use client";

import * as React from "react";
import { useState } from "react";
import { 
  ArrowDownLeft, Terminal, Search, Download, Globe, Building2, Cpu, Activity 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 💾 Deep-Node Ingress
import { TransactionDetailsDrawer } from "@/components/payments/transaction-details-drawer";

/**
 * 🛰️ PAYMENTS_CLIENT (Institutional Apex v16.84.0 - HARDENED)
 * Strategy: Viewport-Locked Chassis & Etched Tactical Grid.
 * Fix: Stationed HUD + Internal Scroll Engine + border-r for vertical lines.
 */
export default function PaymentsClientPage({ initialTransactions = [], isSuperAdmin }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowClick = (tx: any) => {
    impact("light");
    selectionChange();
    setSelectedTx(tx);
    setDrawerOpen(true);
  };

  if (!isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-8 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Syncing_Ledger_Nodes...</p>
    </div>
  );

  return (
    /* 🏛️ PRIMARY CHASSIS: Locked at 100% height to anchor the Stationary Header */
    <div className="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-black text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Layer (shrink-0) --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <ArrowDownLeft className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-primary")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.3em] leading-none",
                isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Revenue_Sync" : "Merchant_Liquidity_Protocol"}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Inflow <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
            </h1>
            
            <div className="flex items-center gap-2 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-2.5" />
              <span className="truncate leading-none">Transmission_Sync: Stable // AES-256 Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 scale-90 origin-bottom-right">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 opacity-20 group-focus-within:text-primary transition-colors" />
               <Input 
                 placeholder="SCAN TX_ID..." 
                 className="h-9 w-40 lg:w-64 pl-9 rounded-xl bg-white/5 border-white/5 font-mono text-[8px] uppercase tracking-widest focus:border-primary/40 focus:ring-0 transition-all"
               />
            </div>
            <Button 
              onClick={() => impact("medium")}
              variant="outline" 
              className="h-9 px-4 rounded-xl border-white/5 bg-white/5 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 active:scale-95"
            >
              <Download className="mr-2 size-3 opacity-40" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 triggers independent scroll --- */}
      <div className="flex-1 min-h-0 w-full relative flex flex-col p-3 pb-6">
        <div className={cn(
          "flex-1 min-h-0 w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isSuperAdmin ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🌊 THE SCROLL ENGINE */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar overscroll-contain">
            <table className="w-full text-left border-collapse min-w-[850px] table-fixed relative">
              <thead className="bg-zinc-950 sticky top-0 z-20 border-b border-white/5 backdrop-blur-md">
                <tr className="divide-x divide-white/5">
                  <th className="w-[30%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity Node</th>
                  {isSuperAdmin && <th className="w-[18%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Origin</th>}
                  <th className="w-[25%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Liquidity</th>
                  <th className="w-[15%] px-6 py-3 text-right text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-white/5">
                {initialTransactions.map((tx: any) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => handleRowClick(tx)}
                    className="hover:bg-white/[0.01] active:bg-white/[0.02] transition-colors divide-x divide-white/5 group cursor-pointer"
                  >
                    <td className="px-6 py-4 border-r border-white/5">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn(
                          "size-9 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-12",
                          isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          <Globe className="size-4" />
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="font-black text-sm uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors truncate">@{tx.user.username}</p>
                          <p className="text-[6px] font-mono text-muted-foreground/20 uppercase mt-0.5 tracking-widest">{format(new Date(tx.createdAt), "HH:mm:ss")}</p>
                        </div>
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-6 py-4 border-r border-white/5">
                        <div className="flex items-center gap-2 text-amber-500/50 font-black uppercase italic text-[9px] truncate">
                          <Building2 className="size-3 shrink-0" />
                          <span className="truncate">{tx.service.merchant?.companyName || "PLATFORM"}</span>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-4 border-r border-white/5">
                      <div className="flex flex-col leading-none">
                        <p className="text-lg font-black tracking-tighter italic tabular-nums leading-none">
                          <span className="text-[9px] mr-1 opacity-20 font-bold">{tx.currency}</span>
                          {Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary/40 mt-1.5 truncate max-w-[150px]">{tx.service.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className={cn(
                        "inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase border tracking-widest italic leading-none",
                        tx.status === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn("size-1 rounded-full mr-1.5", tx.status === 'SUCCESS' ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                        {tx.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🌫️ MOBILE CLEARANCE: Ensures BottomNav overlap protection */}
        {isMobile && (
          <div 
            style={{ height: `calc(${safeArea.bottom}px + 6.5rem)` }} 
            className="shrink-0 w-full" 
          />
        )}
      </div>

      {/* 💾 ARCHIVAL RECEIPT DRAWER */}
      <TransactionDetailsDrawer 
        transaction={selectedTx}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}