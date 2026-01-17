"use client";

import * as React from "react";
import {
  Settings,
  ChevronRight,
  Fingerprint,
  Zap,
  HelpCircle,
  Globe,
  Lock,
  UserCog,
  Activity,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { SubscriptionCard } from "@/components/app/subscription-card";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";

/**
 * 🛰️ USER_PROFILE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 buttons and shrunken telemetry cells prevent layout blowout.
 */
export default function UserProfilePage() {
  const { impact } = useHaptics();
  const { isAuthenticated, isLocked, user, isStaff } = useInstitutionalAuth();
  const { screenSize, isMobile, isTablet, isDesktop, isPortrait, safeArea, isReady } = useDeviceContext();

  const { data: subsData, loading: subsLoading } = useInstitutionalFetch<{
    subscriptions: any[];
  }>(isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || isLocked) return <LoadingScreen message="DECRYPTING_IDENTITY_MANIFEST..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  const allSubscriptions = subsData?.subscriptions || [];
  const activeCount = allSubscriptions.filter((s: any) => s.status === "ACTIVE").length;

  const menuGridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-4" : "grid-cols-1 gap-3";

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 max-w-5xl mx-auto leading-none">
      
      {/* 🛡️ FIXED HUD: Stationary Identity Header */}
      <header 
        className="px-5 py-6 md:px-8 md:py-8 rounded-b-2xl border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all"
        style={{ paddingTop: `calc(${safeArea.top}px * 0.5 + 1rem)` }}
      >
        <div className="flex flex-col items-center text-center space-y-5 relative z-10">
          <div className="relative group shrink-0">
            <div className={cn(
              "relative size-20 md:size-24 rounded-xl md:rounded-2xl border flex items-center justify-center font-black italic shadow-xl transition-all",
              isStaff ? "bg-amber-500 text-black border-amber-400/20" : "bg-primary text-primary-foreground border-white/10"
            )}>
              {user?.first_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 size-8 rounded-lg bg-black border border-white/5 flex items-center justify-center shadow-inner">
               <ShieldCheck className="size-4 text-emerald-500" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2 opacity-10 italic">
              <Fingerprint className="size-2.5 text-primary" />
              <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
                {isStaff ? "Clearance: Institutional" : "Node: Verified"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
              {user?.first_name || "Operator"} <span className="opacity-20">{user?.last_name || ""}</span>
            </h1>
            <p className="text-[6.5px] font-mono uppercase tracking-[0.4em] text-muted-foreground/20 mt-1">
              ID_{user?.id?.toString().toUpperCase().slice(0, 12)}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-8 space-y-10 pb-32">
        
        {/* --- NODE CALIBRATION: Tactical Slim Grid --- */}
        <section className="space-y-3">
           <div className="flex items-center gap-2 px-1 opacity-10 italic">
              <Zap className="size-3" />
              <h3 className="text-[7.5px] font-black uppercase tracking-[0.5em]">Hardware_Sync</h3>
           </div>
           
           <div className={cn("grid", menuGridCols)}>
              <MenuLink href="/settings" label="Hardware Sync" icon={Settings} isStaff={isStaff} />
              <MenuLink href="/support" label="Emergency Protocol" icon={HelpCircle} variant="rose" />
              {isStaff && (
                <MenuLink href="/dashboard" label="Command Hub" icon={UserCog} variant="amber" className="md:col-span-2" />
              )}
           </div>
        </section>

        {/* --- SIGNAL MANIFEST: Independent tactical volume --- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 italic opacity-10">
               <Activity className="size-3" />
               <h2 className="text-[7.5px] font-black uppercase tracking-[0.5em]">Signal_Manifest</h2>
            </div>
            <Badge className="text-[6.5px] font-black uppercase px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground/40 border-none">
              {activeCount} NODES_ACTIVE
            </Badge>
          </div>

          {subsLoading ? <SkeletonList count={2} /> : allSubscriptions.length > 0 ? (
            <div className="space-y-3">
              {allSubscriptions.map((sub: any) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/5 bg-zinc-950/20 p-12 text-center shadow-inner">
               <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 italic">Zero_Ingress_Detected</p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto flex flex-col items-center gap-2 py-8 opacity-10 italic">
         <Globe className="size-4" />
         <p className="text-[7px] font-black uppercase tracking-[0.4em] text-center">
           APEX_IDENTITY // {isStaff ? "MASTER_OVERRIDE" : "NODE_OPTIMAL"}
         </p>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

function MenuLink({ href, label, icon: Icon, variant = "primary", isStaff, className }: any) {
  const { impact } = useHaptics();
  
  const colors = {
    primary: isStaff ? "bg-amber-500/5 text-amber-500 border-amber-500/10" : "bg-primary/5 text-primary border-primary/10",
    rose: "bg-rose-500/5 text-rose-500 border-rose-500/10",
    amber: "bg-amber-500 text-black border-amber-500/10"
  };

  return (
    <Link 
      href={href} 
      onClick={() => impact("light")} 
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border bg-zinc-950/40 shadow-lg transition-all active:scale-95 group",
        className
      )}
    >
       <div className="flex items-center gap-4 min-w-0">
          <div className={cn(
            "size-9 shrink-0 rounded-lg flex items-center justify-center border transition-all",
            colors[variant as keyof typeof colors]
          )}>
             <Icon className="size-4.5" />
          </div>
          <span className={cn(
            "text-[9px] font-black uppercase italic tracking-tight",
            variant === 'amber' ? "text-amber-500" : "text-foreground/60 group-hover:text-foreground"
          )}>
            {label}
          </span>
       </div>
       <ChevronRight className="size-3.5 opacity-10 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background leading-none">
      <div className="rounded-2xl bg-zinc-950/60 border border-rose-500/10 p-8 shadow-2xl text-center space-y-6 max-w-sm">
        <Lock className="size-10 text-rose-500 mx-auto opacity-20" />
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Identity_Null</h1>
          <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest italic">
            Handshake Required. Establish Secure Link.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-11 rounded-xl bg-rose-500 text-white font-black uppercase italic tracking-widest text-[9px] shadow-lg">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}