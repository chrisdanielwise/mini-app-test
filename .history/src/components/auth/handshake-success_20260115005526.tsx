"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Lock, 
  Terminal,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 HANDSHAKE_SUCCESS (v16.16.12)
 * Logic: Cryptographic synchronization simulation with Haptic completion.
 * Design: v9.9.2 Hyper-Glass with Kinetic Progress Ingress.
 */
export function HandshakeSuccess({ 
  user, 
  onComplete 
}: { 
  user: any, 
  onComplete?: () => void 
}) {
  const [progress, setProgress] = useState(0);
  const { impact, notification } = useHaptics();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Fluid increments for "Water Flow" feel
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100 && !isFinished) {
      setIsFinished(true);
      notification("success");
      // Delay the callback to allow the user to see the "100%" state
      setTimeout(() => onComplete?.(), 800);
    }
  }, [progress, isFinished, notification, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-1000 ease-[var(--ease-institutional)]">
      
      {/* 🏛️ TERMINAL STATUS HEADER */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center size-24">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
          <div className="absolute inset-2 rounded-[2rem] border border-emerald-500/10 animate-spin-slow" />
          
          <ShieldCheck className="relative size-10 text-emerald-500 transition-transform duration-700 group-hover:scale-110" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">
            Identity <span className="text-emerald-500">Anchored.</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] italic">
            Handshake_Protocol_v16.1 // SECURE_LINK
          </p>
        </div>
      </div>

      {/* 📊 TELEMETRY DATA CARD */}
      <div className="rounded-[3rem] bg-card/40 border border-white/5 p-10 backdrop-blur-3xl shadow-apex relative overflow-hidden group">
        {/* Kinetic Background Element */}
        <Activity className="absolute -top-6 -right-6 size-32 opacity-[0.03] rotate-12 text-emerald-500 group-hover:rotate-0 transition-transform duration-1000" />
        
        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                <Cpu className="size-5 text-emerald-500/60" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-widest text-foreground">Node_Identity</span>
                <span className="text-[9px] font-medium text-muted-foreground/40 uppercase italic">Verification_Live</span>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-[10px]">
              {user?.role?.toUpperCase() || "MERCHANT_NODE"}
            </Badge>
          </div>

          {/* KINETIC PROGRESS SECTOR */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Synchronizing_Mesh</span>
              <span className="text-xl font-black italic text-emerald-500 tabular-nums">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_#10b981]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center space-y-1">
              <p className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-widest">Protocol</p>
              <p className="text-[10px] font-black text-emerald-500 uppercase italic">Encrypted</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center space-y-1">
              <p className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-widest">Gateway</p>
              <p className="text-[10px] font-black text-emerald-500 uppercase italic">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔐 CRYPTOGRAPHIC FOOTER */}
      <div className="flex items-center justify-center gap-6 py-6 opacity-20 italic grayscale">
        <Lock className="size-3.5" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">
          AES_256_GCM_NODE_SYNC
        </span>
        <Zap className="size-3.5" />
      </div>
    </div>
  );
}

// Internal Badge helper for v16 layout
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <span className={cn("px-3 py-1 rounded-lg font-black uppercase tracking-widest", className)}>
      {children}
    </span>
  );
}