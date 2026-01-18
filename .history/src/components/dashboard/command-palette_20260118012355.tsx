"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { 
  Search, Terminal, User, Zap, Hash, ArrowRight,
  Globe, Command, Activity, Cpu, X
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ COMMAND_PALETTE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Kinetic Search.
 * Standard: Next.js 15 Client Component.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  // 🏁 PROTOCOL: Hardware Keybind Handshake (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
        impact("medium");
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [impact]);

  // 🕵️ SEARCH_INDEX: Mock Data for Prototype (Replace with MeshSearchService)
  const results = useMemo(() => {
    if (query.length < 2) return [];
    return [
      { id: "1", type: "SUBSCRIBER", label: "ALEX_TRADER_99", sub: "ID_7482910", status: "LIVE" },
      { id: "2", type: "SERVICE", label: "GOLDEN_ALPHAS", sub: "NODE_ACTIVE", status: "STABLE" },
      { id: "3", type: "TRANSACTION", label: "TX_HASH_8F2A", sub: "$1,240.00", status: "SYNCED" },
    ].filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  if (!open || !isReady) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[300] flex items-start justify-center p-4",
      isMobile ? "p-0" : "pt-[12vh]"
    )}>
      {/* 🌫️ BACKDROP: Vapour Shield */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={() => { setOpen(false); impact("light"); }}
      />

      

      <div 
        className={cn(
          "relative overflow-hidden border shadow-2xl transition-all duration-500",
          "bg-zinc-950/95 backdrop-blur-3xl animate-in zoom-in-95 slide-in-from-top-2",
          isStaffTheme ? "border-amber-500/20 shadow-amber-500/5" : "border-white/5",
          isMobile ? "w-full h-full rounded-none" : "w-full max-w-lg rounded-2xl"
        )}
      >
        {/* 🚀 MOBILE_CLOSE_PROTOCOL: Hardware-Safe Trigger */}
        {isMobile && (
          <button 
            onClick={() => { setOpen(false); impact("light"); }}
            className="absolute right-4 top-4 z-50 p-2 opacity-30 active:opacity-100"
            style={{ marginTop: `${safeArea.top}px` }}
          >
            <X className="size-4" />
          </button>
        )}

        {/* --- SEARCH INGRESS: Tactical h-12 --- */}
        <div 
          className="flex items-center px-4 h-12 border-b border-white/5 gap-3 relative z-10"
          style={{ marginTop: isMobile ? `${safeArea.top}px` : "0px" }}
        >
          <Search className={cn("size-3.5 opacity-30", isStaffTheme ? "text-amber-500" : "text-primary")} />
          <input
            autoFocus
            placeholder="INDEX_SEARCH..."
            className="flex-1 bg-transparent border-none outline-none text-[11px] font-black uppercase italic tracking-widest placeholder:opacity-10 text-foreground"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              selectionChange();
            }}
          />
          {!isMobile && (
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
              <span className="text-[7px] font-black opacity-20">ESC</span>
            </div>
          )}
        </div>

        {/* --- RESULT STREAM: Kinetic High-Density Row Mapping --- */}
        <div className={cn(
          "overflow-y-auto custom-scrollbar relative z-10 scrollbar-hide",
          isMobile ? "h-[calc(100vh-140px)]" : "max-h-[320px]"
        )}>
          {query.length === 0 ? (
            <div className="py-12 text-center space-y-3 opacity-10">
              <Terminal className="size-6 mx-auto animate-pulse" />
              <p className="text-[8px] font-black uppercase tracking-[0.3em]">Awaiting_Identity</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-1.5 space-y-0.5">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { impact("medium"); setOpen(false); }}
                  className="group flex items-center justify-between py-2.5 px-4 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/5 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                      {item.type === "SUBSCRIBER" && <User className="size-3.5 opacity-30" />}
                      {item.type === "SERVICE" && <Zap className="size-3.5 opacity-30" />}
                      {item.type === "TRANSACTION" && <Hash className="size-3.5 opacity-30" />}
                    </div>
                    <div className="leading-none">
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-black uppercase italic tracking-tight text-foreground/70">{item.label}</p>
                        <span className="text-[6px] font-black px-1 py-0.5 rounded bg-white/5 text-primary/40 tracking-widest">{item.status}</span>
                      </div>
                      <p className="text-[7px] font-black uppercase tracking-[0.1em] text-muted-foreground/20 mt-1">{item.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-10 italic">Zero_Node_Sync</p>
            </div>
          )}
        </div>

        {/* --- TACTICAL FOOTER: Mesh Telemetry --- */}
        <div className="p-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between px-5 relative z-10">
          <div className="flex items-center gap-3 opacity-10 italic">
            <Cpu className="size-2.5" />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">Mesh_Indexer</span>
          </div>
          {isStaffTheme && (
            <div className="flex items-center gap-2 opacity-20 italic">
              <Globe className="size-2.5 text-amber-500 animate-pulse" />
              <span className="text-[7px] font-black uppercase text-amber-500 tracking-[0.2em]">Oversight_Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}