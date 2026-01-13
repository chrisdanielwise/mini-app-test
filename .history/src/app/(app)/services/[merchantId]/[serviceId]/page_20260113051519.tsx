"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApi, apiPost } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { TierSelector } from "@/components/app/tier-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  ShieldCheck,
  Terminal,
  Activity,
  Globe,
  Lock,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isUUID } from "@/lib/utils/validators";

// --- INTERFACES ---
interface ServiceTier {
  id: string;
  name: string;
  price: string;
  interval: string;
  type: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  currency: string;
  tiers: ServiceTier[];
  merchant?: {
    companyName: string;
    id: string;
  };
}

/**
 * 🛰️ SERVICE DEPLOYMENT TERMINAL (Institutional v12.40.0)
 * Architecture: Optimized Ingress via 'getServiceById' Protocol.
 * Hardened: Next.js 16 Async Params & BigInt-Safe Sanitization.
 */
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; serviceId: string }>;
}) {
  // 🚀 UNWRAP PROTOCOL: Params in Next.js 16 are Promises.
  const resolvedParams = use(params);
  const merchantId = resolvedParams?.merchantId;
  const serviceId = resolvedParams?.serviceId;

  const router = useRouter();

  const {
    auth,
    isReady,
    mounted,
    isTelegram,
    setBackButton,
    setMainButton,
    webApp,
  } = useTelegramContext();

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tunnelReady, setTunnelReady] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  // 🛡️ HYDRATION SHIELD: Prevents SSR/CSR desync.
  useEffect(() => {
    if (mounted) setTunnelReady(true);
    const timer = setTimeout(() => {
      if (!isReady) {
        console.warn("🛰️ [Service_Node] Handshake delay. Enforcing soft-session.");
        setIsStuck(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [mounted, isReady]);

  // 🛰️ DATA AUDIT: Fetching individual node telemetry.
  const { data: service, isLoading: apiLoading } = useApi<Service>(
    auth?.isAuthenticated && isUUID(serviceId)
      ? `/api/service/${serviceId}`
      : null
  );

  const isStaff = useMemo(
    () =>
      auth?.user?.role &&
      ["super_admin", "platform_manager"].includes(auth.user.role),
    [auth?.user?.role]
  );

  const triggerHaptic = (style: any) => {
    if (webApp?.HapticFeedback) {
      if (["success", "warning", "error"].includes(style)) {
        webApp.HapticFeedback.notificationOccurred(style);
      } else {
        webApp.HapticFeedback.impactOccurred(style);
      }
    }
  };

  useEffect(() => {
    if (isTelegram && isReady) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram, isReady]);

  // 🎮 MAIN BUTTON ORCHESTRATION: Links UI to Telegram Hardware.
  useEffect(() => {
    if (!isTelegram || !isReady || !auth?.isAuthenticated || !tunnelReady || !service)
      return;

    if (!selectedTierId) {
      setMainButton({
        text: "SELECT ACCESS LEVEL",
        visible: true,
        active: false,
        color: isStaff ? "#f59e0b" : "#1a1a1a",
      });
    } else {
      // 🛡️ NULL SAFETY: Safe lookup in sanitized tiers array.
      const tier = service?.tiers?.find((t) => t.id === selectedTierId);
      if (tier) {
        setMainButton({
          text: `ACTIVATE ${tier.name.toUpperCase()} - ${service.currency} ${tier.price}`,
          visible: true,
          active: !isSubmitting,
          is_progress_visible: isSubmitting,
          color: isStaff ? "#f59e0b" : "#10b981",
          onClick: handleSubscribe,
        });
      }
    }
    return () => setMainButton({ text: "", visible: false });
  }, [service, selectedTierId, isSubmitting, isTelegram, isReady, auth?.isAuthenticated, tunnelReady, isStaff]);

  const handleSubscribe = async () => {
    if (!selectedTierId || !service || isSubmitting) return;
    setIsSubmitting(true);
    triggerHaptic("heavy");

    try {
      const result = await apiPost<{ invoiceUrl: string }>(
        "/api/payments/checkout",
        {
          merchantId,
          tierId: selectedTierId,
          serviceId: service.id,
        }
      );

      if (result.invoiceUrl && webApp) {
        webApp.openInvoice(result.invoiceUrl, (status: string) => {
          if (status === "paid") {
            triggerHaptic("success");
            router.push("/home?payment=success");
          } else {
            triggerHaptic("warning");
            setIsSubmitting(false);
          }
        });
      }
    } catch (error) {
      triggerHaptic("error");
      setIsSubmitting(false);
    }
  };

  // 1. INITIALIZATION: Loader only shows during active auth handshake.
  if (!auth?.isAuthenticated && (!isReady && !isStuck || !tunnelReady || auth?.isLoading || apiLoading)) {
    return <LoadingScreen message="Linking Service Node..." subtext="SECURE TUNNEL ACTIVE" />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified nodes.
  if (!auth?.isAuthenticated && !auth?.isLoading) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="h-20 w-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-rose-500/20">
          <Lock className="h-10 w-10 text-rose-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Identity Null</h1>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-8 rounded-xl h-12">Force Re-Sync</Button>
      </div>
    );
  }

  // 3. NODE OFFLINE STATE: Handling missing data gracefully.
  if (!service && !apiLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="h-12 w-12 opacity-10 mb-6" />
        <h1 className="text-xl font-black italic opacity-40">Node_Offline</h1>
        <Button onClick={() => router.push("/services")} className="mt-6 rounded-xl h-12 px-8">Return to Hub</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground">
      <header className="px-6 py-8 md:py-10 rounded-b-[2rem] border-b border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 pointer-events-none"><Fingerprint className="h-32 w-32" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2", isStaff ? "text-amber-500" : "text-primary")}>
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isStaff ? "bg-amber-500" : "bg-primary")} />
              {isStaff ? "Oversight_Handshake" : "Verified_Inbound"}
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tight truncate leading-none">{service?.name}</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Cluster: {service?.merchant?.companyName || "ROOT_NODE"}</p>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 pb-44">
        {/* TELEMETRY CARDS */}
        <section className="grid grid-cols-3 gap-4">
          {[
            { icon: Shield, label: "Hardened", color: isStaff ? "text-amber-500" : "text-primary", bg: isStaff ? "bg-amber-500/5" : "bg-primary/5" },
            { icon: Zap, label: "Instant", color: "text-amber-500", bg: "bg-amber-500/5" },
            { icon: Activity, label: "Live_Sync", color: "text-emerald-500", bg: "bg-emerald-500/5" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-4 shadow-lg backdrop-blur-md">
              <div className={cn("rounded-xl p-2.5 shadow-inner", item.bg)}><item.icon className={cn("h-5 w-5", item.color)} /></div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{item.label}</span>
            </div>
          ))}
        </section>

        {/* TIER SELECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
            <Terminal className={cn("h-4 w-4", isStaff && "text-amber-500")} />
            <h3 className="text-[9px] font-black uppercase tracking-[0.5em]">Calibration_Nodes</h3>
          </div>
          <div className="rounded-[2rem] border border-border/40 bg-card/40 p-1.5 shadow-2xl backdrop-blur-3xl">
            <TierSelector
              tiers={service?.tiers || []}
              selectedTierId={selectedTierId}
              onSelect={(id) => { setSelectedTierId(id); triggerHaptic("light"); }}
              currency={service?.currency || "USD"}
            />
          </div>
        </section>

        <footer className="flex items-center justify-center gap-4 opacity-20 py-10">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <p className="text-[8px] font-black uppercase tracking-[0.4em] italic text-center leading-none">Zipha Protocol v2.26 // State: {isStaff ? "OVERSIGHT" : "OPTIMAL"}</p>
        </footer>
      </main>
    </div>
  );
}