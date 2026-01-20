"use client";

import { useSearchParams } from "next/navigation";
import { ShieldAlert, Globe, Terminal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 🛰️ MAINTENANCE_GATE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 action hub and shrunken typography prevents blowout.
 */
export default function MaintenancePage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "NODE_OFFLINE: Scheduled maintenance protocol in progress.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative selection:bg-rose-500/20 text-foreground overflow-hidden leading-none">
      
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.02),transparent_70%)] pointer-events-none z-0" />

      <div className="w-full max-w-sm z-10 space-y-6 animate-in fade-in zoom-in duration-700">
        
        {/* --- 🛡️ FIXED HUD: Shield Node --- */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="size-14 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20 shadow-2xl relative">
            <ShieldAlert className="size-7 text-rose-500 animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 size-3 bg-rose-500 rounded-full border-2 border-background" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground">
              Maintenance <span className="text-rose-500/80">Node</span>
            </h1>
            <div className="flex items-center justify-center gap-2 opacity-20 italic">
              <Globe className="size-2.5" />
              <p className="text-[7px] font-black uppercase tracking-[0.3em]">Protocol // Offline</p>
            </div>
          </div>
        </div>

        {/* --- STATUS TERMINAL: Tactical Slim --- */}
        <div className="rounded-2xl bg-zinc-950/40 border border-white/5 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
          
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-rose-500/40 italic">
              <Terminal className="size-2.5" />
              <span className="text-[7.5px] font-black uppercase tracking-widest">Status_Log_v16</span>
            </div>

            <p className="text-[9px] font-black leading-relaxed text-muted-foreground/40 uppercase italic">
              "{message}"
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between leading-none">
              <div className="flex flex-col gap-1">
                <span className="text-[6.5px] font-black uppercase tracking-widest text-muted-foreground/20">Recovery_Estimate</span>
                <span className="text-[9px] font-black uppercase italic text-foreground/40">SYNC_PENDING</span>
              </div>
              
              <Button 
                onClick={() => window.location.reload()}
                className="h-11 px-6 rounded-xl bg-rose-500 text-white hover:bg-rose-600 font-black uppercase italic tracking-widest text-[9px] transition-all shadow-lg active:scale-95"
              >
                <RefreshCw className="size-3.5 mr-2 animate-spin-slow" />
                Retry
              </Button>
            </div>
          </div>
        </div>

        {/* --- FOOTER: Stationary HUD --- */}
        <p className="text-center text-[7px] font-black uppercase tracking-[0.5em] text-muted-foreground/10 italic">
          Authorized Egress // v16.31_APEX
        </p>
      </div>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}