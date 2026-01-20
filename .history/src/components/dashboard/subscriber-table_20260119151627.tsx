"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Terminal,
  ChevronRight,
  Download,
  UserPlus,
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

// ✅ FIX: Strict Enum type for status reconciliation
type SubStatus = "ACTIVE" | "EXPIRED" | "PENDING";

interface Subscriber {
  id: string;
  telegramName: string;
  telegramId: string;
  plan: string;
  status: SubStatus;
  joinedAt: string;
  revenue: string;
  merchantNode?: string; 
}

/**
 * 🛰️ SUBSCRIBER_LEDGER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware Bridge Sync.
 */
export function SubscriberTable({ data: initialData }: { data?: Subscriber[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  const subscribers = useMemo(() => initialData || [
    {
      id: "1",
      telegramName: "Alex_FX",
      telegramId: "7482910",
      plan: "PRO_SIGNAL",
      status: "ACTIVE" as SubStatus,
      joinedAt: "2026-01-05",
      revenue: "$149.00",
      merchantNode: "ALPHA_NODE"
    },
    {
      id: "2",
      telegramName: "Sam_Signals",
      telegramId: "9283741",
      plan: "STARTER_NODE",
      status: "EXPIRED" as SubStatus,
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

  if (!isReady) return <div className="min-h-[400px] w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-[2rem]" />;

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🌊 COMMAND UTILITY HUB */}
      <div className={cn(
        "flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-zinc-950/40 border-white/5"
      )}>
        <div className="relative w-full lg:max-w-md group">
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors",
            isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/30" : "group-focus-within:text-primary text-muted-foreground/30"
          )} />
          <Input
            onFocus={() => impact("light")}
            placeholder={isStaff ? "GLOBAL_SEARCH: IDENTITY..." : "FILTER BY IDENTITY..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl border font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all placeholder:opacity-30 shadow-inner",
              isStaff ? "bg-amber-500/5 border-amber-500/20 focus:ring-amber-500/20" : "bg-white/[0.02] border-white/5 focus:ring-primary/20"
            )}
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => impact("light")}
            className="flex-1 lg:flex-none h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl border-white/5 bg-white/[0.02] text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] active:scale-95 transition-all italic"
          >
            <Filter className="mr-2 size-3.5 opacity-30" /> Filter
          </Button>
          <Button 
            onClick={() => impact("medium")}
            className={cn(
              "flex-1 lg:flex-none h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl active:scale-95 transition-all italic",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
            )}
          >
            <Download className="mr-2 size-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE --- */}
      <div className={cn(
        "rounded-[2rem] md:rounded-[3rem] border overflow-hidden backdrop-blur-3xl shadow-2xl relative transition-all duration-700",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-zinc-950/40 border-white/5"
      )}>
        
        {isMobile ? (
          <div className="p-4 space-y-4 relative z-10">
            {filteredSubscribers.length === 0 ? <NoData isStaff={isStaff} /> : filteredSubscribers.map((sub, i) => (
              <SubscriberCard key={sub.id} sub={sub} isStaff={isStaff} index={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide relative z-10">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  {[
                    "Subscriber Node",
                    isStaff ? "Source Node" : null,
                    "Protocol Type",
                    "Identity ID",
                    "Status",
                    "LTV Flow",
                    "",
                  ].filter(Boolean).map((header) => (
                    <th key={header as string} className="px-8 py-6 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
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
                      className="hover:bg-white/[0.03] transition-all duration-500 group cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <SubscriberAvatar sub={sub} isStaff={isStaff} />
                          <div className="space-y-1 min-w-0">
                            <span className="text-xs md:text-sm font-black uppercase italic tracking-tighter block leading-none truncate text-foreground group-hover:text-foreground">
                              {sub.telegramName}
                            </span>
                            <div className="flex items-center gap-1.5 opacity-20 italic">
                              <UserPlus className="size-3" />
                              <span className="text-[7.5px] font-black uppercase tracking-widest">{sub.joinedAt}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      {isStaff && (
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black uppercase italic tracking-widest text-amber-500/60 group-hover:text-amber-500 transition-colors">
                             {sub.merchantNode}
                           </span>
                        </td>
                      )}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <Terminal className={cn("size-3.5 opacity-10", isStaff ? "text-amber-500" : "text-primary")} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic truncate">
                            {sub.plan}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-[9px] md:text-[10px] font-black tracking-widest opacity-20 text-foreground/50">
                        ID_{sub.telegramId}
                      </td>
                      <td className="px-8 py-6">
                         <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-8 py-6 font-black italic text-lg tracking-tighter text-foreground tabular-nums">
                        {sub.revenue}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={(e) => { e.stopPropagation(); selectionChange(); }} className="size-10 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center text-muted-foreground/20 hover:text-foreground active:scale-75">
                          <MoreHorizontal className="size-5" />
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
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "p-5 rounded-2xl border space-y-5 hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-700 shadow-2xl animate-in fade-in slide-in-from-bottom-2",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-white/[0.01] border-white/5"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <SubscriberAvatar sub={sub} isStaff={isStaff} size="lg" />
          <div className="min-w-0">
            <p className="text-sm font-black uppercase italic tracking-tighter leading-none truncate text-foreground">
              {sub.telegramName}
            </p>
            {isStaff && <p className="text-[7.5px] font-black text-amber-500 uppercase mt-1.5 italic tracking-tighter">NODE_{sub.merchantNode}</p>}
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1.5 opacity-30 italic truncate leading-none">
              {sub.plan}
            </p>
          </div>
        </div>
        <StatusBadge status={sub.status} />
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">ID_Protocol</p>
          <p className="text-[10px] font-mono font-black tracking-widest truncate text-foreground/30 leading-none">ID_{sub.telegramId}</p>
        </div>
        <div className="text-right space-y-1.5">
          <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">LTV_Flow</p>
          <p className="text-sm font-black italic tracking-tighter text-foreground leading-none">{sub.revenue}</p>
        </div>
      </div>

      <Button variant="ghost" className={cn(
        "w-full h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-700 italic",
        isStaff ? "border-amber-500/10 text-amber-500 hover:bg-amber-500/5" : "border-white/5 hover:bg-white/5 hover:text-primary"
      )}>
        Inspect_Identity <ChevronRight className="ml-2 size-3.5" />
      </Button>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function SubscriberAvatar({ sub, isStaff, size = "md" }: { sub: Subscriber, isStaff: boolean, size?: "md" | "lg" }) {
  return (
    <div className={cn(
      "shrink-0 flex items-center justify-center font-black italic shadow-inner border transition-all duration-700",
      size === "md" ? "size-10 rounded-xl" : "size-12 rounded-2xl",
      isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
    )}>
      {sub.telegramName[0]}
    </div>
  );
}

function StatusBadge({ status }: { status: SubStatus }) {
  return (
    <Badge className={cn(
        "rounded-lg text-[7.5px] font-black uppercase tracking-[0.2em] px-3 py-1 border shadow-sm transition-all duration-700 italic",
        status === "ACTIVE"
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
      )}>
      {status}
    </Badge>
  );
}

function NoData({ isStaff }: { isStaff: boolean }) {
  return (
    <div className="py-20 text-center space-y-6 opacity-10 italic">
      <UserCircle className="size-12 mx-auto" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em]">Zero_Identity_Signal</p>
    </div>
  );
}