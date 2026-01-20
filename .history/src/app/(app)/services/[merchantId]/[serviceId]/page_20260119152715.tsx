"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Zap,
  Terminal,
  Activity,
  Lock,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { TierSelector } from "@/components/app/tier-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ✅ FIX: TS2304 - Correct type import from Prisma
import { Service } from "@/generaged/prisma";

/**
 * 🛰️ SERVICE_DETAIL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon.
 */
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; serviceId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { impact, notification } = useHaptics();

  const { isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  const { isReady, safeArea } = useDeviceContext();

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  // ✅ FIX: Explicitly typing the fetcher return to resolve TS2304
  const { data: service, loading: apiLoading } = useInstitutionalFetch<
    Service & { tiers: any[] }
  >(
    isAuthenticated
      ? `/api/service/${resolvedParams.merchantId}/${resolvedParams.serviceId}`
      : null,
    {
      onSuccess: (data) => {
        if (data?.tiers && data.tiers.length > 0)
          setSelectedTierId(data.tiers[0].id);
      },
    }
  );

  // ✅ FIX: TS2345 - Standardizing the fetcher signature for Next.js 15 compliance
  const { execute: triggerCheckout, loading: isSubmitting } =
    useInstitutionalFetch(
      async () => {
        // We will pass the payload directly to the fetch within this thunk
        // when we call execute(true, payload) later.
      },
      {
        manual: true, // 🛡️ Institutional Protocol: prevents auto-run on mount
        onSuccess: (data: { invoiceUrl: string }) => {
          const tg = (window as any).Telegram?.WebApp;
          if (tg?.openInvoice) {
            tg.openInvoice(data.invoiceUrl, (status: string) => {
              if (status === "paid") {
                notification("success");
                router.push("/home?payment=success");
              }
            });
          }
        },
        onError: () => notification("error"),
      }
    );

  if (!isReady || isLocked)
    return <LoadingScreen message="DECRYPTING_SIGNAL_NODE..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;
  if (!service && !apiLoading) return <NodeOfflineFallback router={router} />;

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 leading-none bg-black">
      {/* 🛡️ FIXED HUD: Stationary Header */}
      <header
        className="px-5 py-6 md:px-8 md:py-8 border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl z-50"
        style={{ paddingTop: `calc(${safeArea.top}px + 1rem)` }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge
              className={cn(
                "px-2 py-0.5 rounded text-[7px] font-black tracking-widest uppercase italic border-none",
                isStaff
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-primary/10 text-primary"
              )}
            >
              {isStaff ? "OVERSIGHT" : "VERIFIED_INBOUND"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 bg-white/5 rounded-lg"
              onClick={() => router.back()}
            >
              <ChevronLeft className="size-4.5 opacity-40" />
            </Button>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground truncate">
              {service?.name}
            </h1>
            <p className="text-[7.5px] font-black uppercase tracking-[0.4em] opacity-20 italic">
              ID_{service?.id?.slice(0, 12)}
            </p>
          </div>
        </div>
      </header>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 px-5 py-8 space-y-10 pb-32">
        <section className="grid grid-cols-3 gap-3">
          <MetricBlock
            icon={Shield}
            label="HARDENED"
            color={isStaff ? "text-amber-500" : "text-primary"}
          />
          <MetricBlock icon={Zap} label="INSTANT" color="text-amber-500" />
          <MetricBlock
            icon={Activity}
            label="LIVE_SYNC"
            color="text-emerald-500"
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1 opacity-10 italic">
            <Terminal className="size-3" />
            <h3 className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              Identity_Allocation
            </h3>
          </div>
          <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-3 shadow-2xl backdrop-blur-xl">
            <TierSelector
              tiers={service?.tiers || []}
              selectedTierId={selectedTierId}
              onSelect={(id: string) => {
                setSelectedTierId(id);
                impact("light");
              }}
              currency={service?.currency || "$"}
            />
          </div>
        </section>
      </main>

      {/* 🏁 STATIONARY ACTION */}
      <div
        className="fixed bottom-0 left-0 right-0 p-5 z-[100] bg-gradient-to-t from-black via-black/80 to-transparent"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 1rem)` }}
      >
        <Button
          disabled={!selectedTierId || isSubmitting}
          onClick={() => {
            impact("heavy");

            // 🛰️ TACTICAL EXECUTION
            // Your hook's execute signature is: (isInitial, payload)
            // We pass 'true' for isInitial and our data object as 'payload'
            triggerCheckout(true, {
              merchantId: resolvedParams.merchantId,
              serviceId: service?.id,
              tierId: selectedTierId,
            });
          }}
        >
          {isSubmitting ? "Provisioning_Node..." : "Initialize_Handshake"}
        </Button>
      </div>
    </div>
  );
}

/** --- ATOMIC SUBCOMPONENTS --- */

function MetricBlock({
  icon: Icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-zinc-950/40 p-5 shadow-lg">
      <div className="rounded-lg p-2.5 bg-white/5">
        <Icon className={cn("size-4", color)} />
      </div>
      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-20">
        {label}
      </span>
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-black text-center space-y-6">
      <Lock className="size-10 text-rose-500 opacity-20" />
      <h1 className="text-xl font-black uppercase italic tracking-tighter">
        Identity_Null
      </h1>
      <Button
        onClick={() => window.location.reload()}
        className="h-11 px-8 rounded-xl bg-rose-500 text-white font-black text-[9px] uppercase italic"
      >
        Initiate_Re-Sync
      </Button>
    </div>
  );
}

function NodeOfflineFallback({ router }: { router: any }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center space-y-6 bg-black">
      <ShieldCheck className="size-14 opacity-10 text-primary" />
      <h1 className="text-xl font-black italic opacity-40 uppercase tracking-tighter">
        Node_Offline
      </h1>
      <Button
        onClick={() => router.push("/home")}
        className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-black text-[9px] uppercase italic"
      >
        Return_to_Hub
      </Button>
    </div>
  );
}
