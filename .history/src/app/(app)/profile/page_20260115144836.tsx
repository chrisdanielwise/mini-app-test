"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  Settings,
  User,
  ChevronRight,
  Fingerprint,
  Layers,
  Zap,
  HelpCircle,
  Globe,
  Terminal,
  Lock,
  UserCog,
  Waves,
  ShieldCheck,
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
// import { useInstitutionalAuth } from "@/hooks/use-institutional-auth";
// import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { SubscriptionCard } from "@/components/app/subscription-card";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * 🛰️ PROFILE IDENTITY NODE (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware identity telemetry with hardware-fluid radiance.
 */
export default function UserProfilePage() {
  const { impact } = useHaptics();
  const { isAuthenticated, isLocked, user, isStaff } = useInstitutionalAuth();
  
  // 🛰️ DEVICE INGRESS: Consuming the full interface physics
  const { 
    screenSize, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    safeArea, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  // 🛰️ DATA INGRESS: Standardized Signal Fetch
  const { data: subsData, loading: subsLoading } = useInstitutionalFetch<{
    subscriptions: any[];
  }>(isAuthenticated ? "/api/user/subscriptions" : null);

  // 🛡️ HYDRATION & AUTH GUARD
  if (!isReady || isLocked) return <LoadingScreen message="DECRYPTING_IDENTITY_MANIFEST..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  const allSubscriptions = subsData?.subscriptions || [];
  const activeCount = allSubscriptions.filter((s: any) => s.status === "ACTIVE").length;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical grid density based on the 6-tier system.
   */
  const headerPaddingTop = `calc(${safeArea.top}px + 1.5rem)`;
  const menuGridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-6" : "grid-cols-1 gap-4";
  const avatarSize = isDesktop ? "size-24 md:size-32" : "size-20 md:size-24";

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 max-w-5xl mx-auto selection:bg-primary/30">
      
      {/* --- HUD HEADER: Fluid safeArea.top integration --- */}
      <header 
        className="px-6 pb-12 rounded-b-[3rem] md:rounded-b-[4rem] border-b border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex relative overflow-hidden transition-all duration-700"
        style={{ paddingTop: headerPaddingTop }}
      >
        {/* Identity Radiance Bloom (Scales with viewportWidth) */}
        <div className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 blur-[100px] rounded-full opacity-20 pointer-events-none transition-colors duration-1000",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} style={{ width: `${viewportWidth * 0.4}px`, height: `${viewportWidth * 0.4}px` }} />
        
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="relative group">
            <div className={cn("absolute inset-0 blur-3xl rounded-2xl opacity-20 transition-all duration-1000 group-hover:scale-125", isStaff ? "bg-amber-500" : "bg-primary")} />
            <div className={cn(
              "relative flex items-center justify-center rounded-[1.5rem] md:rounded-[2rem] border-2 font-black italic shadow-2xl transition-all duration-1000 group-hover:rotate-6",
              avatarSize,
              isStaff ? "bg-amber-500 border-amber-400/20 text-black" : "bg-primary border-primary-foreground/20 text-primary-foreground"
            )}>
              {user?.first_name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 italic opacity-40">
              <Fingerprint className={cn("size-4", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.4em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Clearance: Institutional" : "Node: Verified"}
              </span>
            </div>
            <h1 className="text-[var(--fluid-h1)] font-black tracking-tight uppercase italic leading-none">
              {user?.first_name || "Operator"} <span className={cn("opacity-40", isStaff && "text-amber-500")}>{user?.last_name || ""}</span>
            </h1>
            <p className="text-[9px] font-mono font-bold text-muted-foreground/30 uppercase tracking-[0.3em] leading-none mt-4">
              NODE_ID: {(user?.id || "0x000000").toString().toUpperCase()}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 space-y-12 pb-40">
        
        {/* --- NODE CALIBRATION: Morphology-Aware Grid --- */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-2 opacity-30 italic">
              <Zap className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Hardware_Sync</h3>
           </div>
           
           <div className={cn("grid", menuGridCols)}>
              <MenuLink 
                href="/settings" 
                label="Hardware Sync" 
                icon={Settings} 
                isStaff={isStaff} 
                impactType="light" 
              />
              <MenuLink 
                href="/support" 
                label="Emergency Protocol" 
                icon={HelpCircle} 
                variant="rose" 
                impactType="medium" 
              />

              {isStaff && (
                <MenuLink 
                  href="/dashboard" 
                  label="Command Hub" 
                  icon={UserCog} 
                  variant="amber" 
                  isStaff 
                  impactType="heavy"
                  className="md:col-span-2"
                />
              )}
           </div>
        </section>

        {/* --- SIGNAL MANIFEST: Fluid Telemetry --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 italic opacity-30">
               <Layers className="size-4" />
               <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">Signal_Manifest</h2>
            </div>
            <Badge className={cn("text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border-none", isStaff ? "text-amber-500 bg-amber-500/10" : "bg-white/5 text-muted-foreground/40")}>
              {activeCount} NODES ACTIVE
            </Badge>
          </div>

          {subsLoading ? <SkeletonList count={3} /> : allSubscriptions.length > 0 ? (
            <div className="space-y-6">
              {allSubscriptions.map((sub: any) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-dashed border-white/5 bg-card/10 p-20 text-center shadow-inner relative overflow-hidden">
               <Activity className="size-16 mx-auto text-primary opacity-5 animate-pulse" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 italic mt-6">No verified signal nodes synchronized.</p>
               <Waves className="absolute bottom-0 w-full h-12 opacity-5" />
            </div>
          )}
        </section>
      </main>

      {/* --- FOOTER: Safe-Area Accountancy --- */}
      <footer className="mt-auto flex flex-col items-center gap-4 py-12 opacity-20 italic">
         <Globe className="size-5" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center leading-none">
           Zipha Identity Cluster synchronized // Sync: {isStaff ? "MASTER_OVERRIDE" : "NODE_OPTIMAL"}
         </p>
         <Waves className="size-6 animate-pulse" />
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MenuLink({ href, label, icon: Icon, variant = "primary", isStaff, impactType, className }: any) {
  const { impact } = useHaptics();
  
  const colors = {
    primary: isStaff ? "bg-amber-500/5 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/20",
    rose: "bg-rose-500/5 text-rose-500 border-rose-500/20",
    amber: "bg-amber-500 text-black border-amber-500/20"
  };

  return (
    <Link 
      href={href} 
      onClick={() => impact(impactType)} 
      className={cn(
        "flex items-center justify-between p-6 rounded-[2rem] border border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex transition-all duration-500 group active:scale-95",
        className
      )}
    >
       <div className="flex items-center gap-5 min-w-0">
          <div className={cn(
            "size-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
            colors[variant as keyof typeof colors]
          )}>
             <Icon className="size-6" />
          </div>
          <span className={cn(
            "text-[11px] font-black uppercase italic tracking-tight transition-colors duration-500",
            variant === 'amber' ? "text-amber-500" : "text-foreground/70 group-hover:text-foreground"
          )}>
            {label}
          </span>
       </div>
       {variant === 'amber' ? <Terminal className="size-5 text-amber-500 animate-pulse" /> : <ChevronRight className="size-5 opacity-20 group-hover:translate-x-1 transition-all" />}
    </Link>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 bg-background">
      <div className="rounded-[3rem] bg-card border border-rose-500/10 p-12 shadow-apex text-center space-y-8 max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
        <Lock className="size-12 text-rose-500 mx-auto animate-pulse opacity-40" />
        <div className="space-y-3">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Identity_Mismatch</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-40 italic">
            Handshake Failure. Verify identity signature via official Bot terminal.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-foreground font-black uppercase italic tracking-widest shadow-apex">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}