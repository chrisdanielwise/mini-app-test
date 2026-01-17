"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Globe, Activity } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useSignalStabilizer } from "@/lib/hooks/use-signal-stabilizer"; 
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ COUPON_SEARCH (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Standardized h-10 height and high-density ingress scaling.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  const [isPending, startTransition] = useTransition();
  
  const { isReady, isMobile } = useDeviceContext();
  const { flavor } = useLayout();
  const isStaffTheme = flavor === "AMBER";
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const stabilizedQuery = useSignalStabilizer(searchTerm, 400);

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

  if (!isReady) return <div className="h-10 w-full max-w-md bg-white/[0.02] animate-pulse rounded-lg" />;

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
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn("size-3 animate-spin", isStaffTheme ? "text-amber-500" : "text-primary")} />
        ) : (
          <div className="flex items-center gap-2">
            {isStaffTheme ? (
              <Globe className="size-3 text-muted-foreground/20 group-focus-within:text-amber-500 transition-colors" />
            ) : (
              <Search className="size-3 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
            )}
          </div>
        )}
      </div>

      <Input
        value={searchTerm}
        onFocus={() => impact("light")}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isStaffTheme ? "GLOBAL_QUERY..." : "INDEX_SEARCH..."}
        className={cn(
          "w-full h-10 pl-9 pr-10 bg-black/40 backdrop-blur-xl border transition-all",
          "rounded-xl",
          "text-[9px] font-black uppercase italic tracking-widest placeholder:opacity-10 text-foreground",
          isStaffTheme 
            ? "border-amber-500/10 focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5" 
            : "border-white/5 focus:border-primary/20 focus:ring-4 focus:ring-primary/5",
          isPending && "opacity-40"
        )}
      />

      {/* --- ACTION TERMINAL --- */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="p-1 rounded-md bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
          >
            <X className="size-2.5" />
          </button>
        )}
        <Activity className={cn(
          "size-2.5 transition-all",
          isStaffTheme ? "text-amber-500/10" : "text-primary/10",
          isPending && "animate-pulse opacity-100"
        )} />
      </div>

      {/* 🚀 KINETIC STATUS PULSE */}
      <div className="absolute -top-0.5 -right-0.5">
        <div className={cn(
          "size-1 rounded-full animate-pulse",
          isStaffTheme ? "bg-amber-500" : "bg-primary"
        )} />
      </div>
    </div>
  );
}