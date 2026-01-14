"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

/**
 * 🛰️ AUTH_CALLBACK_TERMINAL (Standard v15.3.0)
 * Logic: Implements Acknowledged Handshake to prevent premature redirection.
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"BROADCASTING" | "ACKNOWLEDGED">("BROADCASTING");
  const target = searchParams.get("target") || "/dashboard";
  const authChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const authChannel = new BroadcastChannel("zipha_auth_sync");
    authChannelRef.current = authChannel;

    // 1. 🛰️ Listen for the "I'm ready" signal from Tab A
    authChannel.onmessage = (event) => {
      if (event.data.action === "HANDSHAKE_ACKNOWLEDGED") {
        console.log("🛰️ [Handshake]: Dashboard tab confirmed receipt.");
        setStep("ACKNOWLEDGED");

        // 🧹 Only close or redirect AFTER we know Tab A has refreshed
        setTimeout(() => {
          try {
            window.close();
          } finally {
            window.location.replace(target);
          }
        }, 1500);
      }
    };

    // 2. 📡 Broadcast the pulse every 500ms until acknowledged (Polled Pulse)
    const pulseInterval = setInterval(() => {
      if (step === "BROADCASTING") {
        authChannel.postMessage({
          action: "RELOAD_SESSION",
          target,
          user: { fullName: "Authorized Operator", role: "MERCHANT" }
        });
      }
    }, 500);

    return () => {
      clearInterval(pulseInterval);
      authChannel.close();
    };
  }, [target, step]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="relative mb-10">
        {step === "BROADCASTING" ? (
          <Loader2 className="h-16 w-16 animate-spin text-amber-500 opacity-50" />
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