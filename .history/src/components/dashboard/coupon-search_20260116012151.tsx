"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Terminal, Globe, Activity } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useDebounce } from "@/lib/hooks/use-signal-stabilizer"; 
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ KINETIC_SEARCH_PROTOCOL (Institutional Apex v2026.1.15)
 * Strategy: High-density, low-profile tactical ingress.
 * Fix: Clamped typography and fixed heights to prevent "bogus" oversized distortion.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  const [isPending, startTransition] = useTransition();
  
  // 🛰️ DEVICE & LAYOUT INGRESS
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  const { flavor } = useLayout();
  const isStaffTheme = flavor === "AMBER";
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // 🛡️ PROTOCOL SYNC: Debounced URL Handshake
  useEffect(() => {
    if (!isReady) return;

    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
      params.set("page", "1"); 
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearch, router, searchParams, isReady]);

  const handleClear = () => {
    impact("medium");
    setSearchTerm("");
  };

  // 🛡️ HYDRATION SHIELD: Prevents layout snap during hardware handshake
  if (!isReady) return <div className="h-12 w-full max-w-md bg-white/[0.02] animate-pulse rounded-xl" />;

  /**
   * 🕵️ TACTICAL CLAMPING: Morphology resolution
   * Fix: Standardized to fixed pixel heights (48px-64px) to ensure a "Pro" minimalist look.
   */
  const inputHeight = isMobile ? "h-12" : "h-14 md:h-16";
  const labelTracking = isMobile ? "tracking-[0.2em]" : "tracking-[0.3em]";

  return (
    <div className={cn(
      "relative w-full transition-all duration-700 group",
      isMobile ? "max-w-full" : "lg:max-w-md"
    )}>
      {/* 🌫️ TACTICAL RADIANCE: Low-weight active glow */}
      <div className={cn(
        "absolute inset-0 blur-[20px] opacity-0 group-focus-within:opacity-10 transition-opacity duration-1000 rounded-full pointer-events-none",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- STATUS INGRESS NODE --- */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn(
            "size-3.5 md:size-4 animate-spin",
            isStaffTheme ? "text-amber-500" : "text-primary"
          )} />
        ) : (
          <div className="flex items-center gap-3">
            {isStaffTheme ? (
              <Globe className="size-3.5 md:size-4 text-muted-foreground/30 group-focus-within:text-amber-500 transition-colors duration-500" />
            ) : (
              <Search className="size-3.5 md:size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors duration-500" />
            )}
            <div className="h-4 w-px bg-white/5 hidden md:block" />
          </div>
        )}
      </div>

      <Input
        value={searchTerm}
        onFocus={() => impact("light")}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isStaffTheme ? "GLOBAL_QUERY..." : "FILTER_NODE..."}
        className={cn(
          "w-full pl-12 md:pl-16 pr-14 bg-black/40 backdrop-blur-3xl border shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "rounded-xl md:rounded-2xl",
          "text-[9px] md:text-[10px] font-black uppercase italic tracking-widest placeholder:opacity-20 text-foreground",
          inputHeight,
          labelTracking,
          isStaffTheme 
            ? "border-amber-500/10 focus:border-amber-500/30 focus:bg-amber-500/[0.02]" 
            : "border-white/5 focus:border-primary/30 focus:bg-primary/[0.02]",
          isPending && "opacity-50"
        )}
      />

      {/* --- ACTION TERMINAL --- */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-90"
          >
            <X className="size-3" />
          </button>
        )}
        <Activity className={cn(
          "size-3 hidden sm:block transition-all duration-500",
          isStaffTheme ? "text-amber-500/20" : "text-primary/20",
          isPending && "animate-pulse opacity-100"
        )} />
      </div>

      {/* 🏛️ INSTITUTIONAL STATUS FOOTER: Subsurface Handshake */}
      <div className="absolute -bottom-6 left-2 opacity-0 group-focus-within:opacity-30 transition-all duration-700 translate-y-1 group-focus-within:translate-y-0 pointer-events-none">
         <div className="flex items-center gap-2">
           <Terminal className="size-2.5" />
           <p className={cn(
             "text-[7px] font-black uppercase tracking-[0.3em] italic",
             isStaffTheme ? "text-amber-500" : "text-primary"
           )}>
             {isPending ? "Syncing_Index..." : "Node_Ready"}
           </p>
         </div>
      </div>
    </div>
  );
}