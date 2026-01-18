"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Terminal, Globe, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
// import { useDebounce } from "@/lib/hooks/use-debounce"; 

/**
 * 🛰️ COUPON_SEARCH (Hardened v16.16.34)
 * Strategy: Vertical Compression & Debounced URL Handshake.
 * Features: Staff-Aware (Amber) vs Merchant-Aware (Emerald) telemetry.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  const [isPending, startTransition] = useTransition();
  
  const { isReady, isMobile } = useDeviceContext();
  const { flavor } = useLayout();
  const isStaffTheme = flavor === "AMBER";
  
  // 🔐 1. IDENTITY & STATE HANDSHAKE
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // 🛡️ 2. URL SYNCHRONIZATION PROTOCOL
  useEffect(() => {
    if (!isReady) return;
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
      params.set("page", "1"); // Reset on new query
    } else {
      params.delete("query");
    }

    startTransition(() => {
      // replace prevents history pollution during active searching
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearch, router, searchParams, isReady]);

  const handleClear = () => {
    impact("medium");
    setSearchTerm("");
  };

  if (!isReady) return <div className="h-10 w-full max-w-md bg-white/[0.02] animate-pulse rounded-xl" />;

  return (
    <div className={cn(
      "relative w-full transition-all duration-700 group",
      isMobile ? "max-w-full" : "lg:max-w-xs xl:max-w-sm"
    )}>
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className={cn(
        "absolute inset-0 blur-[15px] opacity-0 group-focus-within:opacity-5 transition-opacity duration-1000 pointer-events-none",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- STATUS INGRESS NODE: Compressed --- */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn("size-3.5 animate-spin", isStaffTheme ? "text-amber-500" : "text-primary")} />
        ) : (
          <div className="flex items-center gap-2">
            {isStaffTheme ? (
              <Globe className="size-3.5 text-muted-foreground/20 group-focus-within:text-amber-500 transition-colors" />
            ) : (
              <Search className="size-3.5 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
            )}
            <div className="h-3 w-px bg-white/5 hidden md:block" />
          </div>
        )}
      </div>

      <Input
        value={searchTerm}
        onFocus={() => impact("light")}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isStaffTheme ? "GLOBAL_QUERY..." : "INDEX_SEARCH..."}
        className={cn(
          "w-full h-10 md:h-12 pl-10 md:pl-12 pr-10 bg-black/40 backdrop-blur-xl border transition-all",
          "rounded-xl md:rounded-2xl shadow-inner",
          /* 🛡️ FIX: text-[16px] prevents iOS Auto-Zoom */
          "text-[16px] md:text-[9px] font-black uppercase italic tracking-widest text-foreground",
          "placeholder:opacity-20",
          isStaffTheme 
            ? "border-amber-500/10 focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5" 
            : "border-white/5 focus:border-primary/20 focus:ring-4 focus:ring-primary/5",
          isPending && "opacity-40"
        )}
      />

      {/* --- ACTION TERMINAL --- */}
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="p-1 rounded-md bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-90"
          >
            <X className="size-3" />
          </button>
        )}
        <Terminal className={cn(
          "size-3 hidden sm:block opacity-20",
          isStaffTheme ? "text-amber-500" : "text-primary"
        )} />
      </div>

      {/* 🚀 KINETIC STATUS LABEL */}
      <div className="absolute -bottom-5 left-1 opacity-0 group-focus-within:opacity-40 transition-opacity pointer-events-none">
        <p className={cn(
          "text-[7px] font-black uppercase tracking-[0.3em] italic",
          isStaffTheme ? "text-amber-500" : "text-muted-foreground"
        )}>
          {isPending ? "Indexing_Platform_Nodes..." : isStaffTheme ? "Ready_For_Global_Vector" : "Node_Ready"}
        </p>
      </div>
    </div>
  );
}