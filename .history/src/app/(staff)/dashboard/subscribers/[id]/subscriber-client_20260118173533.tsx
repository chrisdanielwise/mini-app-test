"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, ShieldAlert, Wallet, Terminal, 
  Zap, Trash2, Calendar, ExternalLink, History, Globe, Activity, Cpu
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ SUBSCRIBER_CLIENT_VIEW (Institutional Apex v2026.1.20 - HARDENED)
 * Strategy: Viewport-Locked Chassis & Hardware Ingress.
 * Fix: Stationed HUD + Internal Tactical Scroll + border-r for vertical lines.
 */
export default function SubscriberClientView({ subscription, isSuperAdmin, id }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-8 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Establishing_Subscriber_Sync...</p>
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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            {/* <Link
              href="/dashboard/subscribers"
              onClick={() => selectionChange()}
              className="group inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 hover:text-primary transition-all italic leading-none mb-1"
            >
              <ArrowLeft className="size-2.5 group-hover:-translate-x-1" /> BACK_TO_LEDGER
            </Link> */}
            
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate max-w-full">
                @{subscription.user.username || "NODE_ANON"}
              </h1>
              <Badge className={cn(
                "rounded-lg text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border shadow-sm italic leading-none",
                subscription.status === 'ACTIVE' 
                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
                  : "bg-rose-500/5 text-rose-500 border-rose-500/10"
              )}>
                {subscription.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 scale-90 origin-bottom-right">
            <Button variant="outline" className="h-10 px-4 rounded-xl border-white/5 bg-white/[0.02] text-[8px] font-black uppercase tracking-widest italic">
              UPDATE_EXPIRY
            </Button>
            <Button 
              onClick={() => impact("heavy")}
              className="h-10 px-4 rounded-xl bg-rose-500 text-white font-black uppercase italic tracking-widest text-[8px] shadow-lg shadow-rose-500/20"
            >
              <Trash2 className="mr-2 size-3.5" /> REVOKE
            </Button>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 triggers independent scroll --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar overscroll-contain px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- LEFT: IDENTITY PASSPORT --- */}
          <div className="lg:col-span-2 space-y-6">
            
            <section className={cn(
              "rounded-[2rem] border backdrop-blur-3xl shadow-2xl relative overflow-hidden group",
              isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/30 border-white/5"
            )}>
               <Zap className={cn("absolute -top-4 -right-4 size-24 opacity-[0.02] pointer-events-none -rotate-12", isSuperAdmin ? "text-amber-500" : "text-primary")} />
               
               <div className="flex items-center gap-2.5 text-primary/40 p-6 md:p-8 pb-0 opacity-30">
                  <Terminal className="size-3.5" />
                  <h3 className="text-[9px] font-black uppercase tracking-[0.3em] italic">Node_Parameters</h3>
               </div>

               {/* 🏁 ETCHED GRID: Parameters */}
               <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 rounded-b-[2rem] overflow-hidden divide-x divide-y sm:divide-y-0 divide-white/5">
                  <div className="space-y-1 p-4 border-r border-white/5">
                     <p className="text-[7px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic">Service_Node</p>
                     <p className="text-lg font-black italic uppercase tracking-tighter truncate leading-tight">{subscription.service.name}</p>
                  </div>
                  <div className="space-y-1 p-4">
                     <p className="text-[7px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic">Protocol_Tier</p>
                     <p className={cn("text-lg font-black italic uppercase tracking-tighter leading-tight", isSuperAdmin ? "text-amber-500" : "text-primary")}>
                       {subscription.serviceTier?.name}
                     </p>
                  </div>
                  <div className="space-y-1 p-4 border-r border-white/5 border-t border-white/5">
                     <p className="text-[7px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic">Identity_ID</p>
                     <p className="text-[9px] font-mono font-bold opacity-20 truncate">{subscription.user.id}</p>
                  </div>
                  <div className="space-y-1 p-4 border-t border-white/5">
                     <p className="text-[7px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic">Start_Signal</p>
                     <p className="text-sm font-black uppercase italic tracking-tight opacity-60">
                       {format(new Date(subscription.createdAt), "dd MMM yyyy")}
                     </p>
                  </div>
               </div>

               <div className="mx-6 md:mx-8 mb-8 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-4 shadow-inner">
                  <div className="flex items-center gap-3">
                     <Calendar className="size-4 text-muted-foreground/20" />
                     <div className="leading-tight">
                        <p className="text-[7px] font-black uppercase tracking-[0.1em] text-muted-foreground/20 italic leading-none">Expiration_Horizon</p>
                        <p className="text-sm font-black uppercase italic tracking-tighter mt-1">
                          {subscription.expiresAt ? format(new Date(subscription.expiresAt), "dd MMM yyyy") : "LIFETIME_PROTO"}
                        </p>
                     </div>
                  </div>
                  <div className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[6px] font-black uppercase tracking-widest border border-white/10", subscription.status === 'ACTIVE' ? "text-emerald-500" : "text-rose-500")}>
                    <div className={cn("size-1 rounded-full mr-1.5", subscription.status === 'ACTIVE' ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                    {subscription.status === 'ACTIVE' ? "Broadcasting" : "Disconnected"}
                  </div>
               </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2.5 px-2 opacity-30">
                 <History className="size-3.5 text-primary" />
                 <h3 className="text-[9px] font-black uppercase tracking-[0.3em] italic">Payment_Telemetry</h3>
              </div>
              
              <div className="rounded-[1.8rem] border border-white/5 bg-card/40 overflow-hidden backdrop-blur-3xl shadow-xl">
                 <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left min-w-[500px] table-fixed">
                       <thead className="bg-white/[0.03] border-b border-white/5">
                          <tr className="divide-x divide-white/5">
                             <th className="w-[30%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic">Liquidity</th>
                             <th className="w-[20%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic">Protocol</th>
                             <th className="w-[30%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic">Status</th>
                             <th className="w-[20%] px-6 py-3"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5 text-foreground">
                          {subscription.payments.map((p: any) => (
                             <tr key={p.id} onMouseEnter={() => impact("light")} className="hover:bg-white/[0.01] transition-colors divide-x divide-white/5 group">
                                <td className="px-6 py-4 font-black text-sm italic tracking-tighter tabular-nums leading-none border-r border-white/5">${Number(p.amount).toFixed(2)}</td>
                                <td className="px-6 py-4 text-[9px] font-bold uppercase opacity-30 italic border-r border-white/5">{p.currency}</td>
                                <td className="px-6 py-4 border-r border-white/5">
                                   <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 italic">PAID</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg border border-white/5 bg-white/5 scale-90 hover:bg-primary transition-all">
                                      <ExternalLink className="size-3 opacity-20" />
                                   </Button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </section>
          </div>

          {/* --- RIGHT: ANALYTICS WIDGETS --- */}
          <div className="space-y-6">
              <div className={cn(
                "rounded-[1.8rem] border p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-all",
                isSuperAdmin ? "bg-amber-500/[0.02] border-amber-500/10 shadow-amber-500/5" : "bg-primary/[0.02] border-primary/20 shadow-primary/5"
              )}>
                <Wallet className={cn("absolute -bottom-2 -right-2 size-20 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0", isSuperAdmin ? "text-amber-500" : "text-primary")} />
                <div className="relative z-10">
                   <p className={cn("text-[7px] font-black uppercase tracking-[0.2em] mb-2 italic", isSuperAdmin ? "text-amber-500/40" : "text-primary/40")}>Total_Contribution</p>
                   <p className={cn("text-3xl font-black italic tracking-tighter leading-none tabular-nums", isSuperAdmin ? "text-amber-500" : "text-primary")}>
                      ${subscription.payments.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </p>
                   <div className="mt-8 pt-8 border-t border-white/5 space-y-4 rounded-b-xl overflow-hidden divide-y divide-white/5">
                      <div className="flex justify-between items-center opacity-30 py-3">
                         <span className="text-[7px] font-black uppercase tracking-widest italic leading-none">Frequency</span>
                         <span className="text-[9px] font-bold uppercase italic tracking-tighter leading-none">{subscription.serviceTier?.interval}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                         <span className="text-[7px] font-black uppercase opacity-20 tracking-widest italic leading-none">Reliability</span>
                         <span className="text-[9px] font-black text-emerald-500/60 tracking-widest italic leading-none">HIGH_TRUST</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/5 bg-black/40 p-6 space-y-3 shadow-xl opacity-30 italic">
                 <h4 className="text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2 leading-none">
                    <ShieldCheck className="size-3 text-emerald-500" /> Audit_Signal
                 </h4>
                 <p className="text-[8px] font-bold text-muted-foreground/50 leading-relaxed uppercase tracking-wider">
                    Verified via Telegram_Node sync for T2 compliance.
                 </p>
              </div>
          </div>
        </div>

        {/* 🌫️ MOBILE CLEARANCE: Ensures profile signals clear the BottomNav */}
        {isMobile && (
          <div 
            style={{ height: `calc(${safeArea.bottom}px + 6.5rem)` }} 
            className="shrink-0 w-full" 
          />
        )}

        {/* FOOTER SIGNAL */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-4 pb-4">
          <Activity className="size-3.5 animate-pulse" />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">
            Identity_Synchronized // Node_Ref_{id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}