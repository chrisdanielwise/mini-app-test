"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Search, Loader2, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // Ensure you have a debounce hook

/**
 * 🛰️ SEARCH PROTOCOL: COUPONS
 * Optimized for high-volume data sets. Uses debounced URL synchronization 
 * to trigger server-side filtering without UI lag.
 */
export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Local state for immediate input feedback
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync search term with URL after user stops typing
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
      params.set("page", "1"); // Reset to start of ledger on new search
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }, [debouncedSearch, router]);

  return (
    <div className="relative w-full max-w-md group">
      {/* Search Icon / Status Indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>

      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="FILTER PROTOCOL: ENTER CODE..."
        className="h-12 pl-11 pr-10 rounded-2xl border-border bg-card/50 backdrop-blur-xl font-black uppercase text-[10px] tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-50"
      />

      {/* Clear Action */}
      {searchTerm && (
        <button 
          onClick={() => setSearchTerm("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors opacity-50 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}