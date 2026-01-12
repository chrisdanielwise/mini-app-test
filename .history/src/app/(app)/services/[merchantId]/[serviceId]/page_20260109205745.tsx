"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useApi, apiPost } from "@/src/lib/hooks/use-api";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { TierSelector } from "@/src/components/mini-app/tier-selector";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ArrowLeft, Shield, Zap, Users, ShieldCheck, CreditCard } from "lucide-react";

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

  /**
   * 🛠️ TELEGRAM NATIVE NAV: Back Button
   */
  useEffect(() => {
    if (isTelegram) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram]);

  /**
   * 🚀 TELEGRAM NATIVE ACTION: Main Button
   * Synchronizes the web selection with the native Telegram checkout button.
   */
  useEffect(() => {
    if (!isTelegram) return;

    if (!service || !selectedTierId) {
      setMainButton({
        text: "SELECT A PLAN",
        visible: true,
        active: false,
        color: "#1a1a1a", // Deep gray for inactive
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
    hapticFeedback("medium");

    try {
      // Create the Invoice Handshake
      const result = await apiPost<{ invoiceUrl: string }>("/api/payments/checkout", {
        merchantId,
        tierId: selectedTierId,
      });

      hapticFeedback("success");

      if (result.invoiceUrl && window.Telegram?.WebApp) {
        // Native Telegram Invoice Protocol
        window.Telegram.WebApp.openInvoice(result.invoiceUrl, (status: string) => {
          if (status === "paid") {
            router.push("/home"); // Redirect to new home flow
          }
        });
      }
    } catch (error: any) {
      hapticFeedback("error");
      console.error("Payment flow error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady || auth.isLoading || isLoading) {
    return <LoadingScreen message="Establishing secure connection..." />;
  }

  if (!service) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center border border-dashed border-border">
          <ShieldCheck className="h-8 w-8 text-muted-foreground opacity-30" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase italic tracking-tighter">Node Not Found</h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            This deployment is no longer active.
          </p>
        </div>
        <Button onClick={() => router.push("/services")} variant="outline" className="rounded-xl px-8 font-black uppercase tracking-widest">
          Browse Clusters
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700 pb-32">
      {/* Visual Header Node */}
      <header className="px-6 pt-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Deployment Protocol
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              {service.name}
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Cluster: <span className="text-foreground">{data?.merchant?.companyName || "Unknown"}</span>
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-lg text-[10px] font-black uppercase">
            {service.tiers.length} OPTIONS
          </Badge>
        </div>

        {service.description && (
          <div className="rounded-[1.5rem] bg-muted/10 p-5 border border-border/40 backdrop-blur-sm">
            <p className="text-xs font-medium leading-relaxed text-muted-foreground tracking-tight italic">
              {service.description}
            </p>
          </div>
        )}
      </header>

      {/* Trust Grid Protocol */}
      <section className="grid grid-cols-3 gap-3 px-6">
        {[
          { icon: Shield, label: "Secure", color: "text-primary", bg: "bg-primary/10" },
          { icon: Zap, label: "Instant", color: "text-amber-500", bg: "bg-amber-500/10" },
          { icon: Users, label: "Global", color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/50 p-5 shadow-sm">
            <div className={cn("rounded-xl p-2", item.bg)}>
              <item.icon className={cn("h-5 w-5", item.color)} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </section>

      {/* Selection Protocol */}
      <section className="px-6 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
          Select Subscription Level
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

      {/* Web Fallback Trigger */}
      {!isTelegram && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-8 bg-gradient-to-t from-background via-background to-transparent pt-12">
          <Button
            className="h-16 w-full rounded-[1.8rem] text-lg font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20"
            disabled={!selectedTierId || isSubmitting}
            onClick={handleSubscribe}
          >
            {isSubmitting ? "SYNCING LEDGER..." : "ACTIVATE SERVICE"}
          </Button>
          <div className="mt-4 flex justify-center items-center gap-2 opacity-30">
            <CreditCard className="h-3 w-3" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Zipha Secure Gateway</span>
          </div>
        </div>
      )}
    </div>
  );
}