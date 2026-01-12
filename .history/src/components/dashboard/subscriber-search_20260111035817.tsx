"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";

export function SubscriberSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 400);

  return (
    <div className="relative w-full lg:w-80 group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        )}
      </div>
      <Input
        placeholder="IDENTITY SEARCH..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        className="pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-card/40 border-border/40 text-xs font-black uppercase tracking-widest placeholder:opacity-20 shadow-inner"
      />
    </div>
  );
}