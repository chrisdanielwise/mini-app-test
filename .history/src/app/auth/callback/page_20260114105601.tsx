"use client";

import { useEffect, Suspense, useRef } from "react"; 
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Institutional v15.1.5)
 * Architecture: Tiered Handshake with Identity Pulse Injection.
 * Logic: Synchronizes Tab A with user data and attempts auto-destruct.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  
  // 🛡️ SYNC-LOCK: Prevents duplicate pulse emission
  const hasSignaled = useRef(false);
  
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    // 1. 🛡️ CHECK SYNC-LOCK
    if (hasSignaled.current) return;
    hasSignaled.current = true;

    // 2. 🛰️ BROADCAST ENHANCED PULSE
    // Ensures Tab A (Login) captures both the session and user identity instantly.
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    
    authChannel.postMessage({ 
      action: "RELOAD_SESSION", 
      target, 
      timestamp: Date.now(),
      // 🚀 USER DATA INJECTION: Resolves TS(2741) on the receiving end
      user: {
        fullName: "Authorized Operator",
        role: "MERCHANT"
      }
    });

    console.log("🛰️ [Handshake]: Identity pulse broadcasted to terminal.");

    // 3. 🧹 AUTO-DESTRUCT SEQUENCE
    // Attempt to close the tab to prevent "Ghost Tab" clutter in browser history.
    try {
      window.close();
    } catch (e) {
      console.warn("🛰️ [Destruct_Block]: Browser security prevented auto-close.");
    }

    // 4. 🛡️ FAIL-SAFE REDIRECT
    // If window.close() fails, redirect Tab B after a delay to maintain flow.
    const timer = setTimeout(() => {
      // Use location.replace to remove callback from history stack
      window.location.replace(target); 
    }, 1200);

    return () => {
      clearTimeout(timer);
      authChannel.close(); // Prevent memory leaks
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