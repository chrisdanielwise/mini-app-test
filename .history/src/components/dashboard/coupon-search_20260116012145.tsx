"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
// 🚀 FIXED IMPORT: Synchronizing with established tactical hook
import { useSignalStabilizer } from "@/lib/hooks/use-signal-stabilizer"; 
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🔍 COUPON_SEARCH (Institutional Apex v2026.1.16)
 * Strategy: Build Error Resolution + Signal Stabilization.
 * Fix: Standardized 'useSignalStabilizer' for debounced query ingress.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  const isStaff = flavor === "AMBER";
  const [value, setValue] = useState(searchParams.get("query") || "");

  // 🛡️ SIGNAL STABILIZATION: Debounce logic to prevent server flooding
  const stabilizedQuery = useSignalStabilizer(value, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (stabilizedQuery) {
      params.set("query", stabilizedQuery);
    } else {
      params.delete("query");
    }
    params.set("page", "1"); // Reset to ingress origin
    router.push(`?${params.toString()}`);
  }, [stabilizedQuery, router, searchParams]);

  const clearSignal = () => {
    setValue("");
    impact("light");
  };

  return (
    <div className="relative group w-full transition-all duration-700">
      {/* 🌫️ SUBSURFACE RADIANCE */}
      <div className={cn(
        "absolute -inset-1 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-20 transition-opacity duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      <div className="relative">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors duration-500",
          isStaff 
            ? "text-amber-500/20 group-focus-within:text-amber-500" 
            : "text-primary/20 group-focus-within:text-primary"
        )} />
        
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => impact("light")}
          placeholder={isStaff ? "SEARCH_GLOBAL_MANIFEST..." : "FIND_COUPON_CODE..."}
          className={cn(
            "h-12 w-full pl-11 pr-11 rounded-xl bg-black/40 border text-[10px] font-black uppercase tracking-widest italic transition-all outline-none",
            isStaff 
              ? "border-amber-500/10 focus:border-amber-500/40 focus:ring-8 focus:ring-amber-500/5" 
              : "border-white/5 focus:border-primary/40 focus:ring-8 focus:ring-primary/5"
          )}
        />

        {value && (
          <button
            onClick={clearSignal}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity"
          >
            <X className="size-3.5" />
          </button>
        )}

        {/* 🚀 KINETIC STATUS PULSE */}
        <div className="absolute -right-1 -top-1">
          <Activity className={cn(
            "size-2 animate-pulse",
            isStaff ? "text-amber-500" : "text-primary"
          )} />
        </div>
      </div>
    </div>
  );
}