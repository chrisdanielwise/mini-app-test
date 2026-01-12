"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/app/subscription-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  Zap,
  Activity,
  History,
  Globe,
  Terminal,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

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
 * 🛰️ USER HOME TERMINAL (Institutional v9.5.2)
 * Hardened: Next.js 16 Hydration Shield prevents "window is not defined" errors.
 * Feature: Staff-Aware UI (Amber Theme) vs. Merchant/User (Emerald Theme).
 */
export default function HomePage() {
  const { auth, isReady, user, mounted, webApp } = useTelegramContext();
  const [tunnelReady, setTunnelReady] = useState(false);

  // 🛡️ HYDRATION SHIELD: Sync with Provider mount state
  useEffect(() => {
    if (mounted) setTunnelReady(true);
  }, [mounted]);

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  // 🛡️ Haptic Protocol Buffer
  const triggerHaptic = (style: "light" | "medium") => {
    if (webApp?.HapticFeedback) webApp.HapticFeedback.impactOccurred(style);
  };

  // 🛡️ STAFF CLEARANCE DETECTION
  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role),
    [auth.user?.role]
  );

  // 1. SYSTEM INITIALIZATION: Wait for SDK Handshake
  if (!isReady || !tunnelReady || auth.isLoading) {
    return <LoadingScreen message="Establishing Secure Link..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unauthorized identity nodes
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full -z-10" />
          <div className="h-20 w-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
            <Lock className="h-10 w-10 text-rose-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Identity Null</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-60">
              Protocol handshake failed. Please re-launch from the official bot terminal.
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

  const activeSubscriptions =
    subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || [];

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      
      {/* --- HUD HEADER --- */}
      <header className="px-6 py-6 md:py-8 rounded-b-[2rem] border-b border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className={cn(
               "absolute inset-0 blur-xl rounded-2xl opacity-20 transition-colors duration-1000",
               isStaff ? "bg-amber-500" : "bg-primary"
             )} />
             <div className={cn(
               "relative flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl border-2 text-2xl font-black italic shadow-2xl transition-all duration-700",
               isStaff ? "bg-amber-500 border-amber-400/20 text-black" : "bg-primary border-primary-foreground/20 text-primary-foreground"
             )}>
               {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
             </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter truncate uppercase italic leading-none">
                {user?.first_name || auth.user?.fullName?.split(" ")[0] || "Operator"}
              </h1>
              {isStaff && (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[8px] tracking-[0.2em] px-2 py-0.5 animate-pulse">
                  STAFF
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isStaff ? "bg-amber-500" : "bg-emerald-500")} />
              <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest italic leading-none">
                {isStaff ? "Universal Oversight Link" : `${activeSubscriptions.length} Verified Clusters`}
              </p>
            </div>
          </div>

          <button className="h-11 w-11 rounded-xl bg-muted/10 border border-border/10 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-90">
             {isStaff ? <Terminal className="h-5 w-5 text-amber-500" /> : <Zap className="h-5 w-5 opacity-40" />}
          </button>
        </div>
      </header>

      <div className="px-5 py-8 space-y-10 pb-36">
        
        {/* --- TACTICAL ACTIONS --- */}
        <section className="grid grid-cols-2 gap-4">
          <Link
            href="/services"
            onClick={() => triggerHaptic("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-6 transition-all active:scale-[0.97] shadow-lg backdrop-blur-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic opacity-50">Market_Hub</span>
            <Activity className="absolute -top-2 -right-2 h-10 w-10 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity" />
          </Link>

          <Link
            href="/history"
            onClick={() => triggerHaptic("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-6 transition-all active:scale-[0.97] shadow-lg backdrop-blur-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/10 text-foreground border border-border/10 shadow-inner group-hover:scale-110 transition-transform">
              <History className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic opacity-50">Audit_Ledger</span>
            <ShieldCheck className="absolute -top-2 -right-2 h-10 w-10 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity" />
          </Link>
        </section>

        {/* --- SERVICE BROADCASTS --- */}
        <section className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">
              {isStaff ? "Platform_Node_Audit" : "Verified_Broadcasters"}
            </h2>
            {activeSubscriptions.length > 0 && (
              <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-black text-[8px] text-emerald-500 uppercase tracking-widest">Live_Sync</span>
              </div>
            )}
          </div>

          {subsLoading ? (
            <div className="space-y-4">
              <SkeletonList count={2} />
            </div>
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {activeSubscriptions.slice(0, 5).map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  id={sub.id}
                  status={sub.status}
                  expiresAt={sub.expiresAt}
                  inviteLink={sub.inviteLink}
                  service={sub.service}
                  tier={sub.tier}
                  merchant={sub.merchant}
                />
              ))}
              {activeSubscriptions.length > 5 && (
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl border border-dashed border-border/20 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:bg-muted/10 hover:text-foreground transition-all"
                  >
                    View All Platform Signals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/10 bg-card/5 p-16 text-center shadow-inner relative overflow-hidden">
              <Sparkles className="mx-auto mb-6 h-12 w-12 text-primary opacity-10 animate-pulse" />
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-black text-foreground/40 uppercase tracking-widest italic leading-none">
                  Vault <span className="text-primary/60">Idle</span>
                </h3>
                <p className="mb-10 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-30 italic leading-relaxed">
                  No active signal nodes detected.<br />Synchronize a merchant node to begin.
                </p>
              </div>
              <Link href="/services" className="w-full relative z-10">
                <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-xs shadow-2xl shadow-primary/20 active:scale-95 transition-all hover:scale-[1.02]">
                  Sync First Service
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-auto flex flex-col items-center gap-3 opacity-20 py-10">
         <Globe className="h-5 w-5 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground italic text-center leading-none">
           Institutional Ingress Node // Protocol: Zipha_V2
         </p>
      </footer>
    </div>
  );
}