"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Globe, 
  Lock, 
  Fingerprint,
  ChevronLeft,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/hooks/use-institutional-auth";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { TierSelector } from "@/components/app/tier-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
 * 🛰️ SERVICE DEPLOYMENT TERMINAL (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware checkout ingress with hardware-fluid radiance.
 */
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; serviceId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { impact, notification } = useHaptics();
  
  // 🛡️ AUTH & IDENTITY
  const { auth, isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  
  // 🛰️ DEVICE PHYSICS
  const { 
    screenSize, isMobile, isTablet, isDesktop, 
    isPortrait, safeArea, viewportWidth, isReady 
  } = useDeviceContext();

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  // 🛰️ DATA INGRESS: Standardized Sync Engine
  const { data: service, loading: apiLoading } = useInstitutionalFetch<Service>(
    isAuthenticated ? `/api/service/${resolvedParams.merchantId}/${resolvedParams.serviceId}` : null,
    {
      onSuccess: (data) => {
        if (data?.tiers?.length > 0) setSelectedTierId(data.tiers[0].id);
      }
    }
  );

  // 🛰️ CHECKOUT ENGINE: Hardened Handshake
  const { execute: startCheckout, loading: isSubmitting } = useInstitutionalFetch(
    async (payload: { tierId: string; merchantId: string; serviceId: string }) => {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("INVOICE_SYNC_FAILED");
      return res.json();
    },
    {
      onSuccess: (data: { invoiceUrl: string }) => {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openInvoice(data.invoiceUrl, (status: string) => {
            if (status === "paid") {
              notification("success");
              router.push("/home?payment=success");
            }
          });
        }
      },
      onError: () => notification("error")
    }
  );

  const handleActivation = () => {
    if (!selectedTierId || !service) return;
    impact("heavy");
    startCheckout({
      merchantId: resolvedParams.merchantId,
      serviceId: service.id,
      tierId: selectedTierId
    });
  };

  // 🛡️ HYDRATION GUARD
  if (!isReady || isLocked) return <LoadingScreen message="DECRYPTING_SIGNAL_NODE..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   */
  const headerPaddingTop = `calc(${safeArea.top}px + 1.5rem)`;
  const metricsGrid = screenSize === 'xs' ? "grid-cols-1" : "grid-cols-3";
  const contentMaxWidth = isDesktop ? "max-w-5xl" : "max-w-3xl";

  if (!service && !apiLoading) return <NodeOfflineFallback router={router} />;

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 selection:bg-primary/30">
      
      {/* 🌊 HEADER: Hardware-aware safeArea */}
      <header 
        className="px-6 pb-10 rounded-b-[3rem] md:rounded-b-[4rem] border-b border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex relative overflow-hidden transition-all duration-700"
        style={{ paddingTop: headerPaddingTop }}
      >
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 pointer-events-none transition-transform duration-[2000ms]">
          <Fingerprint style={{ width: `${viewportWidth * 0.2}px`, height: `${viewportWidth * 0.2}px` }} />
        </div>

        <div className="max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
          <div className="flex items-center justify-between">
            <Badge className={cn(
              "px-3 py-1 rounded-xl text-[9px] font-black tracking-[0.3em] uppercase italic border-none",
              isStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
            )}>
              {isStaff ? "OVERSIGHT_CLEARANCE" : "VERIFIED_INBOUND"}
            </Badge>
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 bg-white/5" onClick={() => router.back()}>
              <ChevronLeft className="size-5 opacity-40" />
            </Button>
          </div>
          <div className="space-y-2 min-w-0">
            <h1 className="text-[var(--fluid-h1)] font-black uppercase italic tracking-tighter leading-none truncate">
              {service?.name}
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em] italic leading-none">
              NODE_ID: {service?.id?.slice(0, 12)}
            </p>
          </div>
        </div>
      </header>

      <main className={cn("flex-1 px-6 py-10 space-y-12 pb-48 mx-auto w-full transition-all", contentMaxWidth)}>
        
        {/* --- TELEMETRY MODULES: Morphology Grid --- */}
        <section className={cn("grid gap-4 md:gap-6", metricsGrid)}>
          <MetricBlock icon={Shield} label="HARDENED" color={isStaff ? "text-amber-500" : "text-primary"} bg={isStaff ? "bg-amber-500/5" : "bg-primary/5"} />
          <MetricBlock icon={Zap} label="INSTANT" color="text-amber-500" bg="bg-amber-500/5" />
          <MetricBlock icon={Activity} label="LIVE_SYNC" color="text-emerald-500" bg="bg-emerald-500/5" />
        </section>

        {/* --- TIER SELECTION: Kinetic Focus --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
            <Terminal className={cn("size-4", isStaff && "text-amber-500")} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Identity_Options</h3>
          </div>
          <div className="rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 bg-card/40 p-2 shadow-apex backdrop-blur-3xl overflow-hidden">
            <TierSelector
              tiers={service?.tiers || []}
              selectedTierId={selectedTierId}
              onSelect={(id) => { setSelectedTierId(id); impact("light"); }}
              currency={service?.currency || "USD"}
            />
          </div>
        </section>

        {/* --- SYSTEM COMPLIANCE --- */}
        <footer className="flex flex-col items-center gap-4 py-10 opacity-20 italic">
          <Globe className="size-6" />
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center leading-none">
            Zipha_Deployment_Protocol // Hardware_{screenSize.toUpperCase()} // v16.29_Apex
          </p>
        </footer>
      </main>

      {/* 🚀 ACTION NODE: Bottom-Anchored with Safe-Area padding */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-6 z-[100] transition-all duration-1000"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 1.5rem)` }}
      >
        <div className={cn("mx-auto", contentMaxWidth)}>
          <Button 
            disabled={!selectedTierId || isSubmitting}
            onClick={handleActivation}
            className={cn(
              "w-full h-20 md:h-24 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] shadow-apex active:scale-95 transition-all duration-1000 group",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/30"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-4">
                <Waves className="size-6 animate-bounce" />
                <span className="animate-pulse">Provisioning_Node...</span>
              </div>
            ) : (
              <span className="flex items-center gap-3">
                {selectedTierId ? "Initialize_Handshake" : "Select_Tier_Allocation"}
                {!isSubmitting && <Zap className="size-5 fill-current animate-pulse" />}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MetricBlock({ icon: Icon, label, color, bg }: any) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-white/5 bg-card/40 p-8 shadow-apex backdrop-blur-md group hover:bg-white/[0.02] transition-all duration-700">
      <div className={cn("rounded-2xl p-4 shadow-inner transition-transform group-hover:scale-110 duration-700", bg)}>
        <Icon className={cn("size-6", color)} />
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">{label}</span>
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 bg-background">
      <div className="rounded-[3rem] bg-card border border-rose-500/10 p-12 shadow-apex text-center space-y-8 max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
        <Lock className="size-12 text-rose-500 mx-auto animate-pulse opacity-40" />
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Identity_Null</h1>
        <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-foreground font-black uppercase italic tracking-widest shadow-apex">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}

function NodeOfflineFallback({ router }: { router: any }) {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-1000">
      <ShieldCheck className="size-16 opacity-10 mb-8 animate-pulse text-primary" />
      <h1 className="text-2xl font-black italic opacity-40 uppercase tracking-tighter leading-none">Node_Offline</h1>
      <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] mt-4 italic leading-relaxed max-w-[260px]">
        This service cluster is currently unreachable. Signal restoration in progress.
      </p>
      <Button onClick={() => router.push("/home")} className="mt-12 h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest shadow-apex">Return_to_Hub</Button>
    </div>
  );
}