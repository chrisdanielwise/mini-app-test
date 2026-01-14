"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Institutional v14.72.0)
 * Logic: Cross-Tab Pulse (BroadcastChannel) & Auto-Destruct sequence.
 * Fix: Synchronizes Tab A and Tab B, then closes Tab B to prevent duplication.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 🚀 Safe Target Extraction
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    // 1. 🛰️ BROADCAST PULSE
    // Signals Tab A (the original login page) that the session is now active.
    // Ensure the channel name "zipha_auth_sync" matches your Master Script.
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    
    authChannel.postMessage({ 
      action: "RELOAD_SESSION", 
      target, 
      timestamp: Date.now() 
    });

    console.log("🛰️ [Handshake]: Signal sent to primary terminal.");

    // 2. 🧹 AUTO-DESTRUCT SEQUENCE
    // We attempt to close the tab. Browsers usually allow this if the tab
    // was opened by a script (like clicking a link from the Telegram app).
    try {
      window.close();
    } catch (e) {
      console.warn("🛰️ [Destruct_Block]: Browser security policy prevented auto-close.");
    }

    // 3. 🛡️ FAIL-SAFE REDIRECT
    // In case window.close() fails or the user is on a restrictive mobile browser,
    // we manually move the current tab to the target destination.
    const timer = setTimeout(() => {
      router.push(target);
    }, 1200);

    return () => {
      clearTimeout(timer);
      authChannel.close();
    };
  }, [target, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-primary/30">
      <div className="relative mb-8">
        {/* Visual Handshake Indicator */}
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

      {/* Manual Override: If the auto-close and timer both fail */}
      <button 
        onClick={() => router.push(target)}
        className="mt-12 text-[9px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors cursor-pointer"
      >
        [ Force_Handshake ]
      </button>
    </div>
  );
}

/**
 * 🛰️ WRAPPER: Required for Next.js 16 SearchParams hydration.
 */
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