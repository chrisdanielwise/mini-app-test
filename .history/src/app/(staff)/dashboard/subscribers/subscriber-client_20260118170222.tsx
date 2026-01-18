"use client";

import * as React from "react";
import Link from "next/link";
import { 
  MoreHorizontal, Calendar, Zap, Search, Filter, 
  Download, ChevronRight, Terminal, UserPlus, Trash2, Building2, Activity, Cpu 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 🛰️ SUBSCRIBERS_CLIENT_PAGE (Institutional Apex v2026.1.20 - HARDENED)
 * Strategy: Viewport-Locked Chassis & Etched Tactical Grid.
 * Fix: Stationed HUD + Internal Scroll Engine + border-r for vertical lines.
 */
export default function SubscribersClientPage({ initialSubscriptions = [], isSuperAdmin, role }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-8 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Establishing_Identity_Sync...</p>
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <UserPlus className={cn("size-3", isSuperAdmin ? "text-amber-500 animate-pulse" : "text-primary")} />
              <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
                  isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Network_Hub" : "Merchant_Identity_Hub"}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Subscriber <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
            </h1>
            
            <div className="flex items-center gap-2 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-2.5" />
              <span className="truncate">Validated: {initialSubscriptions.length} Nodes Synchronized // Protocol: {role}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 scale-90 origin-bottom-right">
            <div className="relative min-w-0 w-48 lg:w-64 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground opacity-30" />
               <Input 
                 placeholder="SEARCH NODE ID..." 
                 className="h-10 w-full pl-10 rounded-xl border-white/5 bg-white/5 font-black text-[9px] uppercase tracking-widest focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/20"
               />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-10 px-4 rounded-xl border-white/5 bg-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-foreground hover:bg-white/10 transition-all">
                <Filter className="mr-2 size-3.5 opacity-40" /> Filter
              </Button>
              <Button className={cn(
                "h-10 px-4 rounded-xl font-black uppercase tracking-[0.2em] text-[8px] shadow-lg transition-transform active:scale-95",
                isSuperAdmin ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
              )}>
                <Download className="mr-2 size-3.5" /> Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 triggers independent scroll --- */}
      <div className="flex-1 min-h-0 w-full relative flex flex-col p-3 pb-6">
        <div className={cn(
          "flex-1 min-h-0 w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isSuperAdmin ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🌊 THE SCROLL ENGINE */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar overscroll-contain">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed relative">
              <thead className="bg-zinc-950 sticky top-0 z-20 border-b border-white/5 backdrop-blur-md">
                <tr className="divide-x divide-white/5">
                  <th className="w-[30%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Identity Node</th>
                  {isSuperAdmin && <th className="w-[18%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Origin Merchant</th>}
                  <th className="w-[18%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Service // Tier</th>
                  <th className="w-[14%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Protocol Status</th>
                  <th className="w-[13%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Expiry Horizon</th>
                  <th className="w-[7%] px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="py-24 text-center opacity-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero_Nodes_Synchronized</p>
                    </td>
                  </tr>
                ) : (
                  initialSubscriptions.map((sub: any) => (
                    <tr 
                      key={sub.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.01] transition-colors divide-x divide-white/5 group cursor-pointer"
                    >
                      {/* 🏁 WHITE ETCHED LINES: Forced via border-r */}
                      <td className="px-6 py-4 border-r border-white/5">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            "size-9 shrink-0 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                            isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                          )}>
                            <span className="font-black italic text-[10px]">{(sub.user.username || "U")[0].toUpperCase()}</span>
                          </div>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <p className="font-black text-foreground uppercase italic tracking-tighter text-sm group-hover:text-primary transition-colors truncate">
                              @{sub.user.username || "unknown_node"}
                            </p>
                            <p className="text-[6px] font-mono font-bold text-muted-foreground/20 uppercase mt-0.5 truncate tracking-widest">
                              UID: {sub.user.id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {isSuperAdmin && (
                        <td className="px-6 py-4 border-r border-white/5">
                          <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                            <Building2 className="size-3.5 shrink-0" />
                            <span className="truncate">{sub.service.merchant?.companyName || "ORPHAN_NODE"}</span>
                          </div>
                        </td>
                      )}

                      <td className="px-6 py-4 border-r border-white/5">
                        <div className="flex flex-col leading-tight">
                          <div className="flex items-center gap-2">
                            <Zap className="size-3 text-primary opacity-40" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/80 italic truncate max-w-[140px]">
                              {sub.service.name}
                            </p>
                          </div>
                          <p className="text-[6px] font-bold text-muted-foreground/20 uppercase tracking-widest ml-5 italic mt-1">
                            {sub.serviceTier?.name || "N/A"} TIER
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 border-r border-white/5">
                        <div className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.2em] border shadow-sm italic leading-none",
                          sub.status === "ACTIVE" 
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
                            : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                        )}>
                          <div className={cn("size-1 rounded-full mr-1.5 animate-pulse", sub.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500")} />
                          {sub.status}
                        </div>
                      </td>

                      <td className="px-6 py-4 border-r border-white/5">
                        <div className="flex items-center gap-2 opacity-60">
                          <Calendar className="size-3 text-muted-foreground/40" />
                          <span className="font-bold text-[8px] uppercase italic leading-none tracking-widest">
                            {sub.expiresAt ? format(new Date(sub.expiresAt), "dd MMM yyyy") : "LIFETIME_SYNC"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={() => selectionChange()}>
                            <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-white/5 border border-white/5 hover:bg-primary hover:text-white transition-all scale-90">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-white/5 bg-black/95 backdrop-blur-3xl p-1.5 shadow-2xl z-[100]">
                            <DropdownMenuItem asChild className="rounded-lg py-2 px-3 focus:bg-primary/10 cursor-pointer">
                              <Link href={`/dashboard/subscribers/${sub.id}`} className="flex items-center justify-between w-full">
                                <span className="text-[9px] font-black uppercase italic tracking-widest">Deep Audit</span>
                                <ChevronRight className="size-3.5 opacity-20" />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => impact("heavy")} className="rounded-lg py-2 px-3 text-rose-500 focus:bg-rose-500/10 cursor-pointer">
                              <Trash2 className="size-3.5 mr-2.5" />
                              <span className="text-[9px] font-black uppercase italic tracking-widest">Revoke Access</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🌫️ MOBILE CLEARANCE: Ensures BottomNav overlap protection */}
        {isMobile && (
          <div 
            style={{ height: `calc(${safeArea.bottom}px + 6.5rem)` }} 
            className="shrink-0 w-full" 
          />
        )}

        {/* --- FOOTER TELEMETRY SIGNAL --- */}
        <div className="shrink-0 flex items-center justify-center gap-4 opacity-10 pt-4 pb-4">
          <Activity className="size-3.5 animate-pulse text-primary" />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">
             Identity Sync Stable // Node_Ref: {role.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}