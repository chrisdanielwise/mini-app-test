"use client";

import { useState } from "react";
import { Zap, ShieldCheck, CreditCard, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
 * 🛰️ SERVICE NODE CARD (Tier 3)
 * High-conversion card with integrated Telegram Payment Handshake.
 */
export function ServiceCard({ name, description, currency, tiers, merchantId }: ServiceCardProps) {
  const [selectedTier, setSelectedTier] = useState<string>(tiers[0]?.id);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🏁 PAYMENT HANDSHAKE
  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      /**
       * 1. CALL THE CHECKOUT API
       * Generates a secure Telegram Invoice Link for this specific tier.
       */
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ tierId: selectedTier, merchantId }),
      });
      const { invoiceUrl } = await response.json();

      /**
       * 2. TRIGGER TELEGRAM NATIVE UI
       * Opens the official Apple Pay / Star / Crypto checkout sheet.
       */
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(invoiceUrl, (status: string) => {
          if (status === "paid") {
            window.Telegram.WebApp.showAlert("✅ Node Activated. Check your history.");
          }
        });
      }
    } catch (err) {
      console.error("Payment Protocol Failure:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="group relative rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-8 shadow-2xl transition-all hover:border-primary/30">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
            {name}
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            Automated Node Delivery
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Zap className="h-6 w-6 fill-current" />
        </div>
      </div>

      {description && (
        <p className="text-xs font-medium text-muted-foreground uppercase leading-relaxed tracking-tight mb-8 opacity-80">
          {description}
        </p>
      )}

      {/* --- TIER SELECTOR PROTOCOL --- */}
      <div className="space-y-3 mb-10">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={cn(
              "w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300",
              selectedTier === tier.id
                ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                : "bg-muted/20 border-border/50 hover:bg-muted/40"
            )}
          >
            <div className="flex items-center gap-4 text-left">
              <div className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                selectedTier === tier.id ? "border-primary bg-primary" : "border-muted-foreground/30"
              )}>
                {selectedTier === tier.id && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {tier.name}
                </p>
                <p className="text-xl font-black italic tracking-tighter mt-1">
                   ${tier.price} <span className="text-[9px] font-bold not-italic opacity-40">/ {tier.interval}</span>
                </p>
              </div>
            </div>
            {tier.discountPercentage && tier.discountPercentage > 0 && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none rounded-lg text-[8px] font-black">
                SAVE {tier.discountPercentage}%
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* --- ACTION TRIGGER --- */}
      <Button 
        onClick={handleSubscribe}
        disabled={isProcessing}
        className="w-full h-20 rounded-[1.8rem] text-md font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 group-active:scale-[0.98] transition-transform"
      >
        {isProcessing ? "Connecting Node..." : "Activate Protocol"}
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      <div className="mt-6 flex justify-center items-center gap-2 opacity-30">
        <ShieldCheck className="h-3 w-3" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Encrypted Checkout</span>
      </div>
    </div>
  );
}