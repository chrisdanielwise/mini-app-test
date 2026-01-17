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
  Command,
  Activity,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 COMMAND_PALETTE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass Depth.
 * Logic: morphology-aware viewport clamping with hardware-haptic ticks.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  // 🛡️ KEYBOARD INTERCEPT: Protocol Trigger
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

  // 🧪 INDEX RESOLUTION: Simulating high-speed node indexing
  const results = useMemo(() => {
    if (query.length < 2) return [];
    return [
      { id: "1", type: "SUBSCRIBER", label: "ALEX_TRADER_99", sub: "ID_7482910", status: "ONLINE" },
      { id: "2", type: "SERVICE", label: "GOLDEN_ALPHAS_SIGNAL", sub: "NODE_ACTIVE", status: "STABLE" },
      { id: "3", type: "TRANSACTION", label: "TX_HASH_8F2A...", sub: "$1,240.00", status: "VERIFIED" },
    ].filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  if (!open || !isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: Switching layout geometry based on hardware tier.
   */
  const isXS = screenSize === 'xs';
  const chassisWidth = isMobile ? "w-full h-full pt-0" : "w-full max-w-2xl mt-[15vh]";
  const chassisRadius = isMobile ? "rounded-none" : "rounded-[3rem]";

  return (
    <div className={cn(
      "fixed inset-0 z-[300] flex items-start justify-center px-0 md:px-4",
      isMobile ? "" : "pt-0"
    )}>
      {/* 🌌 FOCUS-LOCK BACKDROP */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-700" 
        onClick={() => { setOpen(false); impact("light"); }}
      />

      {/* 🚀 COMMAND CHASSIS: Vapour-Glass Construction */}
      <div 
        className={cn(
          "relative overflow-hidden border shadow-apex transition-all duration-1000",
          "bg-card/90 backdrop-blur-3xl animate-in zoom-in-95 slide-in-from-top-8 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isStaff ? "border-amber-500/20" : "border-white/10",
          chassisWidth,
          chassisRadius
        )}
        style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
      >
        {/* Subsurface Radiance */}
        <div className={cn(
          "absolute -top-24 -right-24 size-64 blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />

        {/* --- SEARCH INGRESS --- */}
        <div className="flex items-center px-8 h-24 border-b border-white/5 gap-6 relative z-10">
          <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
             <Search className={cn("size-5", isStaff ? "text-amber-500" : "text-primary")} />
          </div>
          <input
            autoFocus
            placeholder="Search nodes, clusters, or hashes..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-black uppercase italic tracking-tighter placeholder:opacity-10 text-foreground"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              selectionChange();
            }}
          />
          {!isMobile && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-black opacity-30 tracking-widest">ESC</span>
            </div>
          )}
          {isMobile && (
            <button onClick={() => setOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-primary italic">Close</button>
          )}
        </div>

        {/* --- RESULT STREAM --- */}
        <div className={cn(
          "overflow-y-auto custom-scrollbar relative z-10",
          isMobile ? "h-[calc(100vh-160px)]" : "max-h-[450px]"
        )}>
          {query.length === 0 ? (
            <div className="p-20 text-center space-y-6">
              <div className="relative inline-flex">
                <Terminal className="size-12 mx-auto opacity-10 animate-pulse" />
                <Activity className="absolute -top-2 -right-2 size-4 text-primary/20" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-20 leading-none">Awaiting_Query</p>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-10">Institutional_Global_Indexer_v16.31</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-2">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { impact("medium"); setOpen(false); }}
                  className="group flex items-center justify-between p-6 rounded-[1.8rem] hover:bg-white/[0.03] border border-transparent hover:border-white/5 cursor-pointer transition-all duration-500"
                >
                  <div className="flex items-center gap-6">
                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-700">
                      {item.type === "SUBSCRIBER" && <User className="size-5" />}
                      {item.type === "SERVICE" && <Zap className="size-5" />}
                      {item.type === "TRANSACTION" && <Hash className="size-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-base md:text-lg font-black uppercase italic tracking-tighter text-foreground leading-none">{item.label}</p>
                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/5 text-primary/40 tracking-widest">{item.status}</span>
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 mt-2">{item.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-5 opacity-0 group-hover:opacity-100 -translate-x-6 group-hover:translate-x-0 transition-all duration-700 text-primary" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-20 italic">Zero_Index_Matches</p>
            </div>
          )}
        </div>

        {/* --- INSTITUTIONAL FOOTER --- */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between px-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 opacity-20">
              <Cpu className="size-3.5" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node_Search_Active</span>
            </div>
          </div>
          {isStaff && (
            <div className="flex items-center gap-3">
              <Globe className="size-3.5 text-amber-500/40 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-amber-500/40 tracking-[0.4em] italic leading-none">Universal_Oversight</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}