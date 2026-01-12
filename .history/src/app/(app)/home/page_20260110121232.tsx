"use client";

import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { useApi } from "@/src/lib/hooks/use-api";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { SubscriptionCard } from "@/src/components/app/subscription-card";
import { SkeletonList } from "@/src/components/ui/skeleton-card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { hapticFeedback } from "@/src/lib/telegram/webapp";
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Bell, 
  Wallet, 
  ShieldCheck, 
  Zap,
  Activity,
  History
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface Subscription {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  startsAt: string;
  expiresAt: string;
  inviteLink?: string;
  service: {
    id: string;
    name: string;
    description?: string;
  };
  tier?: {
    id: string;
    name: string;
    price: string;
  };
  merchant: {
    companyName?: string;
    botUsername?: string;
  };
}

/**
 * 🛰️ USER HOME TERMINAL (Staff Tier)
 * High-resiliency entry point for subscribers to manage their digital vault.
 */
export default function HomePage() {
  const { auth, isReady, user } = useTelegramContext();

  // 🏁 Data Fetch from the User Ledger Node
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Initializing Identity Node..." />;
  }

  // 🛡️ AUTH GUARD: Identity verification protocol
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-10 text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-destructive/5 blur-[100px] rounded-full" />
        
        <div className="relative group">
          <div className="absolute inset-0 animate-ping rounded-full bg-destructive/10 duration-[2000ms]" />
          <div className="relative rounded-[2.5rem] bg-card border border-destructive/20 p-8 shadow-2xl">
            <Bell className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-4 max-w-xs relative z-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            Identity <span className="text-destructive">Mismatch</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
            Protocol Handshake Failed. Please re-launch the interface via the official Zipha Bot node.
          </p>
        </div>
      </div>
    );
  }

  const activeSubscriptions =
    subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || [];

  return (
    <div className="min-h-screen space-y-10 bg-background pb-32 animate-in fade-in duration-1000">
      
      {/* --- HUD HEADER --- */}
      <header className="p-8 pt-12 rounded-b-[3.5rem] border-b border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl group-hover:blur-2xl transition-all" />
             <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary border-2 border-primary/20 text-2xl font-black text-primary-foreground italic shadow-inner">
               {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden space-y-1">
            <h1 className="text-2xl font-black tracking-tighter truncate uppercase italic leading-none">
              {user?.first_name || auth.user?.fullName?.split(" ")[0] || "Trader"}
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">
                {activeSubscriptions.length} Verified Nodes
              </p>
            </div>
          </div>

          <div className="h-12 w-12 rounded-xl bg-muted/10 border border-border/40 flex items-center justify-center text-muted-foreground opacity-40">
             <Zap className="h-5 w-5" />
          </div>
        </div>
      </header>

      <div className="px-6 space-y-12">
        
        {/* --- TACTICAL ACTIONS --- */}
        <section className="grid grid-cols-2 gap-6">
          <Link
            href="/services"
            onClick={() => hapticFeedback("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-4 rounded-[2.5rem] border border-border/40 bg-card/40 p-8 transition-all hover:border-primary/50 shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-inner">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Market</span>
            <div className="absolute top-0 right-0 p-2 opacity-5">
               <Activity className="h-12 w-12" />
            </div>
          </Link>

          <Link
            href="/history"
            onClick={() => hapticFeedback("light")}
            className="group relative overflow-hidden flex flex-col items-center gap-4 rounded-[2.5rem] border border-border/40 bg-card/40 p-8 transition-all hover:border-foreground/50 shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 text-foreground group-hover:scale-110 transition-transform shadow-inner">
              <History className="h-7 w-7" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Ledger</span>
            <div className="absolute top-0 right-0 p-2 opacity-5">
               <ShieldCheck className="h-12 w-12" />
            </div>
          </Link>
        </section>

        {/* --- SERVICE BROADCASTS --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic">
              Active Broadcasters
            </h2>
            {activeSubscriptions.length > 0 && (
              <Badge
                variant="outline"
                className="font-black text-[8px] border-emerald-500/20 text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-3 py-1"
              >
                STABLE_NODE
              </Badge>
            )}
          </div>

          {subsLoading ? (
            <SkeletonList count={2} />
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-6">
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
                    className="w-full h-16 rounded-[1.5rem] border border-dashed border-border/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-muted/30 transition-all"
                  >
                    View Global Cluster
                    <ArrowRight className="ml-2 h-4 w-4 opacity-30" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border/40 bg-card/20 p-16 text-center shadow-inner relative overflow-hidden">
              <Sparkles className="mx-auto mb-6 h-12 w-12 text-primary opacity-20" />
              <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] italic leading-tight">
                Vault <span className="text-primary">De-Synchronized</span>
              </h3>
              <p className="mb-10 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                No active signal nodes detected in this identity cluster.
              </p>
              <Link href="/services">
                <Button className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
                  Sync First Service
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}