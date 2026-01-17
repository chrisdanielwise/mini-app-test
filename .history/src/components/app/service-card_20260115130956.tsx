"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Zap, Check, ArrowRight, Activity, Terminal, 
  RefreshCcw, Lock, Waves 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";

interface Tier {
  id: string;
  name: string;
  price: string;
  interval: string;
  discountPercentage?: number;
}

interface ServiceCardProps {
  id: string;
  name: string;
  description?: string;
  currency: string;
  tiers: Tier[];
  merchantId: string;
}

/**
 * 🌊 FLUID SERVICE NODE (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, viewportWidth).
 * Design: Kinetic Water-Flow Morphing with Morphology-aware grid logic.
 */
export function ServiceCard({ name, description, currency, tiers, merchantId }: ServiceCardProps) {
  const [selectedTier, setSelectedTier] = useState<string>(tiers[0]?.id);
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming the full interface spectrum
  const { 
    screenSize, isMobile, isTablet, isDesktop, 
    isPortrait, viewportWidth, isReady 
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";

  // 🛰️ TACTICAL INGRESS: Standardized Sync Engine
  const { execute: startCheckout, loading: isProcessing } = useInstitutionalFetch(
    async (payload: { tierId: string; merchantId: string }) => {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("INVOICE_SYNC_FAILED");
      return response.json();
    },
    {
      onSuccess: (data: { invoiceUrl: string }) => {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openInvoice(data.invoiceUrl, (status: string) => {
            if (status === "paid") { notification("success"); impact("heavy"); }
          });
        }
      },
      onError: () => notification("error")
    }
  );

  // 🛡️ HYDRATION GUARD: Prevents morphology jumps during JS load
  if (!isReady) return <div className="h-64 animate-pulse bg-card/20 rounded-[2.5rem] border border-white/5" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating layout gravity based on the 6-tier system.
   */
  const tierGridCols = (screenSize === 'xxl' || screenSize === 'xl') ? "grid-cols-3" : 
                       (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2" : "grid-cols-1";
  
  const cardPadding = screenSize === 'xs' ? "p-5" : screenSize === 'sm' ? "p-8" : "p-10 md:p-12";
  const headerSize = screenSize === 'xs' ? "text-xl" : "text-2xl md:text-4xl";

  return (
    <div className={cn(
      "group relative overflow-hidden shadow-apex backdrop-blur-3xl border",
      "transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]", // 🌊 Water-Ease
      cardPadding,
      "rounded-[2.5rem] md:rounded-[3.5rem]",
      isStaff 
        ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40" 
        : "bg-card/40 border-white/5 hover:border-primary/30"
    )}>
      
      {/* 🌊 KINETIC WATERMARK: Scales with viewportWidth */}
      <Terminal 
        className="absolute -top-12 -right-12 opacity-[0.02] rotate-12 pointer-events-none transition-transform duration-[2000ms] group-hover:-translate-x-12 group-hover:-translate-y-4" 
        style={{ width: `${Math.max(150, viewportWidth * 0.2)}px`, height: `${Math.max(150, viewportWidth * 0.2)}px` }}
      />

      {/* --- HUD HEADER --- */}
      <div className={cn("flex justify-between items-start mb-8 relative z-10", isMobile && "flex-col gap-6")}>
        <div className="space-y-2 md:space-y-4 min-w-0">
          <div className="flex items-center gap-3 italic">
            <Activity className={cn("size-3.5 animate-pulse shrink-0", isStaff ? "text-amber-500" : "text-primary")} />
            <span className={cn("text-[9px] font-black uppercase tracking-[0.4em]", isStaff ? "text-amber-500" : "text-primary")}>Active_Market_Node</span>
          </div>
          <h3 className={cn("font-black uppercase italic tracking-tighter leading-none truncate text-foreground", headerSize)}>
            {name}
          </h3>
        </div>
        
        <div className={cn(
          "shrink-0 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-inner border transition-all duration-1000 group-hover:scale-110 group-hover:rotate-[360deg]",
          screenSize === 'xs' ? "size-12" : "size-14 md:size-20",
          isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
        )}>
          <Zap className="size-7 md:size-10 fill-current" />
        </div>
      </div>

      {description && screenSize !== 'xs' && (
        <div className="mb-8 p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms]" />
          <p className="text-[11px] md:text-[13px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest italic opacity-40">
            "{description}"
          </p>
        </div>
      )}

      {/* --- TIER CALIBRATION: Morphology-aware grid --- */}
      <div className="space-y-4 mb-10 relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 ml-2 italic">Allocate_Resource_Tier</p>
        <div className={cn("grid gap-4", tierGridCols)}>
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => { impact("light"); setSelectedTier(tier.id); }}
              className={cn(
                "w-full flex items-center justify-between p-5 md:p-8 rounded-[1.8rem] md:rounded-[2.2rem] border transition-all duration-700 group/tier",
                selectedTier === tier.id
                  ? (isStaff ? "bg-amber-500/[0.05] border-amber-500 shadow-apex scale-[1.02]" : "bg-primary/[0.05] border-primary shadow-apex scale-[1.02]")
                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
              )}
            >
              <div className="flex items-center gap-4 text-left min-w-0">
                <div className={cn(
                  "size-6 md:size-8 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all duration-700",
                  selectedTier === tier.id 
                    ? (isStaff ? "border-amber-500 bg-amber-500 shadow-lg" : "border-primary bg-primary shadow-lg") 
                    : "border-white/10 bg-black/20"
                )}>
                  {selectedTier === tier.id && <Check className="size-3 md:size-4 text-primary-foreground stroke-[4px] animate-in zoom-in duration-300" />}
                </div>
                <div className="space-y-1 min-w-0">
                  <p className={cn(
                    "text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] leading-none",
                    selectedTier === tier.id ? (isStaff ? "text-amber-500" : "text-primary") : "text-muted-foreground/40"
                  )}>
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-xl md:text-3xl font-black italic tracking-tighter text-foreground leading-none">
                       {tier.price} 
                     </span>
                     <span className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">/ {tier.interval}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- ACTIVATION TRIGGER --- */}
      <div className="relative pt-4">
        <div className={cn(
          "absolute inset-0 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />
        
        <Button 
          onClick={handleSubscribe}
          disabled={isProcessing}
          className={cn(
            "w-full rounded-[2rem] md:rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] shadow-apex active:scale-95 group/btn transition-all duration-1000",
            screenSize === 'xs' ? "h-16 text-[10px]" : "h-20 md:h-24 text-[12px]",
            isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/30"
          )}
        >
          {isProcessing ? (
            <div className="flex items-center gap-4">
              <Waves className="size-5 animate-bounce" />
              <span className="animate-pulse">Provisioning_Node...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span>Activate_Node_Identity</span>
              <ArrowRight className="size-6 group-hover/btn:translate-x-3 transition-transform duration-700 ease-out" />
            </div>
          )}
        </Button>
      </div>

      <div className="mt-10 flex justify-center items-center gap-4 opacity-10 italic">
        <Lock className="size-3.5" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Institutional_v16.29_Apex // {screenSize.toUpperCase()}</span>
      </div>
    </div>
  );
}