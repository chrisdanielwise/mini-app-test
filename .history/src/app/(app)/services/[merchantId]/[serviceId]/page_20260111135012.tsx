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
  Shield, Zap, ShieldCheck, Terminal, Activity, ChevronRight, Fingerprint, Globe, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isUUID } from "@/lib/utils/validators";

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
 * Logic: Synchronized with Universal Identity Protocol. Supports Staff Oversight.
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

  // 🛡️ DATA AUDIT: Validate IDs before API ingress
  const { data, isLoading } = useApi<ServiceData>(
    auth.isAuthenticated && isUUID(merchantId) 
      ? `/api/merchant/${merchantId}/services` 
      : null
  );

  const service = data?.services?.find((s) => s.id === serviceId);
  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  useEffect(() => {
    if (isTelegram && isReady) {
      setBackButton(true, () => router.back());
      return () => setBackButton(false);
    }
  }, [router, setBackButton, isTelegram, isReady]);

  // 🎮 TELEGRAM MAIN BUTTON ORCHESTRATION
  useEffect(() => {
    if (!isTelegram || !isReady || !auth.isAuthenticated) return;

    if (!service || !selectedTierId) {
      setMainButton({
        text: "SELECT ACCESS LEVEL",
        visible: true,
        active: false,
        color: isStaff ? "#f59e0b" : "#1a1a1a", 
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
      color: isStaff ? "#f59e0b" : "#10b981", // Staff Mode: Amber, User Mode: Emerald
      onClick: handleSubscribe,
    });

    return () => setMainButton({ text: "", visible: false });
  }, [service, selectedTierId, isSubmitting, isTelegram, isReady, auth.isAuthenticated, isStaff]);

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

  // 1. SYSTEM INITIALIZATION
  if (!isReady || auth.isLoading || isLoading) {
    return <LoadingScreen message="Linking Service Node..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
          <Lock className="h-8 w-8 text-rose-500 animate-pulse" />
        </div>
        <h1 className="text-lg font-black uppercase italic tracking-tighter">Handshake Required</h1>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-[200px]">
          Identity node unverified. Re-launch via Bot terminal.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-6 rounded-xl text-[9px] font-black uppercase">Force Re-Sync</Button>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <ShieldCheck className="h-10 w-10 text-muted-foreground opacity-20 mb-4" />
        <h1 className="text-lg font-black uppercase italic tracking-tight">Node_Offline</h1>
        <Button onClick={() => router.push("/services")} className="mt-4 rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[9px]">Return to Hub</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: ROLE AWARE --- */}
      <header className="px-5 py-6 md:py-8 rounded-b-2xl border-b border-border/10 bg-card/40 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] rotate-12 pointer-events-none">
          <Fingerprint className="h-24 w-24 md:h-32 md:w-32" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.4em] flex items-center gap-1.5",
              isStaff ? "text-amber-500" : "text-primary"
            )}>
              <div className={cn("h-1 w-1 rounded-full animate-pulse", isStaff ? "bg-amber-500" : "bg-primary")} />
              {isStaff ? "Oversight Handshake" : "Signal Ingress"}
            </span>
            {isStaff && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[7px] font-black tracking-widest">
                STAFF_MODE
              </Badge>
            )}
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-none truncate text-foreground pr-8">
              {service.name}
            </h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Node: {data?.merchant?.companyName || "ROOT_NODE"}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-40">
        
        {/* --- TELEMETRY GRID --- */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Hardened", color: isStaff ? "text-amber-500" : "text-primary", bg: isStaff ? "bg-amber-500/5" : "bg-primary/5" },
            { icon: Zap, label: "Instant", color: "text-amber-500", bg: "bg-amber-500/5" },
            { icon: Activity, label: "Live", color: "text-emerald-500", bg: "bg-emerald-500/5" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/40 p-3.5 shadow-sm">
              <div className={cn("rounded-lg p-2", item.bg)}>
                <item.icon className={cn("h-4 w-4", item.color)} />
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/60">
                {item.label}
              </span>
            </div>
          ))}
        </section>

        {/* --- SELECTION ARCHITECTURE --- */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1 opacity-40 italic">
             <Terminal className={cn("h-3 w-3", isStaff && "text-amber-500")} />
             <h3 className="text-[8px] font-black uppercase tracking-[0.4em]">
               {isStaff ? "Audit Node Calibration" : "Calibration Nodes"}
             </h3>
          </div>
          <div className="rounded-xl border border-border/40 bg-card/40 p-1 shadow-sm">
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
          <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background/90 to-transparent backdrop-blur-md z-50">
            <Button
              className={cn(
                "h-12 md:h-14 w-full rounded-xl text-[10px] md:text-[11px] font-black uppercase italic tracking-widest shadow-xl transition-all active:scale-95",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
              )}
              disabled={!selectedTierId || isSubmitting}
              onClick={handleSubscribe}
            >
              {isSubmitting ? "Syncing Handshake..." : isStaff ? "Finalize Audit Sync" : "Finalize Activation"}
            </Button>
          </div>
        )}

        {/* FOOTER SIGNAL */}
        <footer className="flex items-center justify-center gap-3 opacity-20 py-4">
           <Globe className="h-2.5 w-2.5 text-muted-foreground" />
           <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
             Zipha Protocol v2.26 // State: {isStaff ? "OVERSIGHT" : "OPTIMAL"}
           </p>
        </footer>
      </main>
    </div>
  );
}