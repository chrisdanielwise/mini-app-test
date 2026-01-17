"use client";

import * as React from "react";
import Link from "next/link";
import { 
  MoreHorizontal, Calendar, Zap, Search, Filter, 
  Download, ChevronRight, Terminal, UserPlus, Trash2, Building2 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Contexts & UI
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

export default function SubscribersClientPage({ initialSubscriptions = [], isSuperAdmin, role }: any) {
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
            <UserPlus className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-primary")} />
            <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                isSuperAdmin ? "text-amber-500" : "text-primary"
            )}>
              {isSuperAdmin ? "Global_Network_Hub" : "Merchant_Identity_Hub"}
            </span>
          </div>
          
          <h1 className="text-[clamp(2rem,8vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Subscriber <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
          
          <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/30 italic uppercase tracking-[0.2em]">
            <Terminal className="size-3" />
            <span>Validated: {initialSubscriptions.length} Nodes Synchronized // Identity: {role}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto shrink-0 relative z-20">
          <div className="relative min-w-0 sm:w-64 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
             <Input 
               placeholder="SEARCH NODE ID..." 
               className="h-12 w-full pl-12 rounded-2xl border-white/5 bg-white/5 font-black text-[10px] uppercase tracking-widest focus:ring-primary/20"
             />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
              <Filter className="mr-3 size-4 opacity-40" /> Filter
            </Button>
            <Button className={cn(
              "h-12 px-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg",
              isSuperAdmin ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
            )}>
              <Download className="mr-3 size-4" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* --- LEDGER DATA GRID --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity Node</th>
                {isSuperAdmin && <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Merchant</th>}
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Service // Tier</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol Status</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Expiry Horizon</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 6 : 5} className="py-40 text-center opacity-10">
                    <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Zero_Nodes_Synchronized</p>
                  </td>
                </tr>
              ) : (
                initialSubscriptions.map((sub: any) => (
                  <tr 
                    key={sub.id} 
                    onMouseEnter={() => impact("light")}
                    className="hover:bg-white/[0.02] transition-all duration-500 group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "size-11 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                          isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          <span className="font-black italic text-xs">{(sub.user.username || "U")[0].toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-sm group-hover:text-primary transition-colors leading-none">
                            @{sub.user.username || "unknown_node"}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase mt-2">
                            UID: {sub.user.id.slice(-12)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest leading-none">
                          <Building2 className="size-4" />
                          {sub.service.merchant?.companyName || "ORPHAN_NODE"}
                        </div>
                      </td>
                    )}

                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Zap className="size-3 text-primary opacity-40" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 italic leading-none truncate max-w-[140px]">
                            {sub.service.name}
                          </p>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest ml-5 italic">
                          {sub.serviceTier?.name || "N/A"} TIER
                        </p>
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
                        sub.status === "ACTIVE" 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn("size-1.5 rounded-full mr-2 animate-pulse", sub.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500")} />
                        {sub.status}
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="size-3.5 text-muted-foreground/20" />
                        <span className="font-bold text-[10px] uppercase italic text-muted-foreground/60 leading-none">
                          {sub.expiresAt ? format(new Date(sub.expiresAt), "dd MMM yyyy") : "LIFETIME"}
                        </span>
                      </div>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={() => selectionChange()}>
                          <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-white/5 border border-white/5 hover:bg-primary hover:text-white transition-all">
                            <MoreHorizontal className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-[1.5rem] border-white/5 bg-black/95 backdrop-blur-3xl p-2 shadow-2xl relative z-[100]">
                          <DropdownMenuItem asChild className="rounded-xl py-3 px-4 focus:bg-primary/10 cursor-pointer">
                            <Link href={`/dashboard/subscribers/${sub.id}`} className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-black uppercase italic tracking-widest">Deep Audit</span>
                              <ChevronRight className="size-4 opacity-20" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => impact("heavy")} className="rounded-xl py-3 px-4 text-rose-500 focus:bg-rose-500/10 cursor-pointer">
                            <Trash2 className="size-4 mr-3" />
                            <span className="text-[10px] font-black uppercase italic tracking-widest">Revoke Access</span>
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

      <div className="flex items-center justify-center gap-5 opacity-10 py-12">
        <Terminal className="size-3.5" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground italic">
           Verified Link Established // Role: {role.toUpperCase()} // Status: Optimal
        </p>
      </div>
    </div>
  );
}