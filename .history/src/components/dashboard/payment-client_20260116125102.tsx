"use client";

import * as React from "react";
import { 
  ArrowDownLeft, Terminal, Search, Download,
  Globe, Zap, Calendar, Building2, CheckCircle2, Clock, Activity
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Contexts & UI
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * 🛰️ PAYMENTS_CLIENT_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Fix: High-density row compression (py-3.5) and stationary header protocol.
 */
export default function PaymentsClientPage({ initialTransactions = [], isSuperAdmin, role }: any) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  // 🛡️ Prevent layout snapping during hardware handshake
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <ArrowDownLeft className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-primary")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
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
              <span className="truncate">Validated Packets: {initialTransactions.length} // Identity: {role.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 scale-90 origin-bottom-right">
            <div className="relative min-w-0 w-48 lg:w-64 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
               <Input 
                 placeholder="SEARCH TX_ID..." 
                 className="h-10 w-full pl-10 rounded-xl border-white/5 bg-white/5 font-black text-[9px] uppercase tracking-widest focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/20 transition-all"
               />
            </div>
            <Button variant="outline" className="h-10 px-4 rounded-xl border-white/5 bg-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-foreground hover:bg-white/10 transition-all">
              <Download className="mr-2 size-3.5 opacity-40" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Fleet Grid --- */}
      <div className="flex-1 min-h-0 w-full relative flex flex-col px-6 pt-4 pb-6">
        <div className={cn(
          "flex-1 w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isSuperAdmin ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🛡️ THE SCROLL ENGINE */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar">
            <Table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <TableHeader className="bg-white/[0.04] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[25%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Identity Node</TableHead>
                  {isSuperAdmin && <TableHead className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Origin</TableHead>}
                  <TableHead className="w-[20%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Service Node</TableHead>
                  <TableHead className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Liquidity</TableHead>
                  <TableHead className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Timestamp</TableHead>
                  <TableHead className="w-[10%] px-6 py-2.5 text-right text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Protocol</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody className="divide-y divide-white/5">
                {initialTransactions.length === 0 ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={isSuperAdmin ? 6 : 5} className="py-24 text-center opacity-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">No_Ingress_Signals_Detected</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  initialTransactions.map((tx: any) => (
                    <TableRow 
                      key={tx.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.01] transition-colors border-none group"
                    >
                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            "size-9 shrink-0 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                            isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                          )}>
                            <Globe className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <p className="font-black text-foreground uppercase italic tracking-tighter text-sm group-hover:text-primary transition-colors truncate">
                              @{tx.user.username || 'anon_node'}
                            </p>
                            <p className="text-[6px] font-mono text-muted-foreground/20 uppercase mt-0.5 truncate">
                              UID: {tx.userId.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {isSuperAdmin && (
                        <TableCell className="px-6 py-3.5">
                          <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                            <Building2 className="size-3.5 shrink-0" />
                            {tx.service.merchant?.companyName || "PLATFORM"}
                          </div>
                        </TableCell>
                      )}

                      <TableCell className="px-6 py-3.5">
                        <div className="flex flex-col leading-tight">
                          <div className="flex items-center gap-2">
                            <Zap className="size-3 text-primary opacity-40" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/80 italic truncate max-w-[140px]">
                              {tx.service.name}
                            </p>
                          </div>
                          <p className="text-[6px] font-mono text-muted-foreground/20 uppercase tracking-widest mt-1">
                            TX: {tx.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-3.5">
                        <p className="text-lg font-black tracking-tighter italic text-foreground leading-none tabular-nums">
                          <span className="text-[8px] align-top mr-1 opacity-20 font-bold">{tx.currency}</span>
                          {Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </TableCell>

                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center gap-2 opacity-60">
                          <Calendar className="size-3 text-muted-foreground/40" />
                          <span className="font-bold text-[8px] uppercase italic leading-none">
                            {format(new Date(tx.createdAt), "dd MMM yyyy")}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-3.5 text-right">
                        <div className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
                          tx.status === 'SUCCESS' 
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
                            : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                        )}>
                          {tx.status === 'SUCCESS' ? <CheckCircle2 className="size-3 mr-1.5 animate-pulse" /> : <Clock className="size-3 mr-1.5" />}
                          {tx.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="shrink-0 flex items-center justify-center gap-4 opacity-10 pt-8 pb-12">
        <Activity className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-primary")} />
        <p className="text-[7px] font-black uppercase tracking-[0.5em] text-foreground italic">
           Secure Ledger Sync: Optimal // Role_Node: {role.toUpperCase()}
        </p>
      </div>
    </div>
  );
}