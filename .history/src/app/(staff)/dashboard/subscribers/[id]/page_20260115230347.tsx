"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, ShieldAlert, Wallet, Terminal, 
  Zap, Trash2, Calendar, ExternalLink, History, Globe,
  Activity, Cpu, Fingerprint, Timer
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * 🌊 SUBSCRIBER_DEEP_VIEW (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export default function SubscriberDeepView({ subscription, id }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
    viewportHeight 
  } = useDeviceContext();

  const isPlatformStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <Link
            href="/dashboard/subscribers"
            onClick={() => selectionChange()}
            className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 hover:text-primary transition-all duration-700 italic"
          >
            <ArrowLeft className="size-3 group-hover:-translate-x-2 transition-transform duration-700" />
            Node_Ledger
          </Link>

          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground truncate max-w-full">
              @{subscription.user.username || "NODE_ANON"}
            </h1>
            <Badge className={cn(
              "rounded-xl text-[10px] font-black tracking-[0.3em] px-4 py-1.5 border-none italic shadow-apex",
              subscription.status === 'ACTIVE' 
                ? "bg-emerald-500/10 text-emerald-500 shadow-apex-emerald" 
                : "bg-rose-500/10 text-rose-500 shadow-apex-rose"
            )}>
              <div className={cn("size-1.5 rounded-full mr-2.5 animate-pulse", subscription.status === 'ACTIVE' ? "bg-emerald-500" : "bg-rose-500")} />
              {subscription.status}
            </Badge>
          </div>
        </div>

        {/* --- TACTICAL ACTIONS --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <Button 
            variant="outline" 
            onClick={() => impact("light")}
            className="h-14 px-8 rounded-2xl border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] italic text-foreground hover:bg-white/10"
          >
            Update_Expiry
          </Button>
          <Button 
            onClick={() => hapticFeedback("heavy")}
            className="h-14 px-8 rounded-2xl bg-rose-500 text-white font-black uppercase italic tracking-[0.3em] text-[10px] shadow-apex-rose hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Trash2 className="mr-3 size-4" /> Revoke_Access
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* --- LEFT: IDENTITY PASSPORT --- */}
        <div className="lg:col-span-2 space-y-10 md:space-y-16">
          
          {/* Section: Subscription Parameters */}
          <section className="rounded-[3rem] border border-white/5 bg-card/30 p-8 md:p-14 backdrop-blur-3xl shadow-apex relative overflow-hidden group">
             <Zap className="absolute -top-10 -right-10 size-48 opacity-[0.01] pointer-events-none -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
             
             <div className="flex items-center gap-4 text-primary/40 mb-10 opacity-40">
                <Terminal className="size-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Node_Parameters</h3>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-14">
                <ParameterNode label="Service_Cluster" value={subscription.service.name} />
                <ParameterNode label="Active_Tier" value={subscription.serviceTier?.name} isPrimary />
                <ParameterNode label="Handshake_ID" value={subscription.user.id.toString()} isMono />
                <ParameterNode label="Ingress_Date" value={format(new Date(subscription.createdAt), "dd MMM yyyy")} />
             </div>

             <div className="mt-12 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner transition-all duration-700 hover:bg-white/[0.04]">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                   <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Calendar className="size-7 text-muted-foreground/30" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic leading-none mb-2">Expiration_Horizon</p>
                      <p className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                        {subscription.expiresAt ? format(new Date(subscription.expiresAt), "dd MMMM yyyy") : "LIFETIME_PROTO"}
                      </p>
                   </div>
                </div>
                <Badge variant="outline" className="rounded-xl h-10 px-5 bg-black border-white/5 text-[9px] font-black uppercase italic tracking-[0.3em] shadow-apex w-full sm:w-auto flex justify-center">
                  {subscription.status === 'ACTIVE' ? "Broadcasting_Ready" : "Link_Severed"}
                </Badge>
             </div>
          </section>

          {/* Section: Payment Ledger (Adaptive Table) */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 px-4 opacity-40">
               <History className="size-4 text-primary" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Payment_Telemetry</h3>
            </div>
            
            <div className="rounded-[3rem] border border-white/5 bg-card/30 overflow-hidden backdrop-blur-3xl shadow-apex">
               <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[500px]">
                     <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                           {["Liquidity", "Protocol", "Status", "Handshake"].map((head) => (
                              <th key={head} className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">{head}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5 text-foreground">
                        {subscription.payments.map((p: any) => (
                           <tr key={p.id} className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer">
                              <td className="px-8 py-6 font-black text-lg italic tracking-tighter tabular-nums text-foreground/80 group-hover:text-primary">
                                ${parseFloat(p.amount).toFixed(2)}
                              </td>
                              <td className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground/40">{p.currency}</td>
                              <td className="px-8 py-6">
                                 <span className="text-[9px] font-black uppercase px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 italic">PAID</span>
                              </td>
                              <td className="px-8 py-6">
                                 <Button variant="ghost" size="icon" className="size-10 rounded-xl border border-white/5 bg-white/5 hover:bg-primary transition-all duration-700">
                                    <ExternalLink className="size-4 opacity-40 group-hover:opacity-100" />
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

        {/* --- RIGHT: ANALYTICS HUB --- */}
        <div className="space-y-8">
           {/* Total Value Node */}
           <div className="rounded-[3rem] bg-primary/[0.04] border border-primary/20 p-10 shadow-apex relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 size-48 blur-[80px] bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <Wallet className="absolute -bottom-4 -right-4 size-24 text-primary opacity-[0.03] -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
              
              <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-60 mb-3 italic leading-none">Total_Contribution</p>
                 <p className="text-5xl font-black italic tracking-tighter text-foreground leading-none tabular-nums">
                   ${subscription.payments.reduce((acc: number, curr: any) => acc + parseFloat(curr.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 
                 <div className="mt-10 pt-10 border-t border-primary/10 space-y-5">
                    <AnalyticsRow label="Frequency" value={subscription.serviceTier?.interval} />
                    <AnalyticsRow label="Reliability" value="HIGH_TRUST" isStatus />
                 </div>
              </div>
           </div>

           {/* Audit Node */}
           <div className="rounded-[3rem] border border-white/5 bg-card/30 p-10 space-y-6 shadow-apex backdrop-blur-3xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 flex items-center gap-3 italic">
                 <ShieldCheck className="size-4 text-emerald-500" /> Audit_Signal
              </h4>
              <p className="text-[11px] font-bold text-muted-foreground/30 leading-relaxed uppercase tracking-[0.2em] italic">
                Verified via <span className="text-foreground/60">Institutional_Node</span>. Financial variables synchronized with active ledger for v16 compliance.
              </p>
           </div>
           
           {/* Hardware Status */}
           <div className="flex flex-col items-center gap-6 py-6 opacity-10 italic">
              <div className="flex items-center gap-4">
                 <Cpu className="size-4" />
                 <p className="text-[9px] font-black uppercase tracking-[0.5em]">Mesh_Processing_Active</p>
              </div>
              <div className="flex items-center gap-3">
                 <Activity className="size-3 animate-pulse text-primary" />
                 <span className="text-[8px] font-mono tabular-nums">[TX_NODE_v16_STABLE]</span>
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <Globe className="size-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
          Identity_Core_Synchronized // Node_Ref_{id.slice(0, 12).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

/** 🧪 ATOMIC HELPER COMPONENTS */

function ParameterNode({ label, value, isPrimary, isMono }: any) {
  return (
    <div className="space-y-3">
       <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.4em] leading-none italic">{label}</p>
       <p className={cn(
         "text-2xl font-black uppercase italic tracking-tighter leading-none truncate",
         isPrimary ? "text-primary" : "text-foreground",
         isMono && "font-mono text-sm tracking-widest opacity-60"
       )}>
         {value}
       </p>
    </div>
  );
}

function AnalyticsRow({ label, value, isStatus }: any) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.3em] italic">{label}</span>
       <span className={cn(
         "text-[10px] font-black uppercase italic tracking-[0.2em]",
         isStatus ? "text-emerald-500" : "text-foreground/60"
       )}>
         {value}
       </span>
    </div>
  );
}