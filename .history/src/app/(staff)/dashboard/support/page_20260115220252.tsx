"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ShieldCheck, MessageSquare, Terminal, Search, User, Globe, 
  ChevronRight, Crown, Building2, AlertCircle, Activity, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * 🌊 SUPPORT_LEDGER (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with RBAC-Aware Radiance.
 */
export default function SupportPage({ tickets, session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
  } = useDeviceContext();

  // 🛡️ ROLE RESOLUTION
  const { role } = session.user;
  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session.merchantId;

  const contextLabel = role === "super_admin" 
    ? "System_Root_Oversight" 
    : isPlatformStaff 
      ? "Central_Intervention_Node" 
      : "Merchant_Audit_Trail";

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group text-left">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <div className={cn(
              "p-2 rounded-xl border shadow-inner transition-all duration-700 group-hover:rotate-12",
              isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              {role === "super_admin" ? <Crown className="size-4" /> : 
               isPlatformStaff ? <ShieldCheck className="size-4" /> :
               <MessageSquare className="size-4" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {contextLabel}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Protocol_v16.31_Stable</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Support <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Desk</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className="size-3.5" />
            <span className="tracking-[0.2em]">IDENTITY: {role.toUpperCase()}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">{tickets.length > 0 ? 'Queue_Active' : 'Queue_Idle'}</span>
          </div>
        </div>

        {/* --- TACTICAL SEARCH HUB --- */}
        <div className="relative w-full lg:w-96 group z-20">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
          <Input 
            onFocus={() => impact("light")}
            placeholder="FILTER_TELEMETRY..."
            className="h-14 pl-12 pr-6 rounded-2xl border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest italic focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-apex relative z-10",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : ""
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL: Kinetic Support Cards */
          <div className="p-6 space-y-6">
            {tickets.length === 0 ? <NoData /> : tickets.map((ticket: any, i: number) => (
              <SupportCard key={ticket.id} ticket={ticket} isPlatformStaff={isPlatformStaff} index={i} onClick={selectionChange} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL: Institutional Oversight Ledger */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity_Node</th>
                  {isPlatformStaff && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin_Cluster</th>}
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Manifest / Subject</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-foreground">
                {tickets.length === 0 ? <tr><td colSpan={6}><NoData /></td></tr> : tickets.map((ticket: any, index: number) => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => selectionChange()}
                    className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="size-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-inner">
                          {(ticket.user?.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">@{ticket.user?.username || 'anon_node'}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/20 mt-1 uppercase">UID_{ticket.user?.id ? ticket.user.id.slice(-12) : 'SYSTEM'}</span>
                        </div>
                      </div>
                    </td>
                    {isPlatformStaff && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {ticket.merchantId ? `CLUSTER_${ticket.merchantId.slice(-6).toUpperCase()}` : "GLOBAL_HUB"}
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-1">
                          <span className="text-lg font-black italic uppercase tracking-tight text-foreground/80 group-hover:text-foreground transition-colors leading-none truncate max-w-md">
                            {ticket.subject || "NO_SUBJECT_MANIFEST"}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/10">
                            Last Signal: {ticket.messages[0] ? new Date(ticket.messages[0].createdAt).toLocaleTimeString() : 'N/A'}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <Button 
                        asChild 
                        variant="ghost" 
                        className={cn(
                          "h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all active:scale-90 italic shadow-apex",
                          isPlatformStaff 
                            ? "bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-black" 
                            : "bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white"
                        )}
                      >
                        <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-3">
                          {isPlatformStaff ? "Intervene" : "Audit"}
                          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER TELEMETRY */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Activity className="size-4 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Support_Cluster_Synchronized // Node_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : 'ROOT_MASTER'}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Support Node Card */
function SupportCard({ ticket, isPlatformStaff, index, onClick }: { ticket: any, isPlatformStaff: boolean, index: number, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-8 rounded-[2.8rem] border border-white/5 bg-white/[0.02] space-y-8 shadow-apex animate-in fade-in slide-in-from-bottom-8",
        isPlatformStaff ? "bg-amber-500/[0.02] border-amber-500/10" : ""
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
             <span className="text-lg font-black italic text-primary/40">{(ticket.user?.username || "U")[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">@{ticket.user?.username}</h3>
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase mt-2 italic tracking-[0.2em]">UID_{ticket.user?.id ? ticket.user.id.slice(-6) : 'SYS'}</p>
          </div>
        </div>
        <Button 
          asChild 
          variant="ghost" 
          className={cn(
            "size-12 rounded-2xl border transition-all active:scale-75 shadow-apex",
            isPlatformStaff 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
              : "bg-primary/10 text-primary border-primary/20"
          )}
        >
          <Link href={`/dashboard/support/${ticket.id}`}><ChevronRight className="size-6" /></Link>
        </Button>
      </div>

      <div className="space-y-4 pt-2">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic leading-none">Manifest_Subject</p>
         <p className="text-xl font-black italic uppercase tracking-tighter text-foreground/80 leading-tight">
            {ticket.subject || "NO_SUBJECT_MANIFEST"}
         </p>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Last_Signal</p>
           <p className="text-[11px] font-black uppercase italic tracking-widest text-foreground/60">
             {ticket.messages[0] ? new Date(ticket.messages[0].createdAt).toLocaleTimeString() : 'N/A'}
           </p>
        </div>
        <div className="text-right space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Cluster</p>
           <p className="text-[11px] font-black uppercase italic tracking-widest text-primary truncate">
             {ticket.merchantId ? `CL_${ticket.merchantId.slice(-4)}` : "ROOT"}
           </p>
        </div>
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function NoData() {
  return (
    <div className="py-32 flex flex-col items-center gap-8 opacity-20 animate-in zoom-in duration-1000">
      <AlertCircle className="size-20" />
      <div className="text-center space-y-3">
        <p className="text-[14px] font-black uppercase tracking-[0.5em] italic">Protocol_Queue_Clear</p>
        <p className="text-[9px] font-black uppercase tracking-widest italic">Zero_Active_Support_Signals</p>
      </div>
    </div>
  );
}