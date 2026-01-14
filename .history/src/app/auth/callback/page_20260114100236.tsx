"use client";

import { useEffect, Suspense, useRef } from "react"; // 🛡️ Added useRef
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Institutional v15.1.0)
 * Architecture: Tiered Handshake with Sync-Lock Guard.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 🛡️ SYNC-LOCK: Prevents re-triggering the handshake signal in high-latency environments
  const hasSignaled = useRef(false);
  
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    // 1. 🛡️ CHECK SYNC-LOCK
    if (hasSignaled.current) return;
    hasSignaled.current = true;

    // 2. 🛰️ BROADCAST PULSE
    // Ensures Tab A (Landing/Login) captures the session refresh instantly.
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    
    authChannel.postMessage({ 
      action: "RELOAD_SESSION", 
      target, 
      timestamp: Date.now() 
    });

    console.log("🛰️ [Handshake]: Node signal broadcasted.");

    // 3. 🧹 AUTO-DESTRUCT SEQUENCE
    // Attempt to close the tab to prevent "Ghost Tab" clutter.
    try {
      window.close();
    } catch (e) {
      console.warn("🛰️ [Destruct_Block]: Manual close required.");
    }

    // 4. 🛡️ FAIL-SAFE REDIRECT
    // If window.close() fails, redirect the user after a visual confirmation delay.
    const timer = setTimeout(() => {
      window.location.href = target; // Hard redirect to force middleware sync
    }, 1500);

    return () => {
      clearTimeout(timer);
      authChannel.close(); // Clean up listener
    };
  }, [target]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-primary/30">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative rounded-full border border-primary/20 bg-card p-4 shadow-2xl backdrop-blur-xl">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-xl font-black italic uppercase tracking-tighter">
          Identity_Anchored
        </h1>
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
          <Loader2 className="h-3 w-3 animate-spin" />
          Synchronizing Nodes
        </div>
      </div>

      <button 
        onClick={() => window.location.href = target}
        className="mt-12 text-[9px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors cursor-pointer"
      >
        [ Force_Handshake ]
      </button>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-6 w-6 animate-spin text-primary/20" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}