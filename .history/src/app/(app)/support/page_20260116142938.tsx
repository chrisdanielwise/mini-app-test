"use client";

import { useMemo } from "react";
import { 
  ArrowLeft, MessageSquare, ExternalLink, LifeBuoy, 
  ChevronRight, Terminal, Zap, Globe, Lock, Headset, 
  Activity, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ USER_SUPPORT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 buttons and stationary HUD profile prevents blowout.
 */
export default function UserSupportPage() {
  const { user, isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  const { impact } = useHaptics();
  const { isMobile, screenSize, isPortrait, safeArea, isReady } = useDeviceContext();

  if (!isReady || isLocked) return <LoadingScreen message="LINKING_ASSISTANCE_PROTOCOL..." />;
  if (!isAuthenticated) return <PublicSupportFallback />;

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 max-w-5xl mx-auto leading-none">
      
      {/* 🛡️ FIXED HUD: Stationary Header (h-14/16) */}
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
                {isStaff ? "Institutional_Oversight" : "Protocol_Assistance"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground truncate">
              Help <span className="opacity-20">& Support</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-8 space-y-10 pb-32">
        
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
              {isStaff 
                ? "Priority developer cluster active for root-level terminal intervention." 
                : "Initialize a secure node connection for terminal synchronization anomalies."}
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
            <a href={isStaff ? "https://t.me/dev" : "https://t.me/support"} target="_blank" rel="noreferrer">
              <MessageSquare className="size-3.5" />
              <span>{isStaff ? "Initialize_Link" : "Open_Secure_Comms"}</span>
              <ExternalLink className="size-3 opacity-40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Button>
        </section>

        {/* --- KNOWLEDGE MANIFEST: High Density Module --- */}
        {!isStaff && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1 opacity-10 italic">
               <HelpCircle className="size-3" />
               <h3 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Knowledge_Manifest</h3>
            </div>
            
            <div className="rounded-xl border border-white/5 bg-zinc-950/40 overflow-hidden shadow-2xl">
              {["Payment Sync Issues", "Account Recovery", "Node Status"].map((item) => (
                <div 
                  key={item} 
                  onClick={() => impact("light")}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.01] transition-all cursor-pointer border-b last:border-none border-white/5 group"
                >
                  <span className="text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/30 group-hover:text-foreground">
                    {item.replace(/ /g, "_")}
                  </span>
                  <ChevronRight className="size-3.5 opacity-10 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 🛰️ STATIONARY FOOTER */}
      <footer className="mt-auto flex flex-col items-center gap-2 py-8 opacity-10 italic">
         <Globe className="size-4" />
         <div className="flex flex-col items-center gap-1">
            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-center">
              Audit_Ingress // Node: {user?.role?.toUpperCase() || "USER"}
            </p>
         </div>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

function PublicSupportFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background leading-none">
      <div className="rounded-2xl bg-zinc-950/60 border border-white/5 p-8 shadow-2xl text-center space-y-6 max-w-sm relative">
        <Lock className="size-10 text-primary mx-auto opacity-20 animate-pulse" />
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Support_Locked</h1>
          <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest italic leading-relaxed">
            Identity node offline. Establishing public assistance link...
          </p>
        </div>
        <Button className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-foreground font-black uppercase italic tracking-widest text-[9px] shadow-lg" asChild>
          <a href="https://t.me/public"><Globe className="size-3.5 mr-2" /> Initialize_Public_Comms</a>
        </Button>
      </div>
    </div>
  );
}