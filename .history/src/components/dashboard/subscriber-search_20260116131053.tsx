"use client";

import * as React from "react";
import { useState, useTransition, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, Loader2, Terminal, X, Globe, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SUBSCRIBER_SEARCH (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11/h-12 footprint prevents vertical blowout of the command HUD.
 */
export function SubscriberSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { impact } = useHaptics();
  
  const { isReady, isMobile } = useDeviceContext();
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
    impact("medium");
    setSearchTerm("");
    handleSearch("");
  }, [impact, handleSearch]);

  if (!isReady) return <div className="h-10 w-full lg:max-w-xs bg-white/5 animate-pulse rounded-xl" />;

  return (
    <div className={cn(
      "relative w-full lg:max-w-sm group transition-all duration-700",
      "animate-in fade-in slide-in-from-left-4"
    )}>
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className={cn(
        "absolute inset-0 blur-xl opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none",
        isStaffFlavor ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ INGRESS NODE --- */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn("size-4 animate-spin", isStaffFlavor ? "text-amber-500" : "text-primary")} />
        ) : (
          <div className="flex items-center gap-3">
            {isStaffFlavor ? (
              <Globe className="size-4 text-amber-500/20 group-focus-within:text-amber-500 transition-colors" />
            ) : (
              <Search className="size-4 text-white/10 group-focus-within:text-primary transition-colors" />
            )}
            <div className="h-4 w-px bg-white/5" />
          </div>
        )}
      </div>

      <Input
        placeholder={isStaffFlavor ? "GLOBAL_QUERY..." : "IDENTITY_QUERY..."}
        value={searchTerm}
        onFocus={() => impact("light")}
        onChange={(e) => {
          const val = e.target.value.toUpperCase();
          setSearchTerm(val);
          handleSearch(val);
        }}
        className={cn(
          "h-11 md:h-11 pl-12 pr-12 rounded-xl border-white/5 bg-zinc-950/60 backdrop-blur-xl transition-all shadow-lg",
          "text-[9px] font-black uppercase italic tracking-[0.2em] placeholder:opacity-10 text-foreground",
          isStaffFlavor 
            ? "focus:border-amber-500/20 focus:bg-amber-500/[0.02]" 
            : "focus:border-primary/20 focus:bg-primary/[0.02]",
          isPending && "opacity-60"
        )}
      />

      {/* --- TERMINAL ACTIONS --- */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="size-7 rounded-lg bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all flex items-center justify-center border border-white/5"
          >
            <X className="size-3" />
          </button>
        )}
        <Terminal className={cn(
          "size-3 opacity-10 transition-colors",
          isStaffFlavor ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
        )} />
      </div>

      {/* --- STATUS TELEMETRY --- */}
      <div className="absolute -bottom-6 left-2 opacity-0 group-focus-within:opacity-20 transition-all pointer-events-none">
         <div className="flex items-center gap-2 italic">
           <Activity className={cn("size-2.5 animate-pulse", isStaffFlavor ? "text-amber-500" : "text-primary")} />
           <p className="text-[7px] font-black uppercase tracking-[0.3em] text-foreground">
             {isPending ? "Indexing..." : "Node_Active"}
           </p>
         </div>
      </div>
    </div>
  );
}