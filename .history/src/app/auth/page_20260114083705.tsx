"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Institutional v14.62.0)
 * Logic: Cross-Tab Pulse (BroadcastChannel) & Auto-Destruct sequence.
 * Fix: Prevents "Orphaned Tabs" by closing itself after identity anchoring.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    // 1. 🛰️ BROADCAST PULSE
    // Signals Tab A (the original login page) that the session is now active.
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    authChannel.postMessage({ 
      action: "RELOAD_SESSION", 
      target, 
      timestamp: Date.now() 
    });

    // 2. 🧹 AUTO-DESTRUCT SEQUENCE
    // Attempt to close this tab immediately.
    try {
      window.close();
    } catch (e) {
      console.warn("🛰️ [Destruct_Block]: Browser prevented auto-close.");
    }

    // 3. 🛡️ FAIL-SAFE REDIRECT
    // If the browser blocks window.close() (standard for non-script-opened tabs),
    // we move to the target destination after a brief delay.
    const timer = setTimeout(() => {
      router.push(target);
    }, 1500);

    return () => {
      clearTimeout(timer);
      authChannel.close();
    };
  }, [target, router]);

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

      {/* Manual Override for restricted browsers */}
      <button 
        onClick={() => router.push(target)}
        className="mt-12 text-[9px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
      >
        [ Force_Handshake ]
      </button>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={null}>
      <CallbackContent />
    </Suspense>
  );
}