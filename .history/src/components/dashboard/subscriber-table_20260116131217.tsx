"use client";

import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Terminal,
  ChevronRight,
  Download,
  ShieldCheck,
  UserPlus,
  Zap,
  Globe,
  Activity,
  UserCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface Subscriber {
  id: string;
  telegramName: string;
  telegramId: string;
  plan: string;
  status: "ACTIVE" | "EXPIRED" | "PENDING";
  joinedAt: string;
  revenue: string;
  merchantNode?: string;
}

/**
 * 🌊 SUBSCRIBER_LEDGER (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware grid resolution with kinetic identity ingress.
 */
export function SubscriberTable({ data: initialData }: { data?: Subscriber[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  const subscribers = useMemo(() => initialData || [
    {
      id: "1",
      telegramName: "Alex_FX",
      telegramId: "7482910",
      plan: "PRO_SIGNAL",
      status: "ACTIVE",
      joinedAt: "2026-01-05",
      revenue: "$149.00",
      merchantNode: "ALPHA_NODE"
    },
    {
      id: "2",
      telegramName: "Sam_Signals",
      telegramId: "9283741",
      plan: "STARTER_NODE",
      status: "EXPIRED",
      joinedAt: "2025-12-20",
      revenue: "$49.00",
      merchantNode: "BETA_SYSTEMS"
    },
  ], [initialData]);

  const filteredSubscribers = useMemo(() => 
    subscribers.filter(sub => 
      sub.telegramName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.telegramId.includes(searchTerm)
    ), [subscribers, searchTerm]);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-[600px] w-full bg-card/20 animate-pulse rounded-[3rem] border border-white/5" />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 🌊 COMMAND UTILITY HUB: Morphology-Aware Filtering */}
      <div className={cn(
        "flex flex-col lg:flex-row gap-6 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border backdrop-blur-3xl shadow-apex",
        isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/30 border-white/5"
      )}>
        <div className="relative w-full lg:max-w-md group">
          <Search className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 size-5 transition-colors duration-500",
            isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/20" : "group-focus-within:text-primary text-muted-foreground/20"
          )} />
          <Input
            onFocus={() => impact("light")}
            placeholder={isStaff ? "GLOBAL_IDENTITY_QUERY..." : "FILTER_BY_IDENTITY..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-16 h-16 rounded-2xl md:rounded-[1.8rem] border bg-white/[0.03] font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-700 italic placeholder:opacity-10",
              isStaff ? "border-amber-500/10 focus:ring-amber-500/5 focus:border-amber-500/40" : "border-white/5 focus:ring-primary/5 focus:border-primary/40"
            )}
          />
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => impact("light")}
            className="flex-1 lg:flex-none h-16 px-10 rounded-2xl md:rounded-[1.6rem] border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-white/[0.08]"
          >
            <Filter className="mr-3 size-4 opacity-30" /> Filter_Logs
          </Button>
          <Button 
            onClick={() => impact("medium")}
            className={cn(
              "flex-1 lg:flex-none h-16 px-10 rounded-2xl md:rounded-[1.6rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-apex active:scale-95 transition-all italic",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-white shadow-primary/30"
            )}
          >
            <Download className="mr-3 size-4" /> Export_CSV
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[3rem] md:rounded-[4.5rem] border overflow-hidden backdrop-blur-3xl shadow-apex relative transition-all duration-1000",
        isStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/20 border-white/5"
      )}>
        
        {/* 🌫️ VAPOUR RADIANCE: Ambient subsurface wash */}
        <div className={cn(
          "absolute -right-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />

        {isMobile ? (
          /* 📱 MOBILE PROTOCOL: Liquid Identity Cards */
          <div className="p-8 space-y-8 relative z-10">
            {filteredSubscribers.length === 0 ? <NoData isStaff={isStaff} /> : filteredSubscribers.map((sub, i) => (
              <SubscriberCard key={sub.id} sub={sub} isStaff={isStaff} index={i} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL: Institutional Oversight Ledger */
          <div className="overflow-x-auto scrollbar-hide relative z-10">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  {[
                    "Subscriber_Node",
                    isStaff ? "Source_Vector" : null,
                    "Protocol_Type",
                    "Identity_Hash",
                    "Status",
                    "LTV_Flow",
                    "Terminal",
                  ].filter(Boolean).map((header) => (
                    <th key={header as string} className="px-14 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubscribers.length === 0 ? <tr><td colSpan={isStaff ? 7 : 6}><NoData isStaff={isStaff} /></td></tr> : (
                  filteredSubscribers.map((sub, index) => (
                    <tr 
                      key={sub.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <td className="px-14 py-10">
                        <div className="flex items-center gap-6">
                          <SubscriberAvatar sub={sub} isStaff={isStaff} />
                          <div className="space-y-2 min-w-0">
                            <span className="text-base font-black uppercase italic tracking-tighter block leading-none truncate text-foreground/90 group-hover:text-foreground">
                              {sub.telegramName}
                            </span>
                            <div className="flex items-center gap-3 opacity-20 italic">
                              <UserPlus className="size-3" />
                              <span className="text-[9px] font-black uppercase tracking-widest">{sub.joinedAt}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      {isStaff && (
                        <td className="px-14 py-10">
                           <span className="text-[12px] font-black uppercase italic tracking-widest text-amber-500/60 group-hover:text-amber-500 transition-colors">
                             {sub.merchantNode}
                           </span>
                        </td>
                      )}
                      <td className="px-14 py-10">
                        <div className="flex items-center gap-4">
                          <Terminal className={cn("size-4 opacity-10", isStaff ? "text-amber-500" : "text-primary")} />
                          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30 italic truncate">
                            {sub.plan}
                          </span>
                        </div>
                      </td>
                      <td className="px-14 py-10 font-mono text-[11px] font-bold tracking-widest opacity-20 text-foreground/50">
                        ID_{sub.telegramId}
                      </td>
                      <td className="px-14 py-10">
                         <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-14 py-10 font-black italic text-2xl tracking-tighter text-foreground tabular-nums">
                        {sub.revenue}
                      </td>
                      <td className="px-14 py-10 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); selectionChange(); }} 
                          className="size-12 rounded-[1.2rem] hover:bg-white/5 transition-all flex items-center justify-center text-muted-foreground/20 hover:text-foreground active:scale-75"
                        >
                          <MoreHorizontal className="size-6" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Subscriber Node Card */
function SubscriberCard({ sub, isStaff, index }: { sub: Subscriber, isStaff: boolean, index: number }) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("light")}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-8 rounded-[2.8rem] border space-y-8 hover:bg-white/[0.04] active:scale-[0.97] transition-all duration-1000 shadow-apex animate-in fade-in slide-in-from-bottom-10",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-white/[0.02] border-white/5"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          <SubscriberAvatar sub={sub} isStaff={isStaff} size="lg" />
          <div className="min-w-0">
            <p className="text-xl font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
              {sub.telegramName}
            </p>
            {isStaff && (
              <div className="flex items-center gap-2 mt-2 opacity-40">
                <Globe className="size-3 text-amber-500" />
                <p className="text-[8px] font-black text-amber-500 uppercase italic tracking-widest leading-none">NODE_{sub.merchantNode}</p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 opacity-20">
               <Activity className="size-3" />
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic truncate leading-none">
                {sub.plan}
              </p>
            </div>
          </div>
        </div>
        <StatusBadge status={sub.status} />
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">ID_Protocol</p>
          <p className="text-[11px] font-mono font-bold tracking-widest truncate text-foreground/40 leading-none">ID_{sub.telegramId}</p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Revenue_Flow</p>
          <p className="text-xl font-black italic tracking-tighter text-foreground leading-none">{sub.revenue}</p>
        </div>
      </div>

      <Button variant="ghost" className={cn(
        "w-full h-14 rounded-[1.6rem] text-[10px] font-black uppercase tracking-[0.3em] border transition-all duration-1000 italic",
        isStaff ? "border-amber-500/10 text-amber-500 hover:bg-amber-500/5" : "border-white/5 hover:bg-primary/5 hover:text-primary"
      )}>
        Inspect_Identity <ChevronRight className="ml-3 size-4" />
      </Button>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function SubscriberAvatar({ sub, isStaff, size = "md" }: { sub: Subscriber, isStaff: boolean, size?: "md" | "lg" }) {
  return (
    <div className={cn(
      "shrink-0 flex items-center justify-center font-black italic shadow-inner border transition-all duration-1000",
      size === "md" ? "size-12 rounded-2xl" : "size-16 rounded-[1.6rem]",
      isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
    )}>
      {sub.telegramName[0]}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn(
      "rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 border shadow-apex italic transition-all duration-700",
      status === "ACTIVE"
        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5"
        : status === "EXPIRED"
          ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5"
          : "bg-white/5 text-muted-foreground/40 border-white/10"
    )}>
      {status}
    </Badge>
  );
}

function NoData({ isStaff }: { isStaff: boolean }) {
  return (
    <div className="py-40 text-center space-y-8 animate-in fade-in duration-1000">
      <div className="relative inline-flex">
         <UserCircle className="size-20 opacity-5" />
         <Activity className={cn("absolute -top-4 -right-4 size-8 animate-pulse", isStaff ? "text-amber-500/20" : "text-primary/20")} />
      </div>
      <div className="space-y-2">
        <p className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.6em] opacity-20 leading-none">Zero_Identity_Logs</p>
        <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-10">Cluster_Oversight_Isolated</p>
      </div>
    </div>
  );
}