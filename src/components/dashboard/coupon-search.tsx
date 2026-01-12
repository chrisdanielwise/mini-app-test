"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Terminal, Globe } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce"; 
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ SEARCH PROTOCOL: COUPONS
 * Logic: Synchronized with Theme Flavors (Amber for Staff, Emerald for Merchants).
 * Optimized: Debounced URL synchronization for resilient server-side filtering.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";
  
  // Local state for instant tactile feedback
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync search term with URL after user stops typing
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
      params.set("page", "1"); // Reset to start of ledger on new query
    } else {
      params.delete("query");
    }

    startTransition(() => {
      // replace is safer than .push to avoid polluting history on every keystroke
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearch, router, searchParams]);

  return (
    <div className="relative w-full lg:max-w-md group animate-in fade-in slide-in-from-left-4 duration-700 px-1">
      {/* Search Icon / Status Indicator Node */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-3 z-10">
        {isPending ? (
          <Loader2 className={cn(
            "h-3.5 w-3.5 md:h-4 md:w-4 animate-spin",
            isStaff ? "text-amber-500" : "text-primary"
          )} />
        ) : (
          <div className="flex items-center gap-2">
            {isStaff ? (
              <Globe className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            ) : (
              <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            )}
            <div className="h-3 w-px bg-border/40 hidden md:block" />
          </div>
        )}
      </div>

      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isStaff ? "GLOBAL_SEARCH: PROMO CODE..." : "FILTER: ENTER PROMO CODE..."}
        className={cn(
          "h-12 md:h-14 pl-12 md:pl-14 pr-12 rounded-xl md:rounded-[1.25rem] border-border/40 bg-card/40 backdrop-blur-3xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.25em] transition-all duration-500",
          "placeholder:opacity-30 placeholder:italic shadow-inner",
          isStaff 
            ? "focus:ring-amber-500/20 focus:border-amber-500/40 focus:bg-amber-500/[0.02]" 
            : "focus:ring-primary/20 focus:border-primary/40 focus:bg-card/60",
          isPending && "opacity-70"
        )}
      />

      {/* Terminal Clear Action */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="p-1.5 rounded-lg bg-muted/50 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-50 hover:opacity-100 group/clear active:scale-90"
          >
            <X className="h-3 w-3 md:h-3.5 md:w-3.5 transition-transform" />
          </button>
        )}
        <Terminal className={cn(
          "h-3.5 w-3.5 hidden sm:block transition-colors",
          isStaff ? "text-amber-500/20" : "text-muted-foreground/20"
        )} />
      </div>

      {/* Dynamic Status Label */}
      <div className="absolute -bottom-5 md:-bottom-6 left-1 opacity-0 group-focus-within:opacity-40 transition-opacity pointer-events-none">
         <p className={cn(
           "text-[7px] font-black uppercase tracking-[0.3em] italic",
           isStaff ? "text-amber-500" : "text-muted-foreground"
         )}>
           {isPending ? "Indexing Platform Nodes..." : isStaff ? "Ready for Global Query" : "System Ready for Query"}
         </p>
      </div>
    </div>
  );
}