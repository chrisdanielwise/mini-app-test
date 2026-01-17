"use client";

import * as React from "react";
import { 
  Zap, 
  DollarSign, 
  UserPlus, 
  ShieldAlert, 
  Terminal, 
  Search,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 ACTIVITY_LEDGER_STREAM (v16.16.12)
 * Logic: Real-time event propagation with type-based filtering.
 * Design: High-density Obsidian list with Kinetic Ingress.
 */

const EVENT_TYPES = {
  SIGNAL: { icon: Zap, color: "text-primary", bg: "bg-primary/10", label: "SIGNAL_PULSE" },
  PAYMENT: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "LIQUIDITY_SYNC" },
  USER: { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/10", label: "NODE_INGRESS" },
  ALERT: { icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10", label: "SECURITY_BREACH" },
};

export function ActivityLedger({ events }: { events: any[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
      
      {/* --- COMMAND BAR: SEARCH & FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-20" />
          <Input 
            placeholder="FILTER_LEDGER_BY_HASH..." 
            className="h-12 pl-12 rounded-xl bg-black/20 border-white/5 font-mono text-[10px] uppercase tracking-widest focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {Object.entries(EVENT_TYPES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => impact("light")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all shrink-0 group"
            >
              <value.icon className={cn("size-3.5", value.color)} />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                {value.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- THE LEDGER STREAM --- */}
      <div className={cn(
        "relative overflow-hidden rounded-[3rem] border transition-all duration-700",
        isStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/40 border-white/5 shadow-2xl"
      )}>
        <div className="divide-y divide-white/5">
          {events.map((event, index) => {
            const Config = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES] || EVENT_TYPES.SIGNAL;
            return (
              <div 
                key={event.id}
                style={{ animationDelay: `${index * 40}ms` }}
                className="group px-8 md:px-12 py-6 flex items-center justify-between hover:bg-white/[0.03] transition-all duration-500 animate-in fade-in slide-in-from-top-4"
              >
                <div className="flex items-center gap-6 md:gap-8">
                  <div className={cn(
                    "size-12 md:size-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                    Config.bg, "border-white/5", Config.color
                  )}>
                    <Config.icon className="size-6" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <p className="text-[11px] md:text-sm font-black uppercase italic tracking-tighter text-foreground leading-none">
                        {event.title}
                      </p>
                      <Badge className="bg-white/5 text-[8px] font-mono border-none text-white/20">
                        {event.hash.slice(0, 8)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 opacity-30 italic">
                      <Terminal className="size-3" />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                        {event.timestamp} // {event.node}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                   <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-black italic tracking-tighter", Config.color)}>
                        {event.value}
                      </span>
                      <ArrowUpRight className="size-3 opacity-20" />
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest opacity-10">
                     Block_Height_{event.block}
                   </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- FOOTER: LIVE SYNC STATUS --- */}
      <div className="flex items-center justify-center gap-4 py-8 opacity-10 italic">
         <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
         <p className="text-[9px] font-black uppercase tracking-[0.5em]">Ledger_Streaming_Real_Time</p>
      </div>
    </div>
  );
}