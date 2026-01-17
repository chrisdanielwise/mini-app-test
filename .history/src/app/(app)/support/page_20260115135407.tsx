"use client";

import * as React from "react";
import { useMemo } from "react";
import { 
  ArrowLeft, 
  MessageSquare, 
  ExternalLink, 
  LifeBuoy, 
  ChevronRight, 
  Terminal, 
  Zap,
  Globe,
  Lock,
  Headset,
  Waves,
  ShieldCheck,
  Activity,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ UNIVERSAL SUPPORT NODE (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware assistance protocol with public fallback.
 */
export default function UserSupportPage() {
  const { auth, isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE PHYSICS: Consuming full morphology physics
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

  // 🛡️ HYDRATION GUARD
  if (!isReady || isLocked) return <LoadingScreen message="LINKING_ASSISTANCE_PROTOCOL..." />;

  // 🛡️ IDENTITY FALLBACK: Morphing for unauthenticated users
  if (!isAuthenticated) return <PublicSupportFallback />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating layout gravity based on 6-tier system and safe-areas.
   */
  const headerPaddingTop = `calc(${safeArea.top}px + 1.5rem)`;
  const gridLayout = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-8" : "grid-cols-1 gap-6";
  const contentMaxWidth = isDesktop ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 max-w-5xl mx-auto selection:bg-primary/30">
      
      {/* 🌊 HUD HEADER: Hardware-aware safeArea integration */}
      <header 
        className="px-6 pb-10 rounded-b-[3rem] md:rounded-b-[4rem] border-b border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex relative overflow-hidden transition-all duration-700"
        style={{ paddingTop: headerPaddingTop }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-5 relative z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            onClick={() => impact("light")}
            className="rounded-2xl h-14 w-14 bg-white/5 border border-white/5 transition-all active:scale-90 shrink-0 hover:bg-primary/10"
          >
            <Link href="/home">
              <ArrowLeft className="size-6" />
            </Link>
          </Button>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 italic opacity-40">
              <Zap className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Institutional_Oversight" : "Protocol_Assistance"}
              </span>
            </div>
            <h1 className="text-[var(--fluid-h2)] font-black uppercase italic tracking-tighter leading-none truncate">
              Help <span className={cn("opacity-40", isStaff && "text-amber-500")}>& Support</span>
            </h1>
          </div>
        </div>

        <Waves className="absolute -bottom-4 left-0 w-full opacity-5 text-primary pointer-events-none" 
               style={{ height: `${Math.max(40, viewportWidth * 0.1)}px` }} />
      </header>

      <main className={cn("flex-1 px-6 py-10 space-y-12 pb-48 mx-auto w-full", contentMaxWidth)}>
        
        {/* --- MAIN INTERVENTION NODE --- */}
        <section className={cn(
          "relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border p-8 md:p-14 backdrop-blur-3xl shadow-apex text-center space-y-8 group transition-all duration-1000",
          isStaff ? "bg-amber-500/[0.04] border-amber-500/20 shadow-amber-500/10" : "bg-card/40 border-white/5 hover:border-primary/20"
        )}>
          {/* Subsurface Radiance */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none opacity-50" />

          <div className={cn(
            "mx-auto rounded-[1.8rem] md:rounded-3xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-1000",
            screenSize === 'xs' ? "size-16" : "size-20",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
          )}>
            {isStaff ? <Headset className="size-10" /> : <LifeBuoy className="size-10" />}
          </div>
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-[var(--fluid-h1)] font-black uppercase italic tracking-tighter leading-none">
              {isStaff ? "Engineering_Sync" : "Handshake_Error?"}
            </h2>
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 leading-relaxed max-w-[320px] mx-auto italic">
              {isStaff 
                ? "Priority developer cluster active for root-level terminal intervention and audit recovery." 
                : "Initialize a secure node connection with our tactical support agents to resolve signal anomalies."}
            </p>
          </div>
          
          <Button 
            className={cn(
              "w-full h-20 rounded-[1.8rem] md:rounded-[2.2rem] font-black uppercase italic tracking-[0.2em] text-[11px] gap-4 shadow-apex transition-all duration-1000 active:scale-95 group/btn",
              isStaff ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground"
            )} 
            asChild
            onClick={() => impact("heavy")}
          >
            <a href={isStaff ? "https://t.me/your_dev_link" : "https://t.me/your_user_support_bot"} target="_blank" rel="noreferrer">
              <MessageSquare className="size-5 fill-current" />
              <span>{isStaff ? "Initialize_Engineering_Link" : "Open_Secure_Comms"}</span>
              <ExternalLink className="size-4 opacity-40 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-500" />
            </a>
          </Button>
        </section>

        {/* --- KNOWLEDGE MANIFEST: Morphology-Aware Grid --- */}
        {!isStaff && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-2 opacity-30 italic">
               <HelpCircle className="size-4 text-primary" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Knowledge_Manifest</h3>
            </div>
            
            <div className={cn("grid", gridLayout)}>
              <div className="rounded-[2.5rem] border border-white/5 bg-card/40 divide-y divide-white/5 shadow-apex backdrop-blur-md overflow-hidden">
                {["Payment Sync Issues", "Account Recovery", "Service Node Status", "Encryption Protocols"].map((item) => (
                  <div 
                    key={item} 
                    onClick={() => impact("light")}
                    className="p-7 text-xs font-black uppercase italic tracking-tight text-foreground/60 hover:text-foreground hover:bg-white/[0.02] active:bg-white/[0.05] flex justify-between items-center cursor-pointer group transition-all duration-500"
                  >
                    <span>{item.replace(/ /g, "_")}</span>
                    <ChevronRight className="size-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>

              {/* Desktop Aesthetic Expansion */}
              {isDesktop && (
                <div className="rounded-[2.5rem] border border-dashed border-white/5 flex flex-col items-center justify-center p-10 opacity-20 italic">
                   <ShieldCheck className="size-12 mb-6 animate-pulse" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">
                     Hardware_Verification_Optimal // Support_Tier: Institutional
                   </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* --- FOOTER: Safe-Area Accountancy --- */}
      <footer className="mt-auto flex flex-col items-center gap-4 py-12 opacity-20 italic relative overflow-hidden">
         <Globe className="size-6" />
         <div className="flex flex-col items-center gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center leading-none">
              Audit Ingress Synchronized // Node: {user?.role?.toUpperCase() || "USER"}
            </p>
            <p className="text-[7px] font-mono uppercase tracking-[0.2em]">{screenSize.toUpperCase()}_HARDWARE_SYNC_OK</p>
         </div>
         <Waves className="absolute bottom-0 w-full h-8 opacity-10 animate-pulse pointer-events-none" />
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PublicSupportFallback() {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 bg-background selection:bg-primary/30">
      <div className="rounded-[3rem] bg-card border border-white/5 p-12 shadow-apex text-center space-y-10 max-w-sm relative overflow-hidden transition-all duration-1000">
        <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
        <div className="space-y-4">
          <div className="size-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto border border-primary/10">
            <Lock className="size-10 text-primary animate-pulse opacity-40" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Support_Locked</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-40 italic">
            Identity node offline.<br />Establishing public assistance link...
          </p>
        </div>
        
        <Button 
          className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-foreground font-black uppercase italic tracking-[0.2em] text-[10px] shadow-apex active:scale-95 transition-all"
          asChild
        >
          <a href="https://t.me/your_public_support">
            <Globe className="size-4 mr-3" /> Initialize_Public_Comms
          </a>
        </Button>
      </div>
    </div>
  );
}