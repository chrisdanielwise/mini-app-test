"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Terminal, Globe } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-signal-stabilizer"; 
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID SEARCH PROTOCOL (Institutional v16.16.12)
 * Logic: Debounced URL synchronization with flavor-aware ingress.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  const [isPending, startTransition] = useTransition();
  
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
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
  }, [debouncedSearch, router, searchParams]);

  const handleClear = () => {
    impact("medium"); // 🏁 TACTILE SYNC: Feel the reset
    setSearchTerm("");
  };

  return (
    <div className="relative w-full lg:max-w-md group animate-in fade-in slide-in-from-left-6 duration-1000">
      {/* 🌊 AMBIENT RADIANCE: Subsurface Focus Glow */}
      <div className={cn(
        "absolute inset-0 blur-[20px] opacity-0 group-focus-within:opacity-10 transition-opacity duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* Search Icon / Status Indicator Node */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10 pointer-events-none">
        {isPending ? (
          <Loader2 className={cn(
            "size-4 animate-spin",
            isStaff ? "text-amber-500" : "text-primary"
          )} />
        ) : (
          <div className="flex items-center gap-4">
            {isStaff ? (
              <Globe className="size-4 text-muted-foreground/40 group-focus-within:text-amber-500 transition-colors duration-500" />
            ) : (
              <Search className="size-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-500" />
            )}
            <div className="h-4 w-px bg-white/5 hidden md:block" />
          </div>
        )}
      </div>

      <Input
        value={searchTerm}
        onFocus={() => impact("light")}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isStaff ? "GLOBAL_SEARCH: PROMO_CODE..." : "FILTER: ENTER_PROMO_CODE..."}
        className={cn(
          "h-14 md:h-16 pl-14 md:pl-16 pr-14 rounded-2xl md:rounded-[1.5rem] border-white/5 bg-card/30 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "text-[10px] font-black uppercase italic tracking-[0.25em] placeholder:opacity-20 shadow-2xl",
          isStaff 
            ? "focus:border-amber-500/30 focus:bg-amber-500/[0.03]" 
            : "focus:border-primary/30 focus:bg-primary/[0.03]",
          isPending && "opacity-50"
        )}
      />

      {/* Terminal Clear Action */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="p-2 rounded-xl bg-white/5 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90"
          >
            <X className="size-4" />
          </button>
        )}
        <Terminal className={cn(
          "size-4 hidden sm:block transition-colors",
          isStaff ? "text-amber-500/10" : "text-white/5"
        )} />
      </div>

      {/* 🏛️ INSTITUTIONAL STATUS LABEL */}
      <div className="absolute -bottom-7 left-2 opacity-0 group-focus-within:opacity-30 transition-all duration-1000 translate-y-2 group-focus-within:translate-y-0 pointer-events-none">
         <p className={cn(
           "text-[8px] font-black uppercase tracking-[0.4em] italic",
           isStaff ? "text-amber-500" : "text-foreground"
         )}>
           {isPending ? "Indexing_Platform_Nodes..." : isStaff ? "Ready_for_Global_Query" : "System_Ready_for_Input"}
         </p>
      </div>
    </div>
  );
}