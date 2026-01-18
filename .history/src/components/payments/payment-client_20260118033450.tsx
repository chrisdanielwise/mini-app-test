"use client";

import * as React from "react";
import { useState } from "react";
import { 
  ArrowDownLeft, Terminal, Search, Download, Globe, Building2 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Contexts & UI
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 💾 Deep-Node Ingress
import { TransactionDetailsDrawer } from "@/components/payments/transaction-details-drawer";

/**
 * 🛰️ PAYMENTS_CLIENT (Hardened v16.16.84)
 * Strategy: Component Orchestration & Deep-Node Handshake.
 * Mission: Link the Signal Ledger to the Archival Receipt Drawer.
 */
export default function PaymentsClientPage({ initialTransactions = [], isSuperAdmin }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  // 🛡️ ARCHIVE_STATE: Controls the Deep-Dive Portal
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowClick = (tx: any) => {
    impact("light");
    selectionChange(); // Tactile confirmation of node selection
    setSelectedTx(tx);
    setDrawerOpen(true);
  };

  if (!isReady) return <div className="h-screen w-full bg-black/40 animate-pulse" />;

  return (
    <div 
      className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-1000 p-4 md:p-10"
      style={{ 
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 8rem)` : "4rem",
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 opacity-30 italic">
              <ArrowDownLeft className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-primary")} />
              <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
                {isSuperAdmin ? "Global_Revenue_Sync" : "Merchant_Liquidity_Protocol"}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground">
              Inflow <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 opacity-20 group-focus-within:text-primary transition-colors" />
               <Input 
                 placeholder="SCAN TX_ID..." 
                 className="h-9 pl-9 rounded-xl bg-white/5 border-white/5 font-mono text-[8px] uppercase tracking-widest focus:border-primary/40 focus:ring-0 transition-all"
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

      {/* --- LEDGER DATA GRID --- */}
      <div className={cn(
        "rounded-2xl border backdrop-blur-3xl shadow-3xl overflow-hidden",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/60 border-white/5"
      )}>
        <div className="overflow-x-auto overscroll-x-contain scrollbar-hide">
          <Table className="min-w-[800px] relative">
            <TableHeader className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity Node</TableHead>
                {isSuperAdmin && <TableHead className="px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Origin</TableHead>}
                <TableHead className="px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Liquidity</TableHead>
                <TableHead className="px-6 py-4 text-right text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-white/5">
              {initialTransactions.map((tx: any) => (
                <TableRow 
                  key={tx.id} 
                  onClick={() => handleRowClick(tx)}
                  className="hover:bg-white/[0.02] active:bg-white/[0.03] transition-colors border-none group cursor-pointer"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "size-9 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                        isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        <Globe className="size-4" />
                      </div>
                      <div className="flex flex-col leading-none gap-1.5">
                        <p className="font-black text-[11px] uppercase italic tracking-tighter text-foreground">@{tx.user.username}</p>
                        <p className="text-[7px] font-mono opacity-20 uppercase tracking-widest">{format(new Date(tx.createdAt), "HH:mm:ss")}</p>
                      </div>
                    </div>
                  </TableCell>

                  {isSuperAdmin && (
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-amber-500/50 font-black uppercase italic text-[9px] tracking-widest leading-none">
                        <Building2 className="size-3" />
                        <span className="truncate max-w-[120px]">{tx.service.merchant?.companyName || "PLATFORM"}</span>
                      </div>
                    </TableCell>
                  )}

                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col leading-none">
                      <p className="text-lg font-black tracking-tighter italic tabular-nums leading-none">
                        <span className="text-[9px] mr-1 opacity-20 font-bold">{tx.currency}</span>
                        {Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-10 mt-1">{tx.service.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <div className={cn(
                      "inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border italic leading-none",
                      tx.status === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {tx.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 💾 ARCHIVAL RECEIPT DRAWER: Portal-based Deep Dive */}
      <TransactionDetailsDrawer 
        transaction={selectedTx}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}