"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Terminal } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; 
import { cn } from "@/lib/utils";

/**
 * 🛰️ SEARCH PROTOCOL: COUPONS
 * Optimized for high-volume merchant data. Uses debounced URL synchronization 
 * to trigger server-side filtering with zero UI latency.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Local state for instant tactile feedback
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync search term with URL after user stops typing
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
      params.set("page", "1"); // Reset to start of ledger on new search query
    } else {
      params.delete("query");
    }

    startTransition(() => {
      // replace is safer than .push to avoid polluting history on every keystroke
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearch, router, searchParams]);

  return (
    <div className="relative w-full max-w-lg group animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Search Icon / Status Indicator Node */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <div className="h-3 w-px bg-border/40 hidden md:block" />
          </div>
        )}
      </div>

      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="FILTER LEDGER: ENTER PROMO CODE..."
        className={cn(
          "h-14 pl-14 pr-12 rounded-[1.25rem] border-border/40 bg-card/40 backdrop-blur-2xl font-black uppercase text-[10px] tracking-[0.25em] transition-all duration-500",
          "placeholder:opacity-30 placeholder:italic focus:ring-primary/20 focus:border-primary/40 focus:bg-card/60 shadow-inner",
          isPending && "opacity-70"
        )}
      />

      {/* Terminal Clear Action */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="p-1.5 rounded-lg bg-muted/50 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-50 hover:opacity-100 group/clear"
          >
            <X className="h-3.5 w-3.5 group-active/clear:scale-75 transition-transform" />
          </button>
        )}
        <Terminal className="h-3.5 w-3.5 text-muted-foreground/20 hidden sm:block" />
      </div>

      {/* Dynamic Status Label (Visible only on focus) */}
      <div className="absolute -bottom-6 left-1 opacity-0 group-focus-within:opacity-40 transition-opacity">
         <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">
           {isPending ? "Updating Node Indices..." : "System Ready for Filter Query"}
         </p>
      </div>
    </div>
  );
}