"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useTelegramContext } from "@/components/providers/telegram-provider";

// 🧩 Refined Tactical Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TierSelector } from "@/components/app/tier-selector";
import {
  ArrowRight,
  Terminal,
  Cpu,
  Zap,
  ShieldCheck,
  Globe,
  Waves,
  Activity
} from "lucide-react";

/**
 * 🛰️ MERCHANT_REGISTRATION_TERMINAL (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea, isPortrait).
 * Logic: morphology-aware two-phase calibration with hardware-fluid radiance.
 */
export default function RegisterPage() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  
  const [selectedTier, setSelectedTier] = useState<string | null>("pro-tier-id");
  const [step, setStep] = useState(1);

  // 🛰️ DEVICE PHYSICS: Consuming full morphology spectrum
  const { 
    isReady, 
    screenSize, 
    viewportWidth, 
    viewportHeight, 
    safeArea, 
    isMobile,
    isPortrait
  } = useDeviceContext();

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
    impact("medium");
    setStep(2);
  };

  // 🛡️ HYDRATION GUARD: Stabilize hardware context
  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical vertical compression for 2026 hardware.
   */
  const sectionPadding = isMobile ? "px-6 py-10" : "px-10 py-20";
  const cardBorderRadius = screenSize === 'xs' ? "rounded-[2rem]" : "rounded-[3rem]";

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-1000",
        "selection:bg-primary/20 overflow-x-hidden relative antialiased",
        isStaff && "selection:bg-amber-500/20"
      )}
      style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }}
    >
      
      {/* 🔮 LIQUID AMBIANCE: Hardware-Fluid Subsurface Radiance */}
      <div 
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 blur-[140px] pointer-events-none -z-10 transition-all duration-1000",
          isStaff ? "bg-amber-500/10" : "bg-primary/[0.06]"
        )} 
        style={{ width: `${viewportWidth}px`, height: `${viewportHeight * 0.4}px` }}
      />

      <div className={cn("w-full max-w-xl relative z-10 space-y-10", sectionPadding)}>
        
        {/* --- PROTOCOL HEADER --- */}
        <div className="text-center space-y-5 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center justify-center gap-3 italic">
            <Activity className={cn("size-3.5 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
              Deployment_Protocol_v16.30
            </span>
          </div>
          <h1 className={cn(
            "font-black uppercase italic tracking-tighter leading-none",
            screenSize === 'xs' ? "text-4xl" : "text-5xl md:text-7xl"
          )}>
            Deploy <span className={isStaff ? "text-amber-500" : "text-primary"}>Node.</span>
          </h1>
          
          {/* Progress Telemetry */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {[1, 2].map((i) => (
              <div key={i} className={cn(
                "h-1.5 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                step === i 
                  ? (isStaff ? "w-20 bg-amber-500 shadow-apex" : "w-20 bg-primary shadow-apex") 
                  : "w-12 bg-white/5"
              )} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          /* --- STEP 1: TIER CALIBRATION --- */
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className={cn(
              "relative p-2 bg-card/40 border border-white/5 backdrop-blur-3xl shadow-apex overflow-hidden",
              cardBorderRadius
            )}>
              <TierSelector
                tiers={availableTiers}
                selectedTierId={selectedTier}
                onSelect={(id) => {
                  setSelectedTier(id);
                  impact("light");
                }}
                currency="$"
              />
            </div>

            <Button
              onClick={handleNextStep}
              className={cn(
                "w-full h-20 rounded-[1.8rem] font-black uppercase italic tracking-[0.2em] text-[11px] shadow-apex transition-all duration-1000 hover:scale-[1.02] active:scale-95 group",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/30"
              )}
            >
              <span>Continue_to_Manifest</span>
              <ArrowRight className="ml-3 size-5 group-hover:translate-x-2 transition-transform duration-700" />
            </Button>
          </div>
        ) : (
          /* --- STEP 2: CLUSTER DETAILS --- */
          <Card className={cn(
            "border border-white/5 bg-card/40 backdrop-blur-3xl p-8 md:p-14 shadow-apex animate-in fade-in zoom-in-95 duration-1000 relative overflow-hidden group transition-all",
            cardBorderRadius
          )}>
            {/* Hardware Watermark: Kinetic Morphology */}
            <Terminal className="absolute -bottom-12 -right-12 size-48 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />

            <div className="space-y-10 relative z-10">
              <div className={cn("grid gap-6", isMobile && isPortrait ? "grid-cols-1" : "grid-cols-2")}>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Admin_Identity</Label>
                  <Input
                    placeholder="E.G. ALEX_RIVERA"
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/5 px-6 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Cluster_Label</Label>
                  <Input
                    placeholder="E.G. ZIPHA_ALPHA"
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/5 px-6 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Encryption_Contact</Label>
                <Input
                  type="email"
                  placeholder="ADMIN@YOURDOMAIN.COM"
                  className="h-14 rounded-2xl bg-white/[0.03] border-white/5 px-6 font-black uppercase italic text-xs tracking-tight focus:ring-primary/20 shadow-inner"
                />
              </div>

              <div className="pt-6 space-y-8">
                <Button 
                  onClick={() => impact("heavy")}
                  className={cn(
                    "w-full h-20 rounded-[1.8rem] font-black uppercase italic tracking-[0.2em] text-[11px] shadow-apex transition-all duration-1000 hover:scale-[1.02] active:scale-95",
                    isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/30"
                  )}
                >
                  Initialize_Node_&_Auth
                </Button>

                <div className="flex gap-5 px-6 py-5 rounded-[1.8rem] bg-primary/5 border border-primary/10 items-center">
                  <ShieldCheck className="size-6 shrink-0 text-primary animate-pulse" />
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] leading-relaxed italic">
                    Requires cryptographic handshake via the{" "}
                    <span className="text-primary font-black">Zipha_Bot_Hub</span>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  impact("light");
                  setStep(1);
                }}
                className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-all group italic"
              >
                <ArrowRight className="size-4 rotate-180 group-hover:-translate-x-2 transition-transform duration-700" />
                Return_to_Calibration
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* --- FOOTER SIGNAL: Safe-Area Anchored --- */}
      <footer 
        className="mt-auto flex flex-col items-center gap-4 py-12 opacity-20 italic transition-all duration-1000"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 2rem)` }}
      >
        <Globe className="size-6 text-primary" />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.5em]">
            Verified_Deployment_Node // Sync_Stable
          </p>
          <p className="text-[7px] font-mono uppercase tracking-[0.2em]">{screenSize}_HARDWARE_SYNC_OK</p>
        </div>
        <Waves className="size-8 opacity-20 animate-pulse" />
      </footer>
    </div>
  );
}