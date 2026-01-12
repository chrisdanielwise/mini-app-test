"use client";

import { useState, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { ServiceCard } from "@/components/app/service-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Input } from "@/components/ui/input";
import { 
  Search, Package, ShieldCheck, Zap, Globe, Terminal, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

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
 * 🛰️ APEX DISCOVERY CORE (Fluid Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive search protocol for high-velocity signal discovery.
 */
function ServicesTerminalContent() {
  const { auth, isReady, user } = useTelegramContext();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const urlMerchantId = searchParams.get("merchant");
  const targetMerchantId = urlMerchantId || user?.merchantId;

  // UUID Format Guard
  const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  const { data, isLoading, error } = useApi<MerchantData>(
    isReady && targetMerchantId && isValidUUID(targetMerchantId)
      ? `/api/merchant/${targetMerchantId}/services`
      : null
  );

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Establishing Identity Link..." />;
  }

  const filteredServices = data?.services?.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-6 md:space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- HUD HEADER: BRANDED IDENTITY --- */}
      <header className="px-5 py-8 md:p-10 md:pt-14 bg-card/40 border-b border-border/40 backdrop-blur-3xl rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 md:h-40 md:w-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Cluster Ingress</span>
          </div>
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none truncate pr-8">
              {data?.merchant?.companyName || "Loading Node..."}
            </h1>
            <div className="flex items-center gap-3 opacity-40 italic">
               <Globe className="h-3 w-3" />
               <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">
                 Node: {targetMerchantId?.slice(0, 16) || "SYNCING"}
               </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-8 md:space-y-10">
        {/* --- SEARCH PROTOCOL --- */}
        <div className="relative group px-1">
          <Search className="absolute left-5 md:left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
          <Input
            type="search"
            placeholder="FILTER SIGNAL NODES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 md:pl-14 h-14 md:h-16 rounded-xl md:rounded-2xl bg-card/60 border-border/40 font-black uppercase italic text-xs tracking-tighter shadow-inner transition-all active:scale-[0.99]"
          />
        </div>

        {/* --- SERVICE MESH LAYER --- */}
        <section className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
             <div className="flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Available Assets</h2>
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest">{filteredServices?.length || 0} Nodes Live</span>
          </div>

          {isLoading ? (
            <SkeletonList count={3} />
          ) : error || (!targetMerchantId && !isLoading) ? (
            <div className="rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-12 md:p-16 text-center space-y-4 shadow-inner">
              <ShieldCheck className="mx-auto h-10 w-10 md:h-12 md:w-12 text-rose-500 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
                {!targetMerchantId ? "Identity Context Missing" : "Protocol Error: Cluster Sync Failed"}
              </p>
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="space-y-6 md:space-y-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} {...service} merchantId={targetMerchantId!} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] md:rounded-[4rem] border border-dashed border-border/40 bg-card/20 p-16 md:p-20 text-center shadow-inner relative overflow-hidden">
              <Package className="mx-auto mb-4 md:mb-6 h-12 w-12 md:h-16 md:w-16 text-primary opacity-10" />
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none opacity-40">Zero Signal Nodes</h3>
              <p className="mt-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-20">Broadcast Cluster empty.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/**
 * 🛡️ SUSPENSE BOUNDARY
 */
export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Initializing Mesh..." />}>
      <ServicesTerminalContent />
    </Suspense>
  );
}