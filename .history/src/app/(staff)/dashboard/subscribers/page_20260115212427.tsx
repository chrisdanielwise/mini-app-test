"use client";

import * as React from "react";
import Link from "next/link";
import { 
  MoreHorizontal, Calendar, Zap, Search, Filter, Download, 
  ChevronRight, Terminal, UserPlus, Trash2, Building2, 
  Activity, Globe, Cpu, CheckCircle2, ShieldAlert
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 🌊 SUBSCRIBER_LEDGER (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export default function SubscribersPage({ subscriptions, session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
  } = useDeviceContext();

  const isSuperAdmin = flavor === "AMBER";

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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <UserPlus className={cn("size-4", isSuperAdmin ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isSuperAdmin ? "Global_Network_Hub" : "Merchant_Identity_Hub"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Audit_Protocol_v16.31</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Subscriber <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className="size-3.5" />
            <span className="tracking-[0.2em]">VALIDATED: {subscriptions.length} NODES_SYNC</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">Protocol: Optimal</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <Input 
              onFocus={() => impact("light")}
              placeholder="SEARCH_NODE_ID..." 
              className="h-14 pl-12 pr-6 rounded-2xl border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest italic focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => impact("medium")}
              className="h-14 px-6 rounded-2xl border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest italic text-foreground hover:bg-white/10"
            >
              <Filter className="mr-3 size-4 opacity-40" /> Filter
            </Button>
            <Button 
              onClick={() => impact("medium")}
              className="h-14 px-6 rounded-2xl bg-primary text-white font-black uppercase italic tracking-[0.2em] text-[10px] shadow-apex-primary hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Download className="mr-3 size-4" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Identity Ledger --- */}
      <div className={cn(
        "rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-apex relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : ""
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL: Kinetic Identity Cards */
          <div className="p-6 space-y-6">
            {subscriptions.length === 0 ? <NoData /> : subscriptions.map((sub: any, i: number) => (
              <IdentityCard key={sub.id} sub={sub} isSuperAdmin={isSuperAdmin} index={i} onClick={selectionChange} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL: Institutional Oversight Ledger */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity_Node</th>
                  {isSuperAdmin && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin_Merchant</th>}
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Service // Tier</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol_Status</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Expiry_Horizon</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-foreground">
                {subscriptions.length === 0 ? <tr><td colSpan={6}><NoData /></td></tr> : subscriptions.map((sub: any, index: number) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => selectionChange()}
                    className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="size-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black italic border border-white/5 shadow-inner group-hover:rotate-12 transition-all duration-700">
                          {(sub.user.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">@{sub.user.username || "unknown_node"}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/20 mt-1 uppercase">UID_{sub.user.id.slice(-12)}</span>
                        </div>
                      </div>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {sub.service.merchant?.companyName || "ORPHAN_NODE"}
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <Zap className="size-4 text-primary/40" />
                            <span className="text-lg font-black italic tracking-tighter text-foreground leading-none">{sub.service.name}</span>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/10 ml-7">{sub.serviceTier?.name || "N/A"} TIER</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-muted-foreground/40 italic">
                         <Calendar className="size-4" />
                         <span className="text-[11px] font-black uppercase tracking-widest">{sub.expiresAt ? format(new Date(sub.expiresAt), "dd MMM yyyy") : "LIFETIME_PROTO"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <LedgerActions subId={sub.id} />
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
             Verified_Link_Established // Node_Type: {session.user.role}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Identity Node Card */
function IdentityCard({ sub, isSuperAdmin, index, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-8 rounded-[2.8rem] border border-white/5 bg-white/[0.02] space-y-8 shadow-apex animate-in fade-in slide-in-from-bottom-8",
        isSuperAdmin ? "bg-amber-500/[0.02] border-amber-500/10" : ""
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black italic border border-white/5">
            {(sub.user.username || "U")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">@{sub.user.username}</h3>
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase mt-2 italic tracking-[0.2em]">UID_{sub.user.id.slice(-6)}</p>
          </div>
        </div>
        <LedgerActions subId={sub.id} />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Status</p>
           <StatusBadge status={sub.status} />
        </div>
        <div className="text-right space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Service</p>
           <p className="text-[11px] font-black uppercase italic tracking-widest text-primary truncate">{sub.service.name}</p>
        </div>
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'ACTIVE';
  return (
    <div className={cn(
      "inline-flex items-center rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border shadow-apex italic",
      isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
    )}>
      <div className={cn("size-1.5 rounded-full mr-2.5 animate-pulse", isActive ? "bg-emerald-500 shadow-apex-emerald" : "bg-amber-500 shadow-apex-amber")} />
      {status}
    </div>
  );
}

function LedgerActions({ subId }: { subId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary hover:text-white transition-all duration-700">
          <MoreHorizontal className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] rounded-[1.5rem] border-white/10 bg-card/95 backdrop-blur-3xl p-2 shadow-apex">
        <DropdownMenuItem asChild className="rounded-xl py-3 px-4 focus:bg-primary/10 cursor-pointer">
          <Link href={`/dashboard/subscribers/${subId}`} className="flex items-center justify-between w-full">
            <span className="text-[10px] font-black uppercase italic tracking-widest">Deep_Audit</span>
            <ChevronRight className="size-4 opacity-20" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl py-3 px-4 text-rose-500 focus:bg-rose-500/10 cursor-pointer">
          <Trash2 className="size-4 mr-3" />
          <span className="text-[10px] font-black uppercase italic tracking-widest">Revoke_Node</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NoData() {
  return (
    <div className="py-32 flex flex-col items-center gap-8 opacity-20">
      <ShieldAlert className="size-20" />
      <p className="text-[14px] font-black uppercase tracking-[0.5em] italic">Zero_Identity_Nodes_Sync</p>
    </div>
  );
}