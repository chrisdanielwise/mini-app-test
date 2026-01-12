"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, Loader2, Terminal, X, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ SUBSCRIBER SEARCH PROTOCOL
 * Logic: Synchronized with Universal Identity & Theme Flavors.
 * Adaptive: UI shifts to Amber for Staff (Global Oversight) or Emerald for Merchant.
 */
export function SubscriberSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");
  
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
      params.set("page", "1"); // Reset index on new query
    } else {
      params.delete("query");
    }

    startTransition(() => {
      // replace is used to maintain a clean history stack during active filtering
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 400);

  return (
    <div className="relative w-full lg:max-w-md group animate-in fade-in slide-in-from-left-4 duration-700 px-1">
      {/* Search Icon / Status Indicator Node */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-3 z-10">
        {isPending ? (
          <Loader2 className={cn(
            "h-3.5 w-3.5 md:h-4 md:w-4 animate-spin",
            isStaffFlavor ? "text-amber-500" : "text-primary"
          )} />
        ) : (
          <div className="flex items-center gap-2">
            {isStaffFlavor ? (
              <Globe className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            ) : (
              <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            )}
            <div className="hidden md:block h-3 w-px bg-border/40" />
          </div>
        )}
      </div>

      <Input
        placeholder={isStaffFlavor ? "GLOBAL IDENTITY SEARCH..." : "IDENTITY SEARCH..."}
        value={searchTerm}
        onChange={(e) => {
          hapticFeedback("light");
          const val = e.target.value.toUpperCase();
          setSearchTerm(val);
          handleSearch(val);
        }}
        className={cn(
          "h-12 md:h-14 pl-12 md:pl-14 pr-12 rounded-xl md:rounded-2xl border-border/40 bg-card/40 backdrop-blur-3xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.25em] transition-all duration-500",
          "placeholder:opacity-30 placeholder:italic shadow-inner text-foreground",
          isStaffFlavor 
            ? "focus:ring-amber-500/20 focus:border-amber-500/40 focus:bg-amber-500/[0.02]" 
            : "focus:ring-primary/20 focus:border-primary/40 focus:bg-card/60",
          isPending && "opacity-70"
        )}
      />

      {/* Terminal Clear Action */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
        {searchTerm && (
          <button 
            onClick={() => {
              hapticFeedback("medium");
              setSearchTerm("");
              handleSearch("");
            }}
            className="p-1.5 rounded-lg bg-muted/50 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-50 hover:opacity-100 group/clear active:scale-90"
          >
            <X className="h-3 w-3 md:h-3.5 md:w-3.5 transition-transform" />
          </button>
        )}
        <Terminal className={cn(
          "h-3.5 w-3.5 hidden sm:block transition-colors",
          isStaffFlavor ? "text-amber-500/20" : "text-muted-foreground/20"
        )} />
      </div>

      {/* Dynamic Status Label */}
      <div className="absolute -bottom-5 md:-bottom-6 left-1 opacity-0 group-focus-within:opacity-40 transition-opacity pointer-events-none">
         <p className={cn(
           "text-[7px] font-black uppercase tracking-[0.3em] italic",
           isStaffFlavor ? "text-amber-500" : "text-muted-foreground"
         )}>
           {isPending ? "Indexing Subscriber Nodes..." : isStaffFlavor ? "Global Protocol Ready" : "Search Protocol Ready"}
         </p>
      </div>
    </div>
  );
}