"use client";

import { useEffect, Suspense, useRef, useState } from "react"; 
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Standard v15.2.0)
 * Logic: Extends the handshake lifecycle to ensure broadcast delivery and history cleanup.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const [isSyncing, setIsSyncing] = useState(true);
  const hasSignaled = useRef(false);
  
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    if (hasSignaled.current) return;
    hasSignaled.current = true;

    // 1. 🛰️ BROADCAST PULSE
    // Initializing the channel to signal Tab A (Login Page)
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    
    authChannel.postMessage({ 
      action: "RELOAD_SESSION", 
      target, 
      timestamp: Date.now(),
      user: { fullName: "Authorized Operator", role: "MERCHANT" }
    });

    console.log("🛰️ [Handshake]: Node signal broadcasted.");

    /**
     * 🚀 THE FIX: EXTENDED HANDSHAKE LIFECYCLE
     * We wait 2000ms. This prevents the "flicker" where Tab B closes 
     * before Tab A (the dashboard) has actually processed the refresh.
     */
    const transitionTimer = setTimeout(() => {
      setIsSyncing(false);
      
      try {
        // Attempt to close the tab
        window.close();
      } catch (e) {
        // 🛡️ FALLBACK: STANDARD REDIRECT
        // Use .replace() to remove '/auth/callback' from history stack
        window.location.replace(target); 
      }
    }, 2000); 

    return () => {
      clearTimeout(transitionTimer);
      authChannel.close(); // Clean up listener
    };
  }, [target]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-primary/30">
      <div className="relative mb-8">
        {isSyncing ? (
          <div className="relative h-12 w-12 flex items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="rounded-full bg-green-500/10 p-4 border border-green-500/20">
            <ShieldCheck className="h-8 w-8 text-green-500 animate-bounce" />
          </div>
        )}
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-xl font-black italic uppercase tracking-tighter">
          {isSyncing ? "Syncing_Identity" : "Identity_Anchored"}
        </h1>
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
          {isSyncing ? "Propagating Signal..." : "Returning to Terminal"}
        </div>
      </div>
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