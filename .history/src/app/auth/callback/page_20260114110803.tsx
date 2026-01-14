"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"SYNCING" | "SUCCESS">("SYNCING");
  const target = searchParams.get("target") || "/dashboard";

  useEffect(() => {
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    // 1. 🛰️ Acknowledgment Listener
    authChannel.onmessage = (event) => {
      if (event.data.action === "HANDSHAKE_ACKNOWLEDGED") {
        setStep("SUCCESS");
        
        // 🏁 Finish sequence only after confirmation
        setTimeout(() => {
          authChannel.close();
          window.location.replace(target); 
        }, 1500);
      }
    };

    // 2. 📡 Polled Pulse (Every 500ms)
    // This ensures that even if Tab A was "asleep," it will catch a later pulse.
    const pulseInterval = setInterval(() => {
      if (step === "SYNCING") {
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
      authChannel.close();
    };
  }, [target, step]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
       <div className="relative mb-10">
        {step === "SYNCING" ? (
          <Loader2 className="h-16 w-16 animate-spin text-amber-500" />
        ) : (
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in" />
        )}
      </div>
      <h1 className="text-xl font-black italic uppercase tracking-tighter">
        {step === "SYNCING" ? "SYNCING_NODES" : "IDENTITY_ANCHORED"}
      </h1>
      <p className="text-[10px] opacity-40 uppercase tracking-[0.4em] mt-2">
        {step === "SYNCING" ? "Searching for active terminal..." : "Handshake confirmed."}
      </p>
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