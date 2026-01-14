"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Standard v15.3.5)
 * Logic: Implements Acknowledged Polling to resolve cross-tab sync deadlocks.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"BROADCASTING" | "ACKNOWLEDGED">("BROADCASTING");
  
  // 🛡️ Guard against re-renders
  const hasAcknowledged = useRef(false);
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    // 1. 🛰️ INITIALIZE SECURE CHANNEL
    // Origin must match the dashboard login page exactly.
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      // 🚀 THE BREAKTHROUGH: Listening for the feedback signal from Tab A
      if (event.data.action === "HANDSHAKE_ACKNOWLEDGED" && !hasAcknowledged.current) {
        hasAcknowledged.current = true;
        console.log("🛰️ [Handshake]: Dashboard node confirmed identity anchor.");
        setStep("ACKNOWLEDGED");

        // 🧹 Cleanup and exit once we are CERTAIN Tab A has refreshed
        setTimeout(() => {
          authChannel.close();
          try {
            window.close(); // Attempt to close current tab
          } finally {
            // Standard fallback if window.close is blocked by browser security
            window.location.replace(target); 
          }
        }, 1500);
      }
    };

    // 2. 📡 PULSED BROADCAST (Polled Mode)
    // Sends the reload signal every 500ms until Tab A acknowledges.
    const pulseInterval = setInterval(() => {
      if (!hasAcknowledged.current) {
        authChannel.postMessage({
          action: "RELOAD_SESSION",
          target,
          timestamp: Date.now(),
          user: { fullName: "Authorized Operator", role: "MERCHANT" }
        });
      }
    }, 500);

    return () => {
      clearInterval(pulseInterval);
      authChannel.close(); // Prevent memory leaks
    };
  }, [target]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="relative mb-10">
        {step === "BROADCASTING" ? (
          <div className="relative h-16 w-16 flex items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/10" />
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          </div>
        ) : (
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-500" />
        )}
      </div>

      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">
          {step === "BROADCASTING" ? "Syncing_Nodes" : "Identity_Anchored"}
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 max-w-[200px] leading-relaxed">
          {step === "BROADCASTING" 
            ? "Searching for active dashboard terminal..." 
            : "Dashboard sync confirmed. Handshake complete."}
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