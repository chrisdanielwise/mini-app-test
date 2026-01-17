"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, ShieldAlert, Wallet, Terminal, 
  Zap, Trash2, Calendar, ExternalLink, History, Globe 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Contexts & UI
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscriberClientView({ subscription, isSuperAdmin, id }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea, viewportHeight } = useDeviceContext();

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-6xl mx-auto transition-all duration-1000",
        "animate-in fade-in slide-in-from-bottom-12",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "1rem",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/5 pb-8">
        <div className="space-y-4 flex-1 min-w-0">
          <Link
            href="/dashboard/subscribers"
            onClick={() => selectionChange()}
            className="group inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all italic"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            NODE_LEDGER
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-foreground truncate break-all leading-none">
              @{subscription.user.username || "NODE_ANON"}
            </h1>
            <Badge className={cn(
              "rounded-xl text-[10px] font-black uppercase tracking-widest px-3 py-1 border shadow-sm",
              subscription.status === 'ACTIVE' 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
            )}>
              {subscription.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 relative z-10">
          <Button variant="outline" className="flex-1 lg:flex-none rounded-2xl h-12 px-6 border-white/5 bg-white/5 font-black uppercase text-[10px] tracking-widest">
            UPDATE_EXPIRY
          </Button>
          <Button 
            onClick={() => impact("heavy")}
            className="flex-1 lg:flex-none rounded-2xl h-12 px-6 bg-rose-500 text-white font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-rose-500/20"
          >
            <Trash2 className="mr-2 h-4 w-4" /> REVOKE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* --- LEFT: IDENTITY PASSPORT --- */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          
          {/* Section: Subscription Parameters */}
          <section className={cn(
            "rounded-[2.5rem] border p-8 md:p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden",
            isSuperAdmin ? "border-amber-500/10 bg-amber-500/[0.01]" : "border-white/5 bg-card/40"
          )}>
             <Zap className={cn("absolute -top-6 -right-6 h-32 w-32 opacity-[0.03] pointer-events-none -rotate-12", isSuperAdmin ? "text-amber-500" : "text-primary")} />
             
             <div className="flex items-center gap-3 text-primary/60 mb-10">
                <Terminal className="h-4 w-4" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Node_Parameters</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                <div className="space-y-2">
                   <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.3em]">Service_Node</p>
                   <p className="text-xl font-black italic uppercase tracking-tighter text-foreground truncate">{subscription.service.name}</p>
                </div>
                <div className="space-y-2">
                   <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.3em]">Protocol_Tier</p>
                   <p className={cn("text-xl font-black italic uppercase tracking-tighter", isSuperAdmin ? "text-amber-500" : "text-primary")}>
                     {subscription.serviceTier?.name}
                   </p>
                </div>
                <div className="space-y-2">
                   <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.3em]">Identity_ID</p>
                   <p className="text-sm font-mono font-bold opacity-40 truncate">{subscription.user.id}</p>
                </div>
                <div className="space-y-2">
                   <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.3em]">Start_Signal</p>
                   <p className="text-base font-black uppercase italic tracking-tight">
                     {format(new Date(subscription.createdAt), "dd MMM yyyy")}
                   </p>
                </div>
             </div>

             <div className="mt-12 p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <Calendar className="h-5 w-5 text-muted-foreground opacity-20" />
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Expiration_Horizon</p>
                      <p className="text-md font-black uppercase italic tracking-tighter">
                        {subscription.expiresAt ? format(new Date(subscription.expiresAt), "dd MMMM yyyy") : "LIFETIME_PROTO"}
                      </p>
                   </div>
                </div>
                <Badge variant="outline" className="rounded-xl h-8 px-4 bg-background text-[9px] font-black uppercase italic tracking-widest border-white/5">
                  {subscription.status === 'ACTIVE' ? "Broadcasting" : "Disconnected"}
                </Badge>
             </div>
          </section>

          {/* Section: Payment Ledger */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-4">
               <History className="h-4 w-4 text-primary/60" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Payment_Telemetry</h3>
            </div>
            
            <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden backdrop-blur-3xl">
               <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[500px]">
                     <thead className="bg-white/[0.03] border-b border-white/5">
                        <tr>
                           {["Liquidity", "Protocol", "Status", "TXID"].map((head) => (
                              <th key={head} className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">{head}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5 text-foreground">
                        {subscription.payments.map((p: any) => (
                           <tr key={p.id} onMouseEnter={() => impact("light")} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-8 py-6 font-black text-sm italic tracking-tighter">${Number(p.amount).toFixed(2)}</td>
                              <td className="px-8 py-6 text-[10px] font-bold uppercase opacity-40">{p.currency}</td>
                              <td className="px-8 py-6">
                                 <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">PAID</span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-white/5 bg-white/5">
                                    <ExternalLink className="h-3.5 w-3.5 opacity-30" />
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
        <div className="space-y-8">
            <div className={cn(
              "rounded-[2.5rem] border p-10 shadow-2xl relative overflow-hidden",
              isSuperAdmin ? "bg-amber-500/5 border-amber-500/20" : "bg-primary/5 border-primary/20"
            )}>
              <Wallet className={cn("absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.05] rotate-12", isSuperAdmin ? "text-amber-500" : "text-primary")} />
              <div className="relative z-10">
                 <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mb-2", isSuperAdmin ? "text-amber-500/60" : "text-primary/60")}>Total_Contribution</p>
                 <p className={cn("text-4xl font-black italic tracking-tighter leading-none tabular-nums", isSuperAdmin ? "text-amber-500" : "text-primary")}>
                    ${subscription.payments.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest">Frequency</span>
                       <span className="text-[10px] font-bold uppercase italic tracking-widest text-foreground">{subscription.serviceTier?.interval}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest">Reliability</span>
                       <span className="text-[10px] font-black text-emerald-500 tracking-widest italic">HIGH_TRUST</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 space-y-5 shadow-xl">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3 italic">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Audit_Signal
               </h4>
               <p className="text-[10px] font-bold text-muted-foreground/50 leading-relaxed uppercase tracking-widest italic">
                  Verified via <span className="text-foreground">Telegram_Node</span>. Financial variables synchronized with active ledger for T2 compliance.
               </p>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 opacity-10 py-12">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center">
          Identity_Core_Synchronized // Node_Ref_{id.slice(0, 8).toUpperCase()}
        </p>
      </div>
    </div>
  );
}