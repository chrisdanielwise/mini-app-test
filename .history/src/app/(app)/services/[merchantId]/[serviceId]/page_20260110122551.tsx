"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useApi, apiPost } from "@/src/lib/hooks/use-api";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { TierSelector } from "@/src/components/mini-app/tier-selector";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Zap, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  Terminal, 
  Activity,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { cn } from "@/src/lib/utils";

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
      compareAtPrice?: string;
      discountPercentage: number;
      interval: string;
      intervalCount: number;
      type: string;
    }>;
  }>;
}

/**
 * 🛰️ SERVICE DEPLOYMENT TERMINAL (Apex Tier)
 * Final conversion node for subscriber onboarding via Telegram Native Invoices.
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

  const { data, isLoading } = useApi<ServiceData>(
    auth.isAuthenticated ? `/api/merchant/${merchantId}/services` : null
  );

  const service = data?.services?.find((s) => s.id === serviceId);

  // 🛠️ NAVIGATION PROTOCOL: Telegram Back Button Sync
  useEffect(() => {
    if (isTelegram) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram]);

  // 🚀 ACTION PROTOCOL: Telegram Main Button Handshake
  useEffect(() => {
    if (!isTelegram) return;

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
      progress: isSubmitting,
      onClick: handleSubscribe,
    });

    return () => setMainButton({ text: "", visible: false });
  }, [service, selectedTierId, isSubmitting, isTelegram]);

  const handleSubscribe = async () => {
    if (!selectedTierId || !service || isSubmitting) return;

    setIsSubmitting(true);
    hapticFeedback("heavy"); // Intense feedback for financial triggers

    try {
      const result = await apiPost<{ invoiceUrl: string }>("/api/payments/checkout", {
        merchantId,
        tierId: selectedTierId,
      });

      if (result.invoiceUrl && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(result.invoiceUrl, (status: string) => {
          if (status === "paid") {
            hapticFeedback("success");
            router.push("/home");
          }
        });
      }
    } catch (error: any) {
      hapticFeedback("error");
      console.error("[Handshake_Error] Checkout failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady || auth.isLoading || isLoading) {
    return <LoadingScreen message="Establishing Secure Link..." />;
  }

  if (!service) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-10 text-center space-y-8 animate-in fade-in duration-500">
        <div className="h-20 w-20 rounded-[2.5rem] bg-muted/10 flex items-center justify-center border-2 border-dashed border-border/40">
          <ShieldCheck className="h-10 w-10 text-muted-foreground opacity-20" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Node_Offline</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">
            The target deployment cluster is currently unreachable.
          </p>
        </div>
        <Button onClick={() => router.push("/services")} className="rounded-[1.5rem] h-14 px-10 font-black uppercase italic tracking-widest text-xs">
          Return to Hub
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- HUD HEADER: DEPLOYMENT PROTOCOL --- */}
      <header className="p-8 pt-12 rounded-b-[4rem] border-b border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
          <Fingerprint className="h-48 w-48" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Signal Ingress Terminal
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              {service.name}
            </h1>
            <div className="flex items-center gap-3">
               <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[9px] font-black italic tracking-widest px-3 py-1">
                 {service.tiers.length} ACCESS_LEVELS
               </Badge>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                 By {data?.merchant?.companyName || "ROOT_PROVIDER"}
               </p>
            </div>
          </div>

          {service.description && (
            <div className="rounded-[2rem] bg-muted/10 p-6 border border-border/20 backdrop-blur-md shadow-inner">
              <p className="text-[11px] font-bold leading-relaxed text-muted-foreground tracking-tight italic uppercase opacity-60">
                "{service.description}"
              </p>
            </div>
          )}
        </div>
      </header>

      {/* --- TRUST TELEMETRY GRID --- */}
      <section className="grid grid-cols-3 gap-5 px-8">
        {[
          { icon: Shield, label: "Harden", color: "text-primary", bg: "bg-primary/10" },
          { icon: Zap, label: "Instant", color: "text-amber-500", bg: "bg-amber-500/10" },
          { icon: Activity, label: "Live", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-4 rounded-[2rem] border border-border/40 bg-card/40 p-6 transition-all hover:bg-card shadow-xl">
            <div className={cn("rounded-2xl p-3 shadow-inner", item.bg)}>
              <item.icon className={cn("h-6 w-6", item.color)} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </section>

      {/* --- SELECTION ARCHITECTURE --- */}
      <section className="px-8 space-y-6">
        <div className="flex items-center gap-3 px-2 opacity-30 italic">
           <Terminal className="h-3 w-3" />
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">
             Calibration: Access Tiers
           </h2>
        </div>
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

      {/* --- WEB FALLBACK (STUB) --- */}
      {!isTelegram && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-10 bg-gradient-to-t from-background via-background/90 to-transparent backdrop-blur-sm">
          <Button
            className="h-20 w-full rounded-[2rem] text-sm font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group"
            disabled={!selectedTierId || isSubmitting}
            onClick={handleSubscribe}
          >
            {isSubmitting ? "Executing Handshake..." : (
              <span className="flex items-center gap-3">
                 Finalize Activation <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}