"use client";

import { useEffect, Suspense, useRef, useState } from "react"; 
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Standard v15.2.0)
 * Logic: Implements a "Verified Handshake" to prevent flicker loops.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const [isSyncing, setIsSyncing] = useState(true);
  const hasSignaled = useRef(false);
  
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    if (hasSignaled.current) return;
    hasSignaled.current = true;

    // 1. 🛰️ BROADCAST THE IDENTITY ANCHOR
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    
    authChannel.postMessage({ 
      action: "RELOAD_SESSION", 
      target, 
      timestamp: Date.now(),
      user: { fullName: "Authorized Operator", role: "MERCHANT" }
    });

    console.log("🛰️ [Handshake]: Node signal broadcasted.");

    /**
     * 🚀 THE FIX: DELAYED DESTRUCT
     * We wait 2 seconds to ensure Tab A has successfully refreshed.
     * This prevents the 'flicker' where Tab B closes before the pulse is sent.
     */
    const transitionTimer = setTimeout(() => {
      setIsSyncing(false);
      
      try {
        // Attempt to close the tab
        window.close();
      } catch (e) {
        // Fallback: Use .replace to wipe the 'callback' from history
        window.location.replace(target); 
      }
    }, 2000); 

    return () => {
      clearTimeout(transitionTimer);
      authChannel.close(); // Clean up
    };
  }, [target]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="relative mb-8">
        {isSyncing ? (
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
        ) : (
          <ShieldCheck className="h-12 w-12 text-green-500" />
        )}
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-xl font-black italic uppercase tracking-tighter">
          {isSyncing ? "ANCHORING_IDENTITY" : "HANDSHAKE_COMPLETE"}
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
          {isSyncing ? "Synchronizing Nodes..." : "Returning to Terminal"}
        </p>
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