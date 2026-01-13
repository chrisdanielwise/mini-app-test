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
  Shield, Zap, ShieldCheck, Terminal, Activity, Globe, Lock, Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ SERVICE DEPLOYMENT TERMINAL (Institutional v12.26.0)
 * Logic: Soft-Session Ingress Resilience.
 * Hardened: Bypasses SDK hangs if Bearer Recovery is already verified.
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

  // 🛡️ HYDRATION & TIMEOUT SHIELD
  useEffect(() => {
    if (mounted) setTunnelReady(true);
    
    // Safety Net: Unstick page if Telegram SDK hangs > 4s
    const timer = setTimeout(() => {
       if (!isReady) {
         console.warn("🛰️ [Service_Node] SDK Handshake timeout. Proceeding with Auth state.");
         setIsStuck(true);
       }
    }, 4000);

    return () => clearTimeout(timer);
  }, [mounted, isReady]);

  // 🛡️ DATA AUDIT
  const { data, isLoading: apiLoading } = useApi<ServiceData>(
    auth?.isAuthenticated && isUUID(merchantId) 
      ? `/api/merchant/${merchantId}/services` 
      : null
  );

  const service = useMemo(() => 
    data?.services?.find((s) => s.id === serviceId),
    [data, serviceId]
  );

  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role),
    [auth.user?.role]
  );

  // 🛡️ Haptic Protocol Buffer
  const triggerHaptic = (style: "light" | "medium" | "heavy" | "success" | "warning" | "error") => {
    if (webApp?.HapticFeedback) {
      if (["success", "warning", "error"].includes(style)) {
        webApp.HapticFeedback.notificationOccurred(style as any);
      } else {
        webApp.HapticFeedback.impactOccurred(style as any);
      }
    }
  };

  // Back Button Logic
  useEffect(() => {
    if (isTelegram && isReady) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram, isReady]);

  // 🎮 MAIN BUTTON ORCHESTRATION
  useEffect(() => {
    if (!isTelegram || !isReady || !auth.isAuthenticated || !tunnelReady) return;

    if (!service || !selectedTierId) {
      setMainButton({
        text: "SELECT ACCESS LEVEL",
        visible: true,
        active: false,
        color: isStaff ? "#f59e0b" : "#1a1a1a", 
      });
    } else {
      const tier = service.tiers.find((t) => t.id === selectedTierId);
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
  }, [service, selectedTierId, isSubmitting, isTelegram, isReady, auth.isAuthenticated, isStaff, tunnelReady]);

  const handleSubscribe = async () => {
    if (!selectedTierId || !service || isSubmitting) return;
    setIsSubmitting(true);
    triggerHaptic("heavy");

    try {
      const result = await apiPost<{ invoiceUrl: string }>("/api/payments/checkout", {
        merchantId,
        tierId: selectedTierId,
        serviceId: service.id
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
    } catch (error: any) {
      triggerHaptic("error");
      setIsSubmitting(false);
    }
  };

  // 1. INITIALIZATION: Combined Loader
  // Loader only shows if we have NO auth status yet
  if (!auth.isAuthenticated && (!isReady && !isStuck || !tunnelReady || auth.isLoading || apiLoading)) {
    return <LoadingScreen message="LINKING SERVICE NODE..." subtext="CALIBRATING TELEMETRY" />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="h-20 w-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-rose-500/20 shadow-inner">
          <Lock className="h-10 w-10 text-rose-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Handshake Required</h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 opacity-50">Identity node unverified.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-8 rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest">Force Re-Sync</Button>
      </div>
    );
  }

  // Node Missing State
  if (!service && !apiLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <ShieldCheck className="h-12 w-12 text-muted-foreground opacity-10 mb-6" />
        <h1 className="text-xl font-black uppercase italic tracking-tight opacity-40">Node_Offline</h1>
        <Button onClick={() => router.push("/home")} className="mt-6 rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px]">Return to Hub</Button>
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
              {isStaff ? "Oversight_Handshake" : "Signal_Ingress"}
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-none truncate pr-10">{service.name}</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Cluster: {data?.merchant?.companyName || "ROOT_NODE"}</p>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 pb-44">
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
             <h3 className="text-[9px] font-black uppercase tracking-[0.5em]">{isStaff ? "Audit_Node_Calibration" : "Calibration_Nodes"}</h3>
          </div>
          <div className="rounded-[2rem] border border-border/40 bg-card/40 p-1.5 shadow-2xl backdrop-blur-3xl">
            <TierSelector tiers={service.tiers} selectedTierId={selectedTierId} onSelect={(id) => { setSelectedTierId(id); triggerHaptic("light"); }} currency={service.currency} />
          </div>
        </section>

        {!isTelegram && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl z-50 animate-in slide-in-from-bottom duration-700">
            <Button className={cn("h-14 md:h-16 w-full rounded-2xl text-xs font-black uppercase italic tracking-widest shadow-2xl transition-all", isStaff ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground")} disabled={!selectedTierId || isSubmitting} onClick={handleSubscribe}>
              {isSubmitting ? "Syncing Handshake..." : isStaff ? "Finalize Audit Sync" : "Finalize Activation"}
            </Button>
          </div>
        )}

        <footer className="flex items-center justify-center gap-4 opacity-20 py-10">
           <Globe className="h-4 w-4 text-muted-foreground" />
           <p className="text-[8px] font-black uppercase tracking-[0.4em] italic text-center leading-none">Zipha Protocol v2.26 // State: {isStaff ? "OVERSIGHT" : "OPTIMAL"}</p>
        </footer>
      </main>
    </div>
  );
}