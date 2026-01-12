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
 * 🛰️ SERVICE DEPLOYMENT TERMINAL (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive haptics and touch-safe targets for Telegram UI.
 */
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; serviceId: string }>;
}) {
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

  const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  const { data, isLoading } = useApi<ServiceData>(
    auth.isAuthenticated && isValidUUID(merchantId) 
      ? `/api/merchant/${merchantId}/services` 
      : null
  );

  const service = data?.services?.find((s) => s.id === serviceId);

  useEffect(() => {
    if (isTelegram && isReady) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram, isReady]);

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
    hapticFeedback("heavy");

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
      setIsSubmitting(false);
    }
  };

  if (!isReady || auth.isLoading || isLoading) {
    return <LoadingScreen message="Establishing Secure Link..." />;
  }

  if (!service) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center space-y-8 max-w-7xl mx-auto">
        <ShieldCheck className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground opacity-20" />
        <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">Node_Offline</h1>
        <Button onClick={() => router.push("/services")} className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">Return to Hub</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-8 md:space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-7xl mx-auto">
      
      {/* HUD HEADER */}
      <header className="px-5 py-10 md:p-8 md:pt-12 rounded-b-[2.5rem] md:rounded-b-[4rem] border-b border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 pointer-events-none">
          <Fingerprint className="h-32 w-32 md:h-48 md:w-48" />
        </div>
        <div className="relative z-10 space-y-4 md:space-y-6">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Signal Ingress
          </span>
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none truncate pr-12">
              {service.name}
            </h1>
            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">
              Provider: {data?.merchant?.companyName || "ROOT_NODE"}
            </p>
          </div>
        </div>
      </header>

      {/* TELEMETRY GRID */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5 px-5 sm:px-8">
        {[
          { icon: Shield, label: "Harden", color: "text-primary", bg: "bg-primary/10" },
          { icon: Zap, label: "Instant", color: "text-amber-500", bg: "bg-amber-500/10" },
          { icon: Activity, label: "Live", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((item, i) => (
          <div key={i} className={cn(
            "flex flex-col items-center gap-3 md:gap-4 rounded-2xl md:rounded-[2rem] border border-border/40 bg-card/40 p-5 md:p-6 shadow-xl",
            i === 2 && "col-span-2 sm:col-span-1" // Mobile balance: Last item spans full width if odd
          )}>
            <div className={cn("rounded-xl md:rounded-2xl p-2.5 md:p-3", item.bg)}>
              <item.icon className={cn("h-5 w-5 md:h-6 md:w-6", item.color)} />
            </div>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground opacity-60">
              {item.label}
            </span>
          </div>
        ))}
      </section>

      {/* SELECTION ARCHITECTURE */}
      <section className="px-5 sm:px-8 space-y-4 md:space-y-6">
        <h2 className="px-1 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
          Calibration: Access Tiers
        </h2>
        <div className="rounded-3xl bg-muted/5 p-1 border border-border/10">
          <TierSelector
            tiers={service.tiers}
            selectedTierId={selectedTierId}
            onSelect={(id) => {
              setSelectedTierId(id);
              hapticFeedback("light");
            }}
            currency={service.currency}
          />
        </div>
      </section>

      {/* WEB FALLBACK */}
      {!isTelegram && (
        <div className="fixed bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-sm z-50">
          <Button
            className="h-16 md:h-20 w-full rounded-xl md:rounded-[2rem] text-sm font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all"
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