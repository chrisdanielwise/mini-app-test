"use client";

import { useState } from "react";
import { TierSelector } from "@/components/dashboard/tier.selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Zap, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

/**
 * 🛰️ MERCHANT REGISTRATION PROTOCOL
 * Tier 1 -> Tier 2 Transition Node
 */
export default function RegisterPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(
    "pro-tier-id"
  );
  const [step, setStep] = useState(1);

  // Mock tiers based on your Landing Page logic
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background pt-32 pb-24 overflow-hidden relative">
      {/* Decorative background aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">
            Deploy <span className="text-primary">Node.</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
            Step {step} of 2:{" "}
            {step === 1 ? "Select Protocol" : "Cluster Details"}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <TierSelector
              tiers={availableTiers}
              selectedTierId={selectedTier}
              onSelect={setSelectedTier}
              currency="$"
            />
            <Button
              onClick={() => setStep(2)}
              className="w-full h-20 rounded-[2rem] bg-primary text-lg font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              Continue to Details <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        ) : (
          <Card className="rounded-[3rem] border-border/40 bg-card/50 backdrop-blur-xl p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Merchant Name
                  </Label>
                  <Input
                    placeholder="John Doe"
                    className="h-14 rounded-2xl bg-background/50 border-border/50 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Company / Brand
                  </Label>
                  <Input
                    placeholder="Zipha Signals"
                    className="h-14 rounded-2xl bg-background/50 border-border/50 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                  Business Email
                </Label>
                <Input
                  type="email"
                  placeholder="admin@zipha.com"
                  className="h-14 rounded-2xl bg-background/50 border-border/50 font-bold"
                />
              </div>

              <div className="pt-4 space-y-4">
                <Button className="w-full h-20 rounded-[2rem] bg-primary text-md font-black uppercase italic tracking-widest shadow-xl shadow-primary/20">
                  Initialize & Connect Telegram
                </Button>
                <p className="text-[9px] font-bold text-center text-muted-foreground uppercase tracking-tight leading-relaxed px-10">
                  After clicking, you will be redirected to the Zipha Bot to
                  finalize your identity verification and cluster payment.
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Tiers
              </button>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-16 flex items-center gap-6 opacity-40">
        <div className="flex items-center gap-2">
          <Check className="h-3 w-3 text-emerald-500" />
          <span className="text-[8px] font-black uppercase tracking-widest">
            Instant Deployment
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-3 w-3 text-emerald-500" />
          <span className="text-[8px] font-black uppercase tracking-widest">
            Secure Handshake
          </span>
        </div>
      </div>
    </div>
  );
}
