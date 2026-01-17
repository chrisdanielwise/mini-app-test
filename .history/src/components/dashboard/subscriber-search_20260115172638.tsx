"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, Loader2, Terminal, X, Globe, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useTransition, useCallback } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 SUBSCRIBER_SEARCH (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Momentum | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with debounced URL synchronization.
 */
export function SubscriberSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE & TRANSITION INGRESS
  const { isReady, isMobile, screenSize } = useDeviceContext();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");
  
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
      params.set("page", "1"); 
    } else {
      params.delete("query");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 400);

  const handleClear = useCallback(() => {
    impact("medium"); // 🏁 TACTILE SYNC: Feel the reset
    setSearchTerm("");
    handleSearch("");
  }, [impact, handleSearch]);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="h-16 w-full lg:max-w-md bg-card/20 animate-pulse rounded-2xl" />;

  return (
    <div className={cn(
      "relative w-full lg:max-w-md group transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "animate-in fade-in slide-in-from-left-8"
    )}>
      {/* 🌫️ VAPOUR RADIANCE: Role-Based Focus Aura */}
      <div className={cn(
        "absolute inset-0 blur-[30px] opacity-0 group-focus-within:opacity-20 transition-opacity duration-1000 pointer-events-none",
        isStaffFlavor ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- INGRESS INDICATOR NODE --- */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn(
            "size-5 animate-spin",
            isStaffFlavor ? "text-amber-500" : "text-primary"
          )} />
        ) : (
          <div className="flex items-center gap-4">
            {isStaffFlavor ? (
              <Globe className="size-5 text-muted-foreground/30 group-focus-within:text-amber-500 transition-colors duration-700" />
            ) : (
              <Search className="size-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors duration-700" />
            )}
            <div className="hidden md:block h-6 w-px bg-white/5" />
          </div>
        )}
      </div>

      <Input
        placeholder={isStaffFlavor ? "GLOBAL_IDENTITY_QUERY..." : "IDENTITY_QUERY..."}
        value={searchTerm}
        onFocus={() => impact("light")}
        onChange={(e) => {
          const val = e.target.value.toUpperCase();
          setSearchTerm(val);
          handleSearch(val);
        }}
        className={cn(
          "h-16 md:h-20 pl-16 md:pl-20 pr-16 rounded-2xl md:rounded-[1.8rem] border-white/5 bg-background/60 backdrop-blur-3xl transition-all duration-1000 shadow-apex",
          "text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.3em] placeholder:opacity-10 text-foreground",
          isStaffFlavor 
            ? "focus:border-amber-500/30 focus:bg-amber-500/[0.04]" 
            : "focus:border-primary/30 focus:bg-primary/[0.04]",
          isPending && "opacity-60"
        )}
      />

      {/* --- TERMINAL ACTIONS --- */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="size-10 rounded-xl bg-white/5 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-75 flex items-center justify-center border border-white/5"
          >
            <X className="size-4.5" />
          </button>
        )}
        <Terminal className={cn(
          "size-4 hidden lg:block transition-colors duration-700",
          isStaffFlavor ? "text-amber-500/10 group-focus-within:text-amber-500/30" : "text-white/5 group-focus-within:text-primary/30"
        )} />
      </div>

      {/* --- STATUS TELEMETRY --- */}
      <div className="absolute -bottom-8 left-2 opacity-0 group-focus-within:opacity-40 transition-all duration-1000 translate-y-3 group-focus-within:translate-y-0 pointer-events-none">
         <div className="flex items-center gap-3 italic">
           <Activity className={cn("size-3 animate-pulse", isStaffFlavor ? "text-amber-500" : "text-primary")} />
           <p className={cn(
             "text-[8px] font-black uppercase tracking-[0.5em]",
             isStaffFlavor ? "text-amber-500" : "text-foreground"
           )}>
             {isPending ? "Indexing_Nodes..." : isStaffFlavor ? "Global_Oversight_Active" : "Protocol_Active"}
           </p>
         </div>
      </div>
    </div>
  );
}