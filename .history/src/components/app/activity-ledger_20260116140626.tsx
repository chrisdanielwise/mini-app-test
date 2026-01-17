"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { 
  Zap, 
  DollarSign, 
  UserPlus, 
  ShieldAlert, 
  Terminal, 
  Search,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const EVENT_TYPES = {
  SIGNAL: { icon: Zap, color: "text-primary", bg: "bg-primary/10", label: "SIGNAL" },
  PAYMENT: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "CREDIT" },
  USER: { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/10", label: "AUTH" },
  ALERT: { icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10", label: "ALARM" },
};

/**
 * 🛰️ ACTIVITY_LEDGER (Institutional Apex v2026.1.16)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 search and py-3.5 rows prevent layout blowout.
 */
export function ActivityLedger({ events }: { events: any[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isMobile, screenSize, isPortrait, isReady } = useDeviceContext();
  const [query, setQuery] = useState("");
  const isStaff = flavor === "AMBER";

  if (!isReady) return <div className="h-64 w-full bg-white/5 animate-pulse rounded-2xl" />;

  const filteredEvents = useMemo(() => 
    events.filter(e => 
      e.hash.toLowerCase().includes(query.toLowerCase()) || 
      e.title.toLowerCase().includes(query.toLowerCase())
    ), [events, query]);

  return (
    <div className="space-y-3 animate-in fade-in duration-700">
      
      {/* --- 🔍 SEARCH VECTOR: Compressed h-11 --- */}
      <div className={cn(
        "flex items-center justify-between p-3 rounded-xl border backdrop-blur-xl h-12",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-zinc-950/60 border-white/5 shadow-2xl"
      )}>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 opacity-20 group-focus-within:opacity-100 transition-opacity" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="FILTER_LEDGER..." 
            className="h-8 pl-9 rounded-lg bg-black/40 border-none font-mono text-[9px] uppercase tracking-widest transition-all focus-visible:ring-0"
          />
        </div>
      </div>

      {/* --- 📊 LEDGER STREAM: Independent Tactical Volume --- */}
      <div className={cn(
        "relative overflow-hidden border rounded-xl md:rounded-2xl transition-all",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-zinc-950/40 border-white/5 shadow-2xl"
      )}>
        <div className="divide-y divide-white/5">
          {filteredEvents.map((event, index) => {
            const Config = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES] || EVENT_TYPES.SIGNAL;
            
            return (
              <div 
                key={event.id}
                className="group flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.01] transition-colors cursor-pointer leading-none"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* ICON NODE: Compressed size-9 */}
                  <div className={cn(
                    "shrink-0 size-9 rounded-lg flex items-center justify-center border shadow-inner transition-all",
                    Config.bg, "border-white/5", Config.color
                  )}>
                    <Config.icon className="size-4.5" />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <p className="text-xs font-black uppercase italic tracking-tighter text-foreground truncate">
                        {event.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-10 italic">
                      <Terminal className="size-2.5" />
                      <p className="text-[7.5px] font-black uppercase tracking-[0.2em] truncate">
                        EPOCH_{event.block} • {event.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0 ml-4">
                   <span className={cn(
                     "font-black italic tracking-tighter text-lg leading-none transition-all tabular-nums",
                     Config.color
                   )}>
                     {event.value}
                   </span>
                   <ArrowUpRight className="size-3 opacity-10 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 🛰️ TELEMETRY FOOTER --- */}
      <div className="flex items-center justify-center gap-3 py-4 opacity-10 italic leading-none">
         <Activity className="size-3 animate-pulse text-emerald-500" />
         <p className="text-[7.5px] font-black uppercase tracking-[0.4em]">
           STREAMING_REAL_TIME // CLUSTER_ACTIVE
         </p>
      </div>
    </div>
  );
}