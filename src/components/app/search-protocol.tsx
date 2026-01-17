"use client";

import * as React from "react";
import { Search, X, SlidersHorizontal, Terminal, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ SEARCH_PROTOCOL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 footprint and shrunken typography prevent layout blowout.
 */
export function SearchProtocol({ value, onChange, isStaff }: SearchProtocolProps) {
  const { impact } = useHaptics();
  const { screenSize, isMobile, isPortrait, isReady } = useDeviceContext();
  const [isFocused, setIsFocused] = React.useState(false);

  // 🛡️ HYDRATION SHIELD: Prevents "Bogus" layout snap
  if (!isReady) return <div className="h-11 w-full bg-white/5 animate-pulse rounded-xl border border-white/5" />;

  return (
    <div 
      className={cn(
        "relative flex items-center gap-3 transition-all duration-500",
        // TACTICAL PADDING: Shrunken for high-density scanning
        "p-3 rounded-xl border backdrop-blur-xl bg-zinc-950/60 shadow-2xl",
        isFocused 
          ? (isStaff ? "border-amber-500/20" : "border-primary/20") 
          : "border-white/5"
      )}
    >
      {/* --- TACTICAL INPUT VECTOR: Compressed h-8 --- */}
      <div className="relative flex-1 group">
        <div className={cn(
          "absolute left-2.5 top-1/2 -translate-y-1/2 transition-all duration-500",
          isFocused ? "opacity-100 scale-100" : "opacity-20 scale-90",
          isStaff ? "text-amber-500" : "text-primary"
        )}>
          {isStaff ? <Terminal className="size-3.5" /> : <Search className="size-3.5" />}
        </div>

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setIsFocused(true); impact("light"); }}
          onBlur={() => setIsFocused(false)}
          placeholder={isMobile ? "FILTER..." : "SEARCH_CLUSTER_NODES..."}
          className={cn(
            "w-full pl-8 pr-8 rounded-lg border-none bg-black/40 font-mono text-[9px] uppercase tracking-widest transition-all",
            "h-8 focus-visible:ring-0 placeholder:text-muted-foreground/10"
          )}
        />

        {value && (
          <button
            onClick={() => { onChange(""); impact("medium"); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center rounded-md hover:bg-white/5 transition-all opacity-20 hover:opacity-100"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* --- COMMAND FILTERS: Stationary Horizon --- */}
      {!(screenSize === 'xs' && isPortrait) && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => impact("medium")}
            className={cn(
              "flex items-center gap-2 px-3 h-8 rounded-lg border transition-all active:scale-95 group",
              isStaff ? "bg-amber-500/5 border-amber-500/10 text-amber-500" : "bg-white/5 border-white/5 text-foreground/40"
            )}
          >
            <SlidersHorizontal className="size-3 transition-transform group-hover:rotate-180" />
            <span className="text-[7.5px] font-black uppercase tracking-widest hidden sm:inline">
              PARAMS
            </span>
          </button>
          
          {isStaff && (
            <div className="flex items-center justify-center size-8 rounded-lg bg-amber-500/5 border border-amber-500/10 shadow-sm">
              <Activity className="size-3 text-amber-500 animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}