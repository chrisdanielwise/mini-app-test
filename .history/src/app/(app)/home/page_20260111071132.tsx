"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/app/subscription-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Bell, 
  ShieldCheck, 
  Zap,
  Activity,
  History,
  Globe,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
 * 🛰️ USER HOME TERMINAL (Tactical Medium)
 * Normalized: High-density scannable scale for mobile mini-apps.
 * Optimized: Resilient grid geometry to prevent viewport cropping.
 */
export default function HomePage() {
  const { auth, isReady, user } = useTelegramContext();

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Initializing Identity Node..." />;
  }

  // Identity Mismatch State: Normalized
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background">
        <div className="rounded-2xl bg-card border border-rose-500/20 p-6 shadow-xl text-center space-y-4 max-w-xs animate-in zoom-in-95 duration-500">
          <Bell className="h-8 w-8 text-rose-500 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h1 className="text-lg font-black uppercase italic tracking-tight">Identity Mismatch</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Handshake Failed. Re-launch via the official Zipha Bot node.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeSubscriptions =
    subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || [];

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: TACTICAL SYNC --- */}
      <header className="px-5 py-5 md:py-6 rounded-b-2xl border-b border-border/10 bg-card/40 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/10 blur-lg rounded-xl" />
             <div className="relative flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-primary border border-primary/20 text-lg font-black text-primary-foreground italic shadow-inner">
               {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <h1 className="text-lg md:text-xl font-black tracking-tight truncate uppercase italic leading-none text-foreground">
              {user?.first_name || auth.user?.fullName?.split(" ")[0] || "Trader"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest italic leading-none">
                {activeSubscriptions.length} Verified Nodes
              </p>
            </div>
          </div>

          <button className="h-9 w-9 rounded-lg bg-muted/10 border border-border/10 flex items-center justify-center text-muted-foreground active:scale-90 transition-all">
             <Zap className="h-4 w-4 opacity-30" />
          </button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-8 pb-32">
        
        {/* --- TACTICAL ACTIONS: HIGH DENSITY --- */}
        <section className="grid grid-cols-2 gap-3 md:gap-4">
          <Link
            href="/services"
            onClick={() => hapticFeedback("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-2.5 rounded-xl border border-border/40 bg-card/40 p-4 transition-all active:scale-[0.97] shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 shadow-inner group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] italic opacity-60">Market</span>
            <Activity className="absolute -top-1 -right-1 h-8 w-8 opacity-[0.03] pointer-events-none" />
          </Link>

          <Link
            href="/history"
            onClick={() => hapticFeedback("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-2.5 rounded-xl border border-border/40 bg-card/40 p-4 transition-all active:scale-[0.97] shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/10 text-foreground border border-border/10 shadow-inner group-hover:scale-105 transition-transform">
              <History className="h-5 w-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] italic opacity-60">Ledger</span>
            <ShieldCheck className="absolute -top-1 -right-1 h-8 w-8 opacity-[0.03] pointer-events-none" />
          </Link>
        </section>

        {/* --- SERVICE BROADCASTS: TIGHT GRID --- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
              Active Broadcasters
            </h2>
            {activeSubscriptions.length > 0 && (
              <Badge variant="outline" className="font-black text-[7px] border-emerald-500/10 text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-1.5 py-0">
                STABLE
              </Badge>
            )}
          </div>

          {subsLoading ? (
            <SkeletonList count={2} />
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-3">
              {activeSubscriptions.slice(0, 4).map((sub) => (
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
              {activeSubscriptions.length > 4 && (
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full h-10 rounded-xl border border-dashed border-border/10 text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 hover:bg-muted/10"
                  >
                    View Global Cluster
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/10 bg-card/5 p-8 text-center shadow-inner relative overflow-hidden">
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary opacity-10" />
              <h3 className="text-xs font-black text-foreground/60 uppercase tracking-widest italic leading-none">
                Vault <span className="text-primary">De-Synced</span>
              </h3>
              <p className="mb-6 mt-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-30 italic">
                No active signal nodes detected.
              </p>
              <Link href="/services" className="w-full">
                <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-primary/20 active:scale-95">
                  Sync First Service
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <footer className="mt-auto flex items-center justify-center gap-3 opacity-20 py-6">
         <Globe className="h-2.5 w-2.5 text-muted-foreground" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Zipha Identity Hub // Cluster_Sync: Optimal
         </p>
      </footer>
    </div>
  );
}