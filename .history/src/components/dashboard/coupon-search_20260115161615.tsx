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
 * 🌊 KINETIC_SEARCH_PROTOCOL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware viewport clamping with debounced URL-Sync.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  const [isPending, startTransition] = useTransition();
  
  // 🛰️ DEVICE & LAYOUT INGRESS
  const { isReady, screenSize, isMobile } = useDeviceContext();
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";
  
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

  if (!isReady) return <div className="h-16 w-full max-w-md bg-card/20 animate-pulse rounded-2xl md:rounded-3xl" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Balancing visual weight for 6-tier hardware.
   */
  const inputHeight = screenSize === 'xs' ? "h-14" : "h-16 md:h-20";
  const labelTracking = screenSize === 'xs' ? "tracking-[0.2em]" : "tracking-[0.4em]";

  return (
    <div className={cn(
      "relative w-full transition-all duration-1000 group",
      isMobile ? "max-w-full" : "lg:max-w-md"
    )}>
      {/* 🌫️ VAPOUR RADIANCE: Subsurface Focus Glow */}
      <div className={cn(
        "absolute inset-0 blur-[30px] opacity-0 group-focus-within:opacity-10 transition-opacity duration-1000 rounded-full pointer-events-none",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- STATUS INGRESS NODE --- */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn(
            "size-4 md:size-5 animate-spin",
            isStaff ? "text-amber-500" : "text-primary"
          )} />
        ) : (
          <div className="flex items-center gap-4">
            {isStaff ? (
              <Globe className="size-4 md:size-5 text-muted-foreground/30 group-focus-within:text-amber-500 transition-colors duration-700" />
            ) : (
              <Search className="size-4 md:size-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors duration-700" />
            )}
            <div className="h-5 w-px bg-white/5 hidden md:block" />
          </div>
        )}
      </div>

      <Input
        value={searchTerm}
        onFocus={() => impact("light")}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isStaff ? "GLOBAL_SEARCH..." : "FILTER_NODE..."}
        className={cn(
          "w-full pl-16 md:pl-20 pr-16 bg-card/40 backdrop-blur-3xl shadow-apex transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "rounded-[1.5rem] md:rounded-[2.2rem]",
          "text-[10px] md:text-[11px] font-black uppercase italic placeholder:opacity-10",
          inputHeight,
          labelTracking,
          isStaff 
            ? "focus:border-amber-500/30 focus:bg-amber-500/[0.05]" 
            : "focus:border-primary/30 focus:bg-primary/[0.05]",
          isPending && "opacity-50"
        )}
      />

      {/* --- ACTION TERMINAL --- */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90"
          >
            <X className="size-4" />
          </button>
        )}
        <Activity className={cn(
          "size-4 hidden sm:block transition-all duration-700",
          isStaff ? "text-amber-500/20" : "text-primary/20",
          isPending && "animate-pulse opacity-100"
        )} />
      </div>

      {/* 🏛️ INSTITUTIONAL STATUS FOOTER */}
      <div className="absolute -bottom-8 left-4 opacity-0 group-focus-within:opacity-30 transition-all duration-1000 translate-y-2 group-focus-within:translate-y-0 pointer-events-none">
         <div className="flex items-center gap-3">
           <Terminal className="size-3" />
           <p className={cn(
             "text-[8px] font-black uppercase tracking-[0.4em] italic",
             isStaff ? "text-amber-500" : "text-primary"
           )}>
             {isPending ? "Indexing_Protocol_Nodes..." : isStaff ? "Ready_for_Global_Query" : "Network_Sync_Stable"}
           </p>
         </div>
      </div>
    </div>
  );
}