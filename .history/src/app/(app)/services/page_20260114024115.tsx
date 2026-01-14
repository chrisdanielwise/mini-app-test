"use client";

import { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { ServiceCard } from "@/components/app/service-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  ShieldCheck,
  Zap,
  Globe,
  Terminal,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isUUID } from "@/lib/utils/validators";

// --- INTERFACES ---
interface Service {
  id: string;
  name: string;
  description?: string;
  currency: string;
  categoryTag?: string;
  tiers: Array<{
    id: string;
    name: string;
    price: string;
    interval: string;
    type: string;
  }>;
}

interface MerchantData {
  merchant: {
    id: string;
    companyName?: string;
    botUsername?: string;
  };
  services: Service[];
}

/**
 * 🛰️ APEX DISCOVERY CORE (Institutional v9.5.7)
 * Architecture: Synchronized Identity Protocol with Multi-Tenant Cluster support.
 * Hardened: Next.js 16 Hydration Shield & Telegram MainButton Reset.
 */
function ServicesTerminalContent() {
  const { auth, isReady, user: tgUser, mounted, setMainButton } = useTelegramContext();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [tunnelReady, setTunnelReady] = useState(false);

  // 🛡️ HYDRATION SHIELD: Prevents SSR/CSR desync in Next.js 16
  // 🛡️ HYDRATION SHIELD: Prevents SSR/CSR desync in Next.js 16
useEffect(() => {
  if (mounted) {
    setTunnelReady(true);
    
    // 🚩 THE FIX: Do not set text to "". Keep it as "OK" or similar, even if invisible.
    setMainButton({ 
      text: "CONTINUE", // Cannot be empty
      visible: false    // This keeps it hidden from the user
    });
  }
}, [mounted, setMainButton]);

  const urlMerchantId = searchParams.get("merchant");
  const targetMerchantId = urlMerchantId || auth?.user?.merchant || tgUser?.merchantId;

  // 🛡️ DATA AUDIT
  const { data, isLoading, error } = useApi<MerchantData>(
    auth?.isAuthenticated && targetMerchantId && isUUID(targetMerchantId)
      ? `/api/merchant/${targetMerchantId}/services`
      : null
  );

  const isStaff = useMemo(() => 
    auth?.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role),
    [auth?.user?.role]
  );

  // 1. SYSTEM INITIALIZATION: Wait for SDK and Client Mount
  if (!isReady || !tunnelReady || auth?.isLoading) {
    return <LoadingScreen message="Establishing Identity Link..." />;
  }

  // 2. CRYPTOGRAPHIC GATE
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-12 w-12 text-rose-500 mx-auto animate-pulse opacity-40 shadow-inner" />
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Identity Null</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Identity signature invalid.<br />Re-verify via official Bot terminal.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-12 rounded-xl bg-muted/10 border border-border/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-muted/20 transition-all"
          >
            Initiate Resync
          </button>
        </div>
      </div>
    );
  }

  const filteredServices = data?.services?.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[100dvh] pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-7xl mx-auto text-foreground selection:bg-primary/30">
      
      {/* --- HUD HEADER --- */}
      <header className="px-6 py-8 md:p-12 md:pt-16 bg-card/40 border-b border-border/40 backdrop-blur-2xl rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className={cn(
          "absolute -top-10 -right-10 h-40 w-40 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000",
          isStaff ? "bg-amber-500/15" : "bg-primary/10"
        )} />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("h-2 w-2 rounded-full animate-pulse", isStaff ? "bg-amber-500" : "bg-primary")} />
              <span className={cn("text-[11px] font-black uppercase tracking-[0.5em] italic", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Universal_Oversight" : "Cluster_Ingress"}
              </span>
            </div>
            {isStaff && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[8px] tracking-[0.2em] px-2 py-0.5 shadow-sm">
                STAFF_ACCESS
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none truncate pr-10">
              {data?.merchant?.companyName || "Syncing Mesh..."}
            </h1>
            <div className="flex items-center gap-3 opacity-30 italic mt-2">
              <Globe className={cn("h-4 w-4", isStaff && "text-amber-500")} />
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">
                NODE: {targetMerchantId?.toUpperCase().slice(0, 16) || "PENDING_SIGNAL"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 md:px-10 space-y-10 mt-10">
        {/* --- SEARCH PROTOCOL --- */}
        <div className="relative group">
          <Search className={cn(
            "absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-all duration-500 z-10 group-hover:scale-110",
            isStaff ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
          )} />
          <Input
            type="search"
            placeholder="FILTER SIGNAL NODES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-14 h-16 rounded-2xl bg-card/60 border-border/40 font-black uppercase italic text-xs tracking-tighter shadow-2xl backdrop-blur-md transition-all active:scale-[0.99]",
              isStaff ? "focus-visible:ring-amber-500/50" : "focus-visible:ring-primary/50"
            )}
          />
        </div>

        {/* --- SERVICE MESH LAYER --- */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
            <div className="flex items-center gap-3">
              <Terminal className={cn("h-4 w-4", isStaff && "text-amber-500")} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">
                {isStaff ? "Platform_Cluster_Audit" : "Available_Assets"}
              </h2>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest tabular-nums">
              {filteredServices?.length || 0} NODES ACTIVE
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <SkeletonList count={3} />
            </div>
          ) : error || (!targetMerchantId && !isLoading) ? (
            <div className="rounded-[2.5rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-6 shadow-inner relative overflow-hidden">
              <ShieldCheck className="mx-auto h-12 w-12 text-rose-500 opacity-20 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-[0.4em] text-rose-500 leading-relaxed">
                {!targetMerchantId
                  ? "Identity_Context_Missing"
                  : "Protocol_Error: Cluster_Sync_Failed"}
              </p>
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="space-y-8">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  merchantId={targetMerchantId!}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[3rem] border border-dashed border-border/20 bg-card/20 p-24 text-center shadow-inner relative overflow-hidden">
              <Package className="mx-auto mb-6 h-16 w-16 text-primary opacity-5 animate-pulse" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none opacity-40">
                Vault <span className="text-primary/60">Empty</span>
              </h3>
              <p className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-20 italic">
                No signal nodes detected in this cluster.
              </p>
            </div>
          )}
        </section>
      </div>

      <footer className="flex flex-col items-center gap-4 opacity-20 py-12 mt-auto">
         <Globe className="h-5 w-5" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center leading-none">
           Zipha Network Discovery // Protocol: Mesh_V2
         </p>
      </footer>
    </div>
  );
}

/**
 * 🛡️ SUSPENSE BOUNDARY
 * Essential for Next.js 16 Client-side SearchParams resolution.
 */
export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Initializing Mesh..." />}>
      <ServicesTerminalContent />
    </Suspense>
  );
}