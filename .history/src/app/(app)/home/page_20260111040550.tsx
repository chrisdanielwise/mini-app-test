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
  History
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
 * 🛰️ USER HOME TERMINAL (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive haptics and touch-safe targets for Telegram UI.
 */
export default function HomePage() {
  const { auth, isReady, user } = useTelegramContext();

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Initializing Identity Node..." />;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 p-6 text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-destructive/5 blur-[100px] rounded-full" />
        <div className="relative rounded-3xl md:rounded-[2.5rem] bg-card border border-destructive/20 p-6 md:p-8 shadow-2xl">
          <Bell className="h-10 w-10 md:h-12 md:w-12 text-destructive animate-bounce" />
        </div>
        <div className="space-y-3 max-w-xs relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
            Identity <span className="text-destructive">Mismatch</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground leading-relaxed opacity-60">
            Protocol Handshake Failed. Please re-launch via the official Zipha Bot node.
          </p>
        </div>
      </div>
    );
  }

  const activeSubscriptions =
    subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || [];

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-6 md:space-y-10 bg-background pb-32 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      
      {/* --- HUD HEADER --- */}
      <header className="px-5 py-8 md:p-8 md:pt-12 rounded-b-[2.5rem] md:rounded-b-[3.5rem] border-b border-border/40 bg-card/40 backdrop-blur-3xl shadow-xl">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl" />
             <div className="relative flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl bg-primary border-2 border-primary/20 text-xl md:text-2xl font-black text-primary-foreground italic shadow-inner">
               {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden space-y-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter truncate uppercase italic leading-none">
              {user?.first_name || auth.user?.fullName?.split(" ")[0] || "Trader"}
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] italic opacity-60">
                {activeSubscriptions.length} Verified Nodes
              </p>
            </div>
          </div>

          <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-muted/10 border border-border/40 flex items-center justify-center text-muted-foreground opacity-40">
             <Zap className="h-4 w-4 md:h-5 md:w-5" />
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-10 md:space-y-12">
        
        {/* --- TACTICAL ACTIONS --- */}
        <section className="grid grid-cols-2 gap-4 md:gap-6">
          <Link
            href="/services"
            onClick={() => hapticFeedback("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-3 md:gap-4 rounded-3xl md:rounded-[2.5rem] border border-border/40 bg-card/40 p-6 md:p-8 transition-all active:scale-[0.98] hover:border-primary/50 shadow-lg"
          >
            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform shadow-inner">
              <ShoppingBag className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] italic opacity-80">Market</span>
            <Activity className="absolute -top-2 -right-2 h-10 w-10 opacity-[0.03] pointer-events-none" />
          </Link>

          <Link
            href="/history"
            onClick={() => hapticFeedback("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-3 md:gap-4 rounded-3xl md:rounded-[2.5rem] border border-border/40 bg-card/40 p-6 md:p-8 transition-all active:scale-[0.98] hover:border-foreground/50 shadow-lg"
          >
            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-muted/50 text-foreground group-hover:scale-105 transition-transform shadow-inner">
              <History className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] italic opacity-80">Ledger</span>
            <ShieldCheck className="absolute -top-2 -right-2 h-10 w-10 opacity-[0.03] pointer-events-none" />
          </Link>
        </section>

        {/* --- SERVICE BROADCASTS --- */}
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic">
              Active Broadcasters
            </h2>
            {activeSubscriptions.length > 0 && (
              <Badge variant="outline" className="font-black text-[8px] border-emerald-500/20 text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5">
                STABLE_NODE
              </Badge>
            )}
          </div>

          {subsLoading ? (
            <SkeletonList count={2} />
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {activeSubscriptions.slice(0, 3).map((sub) => (
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
              {activeSubscriptions.length > 3 && (
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full h-14 md:h-16 rounded-2xl border border-dashed border-border/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-muted/30 active:scale-[0.99]"
                  >
                    View Global Cluster
                    <ArrowRight className="ml-2 h-4 w-4 opacity-30" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-border/40 bg-card/10 p-12 md:p-16 text-center shadow-inner relative overflow-hidden">
              <Sparkles className="mx-auto mb-4 md:mb-6 h-10 w-10 md:h-12 md:w-12 text-primary opacity-20" />
              <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] italic">
                Vault <span className="text-primary">De-Synced</span>
              </h3>
              <p className="mb-8 mt-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
                No active signal nodes detected.
              </p>
              <Link href="/services" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 md:h-16 px-10 md:px-12 rounded-xl md:rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] md:text-xs shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                  Sync First Service
                  <ArrowRight className="ml-3 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}