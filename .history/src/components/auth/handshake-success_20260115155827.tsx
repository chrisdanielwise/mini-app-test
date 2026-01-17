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

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 HANDSHAKE_SUCCESS (Institutional Apex v16.16.31)
 * Priority: Morphology-Aware Success Ingress.
 * Logic: Cryptographic synchronization with Device-State haptics.
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
  
  // 🛰️ DEVICE INGRESS
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 30); // Faster increment for "Steam-Flow" feel

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100 && !isFinished) {
      setIsFinished(true);
      notification("success");
      // Delayed handover for visual grounding
      setTimeout(() => onComplete?.(), 1200);
    }
  }, [progress, isFinished, notification, onComplete]);

  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Balancing visual density based on hardware tier.
   */
  const isXS = screenSize === 'xs';
  const containerWidth = isMobile ? "max-w-md" : "max-w-2xl";
  const padding = isXS ? "p-6" : "p-10";

  return (
    <div 
      className={cn(
        "w-full mx-auto space-y-8 md:space-y-12 animate-in fade-in zoom-in-95 duration-1000",
        containerWidth
      )}
      style={{ paddingTop: isXS ? `calc(${safeArea.top}px + 1rem)` : "0px" }}
    >
      
      {/* 🏛️ TERMINAL STATUS HEADER */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center size-20 md:size-28">
          <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
          <div className="absolute inset-2 rounded-[2rem] border border-emerald-500/10 animate-spin-slow" />
          <ShieldCheck className="relative size-8 md:size-12 text-emerald-500" />
        </div>
        
        <div className="space-y-2 px-4">
          <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-foreground leading-none">
            Identity <span className="text-emerald-500">Anchored.</span>
          </h1>
          <p className="text-[9px] md:text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] italic">
            Handshake_Protocol_v16.31 // SECURE_LINK
          </p>
        </div>
      </div>

      {/* 📊 TELEMETRY DATA CARD */}
      <div className={cn(
        "bg-card/40 border border-white/5 backdrop-blur-3xl shadow-apex relative overflow-hidden group transition-all duration-1000",
        "rounded-[2.5rem] md:rounded-[4rem]",
        padding
      )}>
        <Activity className="absolute -top-10 -right-10 size-48 opacity-[0.02] text-emerald-500 pointer-events-none" />
        
        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="size-10 md:size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <Cpu className="size-5 md:size-6 text-emerald-500/60" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-foreground leading-none">Node_Identity</span>
                <span className="text-[8px] md:text-[9px] font-medium text-muted-foreground/30 uppercase italic mt-1">Verification_Live</span>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] md:text-[10px]">
              {user?.role?.toUpperCase() || "MERCHANT_NODE"}
            </Badge>
          </div>

          {/* KINETIC PROGRESS SECTOR */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">Synchronizing_Mesh</span>
              <span className="text-xl md:text-2xl font-black italic text-emerald-500 tabular-nums">{progress}%</span>
            </div>
            <div className="h-2 md:h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_#10b981]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Device-Aware Stat Grid */}
          <div className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-3")}>
            <StatPill label="Protocol" value="Encrypted" />
            <StatPill label="Gateway" value="Verified" />
            {!isMobile && <StatPill label="Latency" value="2ms_OK" />}
          </div>
        </div>
      </div>

      {/* 🔐 CRYPTOGRAPHIC FOOTER */}
      {!isXS && (
        <div className="flex items-center justify-center gap-6 py-6 opacity-20 italic grayscale transition-all duration-1000">
          <Lock className="size-3.5" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em]">
            AES_256_GCM_NODE_SYNC
          </span>
          <Zap className="size-3.5" />
        </div>
      )}
    </div>
  );
}

/** 🛠️ HELPER: ATOMIC STAT PILL */
function StatPill({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center space-y-1">
      <p className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-widest">{label}</p>
      <p className="text-[10px] font-black text-emerald-500 uppercase italic truncate">{value}</p>
    </div>
  );
}

function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <span className={cn("px-3 py-1.5 rounded-xl font-black uppercase tracking-widest transition-all", className)}>
      {children}
    </span>
  );
}