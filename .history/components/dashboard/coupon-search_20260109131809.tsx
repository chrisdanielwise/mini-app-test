"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";

export function CouponSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.set("page", "1"); // Reset to page 1 on new search
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
      <Input
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="SEARCH PROTOCOL: ENTER CODE..."
        className="h-12 pl-11 pr-4 rounded-2xl border-border bg-card/50 backdrop-blur-xl font-black uppercase text-[10px] tracking-widest focus:ring-primary/20 transition-all"
      />
      {searchParams.get("query") && (
        <button 
          onClick={() => handleSearch("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}