"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useApi, apiPost } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { TierSelector } from "@/components/app/tier-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Zap, ShieldCheck, Terminal, Activity, ChevronRight, Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- INTERFACES ---
interface ServiceData {
  merchant: {
    id: string;
    companyName?: string;
    botUsername?: string;
  };
  services: Array<{
    id: string;
    name: string;
    description?: string;
    currency: string;
    tiers: Array<{
      id: string;
      name: string;
      price: string;
      interval: string;
      type: string;
    }>;
  }>;
}

/**
 * 🛰️ SERVICE DEPLOYMENT TERMINAL
 * Orchestrates Telegram Native Invoices and Tier Calibration.
 */
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; serviceId: string }>;
}) {
  // 🏁 Next.js 15: Unwrap params using the 'use' hook
  const { merchantId, serviceId } = use(params);
  const router = useRouter();

  const {
    auth,
    isReady,
    isTelegram,
    setBackButton,
    setMainButton,
    hapticFeedback,
  } = useTelegramContext();

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🛡️ UUID Validation Guard
  const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  const { data, isLoading } = useApi<ServiceData>(
    auth.isAuthenticated && isValidUUID(merchantId) 
      ? `/api/merchant/${merchantId}/services` 
      : null
  );

  const service = data?.services?.find((s) => s.id === serviceId);

  // 🛠️ NAVIGATION: Back Button Handshake
  useEffect(() => {
    if (isTelegram && isReady) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram, isReady]);

  // 🚀 ACTION: Main Button Activation
  useEffect(() => {
    if (!isTelegram || !isReady) return;

    if (!service || !selectedTierId) {
      setMainButton({
        text: "SELECT ACCESS LEVEL",
        visible: true,
        active: false,
        color: "#1a1a1a", 
      });
      return;
    }

    const tier = service.tiers.find((t) => t.id === selectedTierId);
    if (!tier) return;

    setMainButton({
      text: `ACTIVATE ${tier.name.toUpperCase()} - ${service.currency} ${tier.price}`,
      visible: true,
      active: !isSubmitting,
      is_progress_visible: isSubmitting,
      onClick: handleSubscribe,
    });

    return () => setMainButton({ text: "", visible: false });
  }, [service, selectedTierId, isSubmitting, isTelegram, isReady]);

  const handleSubscribe = async () => {
    if (!selectedTierId || !service || isSubmitting) return;

    setIsSubmitting(true);
    hapticFeedback("heavy"); // High-intensity feedback for financial confirmation

    try {
      const result = await apiPost<{ invoiceUrl: string }>("/api/payments/checkout", {
        merchantId,
        tierId: selectedTierId,
        serviceId: service.id
      });

      if (result.invoiceUrl && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(result.invoiceUrl, (status: string) => {
          if (status === "paid") {
            hapticFeedback("success");
            router.push("/home?payment=success");
          } else {
            hapticFeedback("warning");
            setIsSubmitting(false);
          }
        });
      }
    } catch (error: any) {
      hapticFeedback("error");
      console.error("[Checkout_Failure]", error);
      setIsSubmitting(false);
    }
  };

  if (!isReady || auth.isLoading || isLoading) {
    return <LoadingScreen message="Establishing Secure Link..." />;
  }

  if (!service) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-10 text-center space-y-8">
        <ShieldCheck className="h-16 w-16 text-muted-foreground opacity-20" />
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Node_Offline</h1>
        <Button onClick={() => router.push("/services")}>Return to Hub</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* HUD HEADER */}
      <header className="p-8 pt-12 rounded-b-[4rem] border-b border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
          <Fingerprint className="h-48 w-48" />
        </div>
        <div className="relative z-10 space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Signal Ingress
          </span>
          <div className="space-y-2">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{service.name}</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
              Provider: {data?.merchant?.companyName || "ROOT_NODE"}
            </p>
          </div>
        </div>
      </header>

      {/* TELEMETRY GRID */}
      <section className="grid grid-cols-3 gap-5 px-8">
        {[
          { icon: Shield, label: "Harden", color: "text-primary", bg: "bg-primary/10" },
          { icon: Zap, label: "Instant", color: "text-amber-500", bg: "bg-amber-500/10" },
          { icon: Activity, label: "Live", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-4 rounded-[2rem] border border-border/40 bg-card/40 p-6 shadow-xl">
            <div className={cn("rounded-2xl p-3", item.bg)}><item.icon className={cn("h-6 w-6", item.color)} /></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </section>

      {/* SELECTION ARCHITECTURE */}
      <section className="px-8 space-y-6">
        <h2 className="px-2 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">
          Calibration: Access Tiers
        </h2>
        <TierSelector
          tiers={service.tiers}
          selectedTierId={selectedTierId}
          onSelect={(id) => {
            setSelectedTierId(id);
            hapticFeedback("light");
          }}
          currency={service.currency}
        />
      </section>

      {/* WEB FALLBACK */}
      {!isTelegram && (
        <div className="fixed bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-background to-transparent backdrop-blur-sm">
          <Button
            className="h-20 w-full rounded-[2rem] text-sm font-black uppercase tracking-[0.2em]"
            disabled={!selectedTierId || isSubmitting}
            onClick={handleSubscribe}
          >
            {isSubmitting ? "Executing Handshake..." : "Finalize Activation"}
          </Button>
        </div>
      )}
    </div>
  );
}