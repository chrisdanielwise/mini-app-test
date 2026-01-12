"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/src/lib/hooks/use-api";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { ServiceCard } from "@/src/components/app/service-card";
import { SkeletonList } from "@/src/components/ui/skeleton-card";
import { Input } from "@/src/components/ui/input";
import { 
  Search, Package, ShieldCheck, Zap, Globe, Terminal, Filter
} from "lucide-react";
import { cn } from "@/src/lib/utils";

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
 * 🛰️ APEX DISCOVERY CORE
 * Resolves ID format conflicts before database ingress.
 */
function ServicesTerminalContent() {
  const { auth, isReady, user } = useTelegramContext();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * 🛡️ PROTOCOL SYNC: Identity Resolution
   * 1. Priority: URL Search Parameter (Direct link)
   * 2. Secondary: Authenticated Session (Handshake result)
   * 3. Fallback: Null (Prevents 400 Bad Request)
   */
  const urlMerchantId = searchParams.get("merchant");
  const targetMerchantId = urlMerchantId || user?.merchantId;

  // UUID Format Guard: Only allows strings matching UUID pattern
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
    <div className="min-h-screen space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- HUD HEADER: BRANDED IDENTITY --- */}
      <header className="p-8 pt-14 bg-card/40 border-b border-border/40 backdrop-blur-3xl rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/5 blur-[80px] rounded-full" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Cluster Ingress</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              {data?.merchant?.companyName || "Loading Node..."}
            </h1>
            <div className="flex items-center gap-3 opacity-40 italic">
               <Globe className="h-3 w-3" />
               <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                 Node: {targetMerchantId?.slice(0, 12) || "SYNCING"}
               </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 space-y-8">
        {/* --- SEARCH PROTOCOL --- */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="FILTER SIGNAL NODES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-16 rounded-2xl bg-card/60 border-border/40 font-black uppercase italic text-xs tracking-tighter shadow-inner"
          />
        </div>

        {/* --- SERVICE MESH LAYER --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
             <div className="flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Available Assets</h2>
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest">{filteredServices?.length || 0} Nodes Live</span>
          </div>

          {isLoading ? (
            <SkeletonList count={3} />
          ) : error || (!targetMerchantId && !isLoading) ? (
            <div className="rounded-[2.5rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-4">
              <ShieldCheck className="mx-auto h-12 w-12 text-rose-500 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
                {!targetMerchantId ? "Identity Context Missing" : "Protocol Error: Cluster Sync Failed"}
              </p>
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="space-y-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} {...service} merchantId={targetMerchantId!} />
              ))}
            </div>
          ) : (
            <div className="rounded-[4rem] border border-dashed border-border/40 bg-card/20 p-20 text-center">
              <Package className="mx-auto mb-6 h-16 w-16 text-primary opacity-10" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Zero Nodes</h3>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/**
 * 🛡️ SUSPENSE BOUNDARY
 * Required for Next.js 15 Client-Side searchParams access.
 */
export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Initializing Mesh..." />}>
      <ServicesTerminalContent />
    </Suspense>
  );
}