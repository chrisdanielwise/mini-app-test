"use client";

import * as React from "react";
import { 
  ArrowDownLeft, Terminal, Search, Download, Globe, 
  Zap, Calendar, Building2, CheckCircle2, Clock, 
  Activity, Filter, MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * 🌊 PAYMENTS_LEDGER (Institutional Apex v2026.1.16)
 * Aesthetics: Chroma-Rich Momentum | Obsidian-OLED Depth.
 * Strategy: Defensive Ingress Logic to prevent 'undefined' evaluation crashes.
 */
export default function PaymentsPage({ transactions = [], session }: any) {
  const { flavor } = useLayout();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
  } = useDeviceContext();

  // 🛡️ CHROMA PROTOCOL: Restoring role-based glows
  const isSuperAdmin = flavor === "AMBER";
  const realMerchantId = session?.merchantId;

  // 🛡️ CRASH SHIELD: Force evaluation of array to prevent undefined.length errors
  const safeTransactions = React.useMemo(() => 
    Array.isArray(transactions) ? transactions : [], 
    [transactions]
  );

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-black/40 animate-pulse rounded-[3rem]" />;

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-8 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.25rem" : "0px",
        paddingRight: isMobile ? "1.25rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <ArrowDownLeft className={cn("size-4", isSuperAdmin ? "text-amber-500" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Revenue_Sync" : "Merchant_Liquidity_Stream"}
              </span>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Audit_Protocol_v16.31</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Inflow <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className={cn("size-3.5", isSuperAdmin ? "text-amber-500/40" : "text-primary/40")} />
            <span className="tracking-[0.2em]">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">{safeTransactions.length} Packets Validated</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className={cn(
              "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
              isSuperAdmin ? "text-amber-500/20 group-focus-within:text-amber-500" : "text-primary/20 group-focus-within:text-primary"
            )} />
            <Input 
              placeholder="Query_Transaction_ID..."
              className={cn(
                "h-14 pl-12 pr-6 rounded-2xl border bg-black/40 text-[10px] font-black uppercase tracking-widest italic transition-all",
                isSuperAdmin ? "border-amber-500/10 focus:border-amber-500/40" : "border-white/5 focus:border-primary/40"
              )}
            />
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest italic text-foreground hover:bg-white/10">
            <Download className="mr-3 size-4 opacity-40" /> Export_CSV
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL */
          <div className="p-6 space-y-6">
            {safeTransactions.length === 0 ? <NoData /> : safeTransactions.map((tx: any, i: number) => (
              <PaymentCard key={tx.id} tx={tx} isSuperAdmin={isSuperAdmin} index={i} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity_Node</th>
                  {isSuperAdmin && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin</th>}
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Liquidity</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Timestamp</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol_Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {safeTransactions.length === 0 ? <tr><td colSpan={6}><NoData /></td></tr> : safeTransactions.map((tx: any, index: number) => (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "size-11 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner group-hover:rotate-6 transition-all duration-700",
                          isSuperAdmin ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                        )}>
                          <Globe className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">@{tx.user.username || 'anon_node'}</span>
                          <span className="text-[8px] font-mono text-muted-foreground/20 mt-1 uppercase">UID_{tx.userId.slice(-8)}</span>
                        </div>
                      </div>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {tx.service.merchant?.companyName || "PLATFORM"}
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8">
                       <span className="text-xl font-black italic tracking-tighter text-foreground tabular-nums leading-none">
                         <span className="text-xs opacity-20 mr-1.5 font-bold">{tx.currency}</span>
                         {parseFloat(tx.amount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-muted-foreground/40 italic">
                         <Calendar className="size-3.5" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{format(new Date(tx.createdAt), "dd MMM yyyy")}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <StatusBadge status={tx.status} isSuperAdmin={isSuperAdmin} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Activity className={cn("size-4 animate-pulse", isSuperAdmin ? "text-amber-500" : "text-primary")} />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Secure_Ledger_Sync: Optimal // Role_Node: {session?.user?.role || "GUEST"}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Ingress Node Card */
function PaymentCard({ tx, isSuperAdmin, index }: { tx: any, isSuperAdmin: boolean, index: number }) {
  return (
    <div 
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-6 rounded-[2rem] border transition-all duration-700 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-8",
        isSuperAdmin ? "bg-amber-500/[0.03] border-amber-500/10 shadow-amber-500/5" : "bg-white/[0.01] border-white/5"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={cn(
            "size-12 rounded-xl flex items-center justify-center border shadow-inner",
            isSuperAdmin ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Globe className="size-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground leading-none">@{tx.user.username}</h3>
            <p className="text-[9px] font-black text-muted-foreground/30 uppercase mt-2 italic tracking-widest">UID_{tx.userId.slice(-6)}</p>
          </div>
        </div>
        <StatusBadge status={tx.status} isSuperAdmin={isSuperAdmin} />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Liquidity</p>
           <p className="text-xl font-black italic tracking-tighter text-foreground tabular-nums">
              <span className="text-xs opacity-20 mr-1">{tx.currency}</span>
              {parseFloat(tx.amount.toString()).toLocaleString()}
           </p>
        </div>
        <div className="text-right space-y-2">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Service</p>
           <p className={cn(
             "text-[10px] font-black uppercase italic tracking-widest truncate",
             isSuperAdmin ? "text-amber-500" : "text-primary"
           )}>{tx.service.name}</p>
        </div>
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ status, isSuperAdmin }: { status: string, isSuperAdmin: boolean }) {
  const isSuccess = status === 'SUCCESS';
  return (
    <div className={cn(
      "inline-flex items-center rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
      isSuccess 
        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
        : isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-white/5 text-muted-foreground border-white/10"
    )}>
      {isSuccess ? <CheckCircle2 className="size-3 mr-2 animate-pulse" /> : <Clock className="size-3 mr-2" />}
      {status}
    </div>
  );
}

function NoData() {
  return (
    <div className="py-32 flex flex-col items-center gap-6 opacity-10">
      <Activity className="size-16" />
      <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Zero_Ingress_Packets</p>
    </div>
  );
}