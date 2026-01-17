"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { 
  Zap, Check, ArrowRight, Activity, Terminal, Waves 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";

/**
 * 🛰️ SERVICE_CARD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density rows (p-4) and h-11 activation profile prevents layout blowout.
 */
export function ServiceCard({ id, name, tiers, merchantId }: any) {
  const [selectedTier, setSelectedTier] = useState<string>(tiers[0]?.id);
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  
  // 🛰️ DEVICE INGRESS
  const { screenSize, isMobile, isReady } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const { execute: startCheckout, loading: isProcessing } = useInstitutionalFetch<any>(
    "/api/payments/checkout",
    {
      manual: true,
      onSuccess: (data: { invoiceUrl: string }) => {
        const tg = (window as any).Telegram?.WebApp;
        if (tg?.openInvoice) {
          tg.openInvoice(data.invoiceUrl, (status: string) => {
            if (status === "paid") { 
              notification("success"); 
              impact("heavy"); 
            }
          });
        }
      },
      onError: () => notification("error")
    }
  );

  const handleActivation = useCallback(() => {
    if (!selectedTier || isProcessing) return;
    impact("medium");
    startCheckout(true, { 
      tierId: selectedTier, 
      merchantId,
      serviceId: id 
    });
  }, [selectedTier, merchantId, id, isProcessing, startCheckout, impact]);

  if (!isReady) return <div className="h-48 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />;

  return (
    <div className={cn(
      "group relative overflow-hidden bg-zinc-950/40 border border-white/5 transition-all duration-500",
      "p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl",
      isStaff ? "border-amber-500/10" : "hover:border-primary/20"
    )}>
      
      {/* --- 🛡️ FIXED HUD: Stationary Header --- */}
      <div className="flex justify-between items-start mb-6 leading-none">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 italic opacity-20">
            <Activity className="size-3" />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Market_Node_Active</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground truncate">
            {name}
          </h3>
        </div>
        
        <div className={cn(
          "size-9 md:size-10 rounded-xl flex items-center justify-center border shadow-inner transition-all",
          isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
        )}>
          <Zap className="size-5" />
        </div>
      </div>

      {/* --- 🚀 RESOURCE ALLOCATION: Tactical Slim --- */}
      <div className="space-y-2 mb-6">
        <p className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 ml-1 italic">
          Resource_Allocation
        </p>
        <div className="grid gap-2">
          {tiers.map((tier: any) => (
            <button
              key={tier.id}
              onClick={() => { impact("light"); setSelectedTier(tier.id); }}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl border transition-all leading-none",
                selectedTier === tier.id
                  ? (isStaff ? "bg-amber-500/5 border-amber-500" : "bg-primary/5 border-primary shadow-lg")
                  : "bg-white/5 border-white/5 hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-3 text-left min-w-0">
                <div className={cn(
                  "size-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  selectedTier === tier.id 
                    ? (isStaff ? "border-amber-500 bg-amber-500" : "border-primary bg-primary") 
                    : "border-white/10 bg-black/20"
                )}>
                  {selectedTier === tier.id && <Check className="size-3 text-black stroke-[4px]" />}
                </div>
                <div className="space-y-1 min-w-0">
                  <p className={cn(
                    "text-[8px] font-black uppercase tracking-widest leading-none",
                    selectedTier === tier.id ? (isStaff ? "text-amber-500" : "text-primary") : "opacity-30"
                  )}>
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-xl font-black italic tracking-tighter text-foreground">
                       ${tier.price} 
                     </span>
                     <span className="text-[7px] font-black uppercase opacity-10 italic">/ {tier.interval}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- 🏁 ACTION: Provisioning Node (h-11) --- */}
      <Button 
        onClick={handleActivation}
        disabled={isProcessing}
        className={cn(
          "w-full h-11 md:h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg active:scale-95 transition-all",
          isStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-primary-foreground shadow-primary/10"
        )}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Waves className="size-4 animate-bounce" />
            <span>Provisioning...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>Activate_Identity</span>
            <ArrowRight className="size-3.5" />
          </div>
        )}
      </Button>
    </div>
  );
}