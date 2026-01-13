"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApi, apiPost } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { TierSelector } from "@/components/app/tier-selector";
import { Button } from "@/components/ui/button";
import { Shield, Zap, ShieldCheck, Terminal, Activity, Globe, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { isUUID } from "@/lib/utils/validators";

export default function ServiceDetailPage({ params }: { params: Promise<any> }) {
  // 🛡️ Layer 1: Unwrap parameters safely
  const resolvedParams = use(params);
  const merchantId = resolvedParams?.merchantId;
  const serviceId = resolvedParams?.serviceId;

  const router = useRouter();
  const { auth, isReady, mounted, isTelegram, setMainButton, webApp } = useTelegramContext();

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  // 🛡️ Layer 2: Hydration & Timeout Shield
  useEffect(() => {
    const timer = setTimeout(() => { if (!isReady) setIsStuck(true); }, 4000);
    return () => clearTimeout(timer);
  }, [isReady]);

  // 🛰️ Data Ingress with UUID validation
  const { data, isLoading } = useApi<any>(
    auth?.isAuthenticated && isUUID(serviceId) ? `/api/service/${serviceId}` : null
  );

  // 🛡️ Layer 3: Safe Data Extraction (Prevents BigInt rendering crash)
  const service = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      id: String(data.id),
      name: String(data.name || "Unknown Node"),
      currency: String(data.currency || "USD"),
      tiers: Array.isArray(data.tiers) ? data.tiers.map((t: any) => ({
        ...t,
        id: String(t.id),
        price: String(t.price) // 🚀 Critical: force price to string
      })) : []
    };
  }, [data]);

  const isStaff = useMemo(() => auth?.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role), [auth?.user?.role]);

  // 🎮 Telegram UI Sync
  useEffect(() => {
    if (!isTelegram || !isReady || !service) return;

    if (!selectedTierId) {
      setMainButton({ text: "SELECT ACCESS LEVEL", visible: true, active: false });
    } else {
      const tier = service.tiers.find((t: any) => t.id === selectedTierId);
      if (tier) {
        setMainButton({
          text: `ACTIVATE ${tier.name.toUpperCase()} - ${service.currency} ${tier.price}`,
          visible: true,
          active: !isSubmitting,
          is_progress_visible: isSubmitting,
          color: isStaff ? "#f59e0b" : "#10b981",
          onClick: async () => {
            setIsSubmitting(true);
            try {
              const res = await apiPost<any>("/api/payments/checkout", { merchantId, tierId: selectedTierId, serviceId: service.id });
              if (res.invoiceUrl && webApp) webApp.openInvoice(res.invoiceUrl, (s: string) => s === "paid" ? router.push("/home") : setIsSubmitting(false));
            } catch { setIsSubmitting(false); }
          }
        });
      }
    }
    return () => setMainButton({ text: "", visible: false });
  }, [service, selectedTierId, isSubmitting, isTelegram, isReady, isStaff]);

  // 🛰️ Rendering Barriers
  if (!mounted || !isReady && !isStuck || isLoading || auth?.isLoading) {
    return <LoadingScreen message="Syncing Nodes..." subtext="SECURE TUNNEL ACTIVE" />;
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center space-y-6">
        <ShieldCheck className="h-12 w-12 opacity-10" />
        <h1 className="text-xl font-black italic uppercase opacity-40">Node Offline</h1>
        <Button onClick={() => router.push("/services")} className="rounded-xl h-12 px-8">Return to Hub</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      <header className="px-6 py-8 md:py-10 rounded-b-[2rem] border-b border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 pointer-events-none"><Fingerprint className="h-32 w-32" /></div>
        <div className="relative z-10 space-y-4">
          <span className={cn("text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2", isStaff ? "text-amber-500" : "text-primary")}>
            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isStaff ? "bg-amber-500" : "bg-primary")} />
            {isStaff ? "Oversight_Clearance" : "Verified_Inbound"}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-none truncate">{service.name}</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Cluster ID: {merchantId.slice(0, 8)}...</p>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 pb-44">
        <section className="grid grid-cols-3 gap-4">
          {[
            { icon: Shield, label: "Hardened", color: isStaff ? "text-amber-500" : "text-primary", bg: isStaff ? "bg-amber-500/5" : "bg-primary/5" },
            { icon: Zap, label: "Instant", color: "text-amber-500", bg: "bg-amber-500/5" },
            { icon: Activity, label: "Live_Sync", color: "text-emerald-500", bg: "bg-emerald-500/5" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-4 shadow-lg">
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
            <TierSelector tiers={service.tiers} selectedTierId={selectedTierId} onSelect={setSelectedTierId} currency={service.currency} />
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