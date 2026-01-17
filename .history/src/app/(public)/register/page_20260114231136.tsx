"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Terminal,
  Fingerprint,
  Cpu,
  Zap,
  ShieldCheck,
  Globe
} from "lucide-react";
import { TierSelector } from "@/components/app/tier-selector";
import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/providers/telegram-provider";

/**
 * 🛰️ MERCHANT REGISTRATION PROTOCOL (Institutional v9.4.9)
 * Architecture: Two-Phase Deployment Calibration.
 * Hardened: Null-safe Haptics and Turbopack geometric stabilization.
 */
export default function RegisterPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>("pro-tier-id");
  const [step, setStep] = useState(1);
  const { webApp, isReady } = useTelegramContext();

  // 🛡️ Haptic Node Safe-Access
  const triggerHaptic = (style: "light" | "medium" | "heavy") => {
    if (isReady && webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(style);
    }
  };

  const availableTiers = [
    {
      id: "starter-tier-id",
      name: "Starter",
      price: "49.00",
      discountPercentage: 0,
      interval: "MONTH",
      intervalCount: 1,
      type: "RECURRING",
    },
    {
      id: "pro-tier-id",
      name: "Professional",
      price: "149.00",
      discountPercentage: 20,
      interval: "MONTH",
      intervalCount: 1,
      type: "RECURRING",
    },
  ];

  const handleNextStep = () => {
    triggerHaptic("medium");
    setStep(2);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background overflow-x-hidden relative selection:bg-primary/30 text-foreground">
      
      {/* --- INSTITUTIONAL BACKGROUND AURA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl space-y-8 relative z-10 py-10">
        
        {/* --- PROTOCOL HEADER --- */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary/60">
            <Cpu className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Deployment Protocol v2.26
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
            Deploy <span className="text-primary">Node.</span>
          </h1>
          
          {/* Progress Telemetry */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className={cn(
                "h-1 rounded-full transition-all duration-700",
                step === i ? "w-16 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]" : "w-10 bg-muted/20"
              )} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          /* --- STEP 1: TIER CALIBRATION --- */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative p-1.5 rounded-[2rem] bg-card/40 border border-border/40 backdrop-blur-2xl shadow-2xl">
              <TierSelector
                tiers={availableTiers}
                selectedTierId={selectedTier}
                onSelect={(id) => {
                  setSelectedTier(id);
                  triggerHaptic("light");
                }}
                currency="$"
              />
            </div>

            <Button
              onClick={handleNextStep}
              className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group"
            >
              Continue to Manifest
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </div>
        ) : (
          /* --- STEP 2: CLUSTER DETAILS --- */
          <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-3xl p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden group">
            <Terminal className="absolute -bottom-10 -right-10 h-40 w-40 opacity-[0.03] -rotate-12 pointer-events-none" />

            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-primary/70 ml-1">Admin Identity</Label>
                  <Input
                    placeholder="E.G. ALEX RIVERA"
                    className="h-12 rounded-xl bg-muted/10 border-border/40 px-5 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-primary/70 ml-1">Cluster Label</Label>
                  <Input
                    placeholder="E.G. ZIPHA ALPHA"
                    className="h-12 rounded-xl bg-muted/10 border-border/40 px-5 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-primary/70 ml-1">Encryption Contact (Email)</Label>
                <Input
                  type="email"
                  placeholder="ADMIN@YOURDOMAIN.COM"
                  className="h-12 rounded-xl bg-muted/10 border-border/40 px-5 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 shadow-inner"
                />
              </div>

              <div className="pt-4 space-y-6">
                <Button className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Initialize Node & Auth
                </Button>

                <div className="flex gap-4 px-4 py-4 rounded-2xl bg-primary/5 border border-primary/10 items-center">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-primary animate-pulse" />
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed italic">
                    Requires cryptographic handshake via the{" "}
                    <span className="text-primary font-black">Zipha Bot Hub</span>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic("light");
                  setStep(1);
                }}
                className="w-full flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
              >
                <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Return to Calibration
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* FOOTER SIGNAL */}
      <div className="mt-10 flex items-center gap-3 opacity-20 py-8">
        <Globe className="h-4 w-4 text-primary" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] italic">
          Verified Deployment Node // Sync_Stable
        </p>
      </div>
    </div>
  );
}