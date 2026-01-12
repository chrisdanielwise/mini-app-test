"use client";

import { useState } from "react";
import { Zap, ShieldCheck, CreditCard, Check, ArrowRight, Activity, Terminal, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

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
 * 🛰️ SERVICE NODE CARD (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive haptics and institutional touch-targets for capital conversion.
 */
export function ServiceCard({ name, description, currency, tiers, merchantId }: ServiceCardProps) {
  const [selectedTier, setSelectedTier] = useState<string>(tiers[0]?.id);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🏁 PAYMENT PROTOCOL HANDSHAKE
  const handleSubscribe = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    hapticFeedback("heavy"); 

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: selectedTier, merchantId }),
      });

      if (!response.ok) throw new Error("INVOICE_SYNC_FAILED");
      const { invoiceUrl } = await response.json();

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(invoiceUrl, (status: string) => {
          if (status === "paid") {
            hapticFeedback("success");
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
          }
        });
      }
    } catch (err) {
      hapticFeedback("error");
      console.error("[Node_Error] Financial handshake failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTierSelect = (id: string) => {
    setSelectedTier(id);
    hapticFeedback("light");
  };

  return (
    <div className="group relative rounded-2xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-5 md:p-10 shadow-2xl transition-all duration-500 hover:border-primary/40 overflow-hidden min-w-0">
      
      <Terminal className="absolute -top-6 -right-6 h-24 w-24 md:h-32 md:w-32 opacity-[0.03] rotate-12 pointer-events-none" />

      {/* --- HUD HEADER --- */}
      <div className="flex flex-row justify-between items-start mb-6 md:mb-10 relative z-10">
        <div className="space-y-1 md:space-y-3 min-w-0">
          <div className="flex items-center gap-2 italic">
            <Activity className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary animate-pulse shrink-0" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary">Live Asset</span>
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black uppercase italic tracking-tighter leading-none truncate">
            {name}
          </h3>
        </div>
        <div className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner transition-transform group-hover:scale-110 duration-500">
          <Zap className="h-5 w-5 md:h-7 md:w-7 fill-current" />
        </div>
      </div>

      {description && (
        <div className="mb-6 md:mb-10 p-4 md:p-5 rounded-xl md:rounded-2xl bg-muted/10 border border-border/20 backdrop-blur-md">
          <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight italic opacity-60">
            "{description}"
          </p>
        </div>
      )}

      {/* --- TIER CALIBRATION --- */}
      <div className="space-y-3 md:space-y-4 mb-8 md:mb-12 relative z-10">
        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground/40 ml-1 md:ml-2 italic">Select Resource Tier</p>
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => handleTierSelect(tier.id)}
            className={cn(
              "w-full flex items-center justify-between p-4 md:p-6 rounded-xl md:rounded-[1.8rem] border transition-all duration-300 group/tier",
              selectedTier === tier.id
                ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)] scale-[1.01]"
                : "bg-muted/5 border-border/20 hover:bg-muted/10"
            )}
          >
            <div className="flex items-center gap-3 md:gap-5 text-left min-w-0">
              <div className={cn(
                "h-5 w-5 md:h-6 md:w-6 shrink-0 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all duration-500",
                selectedTier === tier.id ? "border-primary bg-primary shadow-lg shadow-primary/40" : "border-border/40 bg-card"
              )}>
                {selectedTier === tier.id && <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary-foreground stroke-[3px]" />}
              </div>
              <div className="space-y-0.5 md:space-y-1 min-w-0">
                <p className={cn(
                  "text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none truncate",
                  selectedTier === tier.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {tier.name}
                </p>
                <p className="text-lg md:text-2xl font-black italic tracking-tighter text-foreground leading-none">
                   <span className="text-[10px] md:text-sm align-top mr-1 opacity-30">{currency}</span>
                   {tier.price} 
                   <span className="text-[8px] md:text-[10px] font-black not-italic opacity-20 uppercase tracking-widest ml-1 md:ml-2">/ {tier.interval}</span>
                </p>
              </div>
            </div>
            {tier.discountPercentage && tier.discountPercentage > 0 && (
              <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[7px] md:text-[8px] font-black px-2 md:px-3 py-1 shrink-0 ml-2">
                -{tier.discountPercentage}%
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* --- ACTIVATION TRIGGER --- */}
      <div className="relative pt-2 md:pt-4">
        <Button 
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full h-16 md:h-20 rounded-xl md:rounded-[2rem] text-xs md:text-sm font-black uppercase italic tracking-[0.15em] md:tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] group/btn"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 animate-spin" />
              Executing Sync...
            </div>
          ) : (
            <>
              Activate Node
              <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
            </>
          )}
        </Button>
      </div>

      {/* --- COMPLIANCE FOOTER --- */}
      <div className="mt-6 md:mt-8 flex justify-center items-center gap-3 md:gap-4 opacity-20 italic">
        <Fingerprint className="h-2.5 w-2.5 md:h-3 md:w-3" />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em]">Protocol_Encrypted // Institutional</span>
      </div>
    </div>
  );
}