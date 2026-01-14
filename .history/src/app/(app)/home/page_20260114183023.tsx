"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/app/subscription-card";
// import { SkeletonList } from "@/components/ui/skeleton-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ShoppingBag, 
  Zap,
  History,
  Globe,
  Terminal,
  Lock,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SkeletonList } from "@/components/ui/skeleton-card";

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
 * 🛰️ HOME TERMINAL (Institutional v16.16.6)
 * Logic: Synchronized with Universal Login & Tactical Role-Aware Hydration.
 */
export default function HomePage() {
  const { auth, isReady, user, mounted } = useTelegramContext();
  const router = useRouter();
  const [tunnelReady, setTunnelReady] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [systemConfig, setSystemConfig] = useState<any>(null);

  // 🏛️ 1. THIN-FETCH IDENTITY PROTOCOL
  useEffect(() => {
    if (!mounted) return;
    setTunnelReady(true);

    const verifySessionNode = async () => {
      try {
        // 🚀 Uses the optimized profile route to prevent 9s+ database lockups
        const res = await fetch("/api/user/profile", { cache: 'no-store' });
        const data = await res.json();
        
        // 🛠️ MAINTENANCE INTERCEPTOR
        if (res.status === 503) {
          router.replace(`/maintenance?message=${encodeURIComponent(data.message || "Node offline.")}`);
          return;
        }

        // 🚨 SOFT AUTH TRIGGER: Redirects to global /login terminal
        if (res.status === 401) {
          router.replace("/login?reason=session_expired&redirect=/home");
          return;
        }

        // 📢 LIVE BROADCAST HYDRATION
        if (data.success && data.data.systemConfig) {
          setSystemConfig(data.data.systemConfig);
        }
      } catch (err) {
        console.error("🔥 [Home_Auth_Critical]: Handshake node unreachable.");
      }
    };

    if (auth.isAuthenticated) {
      verifySessionNode();
    }

    const timer = setTimeout(() => {
       if (!isReady) setIsStuck(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [mounted, isReady, auth.isAuthenticated, router]);

  // 🛰️ DATA INGRESS
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  // 🛡️ ROLE-AWARE THEME DETECTION
  const isMerchant = useMemo(() => 
    auth.user?.role?.toUpperCase() === "MERCHANT",
    [auth.user?.role]
  );

  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager", "platform_support", "amber"].includes(auth.user.role.toLowerCase()),
    [auth.user?.role]
  );

  // 2. INITIALIZATION LOADER
  if (!auth.isAuthenticated && (!isReady && !isStuck || !tunnelReady || auth.isLoading)) {
    return <LoadingScreen message="ESTABLISHING IDENTITY LINK..." subtext="SYNCING WITH NEON DATABASE..." />;
  }

  // 3. CRYPTOGRAPHIC GATE: Identity Null Screen
  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-6 max-w-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full -z-10" />
          <div className="h-20 w-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
            <Lock className="h-10 w-10 text-rose-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Identity Null</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-60">
              Protocol handshake required. Please re-anchor your identity node.
            </p>
          </div>
          <Button 
            onClick={() => router.push("/login?redirect=/home")} 
            variant="outline" 
            className="w-full h-12 rounded-xl border-rose-500/20 text-rose-500 font-black uppercase text-[10px] tracking-widest italic"
          >
            Reconnect Node
          </Button>
        </div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || [];

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground selection:bg-primary/30">
      
      {/* --- LIVE EMERGENCY BROADCAST BANNER --- */}
      {systemConfig?.broadcastActive && (
        <div className={cn(
          "w-full py-3 px-6 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500",
          systemConfig.broadcastLevel === "CRITICAL" ? "bg-rose-600 text-white" : isMerchant ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
        )}>
          <Megaphone className="h-4 w-4 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest italic truncate">
            {systemConfig.broadcastMessage}
          </span>
        </div>
      )}

      {/* --- INSTITUTIONAL HEADER --- */}
      <header className="px-6 py-6 md:py-8 rounded-b-[2rem] border-b border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className={cn(
               "absolute inset-0 blur-xl rounded-2xl opacity-20 transition-colors duration-1000",
               isStaff ? "bg-amber-500" : isMerchant ? "bg-amber-500/50" : "bg-primary"
             )} />
             <div className={cn(
               "relative flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl border-2 text-2xl font-black italic shadow-2xl transition-all duration-700",
               isStaff || isMerchant ? "bg-amber-500 border-amber-400/20 text-black" : "bg-primary border-primary-foreground/20 text-primary-foreground"
             )}>
               {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
             </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter truncate uppercase italic leading-none">
                {user?.first_name || auth.user?.fullName?.split(" ")[0] || "Operator"}
              </h1>
              {isStaff ? (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[8px] tracking-[0.2em] px-2 py-0.5 animate-pulse">
                  STAFF
                </Badge>
              ) : isMerchant && (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[8px] tracking-[0.2em] px-2 py-0.5">
                  MERCHANT
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isStaff || isMerchant ? "bg-amber-500" : "bg-emerald-500")} />
              <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest italic leading-none">
                {isMerchant ? "Merchant Node Active" : isStaff ? "Universal Oversight Link" : `${activeSubscriptions.length} Verified Clusters`}
              </p>
            </div>
          </div>

          <Link href={isMerchant ? "/dashboard" : "/settings"}>
            <button className="h-11 w-11 rounded-xl bg-muted/10 border border-border/10 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-90">
               {isMerchant || isStaff ? <Terminal className="h-5 w-5 text-amber-500" /> : <Zap className="h-5 w-5 opacity-40" />}
            </button>
          </Link>
        </div>
      </header>

      {/* --- GRID NAVIGATION --- */}
      <div className="px-5 py-8 space-y-10 pb-36">
        <section className="grid grid-cols-2 gap-4">
          <Link href="/services" className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-6 transition-all active:scale-[0.97] shadow-lg backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic opacity-50 text-center">Market_Hub</span>
          </Link>

          <Link href="/history" className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-6 transition-all active:scale-[0.97] shadow-lg backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/10 text-foreground border border-border/10 shadow-inner group-hover:scale-110 transition-transform">
              <History className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic opacity-50 text-center">Audit_Ledger</span>
          </Link>
        </section>

        {/* --- DYNAMIC CONTENT --- */}
        <section className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">
              {isMerchant ? "Merchant_Service_Audit" : isStaff ? "Platform_Node_Audit" : "Verified_Broadcasters"}
            </h2>
          </div>

          {subsLoading ? (
            <SkeletonList count={2} /> 
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {activeSubscriptions.map((sub) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border/10 bg-card/5 p-16 text-center shadow-inner relative overflow-hidden">
              <Sparkles className="mx-auto mb-6 h-12 w-12 text-primary opacity-10 animate-pulse" />
              <h3 className="text-lg font-black text-foreground/40 uppercase tracking-widest italic leading-none">Vault <span className="text-primary/60">Idle</span></h3>
              <Link href="/services" className="w-full mt-10">
                <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-xs shadow-2xl">Sync First Service</Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-auto flex flex-col items-center gap-3 opacity-20 py-10 px-6">
         <Globe className="h-5 w-5 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-center leading-relaxed">
           Institutional Ingress Node // Protocol: Zipha_V16
         </p>
      </footer>
    </div>
  );
}