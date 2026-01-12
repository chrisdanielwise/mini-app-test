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
 * 🛰️ MERCHANT REGISTRATION PROTOCOL (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive geometry for Telegram Mini App and desktop browser parity.
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
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-6 bg-background overflow-x-hidden relative selection:bg-primary/30">
      
      {/* --- INSTITUTIONAL BACKGROUND AURA --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-2xl space-y-8 md:space-y-12 relative z-10 py-12">
        
        {/* --- PROTOCOL HEADER --- */}
        <div className="text-center space-y-3 md:space-y-4">
          <div className="flex items-center justify-center gap-3 text-primary mb-2">
            <Cpu className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Deployment Protocol v2.6
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            Deploy <span className="text-primary">Node.</span>
          </h1>
          
          {/* Progress Telemetry */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className={cn(
              "h-1 w-8 md:w-12 rounded-full transition-all duration-700",
              step === 1 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-muted/20"
            )} />
            <div className={cn(
              "h-1 w-8 md:w-12 rounded-full transition-all duration-700",
              step === 2 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-muted/20"
            )} />
          </div>
        </div>

        {step === 1 ? (
          /* --- STEP 1: TIER CALIBRATION --- */
          <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="relative p-1 rounded-3xl md:rounded-[3.5rem] bg-card/40 border border-border/40 backdrop-blur-xl shadow-2xl">
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
              className="w-full h-16 md:h-24 rounded-2xl md:rounded-[2.5rem] bg-primary text-base md:text-xl font-black uppercase italic tracking-[0.15em] md:tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group"
            >
              Continue to Manifest
              <ArrowRight className="ml-3 md:ml-4 h-5 w-5 md:h-7 md:w-7 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </div>
        ) : (
          /* --- STEP 2: CLUSTER DETAILS --- */
          <Card className="rounded-3xl md:rounded-[4rem] border-border/40 bg-card/40 backdrop-blur-3xl p-6 sm:p-10 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-700 relative overflow-hidden group">
            <Terminal className="absolute -bottom-10 -right-10 h-48 w-48 md:h-64 md:w-64 opacity-[0.02] -rotate-12 pointer-events-none" />

            <div className="space-y-8 md:space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-1 opacity-60">
                    Admin Identity
                  </Label>
                  <Input
                    placeholder="E.G. ALEX RIVERA"
                    className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/10 border-border/40 px-6 font-black uppercase italic text-xs md:text-sm tracking-tight focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-1 opacity-60">
                    Brand/Cluster Name
                  </Label>
                  <Input
                    placeholder="E.G. ZIPHA ALPHA"
                    className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/10 border-border/40 px-6 font-black uppercase italic text-xs md:text-sm tracking-tight focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-1 opacity-60">
                  Encryption Contact (Email)
                </Label>
                <Input
                  type="email"
                  placeholder="ADMIN@YOURDOMAIN.COM"
                  className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/10 border-border/40 px-6 font-black uppercase italic text-xs md:text-sm tracking-tight focus:ring-primary/20 transition-all shadow-inner"
                />
              </div>

              <div className="pt-4 md:pt-6 space-y-6">
                <Button className="w-full h-16 md:h-24 rounded-2xl md:rounded-[2.5rem] bg-primary text-sm md:text-lg font-black uppercase italic tracking-[0.15em] md:tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                  Initialize Node & Auth
                </Button>

                <div className="flex gap-4 px-2 md:px-6 items-start opacity-40">
                  <Fingerprint className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-primary" />
                  <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed italic">
                    Finalization requires a cryptographic handshake via the{" "}
                    <span className="text-foreground font-black">Zipha Bot Node</span>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  hapticFeedback("light");
                  setStep(1);
                }}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all group"
              >
                <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Return to Calibration
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}