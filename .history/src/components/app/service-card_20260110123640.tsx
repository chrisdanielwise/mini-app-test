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
 * 🛰️ SERVICE NODE CARD (Apex Standard)
 * High-fidelity conversion node with integrated Telegram Payment Protocol.
 */
export function ServiceCard({ name, description, currency, tiers, merchantId }: ServiceCardProps) {
  const [selectedTier, setSelectedTier] = useState<string>(tiers[0]?.id);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🏁 PAYMENT PROTOCOL HANDSHAKE
  const handleSubscribe = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    hapticFeedback("heavy"); // High-intensity feedback for financial intent

    try {
      /**
       * 1. INVOICE GENERATION
       * Requests a signed invoice link from the secure Zipha Ledger.
       */
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: selectedTier, merchantId }),
      });

      if (!response.ok) throw new Error("INVOICE_SYNC_FAILED");
      
      const { invoiceUrl } = await response.json();

      /**
       * 2. NATIVE INGRESS
       * Hands off control to the Telegram OS for secure capital transfer.
       */
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(invoiceUrl, (status: string) => {
          if (status === "paid") {
            hapticFeedback("success");
            // Optional: Dispatch event or redirect to Success Terminal
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
    <div className="group relative rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl p-10 shadow-2xl transition-all duration-500 hover:border-primary/40 overflow-hidden">
      
      {/* Background Blueprint Watermark */}
      <Terminal className="absolute -top-6 -right-6 h-32 w-32 opacity-[0.03] rotate-12 pointer-events-none" />

      {/* --- HUD HEADER --- */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Live Asset</span>
          </div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
            {name}
          </h3>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner transition-transform group-hover:scale-110 duration-500">
          <Zap className="h-7 w-7 fill-current" />
        </div>
      </div>

      {description && (
        <div className="mb-10 p-5 rounded-2xl bg-muted/10 border border-border/20 backdrop-blur-md">
          <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight italic opacity-70">
            "{description}"
          </p>
        </div>
      )}

      {/* --- TIER CALIBRATION PROTOCOL --- */}
      <div className="space-y-4 mb-12 relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-2 italic">Select Resource Tier</p>
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => handleTierSelect(tier.id)}
            className={cn(
              "w-full flex items-center justify-between p-6 rounded-[1.8rem] border transition-all duration-500 group/tier",
              selectedTier === tier.id
                ? "bg-primary/5 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] scale-[1.02]"
                : "bg-muted/10 border-border/40 hover:bg-muted/20"
            )}
          >
            <div className="flex items-center gap-5 text-left">
              <div className={cn(
                "h-6 w-6 rounded-xl border-2 flex items-center justify-center transition-all duration-500",
                selectedTier === tier.id ? "border-primary bg-primary shadow-lg shadow-primary/40 scale-110" : "border-border/40 bg-card"
              )}>
                {selectedTier === tier.id && <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3px]" />}
              </div>
              <div className="space-y-1">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest leading-none transition-colors",
                  selectedTier === tier.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {tier.name}
                </p>
                <p className="text-2xl font-black italic tracking-tighter text-foreground leading-none">
                   <span className="text-sm align-top mr-1 opacity-40">{currency}</span>
                   {tier.price} 
                   <span className="text-[10px] font-black not-italic opacity-20 uppercase tracking-widest ml-2">/ {tier.interval}</span>
                </p>
              </div>
            </div>
            {tier.discountPercentage && tier.discountPercentage > 0 && (
              <Badge className="bg-emerald-500 text-white border-none rounded-lg text-[8px] font-black px-3 py-1 animate-in zoom-in">
                -{tier.discountPercentage}%
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* --- ACTIVATION TRIGGER --- */}
      <div className="relative pt-4">
        <Button 
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full h-20 rounded-[2rem] text-sm font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:scale-[0.98] group/btn"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 animate-spin-slow" />
              Executing Sync...
            </div>
          ) : (
            <>
              Activate Node
              <ArrowRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
            </>
          )}
        </Button>
      </div>

      {/* --- COMPLIANCE FOOTER --- */}
      <div className="mt-8 flex justify-center items-center gap-4 opacity-20 italic">
        <Fingerprint className="h-3 w-3" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Handshake Encrypted // SSL_v2</span>
      </div>
    </div>
  );
}