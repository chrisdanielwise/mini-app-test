"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/src/lib/hooks/use-api";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { ServiceCard } from "@/src/components/mini-app/service-card";
import { SkeletonList } from "@/src/components/ui/skeleton-card";
import { Input } from "@/src/components/ui/input";
import { 
  Search, 
  Package, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Terminal, 
  Fingerprint,
  Filter
} from "lucide-react";
import { cn } from "@/src/lib/utils";

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
    compareAtPrice?: string;
    discountPercentage: number;
    interval: string;
    intervalCount: number;
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
 * 🛒 DISCOVERY TERMINAL (Apex Tier)
 * Multi-tenant service node isolated to a specific Merchant Identity.
 */
export default function ServicesPage() {
  const { auth, isReady } = useTelegramContext();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchant");
  const [searchQuery, setSearchQuery] = useState("");

  // 🛡️ Multi-Tenancy Guard
  const targetMerchantId = merchantId || "demo-merchant";

  const { data, isLoading, error } = useApi<MerchantData>(
    auth.isAuthenticated ? `/api/merchant/${targetMerchantId}/services` : null
  );

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Marketplace Nodes..." />;
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Signal Cluster Ingress
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              {data?.merchant?.companyName || "Service Nodes"}
            </h1>
            <div className="flex items-center gap-3 opacity-40 italic">
               <Globe className="h-3 w-3" />
               <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                 Node: {targetMerchantId.slice(0, 12)}...
               </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 space-y-8">
        {/* --- SEARCH PROTOCOL: TACTICAL FILTER --- */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <Input
              type="search"
              placeholder="FILTER SIGNAL NODES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-16 rounded-2xl bg-card/60 border-border/40 focus:ring-primary/20 backdrop-blur-md transition-all font-black uppercase italic text-xs tracking-tighter placeholder:opacity-20 shadow-inner"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
               <Filter className="h-4 w-4 opacity-20" />
            </div>
          </div>
        </div>

        {/* --- SERVICE MESH LAYER --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
             <div className="flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Available Assets</h2>
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest">
               {filteredServices?.length || 0} Nodes Live
             </span>
          </div>

          {isLoading ? (
            <SkeletonList count={3} />
          ) : error ? (
            <div className="rounded-[2.5rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-4 shadow-inner">
              <ShieldCheck className="mx-auto h-12 w-12 text-rose-500 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
                Protocol Error: Cluster Sync Failed
              </p>
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="space-y-8">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  merchantId={targetMerchantId}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[4rem] border border-dashed border-border/40 bg-card/20 p-20 text-center backdrop-blur-sm relative overflow-hidden">
              <Package className="mx-auto mb-6 h-16 w-16 text-primary opacity-10" />
              <div className="space-y-2 relative z-10">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Zero Nodes</h3>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] max-w-[180px] mx-auto opacity-50">
                   {searchQuery ? "No matches found in this cluster" : "Provider has no active deployments."}
                 </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* --- DYNAMIC STATUS FLOATER --- */}
      <div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none px-8 animate-in slide-in-from-bottom-10 duration-1000 delay-500">
        <div className="bg-background/40 backdrop-blur-2xl border border-border/40 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl pointer-events-auto">
          <div className="relative">
             <Zap className="h-4 w-4 text-primary fill-primary" />
             <div className="absolute inset-0 bg-primary blur-md rounded-full opacity-40 animate-pulse" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary italic">
            Zipha Secure Gateway: Active
          </span>
        </div>
      </div>
    </div>
  );
}