"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card } from "@/src/components/ui/card";
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Check, 
  Terminal, 
  Fingerprint, 
  Globe, 
  Cpu 
} from "lucide-react";
import Link from "next/link";
import { TierSelector } from "@/src/components/mini-app/tier-selector";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ MERCHANT REGISTRATION PROTOCOL (Apex Tier)
 * Tier 1 -> Tier 2 Transition Node for high-resiliency merchant onboarding.
 */
export default function RegisterPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>("pro-tier-id");
  const [step, setStep] = useState(1);

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
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background pt-32 pb-40 overflow-hidden relative selection:bg-primary/30">
      
      {/* --- INSTITUTIONAL BACKGROUND AURA --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="w-full max-w-2xl space-y-12 relative z-10">
        
        {/* --- PROTOCOL HEADER --- */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-primary mb-4">
            <Cpu className="h-5 w-5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Deployment Protocol v2.6
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            Deploy <span className="text-primary">Node.</span>
          </h1>
          <div className="flex items-center justify-center gap-4 pt-4">
             <div className={cn("h-1 w-12 rounded-full transition-all duration-500", step === 1 ? "bg-primary" : "bg-muted")} />
             <div className={cn("h-1 w-12 rounded-full transition-all duration-500", step === 2 ? "bg-primary" : "bg-muted")} />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic pt-2">
            {step === 1 ? "Calibration: Select Access Tier" : "Identity: Cluster Manifest"}
          </p>
        </div>

        {step === 1 ? (
          /* --- STEP 1: TIER CALIBRATION --- */
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="relative p-1 rounded-[3.5rem] bg-muted/10 border border-border/40 backdrop-blur-sm">
               <TierSelector
                 tiers={availableTiers}
                 selectedTierId={selectedTier}
                 onSelect={setSelectedTier}
                 currency="$"
               />
            </div>
            
            <Button
              onClick={() => setStep(2)}
              className="w-full h-24 rounded-[2.5rem] bg-primary text-xl font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              Continue to Manifest 
              <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </div>
        ) : (
          /* --- STEP 2: CLUSTER DETAILS --- */
          <Card className="rounded-[4rem] border-border/40 bg-card/40 backdrop-blur-3xl p-12 shadow-2xl animate-in fade-in zoom-in duration-700 relative overflow-hidden group">
            <Terminal className="absolute -bottom-10 -right-10 h-64 w-64 opacity-[0.02] -rotate-12 pointer-events-none" />
            
            <div className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Admin Identity</Label>
                  <Input
                    placeholder="E.G. ALEX RIVERA"
                    className="h-16 rounded-2xl bg-muted/10 border-border/40 px-6 font-black uppercase italic text-sm tracking-tight focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Brand/Cluster Name</Label>
                  <Input
                    placeholder="E.G. ZIPHA ALPHA"
                    className="h-16 rounded-2xl bg-muted/10 border-border/40 px-6 font-black uppercase italic text-sm tracking-tight focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground">Encryption Contact (Email)</Label>
                <Input
                  type="email"
                  placeholder="ADMIN@YOURDOMAIN.COM"
                  className="h-16 rounded-2xl bg-muted/10 border-border/40 px-6 font-black uppercase italic text-sm tracking-tight focus:ring-primary/20 transition-all shadow-inner"
                />
              </div>

              <div className="pt-6 space-y-6">
                <Button className="w-full h-24 rounded-[2.5rem] bg-primary text-lg font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Initialize & Connect Telegram
                </Button>
                
                <div className="flex gap-4 px-6 items-start opacity-50">
                   <Fingerprint className="h-5 w-5 shrink-0 text-primary" />
                   <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed italic">
                    Finalization requires a cryptographic handshake via the <span className="text-primary font-black">Zipha Bot</span>. 
                    You will be redirected to verify your Telegram identity and authorize the cluster billing epoch.
                   </p>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all group"
              >
                <ArrowRight className="h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Tier Calibration
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* --- TELEMETRY STATUS BAR --- */}
      <div className="mt-20 flex flex-wrap justify-center items-center gap-10 opacity-30">
        {[
          { label: "Instant Deployment", icon: Globe },
          { label: "Secure Handshake", icon: ShieldCheck },
          { label: "Zero-Latency Payouts", icon: Zap }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <item.icon className="h-4 w-4 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}