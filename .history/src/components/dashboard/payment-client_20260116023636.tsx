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
  const { isReady, isMobile, safeArea, viewportHeight } = useDeviceContext();

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-4">
          <div className="flex items-center gap-3 italic opacity-40">
            <ArrowDownLeft className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Revenue_Sync" : "Merchant_Liquidity_Protocol"}
              </span>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Audit_v9.3.3_Stable</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2rem,8vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Inflow <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
          
          <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/30 italic uppercase tracking-[0.2em]">
            <Terminal className="size-3" />
            <span>Validated Packets: {initialTransactions.length} // Identity: {role}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto shrink-0 relative z-20">
          <div className="relative min-w-0 sm:w-64 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
             <Input 
               placeholder="SEARCH TX_ID..." 
               className="h-12 w-full pl-12 rounded-2xl border-white/5 bg-white/5 font-black text-[10px] uppercase tracking-widest focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/20"
             />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:bg-white/10 transition-all">
            <Download className="mr-3 size-4 opacity-40" /> Export
          </Button>
        </div>
      </div>

      {/* --- LEDGER DATA GRID --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[1000px]">
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity Node</TableHead>
                {isSuperAdmin && <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin</TableHead>}
                <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Service Node</TableHead>
                <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Liquidity</TableHead>
                <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Timestamp</TableHead>
                <TableHead className="px-10 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-white/5">
              {initialTransactions.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={isSuperAdmin ? 6 : 5} className="py-40 text-center opacity-10">
                    <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">No_Ingress_Signals_Detected</p>
                  </TableCell>
                </TableRow>
              ) : (
                initialTransactions.map((tx: any) => (
                  <TableRow 
                    key={tx.id} 
                    onMouseEnter={() => impact("light")}
                    className="hover:bg-white/[0.02] transition-all duration-500 group border-none"
                  >
                    <TableCell className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "size-11 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                          isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          <Globe className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-sm group-hover:text-primary transition-colors leading-none">
                            @{tx.user.username || 'anon_node'}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase mt-2">
                            UID: {tx.userId.slice(-10)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {isSuperAdmin && (
                      <TableCell className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest leading-none">
                          <Building2 className="size-4" />
                          {tx.service.merchant?.companyName || "PLATFORM"}
                        </div>
                      </TableCell>
                    )}

                    <TableCell className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Zap className="size-3 text-primary opacity-40" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 italic leading-none truncate max-w-[140px]">
                            {tx.service.name}
                          </p>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest ml-5">
                          TX: {tx.id.slice(0, 8)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-10 py-8">
                      <p className="text-xl font-black tracking-tighter italic text-foreground leading-none tabular-nums">
                        <span className="text-[10px] align-top mr-1 opacity-30 font-bold">{tx.currency}</span>
                        {Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </TableCell>

                    <TableCell className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="size-3.5 text-muted-foreground/20" />
                        <span className="font-bold text-[10px] uppercase italic text-muted-foreground/60 leading-none">
                          {format(new Date(tx.createdAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-10 py-8 text-right">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
                        tx.status === 'SUCCESS' 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        {tx.status === 'SUCCESS' ? <CheckCircle2 className="size-3 mr-2 animate-pulse" /> : <Clock className="size-3 mr-2" />}
                        {tx.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </>
          </Table>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-12 border-t border-white/5">
        <Activity className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-primary")} />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground italic">
           Secure Ledger Sync: Optimal // Role_Node: {role.toUpperCase()}
        </p>
      </div>
    </div>
  );
}