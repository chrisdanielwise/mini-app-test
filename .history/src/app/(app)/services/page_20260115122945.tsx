"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useInstitutionalAuth } from "@/hooks/use-institutional-auth";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { IdentityNull } from "@/components/auth/identity-null";
import { ServiceCard } from "@/components/app/service-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { DiscoveryHeader } from "@/components/app/discovery-header"; // Extracted
import { SearchProtocol } from "@/components/app/search-protocol";   // Extracted
import { Globe, Terminal, ShieldCheck, Package } from "lucide-react";

/**
 * 🛰️ APEX DISCOVERY MESH (v16.16.30)
 * Standard: v9.5.7 Ingress with Consolidated Auth-Guard.
 * Architecture: Stateless logic with streaming data ingress.
 */
function ServicesTerminalContent() {
  const { isLocked, isAuthenticated, user, isStaff } = useInstitutionalAuth();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const targetMerchantId = searchParams.get("merchant") || user?.merchantId;

  // 🛰️ DATA INGRESS: Zero-Lag Cluster Sync
  const { data, loading, error } = useInstitutionalFetch<any>(
    async () => {
      if (!targetMerchantId) return null;
      const res = await fetch(`/api/merchant/${targetMerchantId}/services`);
      return res.json();
    }
  );

  const filteredServices = useMemo(() => 
    data?.services?.filter((s: any) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
  [data, searchQuery]);

  if (isLocked) return <LoadingScreen message="Linking Cluster Node..." />;
  if (!isAuthenticated) return <IdentityNull />;

  return (
    <div className="flex flex-col min-h-[100dvh] pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-7xl mx-auto">
      
      {/* HUD HEADER: Extracted for independent memoization */}
      <DiscoveryHeader 
        companyName={data?.merchant?.companyName} 
        merchantId={targetMerchantId} 
        isStaff={isStaff} 
      />

      <div className="px-5 md:px-10 space-y-10 mt-10">
        {/* SEARCH PROTOCOL: Tactical Filter Layer */}
        <SearchProtocol 
          value={searchQuery} 
          onChange={setSearchQuery} 
          isStaff={isStaff} 
        />

        {/* SERVICE MESH LAYER */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
            <div className="flex items-center gap-3">
              <Terminal className={isStaff ? "text-amber-500" : ""} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">
                {isStaff ? "Platform_Cluster_Audit" : "Available_Assets"}
              </h2>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest tabular-nums">
              {filteredServices.length} NODES ACTIVE
            </span>
          </div>

          {loading ? (
            <SkeletonList count={3} />
          ) : error || !targetMerchantId ? (
            <DiscoveryErrorState message={!targetMerchantId ? "Identity_Context_Missing" : "Cluster_Sync_Failed"} />
          ) : filteredServices.length > 0 ? (
            <div className="grid gap-8">
              {filteredServices.map((service: any) => (
                <ServiceCard key={service.id} {...service} merchantId={targetMerchantId} />
              ))}
            </div>
          ) : (
            <EmptyMeshState />
          )}
        </section>
      </div>

      <footer className="flex flex-col items-center gap-4 opacity-20 py-12 mt-auto">
        <Globe className="h-5 w-5" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center">
          Zipha Network Discovery // Protocol: Mesh_V2
        </p>
      </footer>
    </div>
  );
}

function EmptyMeshState() {
  return (
    <div className="rounded-[3rem] border border-dashed border-border/20 bg-card/20 p-24 text-center shadow-inner relative overflow-hidden">
      <Package className="mx-auto mb-6 h-16 w-16 text-primary opacity-5 animate-pulse" />
      <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none opacity-40">Vault <span className="text-primary/60">Empty</span></h3>
    </div>
  );
}

function DiscoveryErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-[2.5rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-6 shadow-inner relative overflow-hidden">
      <ShieldCheck className="mx-auto h-12 w-12 text-rose-500 opacity-20 animate-pulse" />
      <p className="text-xs font-black uppercase tracking-[0.4em] text-rose-500 leading-relaxed">{message}</p>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Initializing Mesh..." />}>
      <ServicesTerminalContent />
    </Suspense>
  );
}