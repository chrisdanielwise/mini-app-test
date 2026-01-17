"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, ShoppingBag, Zap, History, Globe, 
  Terminal, Lock, Megaphone, Activity, Waves 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/hooks/use-institutional-auth";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { SubscriptionCard } from "@/components/app/subscription-card";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  startsAt: string;
  expiresAt: string;
  inviteLink?: string;
  service: { id: string; name: string; description?: string; };
  tier?: { id: string; name: string; price: string; };
  merchant: { companyName?: string; botUsername?: string; };
}

/**
 * 🛰️ HOME TERMINAL (Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: Synchronized Role-Aware Ingress with Hardware-Fluid Interpolation.
 */
export default function HomePage() {
  const router = useRouter();
  const { impact } = useHaptics();
  
  // 🛡️ AUTH & IDENTITY NODE
  const { user, isAuthenticated, isLocked, isStaff, isMerchant } = useInstitutionalAuth();
  
  // 🛰️ DEVICE PHYSICS
  const { 
    screenSize, isMobile, isTablet, isDesktop, 
    isPortrait, safeArea, viewportWidth, isReady 
  } = useDeviceContext();

  // 🛰️ DATA INGRESS: System Broadcast & Configurations
  const { data: profileData } = useInstitutionalFetch<any>(
    isAuthenticated ? "/api/user/profile" : null
  );

  // 🛰️ DATA INGRESS: Active Signal Nodes
  const { data: subData, loading: subsLoading } = useInstitutionalFetch<{ subscriptions: Subscription[] }>(
    isAuthenticated ? "/api/user/subscriptions" : null
  );

  const systemConfig = profileData?.data?.systemConfig;
  const activeSubscriptions = useMemo(() => 
    subData?.subscriptions?.filter((s) => s.status === "ACTIVE") || [],
    [subData]
  );

  // 🛡️ HYDRATION & AUTH GUARD
  if (!isReady || isLocked) return <LoadingScreen message="ESTABLISHING_IDENTITY_LINK..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical hit-zones based on 6-tier logic.
   */
  const navGridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-8" : "grid-cols-2 gap-4";
  const headerPaddingTop = `calc(${safeArea.top}px + 1.5rem)`;

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 max-w-5xl mx-auto">
      
      {/* 🌊 EMERGENCY BROADCAST: Kinetic Ingress */}
      {systemConfig?.broadcastActive && (
        <div 
          className={cn(
            "w-full py-4 px-6 flex items-center justify-center gap-3 z-[60] sticky top-0 border-b transition-all duration-700",
            systemConfig.broadcastLevel === "CRITICAL" ? "bg-rose-600 text-white border-rose-500" : "bg-primary text-primary-foreground border-primary/20"
          )}
          style={{ paddingTop: `calc(${safeArea.top}px + 0.5rem)` }}
        >
          <Megaphone className="size-4 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest italic truncate">
            {systemConfig.broadcastMessage}
          </span>
        </div>
      )}

      {/* --- HUD HEADER: Morphology-aware safeArea integration --- */}
      <header 
        className="px-6 pb-10 rounded-b-[3rem] md:rounded-b-[4rem] border-b border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex relative overflow-hidden"
        style={{ paddingTop: systemConfig?.broadcastActive ? "1.5rem" : headerPaddingTop }}
      >
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative group">
             <div className={cn(
               "absolute inset-0 blur-2xl rounded-2xl opacity-20 transition-all duration-1000 group-hover:scale-150",
               isStaff ? "bg-amber-500" : isMerchant ? "bg-amber-500/50" : "bg-primary"
             )} />
             <div className={cn(
               "relative flex shrink-0 items-center justify-center rounded-[1.5rem] md:rounded-2xl border-2 font-black italic shadow-2xl transition-all duration-1000 group-hover:rotate-6",
               isDesktop ? "size-20 text-3xl" : "size-14 md:size-18 text-xl",
               isStaff || isMerchant ? "bg-amber-500 border-amber-400/20 text-black" : "bg-primary border-primary-foreground/20 text-primary-foreground"
             )}>
               {user?.first_name?.[0]?.toUpperCase() || "U"}
             </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[var(--fluid-h2)] font-black tracking-tighter truncate uppercase italic leading-none">
                {user?.first_name || "Operator"}
              </h1>
              {isStaff && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[8px] tracking-[0.2em] px-2 py-0.5 animate-pulse">STAFF</Badge>}
              {isMerchant && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[8px] tracking-[0.2em] px-2 py-0.5">MERCHANT</Badge>}
            </div>
            <div className="flex items-center gap-2.5 mt-3 opacity-40">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isStaff || isMerchant ? "bg-amber-500" : "bg-emerald-500")} />
              <p className="text-[10px] font-black uppercase tracking-widest italic leading-none truncate">
                {isMerchant ? "Merchant_Node_Active" : isStaff ? "Universal_Oversight" : `${activeSubscriptions.length}_Verified_Clusters`}
              </p>
            </div>
          </div>

          <Link href={isMerchant ? "/dashboard" : "/settings"} onClick={() => impact("light")}>
            <div className="size-12 md:size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 group">
               {isMerchant || isStaff ? <Terminal className="size-5 md:size-6 text-amber-500" /> : <Zap className="size-5 md:size-6 opacity-30 group-hover:opacity-100" />}
            </div>
          </Link>
        </div>
      </header>

      {/* --- GRID NAVIGATION --- */}
      <main className="px-6 py-10 space-y-[var(--fluid-gap)] pb-40">
        <section className={cn("grid", navGridCols)}>
          <NavCard 
            href="/services" 
            label="Market_Hub" 
            icon={ShoppingBag} 
            active={!isMerchant} 
            isStaff={isStaff} 
          />
          <NavCard 
            href="/history" 
            label="Audit_Ledger" 
            icon={History} 
            active 
            isStaff={isStaff} 
          />
        </section>

        {/* --- DYNAMIC CONTENT: SIGNAL NODES --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">
              {isMerchant ? "Service_Provision_Audit" : isStaff ? "Platform_Cluster_Audit" : "Verified_Signal_Nodes"}
            </h2>
            <Activity className="size-3.5 animate-pulse" />
          </div>

          {subsLoading ? (
            <SkeletonList count={2} /> 
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-6">
              {activeSubscriptions.map((sub) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <EmptyState isMerchant={isMerchant} />
          )}
        </section>
      </main>

      <footer className="mt-auto flex flex-col items-center gap-4 py-12 opacity-20 italic">
         <Globe className="size-5" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center leading-relaxed">
           Institutional Ingress Node // Protocol: Zipha_V16.29_Apex
         </p>
         <Waves className="size-6 animate-pulse" />
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavCard({ href, label, icon: Icon, active, isStaff }: any) {
  const { impact } = useHaptics();
  return (
    <Link 
      href={href} 
      onClick={() => impact("medium")}
      className={cn(
        "group relative overflow-hidden flex flex-col items-center gap-4 rounded-[2rem] md:rounded-[3rem] border p-8 transition-all duration-700 active:scale-[0.97] shadow-apex backdrop-blur-3xl",
        active ? "bg-card/40 border-white/5" : "bg-white/[0.02] border-white/5 opacity-40 grayscale pointer-events-none"
      )}
    >
      <div className={cn(
        "flex size-12 md:size-16 items-center justify-center rounded-2xl border transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-inner",
        isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/10"
      )}>
        <Icon className="size-6 md:size-8" />
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.4em] italic opacity-30 group-hover:opacity-100 transition-opacity">{label}</span>
    </Link>
  );
}

function EmptyState({ isMerchant }: { isMerchant: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/5 bg-card/5 p-20 text-center shadow-inner relative overflow-hidden">
      <Sparkles className="mx-auto mb-6 size-16 text-primary opacity-10 animate-pulse" />
      <h3 className="text-xl font-black text-foreground/40 uppercase tracking-widest italic leading-none">
        Vault <span className="text-primary/60">Idle</span>
      </h3>
      {!isMerchant && (
        <Link href="/services" className="w-full mt-10">
          <Button className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-[0.2em] shadow-apex">Sync_Market_Node</Button>
        </Link>
      )}
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 bg-background">
      <div className="rounded-[3rem] bg-card border border-rose-500/10 p-12 shadow-apex text-center space-y-8 max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full -z-10" />
        <div className="size-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
          <Lock className="size-10 text-rose-500 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Identity_Null</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-40 italic">
            Protocol handshake required. Re-anchor identity node.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl bg-rose-500 text-white font-black uppercase italic tracking-widest shadow-apex">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}