"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Terminal, Globe, Activity } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
// 🚀 FIXED IMPORT: Synchronizing with established tactical hook
import { useSignalStabilizer } from "@/lib/hooks/use-signal-stabilizer"; 
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🔍 COUPON_SEARCH (Institutional Apex v2026.1.16)
 * Strategy: Build Error Resolution + Signal Stabilization.
 * Fix: Standardized 'useSignalStabilizer' for debounced query ingress.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  const [isPending, startTransition] = useTransition();
  
  // 🛰️ DEVICE & LAYOUT INGRESS
  const { isReady, isMobile } = useDeviceContext();
  const { flavor } = useLayout();
  const isStaffTheme = flavor === "AMBER";
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  
  // 🛡️ SIGNAL STABILIZATION: Corrected hook usage
  const stabilizedQuery = useSignalStabilizer(searchTerm, 400);

  // 🛡️ PROTOCOL SYNC: Debounced URL Handshake
  useEffect(() => {
    if (!isReady) return;

    const params = new URLSearchParams(searchParams.toString());
    
    if (stabilizedQuery) {
      params.set("query", stabilizedQuery);
      params.set("page", "1"); 
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [stabilizedQuery, router, searchParams, isReady]);

  const handleClear = () => {
    impact("medium");
    setSearchTerm("");
  };

  // 🛡️ HYDRATION SHIELD: Prevents layout snap during hardware handshake
  if (!isReady) return <div className="h-12 w-full max-w-md bg-white/[0.02] animate-pulse rounded-xl" />;

  /**
   * 🕵️ TACTICAL CLAMPING: Morphology resolution
   * Fix: Standardized to fixed heights (48px-56px) to ensure professional density.
   */
  const inputHeight = isMobile ? "h-11" : "h-12 md:h-14";

  return (
    <div className={cn(
      "relative w-full transition-all duration-700 group",
      isMobile ? "max-w-full" : "lg:max-w-md"
    )}>
      {/* 🌫️ TACTICAL RADIANCE: Subsurface Chroma */}
      <div className={cn(
        "absolute inset-0 blur-[20px] opacity-0 group-focus-within:opacity-10 transition-opacity duration-1000 rounded-full pointer-events-none",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- STATUS INGRESS NODE --- */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn(
            "size-3.5 animate-spin",
            isStaffTheme ? "text-amber-500" : "text-primary"
          )} />
        ) : (
          <div className="flex items-center gap-3">
            {isStaffTheme ? (
              <Globe className="size-3.5 text-muted-foreground/30 group-focus-within:text-amber-500 transition-colors duration-500" />
            ) : (
              <Search className="size-3.5 text-muted-foreground/30 group-focus-within:text-primary transition-colors duration-500" />
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
          "w-full pl-11 md:pl-14 pr-12 bg-black/40 backdrop-blur-3xl border transition-all duration-500",
          "rounded-xl",
          "text-[10px] font-black uppercase italic tracking-widest placeholder:opacity-20 text-foreground",
          inputHeight,
          isStaffTheme 
            ? "border-amber-500/10 focus:border-amber-500/30 focus:ring-8 focus:ring-amber-500/5" 
            : "border-white/5 focus:border-primary/30 focus:ring-8 focus:ring-primary/5",
          isPending && "opacity-50"
        )}
      />

      {/* --- ACTION TERMINAL --- */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-90"
          >
            <X className="size-3" />
          </button>
        )}
        <Activity className={cn(
          "size-2.5 hidden sm:block transition-all duration-500",
          isStaffTheme ? "text-amber-500/20" : "text-primary/20",
          isPending && "animate-pulse opacity-100"
        )} />
      </div>

      {/* 🚀 KINETIC STATUS PULSE */}
      <div className="absolute -top-1 -right-1">
        <div className={cn(
          "size-1.5 rounded-full animate-pulse",
          isStaffTheme ? "bg-amber-500" : "bg-primary"
        )} />
      </div>
    </div>
  );
}