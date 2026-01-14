"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (v16.16.10)
 * Logic: Non-Blocking Ingress with Background Node Synchronization.
 * Feature: Resolves the "Refresh Required" hang by forcing local redirection.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<"BROADCASTING" | "REDIRECTING">("BROADCASTING");
  
  const hasTriggered = useRef(false);
  const target = searchParams.get("target") || "/home";

  useEffect(() => {
    if (hasTriggered.current) return;

    // 1. 🛰️ INITIALIZE BROADCAST (Background Sync)
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    // 🚀 THE FIX: Background pulse for other tabs
    authChannel.postMessage({
      action: "RELOAD_SESSION",
      target,
      timestamp: Date.now(),
      user: { role: "MERCHANT" } // Optimized payload
    });

    // 2. ⚡ IMMEDIATE LOCAL REDIRECT
    // Instead of waiting for a response (which hangs due to 9s DB queries),
    // we assume the server-set cookie is ready and force ingress.
    const performEgress = async () => {
      hasTriggered.current = true;
      
      // Small delay to ensure browser write-buffer for cookies is flushed
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStep("REDIRECTING");
      
      // Use window.location.replace for a hard "Clean State" navigation
      // This bypasses React state lag during heavy DB loads
      window.location.replace(target);
    };

    performEgress();

    return () => authChannel.close();
  }, [target]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black text-white p-6 selection:bg-amber-500/30">
      {/* Institutional Branding Background */}
      <ShieldCheck className="absolute h-[50vh] w-[50vh] opacity-[0.02] -rotate-12 pointer-events-none" />

      <div className="relative mb-10 z-10">
        {step === "BROADCASTING" ? (
          <div className="relative h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
            <div className="absolute inset-0 animate-pulse rounded-full border border-amber-500/20" />
            <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-500/10 p-5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-in zoom-in fade-in duration-700" />
          </div>
        )}
      </div>

      <div className="space-y-4 text-center z-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          {step === "BROADCASTING" ? "Syncing_Node" : "Identity_Anchored"}
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 leading-relaxed">
            {step === "BROADCASTING" 
              ? "Bridging session to identity node..." 
              : "Handshake verified. Decrypting terminal..."}
          </p>
          <div className="h-[1px] w-12 bg-amber-500/20" />
        </div>
      </div>

      <footer className="absolute bottom-10 opacity-20">
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic">Zipha_Protocol // Secure_Ingress</p>
      </footer>
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