"use client";

import { useMemo } from "react";
import { 
  ArrowLeft, 
  MessageSquare, 
  ExternalLink, 
  LifeBuoy, 
  ChevronRight, 
  Terminal, 
  ShieldCheck, 
  Zap,
  HelpCircle,
  Globe,
  Lock,
  Headset,
  Waves
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
// import { useInstitutionalAuth } from "@lib/hooks/use-institutional-auth";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ USER SUPPORT TERMINAL (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware assistance protocol.
 */
export default function UserSupportPage() {
  const { user, isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
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

  // 🛡️ HYDRATION & AUTH GUARD
  if (!isReady || isLocked) return <LoadingScreen message="LINKING_ASSISTANCE_PROTOCOL..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical hit-zones based on 6-tier logic and viewport width.
   */
  const headerPaddingTop = `calc(${safeArea.top}px + 1.5rem)`;
  const gridLayout = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-8" : "grid-cols-1 gap-6";
  const interventionCardPadding = screenSize === 'xs' ? "p-6" : "p-10 md:p-14";

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 max-w-5xl mx-auto">
      
      {/* --- HUD HEADER: safeArea.top accountancy --- */}
      <header 
        className="px-6 pb-10 rounded-b-[3rem] md:rounded-b-[4rem] border-b border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex relative overflow-hidden transition-all duration-700"
        style={{ paddingTop: headerPaddingTop }}
      >
        <div className="flex items-center gap-5 relative z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            onClick={() => impact("light")}
            className="rounded-2xl h-14 w-14 bg-white/5 border border-white/5 transition-all active:scale-90 shrink-0 hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/home">
              <ArrowLeft className="size-6" />
            </Link>
          </Button>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 italic">
              <Zap className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Universal_Oversight_Link" : "Protocol_Assistance"}
              </span>
            </div>
            <h1 className="text-[var(--fluid-h2)] font-black uppercase italic tracking-tighter leading-none truncate">
              Help <span className={cn(isStaff ? "text-amber-500/40" : "text-primary/40")}>& Support</span>
            </h1>
          </div>
        </div>
        
        {/* Background Flow (Scales with viewportWidth) */}
        <Waves className="absolute -bottom-4 left-0 w-full opacity-5 text-primary pointer-events-none" 
               style={{ height: `${Math.max(40, viewportWidth * 0.1)}px` }} />
      </header>

      <main className="flex-1 px-6 py-10 space-y-12 pb-40">
        
        {/* --- MAIN INTERVENTION CARD: Morphology-Aware Padding --- */}
        <section className={cn(
          "relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border backdrop-blur-3xl shadow-apex text-center space-y-8 group transition-all duration-1000",
          interventionCardPadding,
          isStaff ? "bg-amber-500/[0.04] border-amber-500/20 shadow-amber-500/10" : "bg-card/40 border-white/5 hover:border-primary/20"
        )}>
          {/* Drifting Watermark (Uses viewportWidth) */}
          <Terminal 
            className="absolute -bottom-8 -right-8 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-[2000ms] group-hover:scale-125 group-hover:rotate-0" 
            style={{ width: `${Math.max(160, viewportWidth * 0.15)}px`, height: `${Math.max(160, viewportWidth * 0.15)}px` }}
          />

          <div className={cn(
            "mx-auto rounded-3xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-1000",
            screenSize === 'xs' ? "size-16" : "size-20",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
          )}>
            {isStaff ? <Headset className="size-10" /> : <LifeBuoy className="size-10" />}
          </div>
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-[var(--fluid-h1)] font-black uppercase italic tracking-tighter leading-none">
              {isStaff ? "Engineering_Sync" : "Handshake_Error?"}
            </h2>
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 leading-relaxed max-w-[320px] mx-auto italic">
              {isStaff 
                ? "Connect to the priority developer cluster for root-level node intervention and database audit resolution."
                : "Our tactical team is active via the secure signal node to resolve any synchronization anomalies."}
            </p>
          </div>
          
          <Button 
            onClick={() => impact("heavy")}
            className={cn(
              "w-full rounded-[1.8rem] md:rounded-[2.2rem] h-20 font-black uppercase italic tracking-widest text-[11px] gap-4 shadow-apex transition-all duration-1000 active:scale-95 group/btn",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )} 
            asChild
          >
            <a href={isStaff ? "https://t.me/zipha_dev_hq" : "https://t.me/your_support_bot"} target="_blank" rel="noreferrer">
              <MessageSquare className="size-5 fill-current" />
              <span>{isStaff ? "Initialize_Engineering_Link" : "Open_Secure_Comms"}</span>
              <ExternalLink className="size-4 opacity-40 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </a>
          </Button>
        </section>

        {/* --- KNOWLEDGE MANIFEST: Adaptive Grid --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
             <HelpCircle className="size-4 text-primary" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Knowledge_Manifest</h3>
          </div>
          
          <div className={cn("grid", gridLayout)}>
            <div className="rounded-[2.5rem] border border-white/5 bg-card/40 divide-y divide-white/5 shadow-apex backdrop-blur-md overflow-hidden">
              {[
                "Join Protocol: Identity access",
                "Renewal Cycle: Node extension",
                "Billing: Asset restoration",
                "Encryption: Network standards"
              ].map((topic) => (
                <div 
                  key={topic} 
                  onClick={() => impact("light")}
                  className="flex items-center justify-between p-7 transition-all hover:bg-white/[0.02] active:bg-white/[0.05] group cursor-pointer"
                >
                  <span className={cn(
                    "text-xs font-black uppercase italic tracking-tight transition-colors duration-500",
                    isStaff ? "text-amber-500/60 group-hover:text-amber-500" : "text-foreground/60 group-hover:text-primary"
                  )}>
                    {topic}
                  </span>
                  <ChevronRight className="size-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
            
            {/* Desktop Placeholder for expanding documentation */}
            {isDesktop && (
               <div className="rounded-[2.5rem] border border-dashed border-white/5 flex flex-col items-center justify-center p-10 opacity-20 italic">
                  <Globe className="size-10 mb-4 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Global_Documentation_Cluster_Active</p>
               </div>
            )}
          </div>
        </section>

        {/* --- SYSTEM FOOTNOTE --- */}
        <div className="pt-8 flex flex-col items-center justify-center gap-4 opacity-30 italic">
           <ShieldCheck className={cn("size-5", isStaff && "text-amber-500")} />
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">
             {isStaff 
               ? "System_Root_Support_Tunnel // Link: Verified" 
               : "Verified_Support_Ingress // Node: V16.29_Apex"}
           </p>
        </div>
      </main>

      <footer className="mt-auto flex flex-col items-center gap-4 opacity-20 py-12">
         <Globe className="size-6" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center leading-none">
           Audit_Ingress synchronized // NODE_ID: {auth.user?.role?.toUpperCase() || "ROOT"}
         </p>
         <Waves className="size-6 animate-pulse" />
      </footer>
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 bg-background">
      <div className="rounded-[3rem] bg-card border border-rose-500/10 p-12 shadow-apex text-center space-y-8 max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
        <div className="size-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
          <Lock className="size-10 text-rose-500 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Support_Locked</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-40 italic">
            Identity signature required.<br />Establish secure node connection.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl bg-rose-500 text-white font-black uppercase italic tracking-widest shadow-apex">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}