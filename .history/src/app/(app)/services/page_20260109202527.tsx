"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/src/lib/hooks/use-api";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { ServiceCard } from "@/src/components/mini-app/service-card";
import { SkeletonList } from "@/src/components/ui/skeleton-card";
import { Input } from "@/src/components/ui/input";
import { Search, Package, ShieldCheck, Zap } from "lucide-react";

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
 * 🛒 USER-FACING STOREFRONT (Tier 3)
 * Multi-tenant service node isolated to a specific Merchant ID.
 */
export default function ServicesPage() {
  const { auth, isReady } = useTelegramContext();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchant");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔐 Multi-Tenancy Protection
  const targetMerchantId = merchantId || "demo-merchant";

  const { data, isLoading, error } = useApi<MerchantData>(
    auth.isAuthenticated ? `/api/merchant/${targetMerchantId}/services` : null
  );

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Establishing Connection..." />;
  }

  const filteredServices = data?.services?.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- BRANDED HEADER --- */}
      <header className="space-y-2 pt-4 px-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Authorized Provider
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
          {data?.merchant?.companyName || "Service Nodes"}
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
          Cluster: <span className="text-foreground">{targetMerchantId.slice(0, 8)}</span>
        </p>
      </header>

      {/* --- SEARCH PROTOCOL --- */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="search"
          placeholder="Filter Cluster Services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 rounded-2xl bg-card/50 border-border/50 focus:ring-primary/10 transition-all font-medium italic"
        />
      </div>

      {/* --- DATA VISUALIZATION LAYER --- */}
      <section className="pb-20">
        {isLoading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <div className="rounded-[2.5rem] border border-dashed border-destructive/30 bg-destructive/5 p-10 text-center">
            <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-destructive opacity-40" />
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive">
              Protocol Error: Failed to load Cluster Data
            </p>
          </div>
        ) : filteredServices && filteredServices.length > 0 ? (
          <div className="space-y-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                currency={service.currency}
                tiers={service.tiers}
                merchantId={targetMerchantId}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[3rem] border border-dashed border-border/60 bg-card/30 backdrop-blur-sm p-16 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-black uppercase italic tracking-tighter">No Active Nodes</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
              {searchQuery ? "No matches found in this cluster" : "Provider has no active deployments"}
            </p>
          </div>
        )}
      </section>

      {/* --- STATUS FOOTER --- */}
      <div className="fixed bottom-28 left-0 right-0 flex justify-center pointer-events-none px-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
          <Zap className="h-3 w-3 text-primary fill-primary" />
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
            Zipha Secure Gateway Active
          </span>
        </div>
      </div>
    </div>
  );
}