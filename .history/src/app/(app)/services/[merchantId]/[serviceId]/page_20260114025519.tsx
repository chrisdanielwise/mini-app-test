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
 * 🛰️ SERVICE DEPLOYMENT TERMINAL (Institutional v12.42.0)
 * Logic: Hardened Hydration Shield & Recursive String Sanitization.
 * Fix: Prevents "Application Error" by gating all UI until Client-Mount.
 */
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; serviceId: string }>;
}) {
  // 🚀 PROTOCOL 1: ASYNC UNWRAP
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
  const [isStuck, setIsStuck] = useState(false);

  // 🛡️ PROTOCOL 2: HANDSHAKE TIMEOUT
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      if (!isReady) {
        console.warn("🛰️ [Service_Node] Handshake delay. Bypassing SDK lock.");
        setIsStuck(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [mounted, isReady]);

  // 🛰️ DATA INGRESS
  const { data: rawData, isLoading: apiLoading } = useApi<any>(
    mounted && auth?.isAuthenticated && isUUID(serviceId)
      ? `/api/service/${merchantId}/${serviceId}`
      : null
  );

  // 🛡️ PROTOCOL 3: RECURSIVE STRING-SAFE PARSER
  // This is the "Crash-Killer." It forces all values to Strings before rendering.
  const service = useMemo(() => {
    if (!rawData) return null;
    try {
      return {
        ...rawData,
        id: String(rawData.id),
        name: String(rawData.name || "Signal Node"),
        currency: String(rawData.currency || "USD"),
        merchant: rawData.merchant ? {
          id: String(rawData.merchant.id),
          companyName: String(rawData.merchant.companyName || "ROOT_NODE")
        } : null,
        tiers: Array.isArray(rawData.tiers) 
          ? rawData.tiers.map((t: any) => ({
              ...t,
              id: String(t.id),
              price: String(t.price), 
              name: String(t.name)
            }))
          : []
      };
    } catch (e) {
      console.error("🔥 [Render_Shield] Sanitization failed:", e);
      return null;
    }
  }, [rawData]);

  const isStaff = useMemo(
    () =>
      auth?.user?.role &&
      ["super_admin", "platform_manager", "merchant"].includes(auth.user.role.toLowerCase()),
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
    if (isTelegram && isReady && mounted) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram, isReady, mounted]);

  // 🎮 TELEGRAM BRIDGE ORCHESTRATION
  useEffect(() => {
    if (!isTelegram || !isReady || !auth?.isAuthenticated || !service || !mounted)
      return;

    if (!selectedTierId) {
      setMainButton({
        text: "SELECT ACCESS LEVEL",
        isVisible: true,
        active: false,
        color: isStaff ? "#f59e0b" : "#1a1a1a",
      });
    } else {
      const tier = service?.tiers?.find((t) => t.id === selectedTierId);
      if (tier) {
        setMainButton({
          text: `ACTIVATE ${tier.name.toUpperCase()} - ${service.currency} ${tier.price}`,
          isVisible: true,
          active: !isSubmitting,
          is_progress_visible: isSubmitting,
          color: isStaff ? "#f59e0b" : "#10b981",
          onClick: handleSubscribe,
        });
      }
    }
    return () => setMainButton({ text: "", isVisible: false });
  }, [service, selectedTierId, isSubmitting, isTelegram, isReady, auth?.isAuthenticated, isStaff, mounted, setMainButton]);

  const handleSubscribe = async () => {
    if (!selectedTierId || !service || isSubmitting) return;
    setIsSubmitting(true);
    triggerHaptic("heavy");

    try {
      const result = await apiPost<{ invoiceUrl: string }>("/api/payments/checkout", {
        merchantId: String(merchantId),
        tierId: String(selectedTierId),
        serviceId: String(service.id),
      });

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

  // 🛑 THE MASTER GATE
  // If not mounted, we render NULL. This prevents Next.js hydration errors.
  if (!mounted) return null;

  if ((!isReady && !isStuck) || apiLoading || (auth && auth.isLoading)) {
    return <LoadingScreen message="Linking Cluster Node..." subtext="SECURE TUNNEL ACTIVE" />;
  }

  if (!auth?.isAuthenticated) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <Lock className="h-10 w-10 text-rose-500 mb-8 animate-pulse" />
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Identity_Null</h1>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-8 rounded-xl h-12">Force_Handshake</Button>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="h-12 w-12 opacity-10 mb-6" />
        <h1 className="text-xl font-black italic opacity-40 uppercase">Node_Offline</h1>
        <Button onClick={() => router.push("/home")} className="mt-6 rounded-xl h-12 px-8">Return to Hub</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      <header className="px-6 py-8 md:py-10 rounded-b-[2rem] border-b border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 pointer-events-none"><Fingerprint className="h-32 w-32" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2", isStaff ? "text-amber-500" : "text-primary")}>
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isStaff ? "bg-amber-500" : "bg-primary")} />
              {isStaff ? "Oversight_Clearance" : "Verified_Inbound"}
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tight truncate pr-10">{service.name}</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Node: {service.id.slice(0, 8)}</p>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 pb-44">
        {/* TELEMETRY NODES */}
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

        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
            <Terminal className={cn("h-4 w-4", isStaff && "text-amber-500")} />
            <h3 className="text-[9px] font-black uppercase tracking-[0.5em]">Identity_Options</h3>
          </div>
          <div className="rounded-[2rem] border border-border/40 bg-card/40 p-1.5 shadow-2xl backdrop-blur-3xl">
            <TierSelector
              tiers={service.tiers}
              selectedTierId={selectedTierId}
              onSelect={(id) => { setSelectedTierId(id); triggerHaptic("light"); }}
              currency={service.currency}
            />
          </div>
        </section>

        <footer className="flex items-center justify-center gap-4 opacity-20 py-10">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center leading-none">Zipha Protocol v2.26 // State: {isStaff ? "OVERSIGHT" : "OPTIMAL"}</p>
        </footer>
      </main>
    </div>
  );
}