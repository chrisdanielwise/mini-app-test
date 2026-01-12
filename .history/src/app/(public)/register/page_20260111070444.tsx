"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Fingerprint,
  Globe,
  Cpu,
} from "lucide-react";
import { TierSelector } from "@/components/app/tier-selector";
import { cn } from "@/lib/utils";
import { useTelegramContext } from "@/components/telegram/telegram-provider";

/**
 * 🛰️ MERCHANT REGISTRATION PROTOCOL (Tactical Medium)
 * Normalized: World-standard fluid scaling for institutional onboarding.
 * Optimized: Resilient geometric layout to prevent viewport cropping.
 */
export default function RegisterPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>("pro-tier-id");
  const [step, setStep] = useState(1);
  const { hapticFeedback } = useTelegramContext();

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
    hapticFeedback("medium");
    setStep(2);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background overflow-x-hidden relative selection:bg-primary/20">
      
      {/* --- INSTITUTIONAL BACKGROUND AURA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl space-y-8 relative z-10 py-10">
        
        {/* --- PROTOCOL HEADER --- */}
        <div className="text-center space-y-2 md:space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary/60 mb-1">
            <Cpu className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
              Deployment Protocol v2.26
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Deploy <span className="text-primary">Node.</span>
          </h1>
          
          {/* Progress Telemetry: Tactical Scale */}
          <div className="flex items-center justify-center gap-2.5 pt-4">
            <div className={cn(
              "h-1 w-10 md:w-14 rounded-full transition-all duration-700",
              step === 1 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "bg-muted/20"
            )} />
            <div className={cn(
              "h-1 w-10 md:w-14 rounded-full transition-all duration-700",
              step === 2 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "bg-muted/20"
            )} />
          </div>
        </div>

        {step === 1 ? (
          /* --- STEP 1: TIER CALIBRATION --- */
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="relative p-1 rounded-2xl md:rounded-3xl bg-card/40 border border-border/40 backdrop-blur-xl shadow-xl">
              <TierSelector
                tiers={availableTiers}
                selectedTierId={selectedTier}
                onSelect={(id) => {
                  setSelectedTier(id);
                  hapticFeedback("light");
                }}
                currency="$"
              />
            </div>

            <Button
              onClick={handleNextStep}
              className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-[0.1em] text-[11px] md:text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group"
            >
              Continue to Manifest
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </div>
        ) : (
          /* --- STEP 2: CLUSTER DETAILS --- */
          <Card className="rounded-2xl md:rounded-3xl border-border/40 bg-card/40 backdrop-blur-3xl p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-500 relative overflow-hidden group">
            <Terminal className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.03] -rotate-12 pointer-events-none" />

            <div className="space-y-6 md:space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-primary/70 ml-1">
                    Admin Identity
                  </Label>
                  <Input
                    placeholder="E.G. ALEX RIVERA"
                    className="h-11 rounded-xl bg-muted/10 border-border/40 px-4 font-black uppercase italic text-[10px] tracking-tight focus:ring-primary/20 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-primary/70 ml-1">
                    Cluster Label
                  </Label>
                  <Input
                    placeholder="E.G. ZIPHA ALPHA"
                    className="h-11 rounded-xl bg-muted/10 border-border/40 px-4 font-black uppercase italic text-[10px] tracking-tight focus:ring-primary/20 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-primary/70 ml-1">
                  Encryption Contact (Email)
                </Label>
                <Input
                  type="email"
                  placeholder="ADMIN@YOURDOMAIN.COM"
                  className="h-11 rounded-xl bg-muted/10 border-border/40 px-4 font-black uppercase italic text-[10px] tracking-tight focus:ring-primary/20 shadow-inner"
                />
              </div>

              <div className="pt-4 space-y-6">
                <Button className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-[0.1em] text-[11px] md:text-sm shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                  Initialize Node & Auth
                </Button>

                <div className="flex gap-3 px-2 items-start opacity-40">
                  <Fingerprint className="h-4 w-4 shrink-0 text-primary" />
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed italic">
                    Requires cryptographic handshake via the{" "}
                    <span className="text-foreground font-black">Zipha Bot Node</span>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  hapticFeedback("light");
                  setStep(1);
                }}
                className="w-full flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
              >
                <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                Return to Calibration
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* FOOTER SIGNAL */}
      <div className="mt-10 flex items-center gap-2.5 opacity-20">
        <Zap className="h-3 w-3 fill-primary text-primary" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Zipha Intelligence Hub</span>
      </div>
    </div>
  );
}