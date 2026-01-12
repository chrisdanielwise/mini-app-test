"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/app/subscription-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";
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
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

/**
 * 🛰️ PROFILE IDENTITY NODE (Institutional v9.5.5)
 * Architecture: Universal Identity Protocol with Staff Oversight logic.
 * Hardened: Hydration Shield & Multi-tenant Role Injection.
 */
export default function UserProfilePage() {
  const { auth, isReady, user, mounted, webApp } = useTelegramContext();
  const [tunnelReady, setTunnelReady] = useState(false);

  // 🛡️ HYDRATION SHIELD: Prevents SSR/CSR desync
  useEffect(() => {
    if (mounted) setTunnelReady(true);
  }, [mounted]);

  // 🛡️ Haptic Protocol Buffer
  const triggerHaptic = (style: "light" | "medium") => {
    if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred(style);
  };

  // 🛡️ AUTHENTICATED FETCH
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  // 🛡️ STAFF CLEARANCE DETECTION
  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role),
    [auth.user?.role]
  );

  // 1. SYSTEM INITIALIZATION: Wait for identity handshake and client mount
  if (!isReady || !tunnelReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Identity Manifest..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-10 w-10 text-rose-500 mx-auto animate-pulse opacity-40" />
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase italic tracking-tight">Identity Mismatch</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Handshake Failed. Re-verify identity signature via the official Bot terminal.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full mt-4 py-3 bg-muted/10 border border-border/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-muted/20 transition-all"
          >
            Force Identity Re-Sync
          </button>
        </div>
      </div>
    );
  }

  const allSubscriptions = subscriptions?.subscriptions || [];
  const activeCount = allSubscriptions.filter((s: any) => s.status === "ACTIVE").length;

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      
      {/* --- HUD HEADER: ROLE AWARE --- */}
      <header className="px-6 py-8 md:py-10 rounded-b-[2rem] border-b border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl relative overflow-hidden">
        <div className={cn(
          "absolute top-0 left-0 h-40 w-40 blur-[80px] rounded-full pointer-events-none transition-colors duration-1000",
          isStaff ? "bg-amber-500/15" : "bg-primary/10"
        )} />
        
        <div className="flex flex-col items-center text-center space-y-5 relative z-10">
          <div className="relative">
            <div className={cn("absolute inset-0 blur-2xl rounded-2xl opacity-25", isStaff ? "bg-amber-500" : "bg-primary")} />
            <div className={cn(
              "relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-[1.25rem] border-2 text-2xl md:text-3xl font-black italic shadow-2xl transition-all duration-700",
              isStaff ? "bg-amber-500 border-amber-400/20 text-black" : "bg-primary border-primary-foreground/20 text-primary-foreground"
            )}>
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 opacity-50">
              <Fingerprint className={cn("h-4 w-4", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Clearance: Institutional" : "Identity: Verified"}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase italic leading-none">
              {user?.first_name || auth.user?.fullName?.split(" ")[0]} <span className={isStaff ? "text-amber-500" : "text-primary"}>{user?.last_name || ""}</span>
            </h1>
            <p className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-2">
              NODE_ID: {(user?.id || auth.user?.telegramId || "0x000000").toString().toUpperCase()}
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 space-y-10 pb-36">
        
        {/* --- TACTICAL SETTINGS MENU --- */}
        <section className="space-y-4">
           <div className="flex items-center gap-3 px-2 opacity-30 italic">
              <Zap className={cn("h-4 w-4", isStaff ? "text-amber-500" : "text-primary")} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Node_Calibration</h3>
           </div>
           
           <div className="rounded-[2rem] border border-border/40 bg-card/40 divide-y divide-border/10 shadow-2xl backdrop-blur-md overflow-hidden">
              <Link 
                href="/settings" 
                onClick={() => triggerHaptic("light")} 
                className="flex items-center justify-between p-6 hover:bg-muted/5 active:bg-muted/10 transition-all group"
              >
                 <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "h-11 w-11 shrink-0 rounded-xl flex items-center justify-center border shadow-inner group-hover:scale-110 transition-all",
                      isStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-primary/5 border-primary/20"
                    )}>
                       <Settings className={cn("h-5 w-5", isStaff ? "text-amber-500" : "text-primary")} />
                    </div>
                    <span className="text-[11px] font-black uppercase italic tracking-tight text-foreground/80 group-hover:text-primary transition-colors">Hardware Sync</span>
                 </div>
                 <ChevronRight className="h-5 w-5 opacity-20 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </Link>
              
              <Link 
                href="/support" 
                onClick={() => triggerHaptic("light")} 
                className="flex items-center justify-between p-6 hover:bg-muted/5 active:bg-muted/10 transition-all group"
              >
                 <div className="flex items-center gap-4 min-w-0">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-inner group-hover:scale-110 transition-all">
                       <HelpCircle className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-black uppercase italic tracking-tight text-foreground/80 group-hover:text-rose-500 transition-colors">Emergency Protocol</span>
                 </div>
                 <ChevronRight className="h-5 w-5 opacity-20 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </Link>

              {isStaff && (
                <Link 
                  href="/dashboard" 
                  onClick={() => triggerHaptic("medium")} 
                  className="flex items-center justify-between p-6 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20 transition-all group"
                >
                   <div className="flex items-center gap-4 min-w-0">
                      <div className="h-11 w-11 shrink-0 rounded-xl bg-amber-500 flex items-center justify-center text-black border border-amber-500/20 shadow-inner group-hover:scale-110 transition-all">
                         <UserCog className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase italic tracking-tight text-amber-500">Platform Command Hub</span>
                   </div>
                   <Terminal className="h-5 w-5 text-amber-500 opacity-40 animate-pulse" />
                </Link>
              )}
           </div>
        </section>

        {/* --- GLOBAL SIGNAL MANIFEST --- */}
        <section className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 italic opacity-30">
               <Layers className="h-4 w-4" />
               <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">Signal_Manifest</h2>
            </div>
            <Badge variant="outline" className={cn(
              "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border-none",
              isStaff ? "text-amber-500 bg-amber-500/10" : "bg-muted/10 text-muted-foreground"
            )}>
              {activeCount} NODES ACTIVE
            </Badge>
          </div>

          {subsLoading ? (
            <div className="space-y-4">
              <SkeletonList count={3} />
            </div>
          ) : allSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {allSubscriptions.map((sub: any) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border/10 bg-card/5 p-16 text-center space-y-4 shadow-inner relative overflow-hidden">
               <User className="h-10 w-10 mx-auto text-muted-foreground opacity-5 animate-pulse" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 italic">
                 No verified signal nodes synchronized.
               </p>
            </div>
          )}
        </section>
      </main>

      {/* --- FOOTER SIGNAL --- */}
      <footer className="mt-auto flex flex-col items-center gap-4 opacity-20 py-10">
         <Globe className="h-5 w-5 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center leading-none">
           Zipha Identity Cluster synchronized // Sync: {isStaff ? "MASTER" : "NODE"}
         </p>
      </footer>
    </div>
  );
}