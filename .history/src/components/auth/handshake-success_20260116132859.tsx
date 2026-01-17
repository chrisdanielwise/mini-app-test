"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Lock, 
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ HANDSHAKE_SUCCESS (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Success Ingress.
 * Fix: Standardized h-1.5 bars and shrunken header volume prevents blowout.
 */
export function HandshakeSuccess({ user, onComplete }: any) {
  const [progress, setProgress] = useState(0);
  const { impact, notification } = useHaptics();
  const [isFinished, setIsFinished] = useState(false);
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 4)); // Accelerated Ingress
    }, 25);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100 && !isFinished) {
      setIsFinished(true);
      notification("success");
      setTimeout(() => onComplete?.(), 1000);
    }
  }, [progress, isFinished, notification, onComplete]);

  if (!isReady) return null;

  return (
    <div 
      className={cn(
        "w-full mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-700",
        isMobile ? "max-w-sm" : "max-w-lg"
      )}
      style={{ paddingTop: screenSize === 'xs' ? `calc(${safeArea.top}px + 0.5rem)` : "0px" }}
    >
      
      {/* --- 🛡️ FIXED HUD: Success Header --- */}
      <div className="text-center space-y-3">
        <div className="relative inline-flex items-center justify-center size-16 md:size-20">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
          <ShieldCheck className="relative size-7 md:size-9 text-emerald-500" />
        </div>
        
        <div className="space-y-1 leading-none">
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Identity <span className="text-emerald-500">Anchored</span>
          </h1>
          <p className="text-[7.5px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] italic">
            Handshake_v16.31 // NODE_SECURE
          </p>
        </div>
      </div>

      {/* --- 🚀 TELEMETRY DATA: Tactical Slim --- */}
      <div className={cn(
        "bg-zinc-950/40 border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden",
        "rounded-2xl md:rounded-3xl p-5 md:p-6"
      )}>
        <Activity className="absolute -top-10 -right-10 size-32 opacity-[0.02] text-emerald-500" />
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 leading-none">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                <Cpu className="size-4 text-emerald-500/60" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground">Node_Auth</span>
                <span className="text-[6.5px] text-muted-foreground/30 uppercase italic">Verification_Live</span>
              </div>
            </div>
            <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[7px] font-black tracking-widest">
              {user?.role?.toUpperCase() || "MERCHANT_NODE"}
            </div>
          </div>

          {/* PROGRESS SECTOR: Compressed h-1.5 */}
          <div className="space-y-3">
            <div className="flex justify-between items-end leading-none">
              <span className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-20 italic">Mesh_Sync</span>
              <span className="text-sm font-black italic text-emerald-500 tabular-nums">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-emerald-500 transition-all duration-200 ease-out shadow-[0_0_15px_#10b981]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Grid Layout: Compact 3-tier */}
          <div className="grid grid-cols-3 gap-2">
            <StatPill label="State" value="Encrypted" />
            <StatPill label="Link" value="Verified" />
            <StatPill label="Pulse" value="2ms_OK" />
          </div>
        </div>
      </div>

      {/* --- 🔐 CRYPTO FOOTER: Minimalist --- */}
      <div className="flex items-center justify-center gap-4 opacity-10 italic pt-2">
        <Lock className="size-3" />
        <span className="text-[7px] font-black uppercase tracking-[0.4em]">
          AES_256_GCM_PROTOCOL
        </span>
        <Zap className="size-3" />
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string, value: string }) {
  return (
    <div className="py-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-center leading-none">
      <p className="text-[6px] font-black uppercase text-muted-foreground/10 tracking-[0.1em] mb-1">{label}</p>
      <p className="text-[8px] font-black text-emerald-500 uppercase italic truncate">{value}</p>
    </div>
  );
}