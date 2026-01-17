"use client";

import { useTelegramContext } from "@/components/providers/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
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
  Headset
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

/**
 * 🛰️ USER SUPPORT NODE (Institutional v12.24.0)
 * Logic: Soft-Session Ingress Resilience.
 * Hardened: Bypasses SDK hangs if Bearer Recovery is already verified.
 */
export default function UserSupportPage() {
  const { isReady, auth, mounted } = useTelegramContext();
  const [tunnelReady, setTunnelReady] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  // 🛡️ HYDRATION & TIMEOUT SHIELD
  useEffect(() => {
    if (mounted) setTunnelReady(true);

    // Safety Net: Unstick page if Telegram SDK hangs > 4s
    // This allows users to access support even if the SDK handshake fails.
    const timer = setTimeout(() => {
       if (!isReady) {
         console.warn("🛰️ [Support_Node] SDK Handshake timeout. Force-mounting interface.");
         setIsStuck(true);
       }
    }, 4000);

    return () => clearTimeout(timer);
  }, [mounted, isReady]);

  // 🛡️ ROLE PROTOCOL
  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role),
    [auth.user?.role]
  );

  // 1. SYSTEM INITIALIZATION: Loader only shows if we have NO auth status yet
  if (!auth.isAuthenticated && (!isReady && !isStuck || !tunnelReady || auth.isLoading)) {
    return <LoadingScreen message="LINKING ASSISTANCE PROTOCOL..." subtext="SECURE TUNNEL ACTIVE" />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <div className="h-20 w-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
            <Lock className="h-10 w-10 text-rose-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Support Locked</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60 italic">
              Identity signature required to establish a secure communications channel.
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline" 
            className="w-full h-12 rounded-xl border-rose-500/20 text-rose-500 font-black uppercase text-[10px] tracking-widest italic hover:bg-rose-500/5"
          >
            Reconnect Node
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      
      {/* --- HUD HEADER --- */}
      <header className="px-6 py-6 md:py-8 bg-card/40 border-b border-border/10 backdrop-blur-2xl rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="rounded-xl h-11 w-11 bg-muted/10 border border-border/10 transition-all active:scale-90 shrink-0 hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Zap className={cn("h-4 w-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Universal Oversight Link" : "Protocol Assistance"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none truncate">
              Help <span className={cn(isStaff ? "text-amber-500/40" : "text-primary/40")}>& Support</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 pb-36">
        
        {/* --- MAIN INTERVENTION CARD --- */}
        <section className={cn(
          "relative overflow-hidden rounded-[2rem] border p-8 md:p-10 backdrop-blur-3xl shadow-2xl text-center space-y-6 group transition-all duration-500",
          isStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-card/40 border-border/40 hover:border-primary/20"
        )}>
          <Terminal className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.03] -rotate-12 pointer-events-none transition-transform group-hover:scale-110" />

          <div className={cn(
            "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-700",
            isStaff ? "bg-amber-500/10 border-amber-500/20 shadow-amber-500/10" : "bg-primary/5 border-primary/20 shadow-primary/10"
          )}>
            {isStaff ? <Headset className="h-8 w-8 text-amber-500" /> : <LifeBuoy className="h-8 w-8 text-primary" />}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
              {isStaff ? "Engineering Sync" : "Handshake Error?"}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto italic">
              {isStaff 
                ? "Access the priority developer cluster for root-level intervention and database audit resolution."
                : "Our tactical team is active via the secure node to resolve any synchronization anomalies."}
            </p>
          </div>
          
          <Button 
            className={cn(
              "w-full rounded-xl h-14 font-black uppercase italic tracking-widest text-[11px] gap-3 shadow-xl transition-all active:scale-95",
              isStaff ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground hover:scale-[1.02]"
            )} 
            asChild
          >
            <a href={isStaff ? "https://t.me/zipha_dev_hq" : "https://t.me/your_support_bot"} target="_blank" rel="noreferrer">
              <MessageSquare className="h-4 w-4 fill-current" />
              {isStaff ? "Connect to Engineering" : "Initialize Secure Comms"}
              <ExternalLink className="h-3.5 w-3.5 opacity-40" />
            </a>
          </Button>
        </section>

        {/* --- KNOWLEDGE MANIFEST --- */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
             <HelpCircle className="h-4 w-4 text-primary" />
             <h3 className="text-[9px] font-black uppercase tracking-[0.5em]">Knowledge_Manifest</h3>
          </div>
          
          <div className="rounded-[2rem] border border-border/40 bg-card/40 divide-y divide-border/10 shadow-2xl backdrop-blur-md overflow-hidden">
            {[
              "Join Protocol: Identity access",
              "Renewal Cycle: Node extension",
              "Billing: Asset restoration",
              "Encryption: Network standards"
            ].map((topic) => (
              <div 
                key={topic} 
                className="flex items-center justify-between p-6 transition-all hover:bg-muted/5 active:bg-muted/10 group cursor-pointer"
              >
                <span className={cn(
                  "text-xs font-black uppercase italic tracking-tight transition-colors",
                  isStaff ? "text-amber-500/70 group-hover:text-amber-500" : "text-foreground/70 group-hover:text-primary"
                )}>
                  {topic}
                </span>
                <ChevronRight className="h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* --- SYSTEM FOOTNOTE --- */}
        <div className="pt-6 flex flex-col items-center justify-center gap-3 opacity-20 italic">
           <ShieldCheck className={cn("h-4 w-4", isStaff && "text-amber-500")} />
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">
             {isStaff 
               ? "System_Root_Support_Tunnel // Link: Verified" 
               : "Verified Support Ingress // Protocol: Optimal"}
           </p>
        </div>
      </main>

      <footer className="mt-auto flex items-center justify-center gap-4 opacity-20 py-10">
         <Globe className="h-5 w-5 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground italic text-center leading-none">
           Audit Ingress synchronized // NODE: {auth.user?.role?.toUpperCase() || "ROOT"}
         </p>
      </footer>
    </div>
  );
}