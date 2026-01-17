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
 * 🛰️ COMMAND_PALETTE (Institutional Apex v2026.1.15)
 * Strategy: High-density, low-profile tactical index.
 * Logic: morphology-aware safe-area clamping with Hardware-Haptic sync.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Recalibrated for Tactical Depth
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  // 🛡️ PROTOCOL TRIGGER: Keyboard Intercept
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

  // 🧪 INDEX RESOLUTION: Institutional Node Mocking
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
      isMobile ? "p-0" : "pt-[15vh]"
    )}>
      {/* 🌌 FOCUS-LOCK BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-500" 
        onClick={() => { setOpen(false); impact("light"); }}
      />

      {/* 🚀 COMMAND CHASSIS: Obsidian-OLED Membrane */}
      <div 
        className={cn(
          "relative overflow-hidden border shadow-2xl transition-all duration-700",
          "bg-zinc-950/90 backdrop-blur-3xl animate-in zoom-in-95 slide-in-from-top-4 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isStaffTheme ? "border-amber-500/20" : "border-white/5",
          isMobile ? "w-full h-full rounded-none" : "w-full max-w-xl rounded-3xl"
        )}
        style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
      >
        {/* Subsurface Vapour Radiance */}
        <div className={cn(
          "absolute -top-32 -right-32 size-64 blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000",
          isStaffTheme ? "bg-amber-500" : "bg-primary"
        )} />

        {/* --- SEARCH INGRESS: Reduced to Tactical 64px --- */}
        <div className="flex items-center px-6 h-16 border-b border-white/5 gap-4 relative z-10">
          <Search className={cn("size-4 opacity-40", isStaffTheme ? "text-amber-500" : "text-primary")} />
          <input
            autoFocus
            placeholder="CMD_QUERY..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] font-black uppercase italic tracking-widest placeholder:opacity-10 text-foreground"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              selectionChange();
            }}
          />
          {isMobile ? (
            <button onClick={() => setOpen(false)} className="p-2 opacity-20"><X className="size-5" /></button>
          ) : (
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10">
              <span className="text-[8px] font-black opacity-30">ESC</span>
            </div>
          )}
        </div>

        {/* --- RESULT STREAM --- */}
        <div className={cn(
          "overflow-y-auto custom-scrollbar relative z-10 scrollbar-hide",
          isMobile ? "h-[calc(100vh-140px)]" : "max-h-[380px]"
        )}>
          {query.length === 0 ? (
            <div className="py-20 text-center space-y-4 opacity-20">
              <Terminal className="size-8 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting_Node_Input</p>
                <p className="text-[7px] font-mono tracking-widest uppercase">v16.31_Institutional_Indexer</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2 space-y-1">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { impact("medium"); setOpen(false); }}
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
                      {item.type === "SUBSCRIBER" && <User className="size-4 opacity-40" />}
                      {item.type === "SERVICE" && <Zap className="size-4 opacity-40" />}
                      {item.type === "TRANSACTION" && <Hash className="size-4 opacity-40" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-[13px] font-black uppercase italic tracking-tight text-foreground/80 leading-none">{item.label}</p>
                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/5 text-primary/60 tracking-widest">{item.status}</span>
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 leading-none">{item.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-primary" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 italic">Zero_Node_Sync</p>
            </div>
          )}
        </div>

        {/* --- TACTICAL FOOTER --- */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between px-6 relative z-10">
          <div className="flex items-center gap-4 opacity-20 italic">
            <Cpu className="size-3" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Mesh_Indexer_Active</span>
          </div>
          {isStaffTheme && (
            <div className="flex items-center gap-3 opacity-30 italic">
              <Globe className="size-3 text-amber-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase text-amber-500 tracking-[0.3em]">Universal_Oversight</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}