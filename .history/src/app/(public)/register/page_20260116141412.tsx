"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🧩 Tactical Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TierSelector } from "@/components/app/tier-selector";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Zap,
  Terminal,
  Globe
} from "lucide-react";

/**
 * 🛰️ MERCHANT_REGISTRATION (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 action hub and shrunken typography prevents blowout.
 */
export default function RegisterPage() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  
  const [selectedTier, setSelectedTier] = useState<string | null>("pro-tier-id");
  const [step, setStep] = useState(1);

  const { isReady, screenSize, isMobile, isPortrait, safeArea } = useDeviceContext();

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

  if (!isReady) return <div className="min-h-screen bg-black animate-pulse" />;

  return (
    <div className="flex flex-col items-center justify-center bg-background relative overflow-hidden leading-none selection:bg-primary/20">
      
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 blur-[120px] opacity-[0.03] pointer-events-none",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} style={{ width: '80%', height: '40%' }} />

      <div className={cn("w-full max-w-lg relative z-10 space-y-8 px-6 py-12 md:py-16")}>
        
        {/* --- 🛡️ FIXED HUD: Protocol Header --- */}
        <div className="text-center space-y-3 animate-in fade-in duration-700">
          <div className="flex items-center justify-center gap-2 opacity-20 italic">
            <Activity className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              Provisioning_Protocol_v16
            </span>
          </div>
          <h1 className={cn(
            "font-black uppercase italic tracking-tighter text-foreground",
            screenSize === 'xs' ? "text-3xl" : "text-4xl md:text-5xl"
          )}>
            Deploy <span className={isStaff ? "text-amber-500" : "text-primary"}>Node</span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className={cn(
                "h-1 rounded-full transition-all duration-700",
                step === i 
                  ? (isStaff ? "w-12 bg-amber-500" : "w-12 bg-primary") 
                  : "w-6 bg-white/5"
              )} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          /* --- STEP 1: TIER CALIBRATION --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="p-3 bg-zinc-950/40 border border-white/5 rounded-2xl backdrop-blur-xl shadow-2xl">
              <TierSelector
                tiers={availableTiers}
                selectedTierId={selectedTier}
                onSelect={(id) => { setSelectedTier(id); impact("light"); }}
                currency="$"
              />
            </div>

            <Button
              onClick={() => { setStep(2); impact("medium"); }}
              className={cn(
                "w-full h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all active:scale-95 group",
                isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
              )}
            >
              Continue_to_Manifest
              <ArrowRight className="ml-2 size-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        ) : (
          /* --- STEP 2: CLUSTER DETAILS --- */
          <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="space-y-6 relative z-10">
              <div className={cn("grid gap-4", isMobile && isPortrait ? "grid-cols-1" : "grid-cols-2")}>
                <div className="space-y-2">
                  <Label className="text-[7.5px] font-black uppercase tracking-widest opacity-20 ml-1">Admin_Identity</Label>
                  <Input
                    placeholder="ALEX_RIVERA"
                    className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-black uppercase italic text-[10px] focus:border-primary/40 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[7.5px] font-black uppercase tracking-widest opacity-20 ml-1">Cluster_Label</Label>
                  <Input
                    placeholder="ALPHA_NODE"
                    className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-black uppercase italic text-[10px] focus:border-primary/40 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-widest opacity-20 ml-1">Encryption_Contact</Label>
                <Input
                  type="email"
                  placeholder="ADMIN@RELAY.IO"
                  className="h-11 rounded-xl bg-black/40 border-white/5 px-4 font-black uppercase italic text-[10px] focus:border-primary/40 shadow-inner"
                />
              </div>

              <div className="pt-4 space-y-6">
                <Button 
                  onClick={() => impact("heavy")}
                  className={cn(
                    "w-full h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg active:scale-95 transition-all",
                    isStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-primary-foreground shadow-primary/10"
                  )}
                >
                  Initialize_Node_&_Auth
                </Button>

                <div className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 items-center">
                  <ShieldCheck className="size-4.5 shrink-0 text-primary animate-pulse" />
                  <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-relaxed italic">
                    Requires <span className="text-primary/60 font-black">Cryptographic Handshake</span> via the bot.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setStep(1); impact("light"); }}
                className="w-full flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 hover:text-primary transition-all group italic"
              >
                <ArrowRight className="size-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Return_to_Calibration
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* --- 🛰️ FOOTER SIGNAL: Stationary HUD --- */}
      <footer 
        className="mt-auto flex flex-col items-center gap-2 py-8 opacity-10 italic transition-all"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 1rem)` }}
      >
        <Globe className="size-4" />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">Verified_Node // Sync_Stable</p>
          <p className="text-[6.5px] font-mono uppercase tracking-[0.2em]">{screenSize}_HARDWARE_SYNC_OK</p>
        </div>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}