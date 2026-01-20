"use client";

import * as React from "react";
import { useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, ShoppingBag, Zap, History, Globe, 
  Terminal, Lock, Megaphone, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ INSTITUTIONAL INGRESS: Standardized Types
import { Subscription, SubscriptionStatus } from "@/generated/prisma";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 🛠️ Atomic UI Components
import { SubscriptionCard } from "@/components/app/subscription-card";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonList } from "@/components/ui/skeleton-card";

/**
 * 🛰️ HOME_TERMINAL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Safe Area Synchronization.
 * Fix: Applied safeArea top/bottom offsets for mobile standard compliance.
 */
export default function HomePage() {
  const { impact } = useHaptics();
  const { user, isAuthenticated, isLocked, isStaff, isMerchant } = useInstitutionalAuth();
  const { screenSize, isTablet, isDesktop, isPortrait, isReady, safeArea } = useDeviceContext();

  const { data: profileData } = useInstitutionalFetch<any>(
    isAuthenticated ? "/api/user/profile" : null
  );

  const { data: subData, loading: subsLoading } = useInstitutionalFetch<{ subscriptions: Subscription[] }>(
    isAuthenticated ? "/api/user/subscriptions" : null
  );

  const systemConfig = profileData?.data?.systemConfig;

  // ✅ FIX: Explicitly typed 's' to resolve TS7006
 const activeSubscriptions = useMemo(() => 
  subData?.subscriptions?.filter((s: Subscription) => s.status === SubscriptionStatus.ACTIVE) || [],
  [subData]
);

  if (!isReady || isLocked) return <LoadingScreen message="SYNCING_IDENTITY_LINK..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  const navGridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-4" : "grid-cols-2 gap-3";

  return (
    <div className="flex flex-col animate-in fade-in duration-700 max-w-5xl mx-auto leading-none min-h-screen">
      
      {/* 🛡️ BROADCAST: Tactical Slim with Safe-Area aware Top Padding */}
      {systemConfig?.broadcastActive && (
        <div 
          className={cn(
            "w-full py-2.5 px-4 flex items-center justify-center gap-2 border-b rounded-xl",
            systemConfig.broadcastLevel === "CRITICAL" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-primary/5 text-primary border-primary/10"
          )}
          style={{ marginTop: safeArea.top > 0 ? `calc(${safeArea.top}px * 0.5)` : '1rem' }}
        >
          <Megaphone className="size-3 animate-pulse" />
          <span className="text-[7.5px] font-black uppercase tracking-widest italic truncate">
            {systemConfig.broadcastMessage}
          </span>
        </div>
      )}

      {/* --- HUD HEADER: Compressed Ingress --- */}
      <header 
        className="px-5 py-6 md:px-8 md:py-8 rounded-b-2xl md:rounded-b-3xl border-x border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        style={{ paddingTop: !systemConfig?.broadcastActive ? `calc(${safeArea.top}px + 1.5rem)` : '1.5rem' }}
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative group shrink-0">
             <div className={cn(
               "size-11 md:size-12 rounded-xl flex items-center justify-center border font-black italic shadow-xl transition-all",
               isStaff || isMerchant ? "bg-amber-500 text-black border-amber-400/20" : "bg-primary text-primary-foreground border-white/10"
             )}>
               {user?.firstName?.[0]?.toUpperCase() || "U"}
             </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter truncate uppercase italic text-foreground">
                {user?.firstName || "Operator"}
              </h1>
              {isStaff && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[6.5px] px-1.5 py-0.5">STAFF</Badge>}
            </div>
            <div className="flex items-center gap-2 mt-1.5 opacity-20">
              <Activity className={cn("size-2.5 animate-pulse", isStaff || isMerchant ? "text-amber-500" : "text-emerald-500")} />
              <p className="text-[7.5px] font-black uppercase tracking-widest">
                {isMerchant ? "Node_Merchant_Active" : isStaff ? "Universal_Oversight" : `${activeSubscriptions.length}_Active_Nodes`}
              </p>
            </div>
          </div>

          <Link href={isMerchant ? "/dashboard" : "/settings"} onClick={() => impact("light")}>
            <div className="size-9 md:size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90">
               {isMerchant || isStaff ? <Terminal className="size-4 text-amber-500" /> : <Zap className="size-4 opacity-20" />}
            </div>
          </Link>
        </div>
      </header>

      {/* --- GRID NAVIGATION --- */}
      <main className="py-6 md:py-8 space-y-8 px-5 md:px-8">
        <section className={cn("grid", navGridCols)}>
          <NavCard href="/services" label="Market_Hub" icon={ShoppingBag} active={!isMerchant} isStaff={isStaff} />
          <NavCard href="/history" label="Audit_Ledger" icon={History} active isStaff={isStaff} />
        </section>

        {/* --- DYNAMIC CLUSTERS --- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1 opacity-10 italic">
            <h2 className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              {isMerchant ? "Provision_Audit" : "Signal_Nodes"}
            </h2>
            <Activity className="size-2.5" />
          </div>

          {subsLoading ? (
            <SkeletonList count={3} /> 
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-3">
              {/* ✅ FIX: Explicitly typed 'sub' to resolve TS7006 */}
              {activeSubscriptions.map((sub: Subscription) => (
                <SubscriptionCard key={sub.id} {...(sub as any)} />
              ))}
            </div>
          ) : (
            <EmptyState isMerchant={isMerchant} />
          )}
        </section>
      </main>

      {/* 📐 FOOTER: Bottom Safe-Area Padding */}
      <footer 
        className="mt-auto flex flex-col items-center gap-3 py-10 opacity-10 italic"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 2rem)` }}
      >
         <Globe className="size-4" />
         <p className="text-[7px] font-black uppercase tracking-[0.4em] text-center">
           APEX_INGRESS // v16.31_TERMINAL
         </p>
      </footer>

      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

function NavCard({ href, label, icon: Icon, active, isStaff }: any) {
  const { impact } = useHaptics();
  return (
    <Link 
      href={href} 
      onClick={() => impact("medium")}
      className={cn(
        "group relative flex flex-col items-center gap-2.5 rounded-xl md:rounded-2xl border p-5 transition-all shadow-lg active:scale-95",
        active ? "bg-zinc-950/40 border-white/5" : "bg-white/[0.01] border-white/5 opacity-30 grayscale pointer-events-none"
      )}
    >
      <div className={cn(
        "size-9 md:size-10 flex items-center justify-center rounded-lg border shadow-inner transition-all",
        isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/10"
      )}>
        <Icon className="size-4.5" />
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest opacity-20">{label}</span>
    </Link>
  );
}

function EmptyState({ isMerchant }: { isMerchant: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-zinc-950/20 p-12 text-center shadow-inner leading-none">
      <Sparkles className="mb-4 size-10 text-primary opacity-5 animate-pulse" />
      <h3 className="text-sm font-black text-foreground/20 uppercase tracking-widest italic">
        Vault_Idle
      </h3>
      {!isMerchant && (
        <Link href="/services" className="w-full mt-6">
          <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[9px] shadow-lg">Sync_Market</Button>
        </Link>
      )}
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background leading-none">
      <div className="rounded-2xl bg-zinc-950/60 border border-rose-500/10 p-8 shadow-2xl text-center space-y-6 max-w-sm">
        <div className="size-14 bg-rose-500/10 rounded-xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
          <Lock className="size-6 text-rose-500 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Identity_Null</h1>
          <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest italic">
            Handshake required. Re-anchor node.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-11 rounded-xl bg-rose-500 text-white font-black uppercase italic tracking-widest text-[9px] shadow-lg">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}