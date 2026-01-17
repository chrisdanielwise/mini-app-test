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
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ USER_SUPPORT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 action hub and shrunken typography prevent blowout.
 */
export default function UserSupportPage() {
  const { isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  const { isMobile, screenSize, safeArea, isReady } = useDeviceContext();

  if (!isReady || isLocked) return <LoadingScreen message="LINKING_ASSISTANCE_PROTOCOL..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 max-w-5xl mx-auto leading-none">
      
      {/* 🛡️ FIXED HUD: Stationary Header */}
      <header 
        className="px-5 py-6 md:px-8 md:py-8 rounded-b-2xl border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all"
        style={{ paddingTop: `calc(${safeArea.top}px * 0.5 + 1rem)` }}
      >
        <div className="flex items-center gap-4 relative z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            onClick={() => impact("light")}
            className="rounded-lg size-9 bg-white/5 border border-white/5 hover:bg-white/10 shrink-0"
          >
            <Link href="/home">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 opacity-10 italic">
              <Zap className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
              <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
                {isStaff ? "Universal_Oversight" : "Protocol_Assistance"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground truncate">
              Help <span className="opacity-20">& Support</span>
            </h1>
          </div>
        </div>
      </header>

      {/* 🚀 INDEPENDENT TACTICAL VOLUME */}
      <main className="flex-1 px-5 py-8 space-y-8 pb-32">
        
        {/* --- INTERVENTION HUB: Tactical Slim Card --- */}
        <section className={cn(
          "relative overflow-hidden rounded-2xl border bg-zinc-950/40 p-6 md:p-8 text-center space-y-6 shadow-2xl transition-all",
          isStaff ? "border-amber-500/10 shadow-amber-500/5" : "border-white/5"
        )}>
          <div className={cn(
            "mx-auto rounded-xl flex items-center justify-center border shadow-inner size-14",
            isStaff ? "bg-amber-500/5 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
          )}>
            {isStaff ? <Headset className="size-7" /> : <LifeBuoy className="size-7" />}
          </div>
          
          <div className="space-y-2 relative z-10">
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
              {isStaff ? "Engineering_Sync" : "Handshake_Error"}
            </h2>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 leading-relaxed max-w-[280px] mx-auto italic">
              Tactical team active via secure signal node for terminal synchronization anomalies.
            </p>
          </div>
          
          <Button 
            onClick={() => impact("heavy")}
            className={cn(
              "w-full rounded-xl h-11 font-black uppercase italic tracking-widest text-[9px] gap-2 shadow-lg transition-all active:scale-95 group",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-primary-foreground shadow-primary/10"
            )} 
            asChild
          >
            <a href={isStaff ? "https://t.me/zipha_dev_hq" : "https://t.me/zipha_support"} target="_blank" rel="noreferrer">
              <MessageSquare className="size-3.5" />
              <span>{isStaff ? "Initialize_Engineering_Link" : "Open_Secure_Comms"}</span>
              <ExternalLink className="size-3 opacity-40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Button>
        </section>

        {/* --- KNOWLEDGE MANIFEST: High Density Module --- */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1 opacity-10 italic">
             <HelpCircle className="size-3" />
             <h3 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Knowledge_Manifest</h3>
          </div>
          
          <div className="rounded-xl border border-white/5 bg-zinc-950/40 overflow-hidden shadow-2xl">
            {[
              "Join Protocol: Identity access",
              "Renewal Cycle: Node extension",
              "Billing: Asset restoration",
              "Encryption: Network standards"
            ].map((topic) => (
              <div 
                key={topic} 
                onClick={() => impact("light")}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.01] transition-all cursor-pointer border-b last:border-none border-white/5 group"
              >
                <span className={cn(
                  "text-[9px] font-black uppercase italic tracking-widest transition-colors",
                  isStaff ? "text-amber-500/40 group-hover:text-amber-500" : "text-muted-foreground/30 group-hover:text-foreground"
                )}>
                  {topic}
                </span>
                <ChevronRight className="size-3 opacity-10 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* --- SYSTEM NOTICES --- */}
        <div className="flex flex-col items-center justify-center gap-3 opacity-10 italic">
           <ShieldCheck className={cn("size-4", isStaff && "text-amber-500")} />
           <p className="text-[7.5px] font-black uppercase tracking-[0.4em] text-center">
             {isStaff ? "System_Root_Tunnel // Verified" : "Secure_Ingress_Node // v16.31_Apex"}
           </p>
        </div>
      </main>

      {/* 🛰️ STATIONARY FOOTER */}
      <footer className="mt-auto flex flex-col items-center gap-2 py-10 opacity-10 italic">
         <Globe className="size-4" />
         <p className="text-[7px] font-black uppercase tracking-[0.5em] text-center">
           Audit_Ingress // Node_{screenSize.toUpperCase()}
         </p>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background leading-none">
      <div className="rounded-2xl bg-zinc-950/60 border border-rose-500/10 p-8 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
        <Lock className="size-10 text-rose-500 mx-auto opacity-20 animate-pulse" />
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Access_Locked</h1>
          <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest italic">
            Identity handshake required for support egress.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-11 rounded-xl bg-rose-500 text-white font-black uppercase italic tracking-widest text-[9px] shadow-lg">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}