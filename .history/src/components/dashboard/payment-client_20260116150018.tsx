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

export default function PaymentsClientPage({ initialTransactions = [], isSuperAdmin, role }: any) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return <div className="h-screen w-full bg-black/40 animate-pulse" />;

  return (
    <div 
      className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-8"
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 opacity-40 italic">
            <ArrowDownLeft className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-primary")} />
            <span className={cn("text-[8.5px] font-black uppercase tracking-[0.4em]", isSuperAdmin ? "text-amber-500" : "text-primary")}>
              {isSuperAdmin ? "Global_Revenue_Sync" : "Merchant_Liquidity_Protocol"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Inflow <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 opacity-20" />
             <Input 
               placeholder="SEARCH TX_ID..." 
               className="h-10 pl-10 rounded-xl bg-white/5 border-white/5 font-mono text-[9px] uppercase tracking-widest"
             />
          </div>
          <Button variant="outline" className="h-10 px-5 rounded-xl border-white/5 bg-white/5 text-[9px] font-black uppercase tracking-widest">
            <Download className="mr-2 size-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* --- LEDGER DATA GRID: STICKY HORIZON PROTOCOL --- */}
      <div className={cn(
        "rounded-2xl md:rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        {/* Set max-height and overflow-y-auto to enable the sticky header effect */}
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[1000px] relative">
            <TableHeader className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-8 py-4 text-[8.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">Identity Node</TableHead>
                {isSuperAdmin && <TableHead className="px-8 py-4 text-[8.5px] font-black uppercase tracking-[0.3em] text-amber-500/40 italic">Origin</TableHead>}
                <TableHead className="px-8 py-4 text-[8.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">Service Node</TableHead>
                <TableHead className="px-8 py-4 text-[8.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">Liquidity</TableHead>
                <TableHead className="px-8 py-4 text-[8.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">Timestamp</TableHead>
                <TableHead className="px-8 py-4 text-right text-[8.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-white/5">
              {initialTransactions.map((tx: any) => (
                <TableRow 
                  key={tx.id} 
                  onMouseEnter={() => impact("light")}
                  className="hover:bg-white/[0.02] transition-colors border-none"
                >
                  <TableCell className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "size-9 shrink-0 rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                        isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        <Globe className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-black text-[11px] uppercase italic tracking-tighter leading-none">@{tx.user.username}</p>
                        <p className="text-[7px] font-mono opacity-20 mt-1">ID_{tx.userId.slice(-6)}</p>
                      </div>
                    </div>
                  </TableCell>

                  {isSuperAdmin && (
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[10px] tracking-widest">
                        <Building2 className="size-3" />
                        {tx.service.merchant?.companyName || "PLATFORM"}
                      </div>
                    </TableCell>
                  )}

                  <TableCell className="px-8 py-5">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 italic leading-none">{tx.service.name}</p>
                      <p className="text-[7px] opacity-10 uppercase tracking-widest mt-1">PKT_{tx.id.slice(0, 4)}</p>
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5">
                    <p className="text-lg font-black tracking-tighter italic tabular-nums leading-none">
                      <span className="text-[9px] mr-1 opacity-20 font-bold">{tx.currency}</span>
                      {Number(tx.amount).toFixed(2)}
                    </p>
                  </TableCell>

                  <TableCell className="px-8 py-5">
                    <span className="font-bold text-[9px] uppercase italic text-muted-foreground/40">{format(new Date(tx.createdAt), "dd MMM yy")}</span>
                  </TableCell>

                  <TableCell className="px-8 py-5 text-right">
                    <div className={cn(
                      "inline-flex items-center rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-widest border italic",
                      tx.status === 'SUCCESS' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : "bg-amber-500/5 text-amber-500 border-amber-500/20"
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

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-4 opacity-10 py-8 border-t border-white/5">
        <Activity className="size-3" />
        <p className="text-[8.5px] font-black uppercase tracking-[0.5em] italic">Protocol: Secure_Ledger_Sync</p>
      </div>
    </div>
  );
}