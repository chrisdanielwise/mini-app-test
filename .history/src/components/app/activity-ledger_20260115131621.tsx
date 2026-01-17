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
  Waves,
  Activity,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
 * 🌊 ACTIVITY_LEDGER_STREAM (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware filtering with hardware-level performance.
 */
export function ActivityLedger({ events }: { events: any[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    screenSize, 
    isPortrait, 
    isReady,
    viewportWidth,
    safeArea 
  } = useDeviceContext();

  const [query, setQuery] = useState("");
  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION GUARD: Prevents "Layout Jumps" during morphology sync
  if (!isReady) return (
    <div className="space-y-6 animate-pulse opacity-20">
      <div className="h-16 rounded-2xl bg-card" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-3xl bg-card" />)}
      </div>
    </div>
  );

  // 🛰️ DATA FILTERING: Optimized for 120Hz scrolling
  const filteredEvents = useMemo(() => 
    events.filter(e => 
      e.hash.toLowerCase().includes(query.toLowerCase()) || 
      e.title.toLowerCase().includes(query.toLowerCase())
    ),
  [events, query]);

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating density thresholds based on the 6-tier system.
   */
  const rowPadding = screenSize === 'xs' ? "px-5 py-4" : "px-8 md:px-12 py-6";
  const iconBoxSize = screenSize === 'xs' ? "size-10" : "size-12 md:size-14";

  return (
    <div className="space-y-[var(--fluid-gap)] animate-in fade-in slide-in-from-right-8 duration-1000 ease-[var(--ease-institutional)]">
      
      {/* --- COMMAND BAR: HARDWARE-AWARE FILTERS --- */}
      <div className={cn(
        "flex flex-col md:flex-row gap-4 items-center justify-between p-4 md:p-6 rounded-[2rem] border backdrop-blur-3xl transition-all duration-1000",
        isStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-white/[0.02] border-white/5 shadow-apex"
      )}>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-20 group-focus-within:opacity-100 transition-opacity" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="FILTER_LEDGER_BY_HASH..." 
            className="h-12 pl-12 rounded-xl bg-black/20 border-white/5 font-mono text-[10px] uppercase tracking-widest focus:border-primary/40 transition-all duration-500"
          />
        </div>
        
        {/* Only show filters if not on XS portrait to prevent vertical bloat */}
        {!(screenSize === 'xs' && isPortrait) && (
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {Object.entries(EVENT_TYPES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => { impact("light"); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all shrink-0 group"
              >
                <value.icon className={cn("size-3.5", value.color)} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">
                  {value.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- THE LEDGER STREAM: MORPHOLOGY-AWARE LIST --- */}
      <div className={cn(
        "relative overflow-hidden border transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "rounded-[2.5rem] md:rounded-[3.5rem]",
        isStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/40 border-white/5 shadow-apex"
      )}>
        <div className="divide-y divide-white/5">
          {filteredEvents.map((event, index) => {
            const Config = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES] || EVENT_TYPES.SIGNAL;
            
            return (
              <div 
                key={event.id}
                style={{ animationDelay: `${index * 40}ms` }}
                className={cn(
                  "group flex items-center justify-between hover:bg-white/[0.03] transition-all duration-700 cursor-pointer animate-in fade-in slide-in-from-top-4",
                  rowPadding
                )}
              >
                <div className="flex items-center gap-4 md:gap-8 min-w-0">
                  {/* ICON NODE: Morphology scaling */}
                  <div className={cn(
                    "shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110",
                    iconBoxSize, Config.bg, "border-white/5", Config.color
                  )}>
                    <Config.icon className={screenSize === 'xs' ? "size-5" : "size-7"} />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-[11px] md:text-sm font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
                        {event.title}
                      </p>
                      {/* Hide hash on small screens unless isDesktop */}
                      {(isTablet || isDesktop) && (
                        <Badge className="bg-white/5 text-[8px] font-mono border-none text-white/20 shrink-0">
                          {event.hash.slice(0, 10)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 opacity-30 italic">
                      <Terminal className="size-3" />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] truncate">
                        {event.timestamp} {isDesktop && `// NODE_${event.node}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1 md:gap-2 shrink-0 ml-4">
                   <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-black italic tracking-tighter transition-all duration-700 leading-none",
                        screenSize === 'xs' ? "text-sm" : "text-lg",
                        Config.color
                      )}>
                        {event.value}
                      </span>
                      <ArrowUpRight className="size-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                   </div>
                   {/* Hide block height on mobile portrait to keep clean */}
                   {!(isMobile && isPortrait) && (
                     <span className="text-[8px] font-black uppercase tracking-widest opacity-10 italic">
                       Block_{event.block}
                     </span>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- FOOTER: REAL-TIME TELEMETRY --- */}
      <div className="flex items-center justify-center gap-4 py-8 opacity-20 italic relative">
         <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
         <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] text-foreground">
           Ledger_Streaming_Real_Time // Cluster_Active
         </p>
         {/* Uses viewportWidth to scale wave aesthetic */}
         <Waves 
           className="absolute inset-x-0 bottom-0 w-full opacity-5 pointer-events-none" 
           style={{ height: `${Math.max(20, viewportWidth * 0.05)}px` }} 
         />
      </div>
    </div>
  );
}