"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ AUTH_CALLBACK (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon.
 * Fix: High-density status nodes and shrunken telemetry prevent viewport blowout.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"BROADCASTING" | "REDIRECTING">("BROADCASTING");
  
  const hasTriggered = useRef(false);
  const target = searchParams.get("target") || "/home";

  useEffect(() => {
    if (hasTriggered.current) return;

    // 1. 🛰️ INITIALIZE BROADCAST (Background Sync)
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.postMessage({
      action: "RELOAD_SESSION",
      target,
      timestamp: Date.now(),
      user: { role: "MERCHANT" }
    });

    // 2. ⚡ IMMEDIATE LOCAL EGRESS
    const performEgress = async () => {
      hasTriggered.current = true;
      
      // Clinical delay for cookie write-buffer flush
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStep("REDIRECTING");
      
      // Hard replace to bypass React state lag during node ingress
      window.location.replace(target);
    };

    performEgress();

    return () => authChannel.close();
  }, [target]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-foreground p-6 selection:bg-amber-500/20 overflow-hidden leading-none relative">
      
      {/* --- 🛡️ FIXED HUD: Status Node --- */}
      <div className="relative mb-8 z-10 flex flex-col items-center">
        {step === "BROADCASTING" ? (
          <div className="relative size-14 flex items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/10" />
            <Loader2 className="size-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="size-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-2xl">
            <CheckCircle2 className="size-8 text-emerald-500 animate-in zoom-in duration-500" />
          </div>
        )}
      </div>

      {/* --- TELEMETRY BLOCK: Institutional Scale --- */}
      <div className="space-y-3 text-center z-10">
        <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground">
          {step === "BROADCASTING" ? "Syncing_Node" : "Identity_Anchored"}
        </h1>
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 opacity-20 italic">
            <Activity className="size-3 animate-pulse text-primary" />
            <p className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              {step === "BROADCASTING" 
                ? "Bridging_Identity_Node" 
                : "Handshake_Verified"}
            </p>
          </div>
          <div className={cn(
            "h-[1.5px] w-8 transition-all duration-700",
            step === "BROADCASTING" ? "bg-amber-500/20" : "bg-emerald-500/40"
          )} />
        </div>
      </div>

      {/* --- FOOTER: Stationary HUD --- */}
      <footer className="absolute bottom-10 opacity-10 flex items-center gap-3">
         <ShieldCheck className="size-3" />
         <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">Zipha_Protocol // v16.31_APEX</p>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <CallbackContent />
    </Suspense>
  );
}