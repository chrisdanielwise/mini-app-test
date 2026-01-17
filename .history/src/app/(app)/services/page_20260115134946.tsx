"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
// import { useInstitutionalAuth } from "@lib/hooks/use-institutional-auth";
// import { useInstitutionalFetch } from "@lib/hooks/use-institutional-fetch";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
// import { IdentityNull } from "@/components/auth/identity-null";
import { ServiceCard } from "@/components/app/service-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
// import { DiscoveryHeader } from "@/components/app/discovery-header";
// import { SearchProtocol } from "@/components/app/search-protocol";
import {
  Globe,
  Terminal,
  ShieldCheck,
  Package,
  Waves,
  Activity,
} from "lucide-react";
import { SearchProtocol } from "@/components/app/search-protocol";
import { DiscoveryHeader } from "@/components/app/discovery-header";
import { IdentityNull } from "@/components/auth/identity-null";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ APEX DISCOVERY MESH (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, viewportWidth).
 * Architecture: Hardware-Fluid Service Discovery with Kinetic Grid Ingress.
 */
function ServicesTerminalContent() {
  const { isLocked, isAuthenticated, user, isStaff } = useInstitutionalAuth();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // 🛰️ DEVICE PHYSICS: Consuming the hardware engine
  const {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    viewportWidth,
    isReady,
  } = useDeviceContext();

  const targetMerchantId = searchParams.get("merchant") || user?.merchantId;

  // 🛰️ DATA INGRESS: Standardized Cluster Sync
  const { data, loading, error } = useInstitutionalFetch<any>(async () => {
    if (!targetMerchantId) return null;
    const res = await fetch(`/api/merchant/${targetMerchantId}/services`);
    return res.json();
  });

  const filteredServices = useMemo(
    () =>
      data?.services?.filter(
        (s: any) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [],
    [data, searchQuery]
  );

  // 🛡️ HYDRATION & AUTH GUARD
  if (!isReady || isLocked)
    return <LoadingScreen message="SYNCING_DISCOVERY_MESH..." />;
  if (!isAuthenticated) return <IdentityNull />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating layout gravity for the Service Matrix.
   */
  const serviceGridCols =
    screenSize === "xxl" || screenSize === "xl"
      ? "grid-cols-2 gap-10"
      : isDesktop || (isTablet && !isPortrait)
      ? "grid-cols-2 gap-6"
      : "grid-cols-1 gap-6";

  const containerPadding = screenSize === "xs" ? "px-5" : "px-8 md:px-12";

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] pb-44 animate-in fade-in duration-1000 max-w-7xl mx-auto selection:bg-primary/30">
      {/* HUD HEADER: Hardware-aware sticky ingress */}
      <DiscoveryHeader
        companyName={data?.merchant?.companyName}
        merchantId={targetMerchantId}
        isStaff={isStaff}
      />

      <div className={cn("space-y-10 mt-10 transition-all", containerPadding)}>
        {/* SEARCH PROTOCOL: Tactical Filter Layer */}
        <section className="relative z-20">
          <SearchProtocol
            value={searchQuery}
            onChange={setSearchQuery}
            isStaff={isStaff}
          />
        </section>

        {/* SERVICE MESH LAYER: Kinetic Matrix */}
        <section className="space-y-8 relative">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
            <div className="flex items-center gap-3">
              <Terminal
                className={cn(
                  "size-4",
                  isStaff ? "text-amber-500" : "text-primary"
                )}
              />
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">
                {isStaff ? "Platform_Cluster_Audit" : "Available_Assets"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Activity className="size-3 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest tabular-nums">
                {filteredServices.length} NODES_ACTIVE
              </span>
            </div>
          </div>

          {loading ? (
            <SkeletonList count={3} />
          ) : error || !targetMerchantId ? (
            <DiscoveryErrorState
              message={
                !targetMerchantId
                  ? "Identity_Context_Missing"
                  : "Cluster_Sync_Failed"
              }
            />
          ) : filteredServices.length > 0 ? (
            <div
              className={cn(
                "grid transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                serviceGridCols
              )}
            >
              {filteredServices.map((service: any) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  merchantId={targetMerchantId}
                />
              ))}
            </div>
          ) : (
            <EmptyMeshState />
          )}

          {/* Subsurface Radiance for Large Displays */}
          {isDesktop && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none -z-10">
              <Waves className="w-full h-full animate-pulse text-primary" />
            </div>
          )}
        </section>
      </div>

      <footer className="flex flex-col items-center gap-6 py-12 mt-auto opacity-20 italic overflow-hidden">
        <Globe className="size-6" />
        <div className="flex flex-col items-center gap-2">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center">
            Zipha Network Discovery // Protocol: Mesh_V16.30_Apex
          </p>
          <p className="text-[7px] font-mono uppercase tracking-[0.2em]">
            {screenSize.toUpperCase()}_HARDWARE_SYNC_OK
          </p>
        </div>
        <Waves className="w-full h-8 opacity-10 animate-pulse" />
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS: Morphology accountancy ---

function EmptyMeshState() {
  return (
    <div className="rounded-[3rem] border border-dashed border-white/5 bg-card/10 p-24 text-center shadow-inner relative overflow-hidden group">
      <Package className="mx-auto mb-8 size-20 text-primary opacity-5 animate-pulse transition-transform group-hover:scale-110 duration-1000" />
      <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none opacity-30">
        Vault <span className="text-primary/60">Empty</span>
      </h3>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 mt-4 italic">
        No active assets detected in this cluster.
      </p>
    </div>
  );
}

function DiscoveryErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-[3rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-8 shadow-inner relative overflow-hidden animate-in zoom-in-95 duration-700">
      <ShieldCheck className="mx-auto h-16 w-16 text-rose-500 opacity-20 animate-pulse" />
      <div className="space-y-2">
        <p className="text-sm font-black uppercase italic tracking-[0.4em] text-rose-500">
          {message}
        </p>
        <p className="text-[9px] font-black uppercase tracking-widest text-rose-500/40 italic">
          Check terminal identity signature or cluster availability.
        </p>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingScreen message="CALIBRATING_MESH..." />}>
      <ServicesTerminalContent />
    </Suspense>
  );
}
