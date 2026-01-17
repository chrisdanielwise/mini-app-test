"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Terminal, 
  User, 
  Zap, 
  Hash, 
  ArrowRight,
  Globe,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID COMMAND PALETTE (Institutional v16.16.12)
 * Logic: Global Identity Resolution & Navigation Shortcut.
 * Trigger: [Cmd/Ctrl + K] | Design: v9.9.1 Hardened Glassmorphism.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  // 🛡️ KEYBOARD INTERCEPT
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        impact("medium");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [impact]);

  // 🧪 MOCK RESOLUTION LOGIC (Simulating 1M+ User DB Index)
  const results = useMemo(() => {
    if (query.length < 2) return [];
    return [
      { id: "1", type: "SUBSCRIBER", label: "ALEX_TRADER_99", sub: "ID_7482910" },
      { id: "2", type: "SERVICE", label: "GOLDEN_ALPHAS_SIGNAL", sub: "NODE_ACTIVE" },
      { id: "3", type: "TRANSACTION", label: "TX_HASH_8F2A...", sub: "$1,240.00" },
    ].filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      {/* 🌌 FOCUS-LOCK BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={() => { setOpen(false); impact("light"); }}
      />

      {/* 🚀 COMMAND CHASSIS */}
      <div className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border shadow-[0_0_50px_rgba(0,0,0,0.5)]",
        "bg-card/90 backdrop-blur-3xl transition-all duration-700 animate-in zoom-in-95 slide-in-from-top-4",
        isStaff ? "border-amber-500/20" : "border-white/10"
      )}>
        <div className="flex items-center px-8 h-20 border-b border-white/5 gap-4">
          <Search className={cn("size-5", isStaff ? "text-amber-500" : "text-primary")} />
          <input
            autoFocus
            placeholder="Search clusters, nodes, or identity hashes..."
            className="flex-1 bg-transparent border-none outline-none text-base font-black uppercase italic tracking-widest placeholder:opacity-20 text-foreground"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              selectionChange();
            }}
          />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-black opacity-40">ESC</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 scrollbar-hide">
          {query.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Terminal className="size-10 mx-auto opacity-10" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-20">Awaiting_Query_Parameters</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { impact("medium"); setOpen(false); }}
                  className="group flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/40">
                      {item.type === "SUBSCRIBER" && <User className="size-4" />}
                      {item.type === "SERVICE" && <Zap className="size-4" />}
                      {item.type === "TRANSACTION" && <Hash className="size-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase italic tracking-tighter text-foreground">{item.label}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{item.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-primary" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-20 italic">Zero_Results_Matched</p>
            </div>
          )}
        </div>

        {/* 🏛️ INSTITUTIONAL FOOTER */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Command className="size-3 opacity-20" />
              <span className="text-[9px] font-black uppercase opacity-20 tracking-widest">Global_Indexer</span>
            </div>
          </div>
          {isStaff && (
            <div className="flex items-center gap-2">
              <Globe className="size-3 text-amber-500/40" />
              <span className="text-[9px] font-black uppercase text-amber-500/40 tracking-widest italic">Oversight_Enabled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}