"use client";

import * as React from "react";
import { Search, X, SlidersHorizontal, Terminal, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface SearchProtocolProps {
  value: string;
  onChange: (value: string) => void;
  isStaff?: boolean;
}

/**
 * 🌊 SEARCH_PROTOCOL (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait).
 * Logic: Kinetic input focus with morphology-aware command hit-zones.
 */
export function SearchProtocol({ value, onChange, isStaff }: SearchProtocolProps) {
  const { impact } = useHaptics();
  const { screenSize, isMobile, isPortrait } = useDeviceContext();
  const [isFocused, setIsFocused] = React.useState(false);

  // 🕵️ MORPHOLOGY RESOLUTION
  // Condensing layout for XS devices to prevent horizontal squishing
  const containerPadding = screenSize === 'xs' ? "p-3" : "p-4 md:p-6";
  const inputHeight = screenSize === 'xs' ? "h-12" : "h-14 md:h-16";

  const handleClear = () => {
    onChange("");
    impact("medium");
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col md:flex-row gap-4 items-center transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        containerPadding,
        "rounded-[2rem] md:rounded-[3rem] border backdrop-blur-3xl shadow-apex",
        isFocused 
          ? (isStaff ? "border-amber-500/40 bg-amber-500/[0.04]" : "border-primary/40 bg-primary/[0.04]") 
          : "border-white/5 bg-white/[0.02]"
      )}
    >
      {/* --- TACTICAL INPUT VECTOR --- */}
      <div className="relative w-full group">
        <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-700",
          isFocused ? "opacity-100 scale-110" : "opacity-20 scale-100",
          isStaff ? "text-amber-500" : "text-primary"
        )}>
          {isStaff ? <Terminal className="size-5" /> : <Search className="size-5" />}
        </div>

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setIsFocused(true); impact("light"); }}
          onBlur={() => setIsFocused(false)}
          placeholder={isMobile ? "FILTER_NODES..." : "SEARCH_CLUSTER_BY_NAME_OR_SIGNAL..."}
          className={cn(
            "w-full pl-12 pr-12 rounded-xl md:rounded-2xl border-none bg-black/20 font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] transition-all duration-700",
            inputHeight,
            "placeholder:text-muted-foreground/20 focus-visible:ring-0"
          )}
        />

        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all active:scale-90"
          >
            <X className="size-4 opacity-40" />
          </button>
        )}
      </div>

      {/* --- COMMAND FILTERS: Hidden on XS Portrait for Laminar Flow --- */}
      {!(screenSize === 'xs' && isPortrait) && (
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => impact("medium")}
            className={cn(
              "flex items-center gap-3 px-6 h-14 md:h-16 rounded-xl md:rounded-2xl border transition-all duration-700 group",
              isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/5 border-white/5 text-foreground/40"
            )}
          >
            <SlidersHorizontal className="size-4 transition-transform group-hover:rotate-180 duration-1000" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] hidden sm:inline">
              Parameters
            </span>
          </button>
          
          {isStaff && (
            <div className="flex items-center gap-2 px-4 h-14 md:h-16 rounded-xl md:rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <Activity className="size-4 text-amber-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-500">Live</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}