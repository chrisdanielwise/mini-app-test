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
      className="max-w-[1600px] mx-auto animate-in fade-in duration-700 space-y-6 md:space-y-8"
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "2rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6 leading-none">
        <div className="space-y-2">
          <div className="flex items-center gap-2 opacity-20 italic">
            <ArrowDownLeft className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-primary")} />
            <span className={cn("text-[7.5px] font-black uppercase tracking-[0.3em]", isSuperAdmin ? "text-amber-500" : "text-primary")}>
              {isSuperAdmin ? "Global_Revenue_Sync" : "Merchant_Liquidity_Protocol"}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground">
            Inflow <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-48 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 opacity-20" />
             <Input 
               placeholder="SEARCH TX_ID..." 
               className="h-9 pl-9 rounded-lg bg-white/5 border-white/5 font-mono text-[8px] uppercase tracking-widest focus:border-primary/40 transition-all"
             />
          </div>
          <Button variant="outline" className="h-9 px-4 rounded-lg border-white/5 bg-white/5 text-[8px] font-black uppercase tracking-widest hover:bg-white/10">
            <Download className="mr-2 size-3 opacity-40" /> Export
          </Button>
        </div>
      </div>

      {/* --- LEDGER DATA GRID: STICKY HORIZON PROTOCOL --- */}
      <div className={cn(
        "rounded-xl md:rounded-2xl border backdrop-blur-3xl shadow-2xl relative z-10 overflow-hidden",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        {/* Laminar Volume with Sticky Anchorage */}
        <div className="overflow-x-auto overflow-y-auto max-h-[65vh] scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[1000px] relative">
            <TableHeader className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Identity Node</TableHead>
                {isSuperAdmin && <TableHead className="px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.3em] text-amber-500/30 italic">Origin</TableHead>}
                <TableHead className="px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Service Node</TableHead>
                <TableHead className="px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Liquidity</TableHead>
                <TableHead className="px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Timestamp</TableHead>
                <TableHead className="px-6 py-3 text-right text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-white/5">
              {initialTransactions.map((tx: any) => (
                <TableRow 
                  key={tx.id} 
                  onMouseEnter={() => impact("light")}
                  className="hover:bg-white/[0.01] transition-colors border-none group"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "size-8 shrink-0 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                        isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        <Globe className="size-3.5" />
                      </div>
                      <div className="flex flex-col leading-none gap-1">
                        <p className="font-black text-[10px] uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">@{tx.user.username}</p>
                        <p className="text-[6.5px] font-mono opacity-10 uppercase tracking-widest leading-none">ID_{tx.userId.slice(-6)}</p>
                      </div>
                    </div>
                  </TableCell>

                  {isSuperAdmin && (
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-amber-500/40 font-black uppercase italic text-[9px] tracking-widest leading-none">
                        <Building2 className="size-3" />
                        {tx.service.merchant?.companyName || "PLATFORM"}
                      </div>
                    </TableCell>
                  )}

                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col leading-none gap-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 italic leading-none">{tx.service.name}</p>
                      <p className="text-[6.5px] opacity-10 uppercase tracking-widest">PKT_{tx.id.slice(0, 4)}</p>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <p className="text-base font-black tracking-tighter italic tabular-nums leading-none">
                      <span className="text-[8px] mr-1 opacity-10 font-bold">{tx.currency}</span>
                      {Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="font-bold text-[8.5px] uppercase italic text-muted-foreground/30">{format(new Date(tx.createdAt), "dd MMM yy")}</span>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <div className={cn(
                      "inline-flex items-center rounded-lg px-2 py-1 text-[7.5px] font-black uppercase tracking-widest border italic leading-none",
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
      <div className="flex items-center justify-center gap-3 opacity-5 py-6">
        <Activity className="size-2.5" />
        <p className="text-[7.5px] font-black uppercase tracking-[0.4em] italic">Protocol_v16.31 // Secure_Ledger_Sync</p>
      </div>
    </div>
  );
}