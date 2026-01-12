"use client";

import { useState, useEffect } from "react";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen, LoadingSpinner } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/app/subscription-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hapticFeedback } from "@/lib/telegram/webapp";
import {
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  UserCircle,
  LayoutDashboard,
  BarChart3,
  Wallet,
  Sparkles,
  Bell,
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

/**
 * 🛰️ USER HOME NODE (Tier 3)
 * Located at /home to resolve the parallel route collision with (public)/page.tsx.
 */
export default function UserHomePage() {
  const { auth, isReady, user } = useTelegramContext();

  // 1. Data Fetching via Secure API
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Establishing secure link..." />;
  }

  // 2. Auth Guard: Redirect or block if not verified by Telegram
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-background">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
          <div className="relative rounded-full bg-destructive/10 p-5 border border-destructive/20">
            <Bell className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight uppercase italic text-foreground">
            Access Denied
          </h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
            Verify session via the official bot.
          </p>
        </div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || [];

  const handleActionClick = () => {
    hapticFeedback("light");
  };

  return (
    <div className="min-h-screen space-y-8 bg-background pb-28 animate-in fade-in duration-700">
      {/* Header: Identity Visualization */}
      <header className="p-8 pt-12 border-b border-border/40 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border-2 border-primary/20 text-2xl font-black text-primary italic shadow-2xl">
            {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-xl font-black tracking-tighter uppercase italic truncate text-foreground">
              Hi, {user?.first_name || "User"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                {activeSubscriptions.length} Active Services
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 space-y-10">
        {/* Quick Access Grid */}
        <section className="grid grid-cols-2 gap-4">
          <Link
            href="/services"
            onClick={handleActionClick}
            className="group flex flex-col items-center gap-4 rounded-[2rem] border border-border/40 bg-card/50 p-6 transition-all hover:border-primary/40 active:scale-95 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Marketplace
            </span>
          </Link>
          <Link
            href="/history"
            onClick={handleActionClick}
            className="group flex flex-col items-center gap-4 rounded-[2rem] border border-border/40 bg-card/50 p-6 transition-all hover:border-foreground/20 active:scale-95 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-foreground group-hover:bg-muted/80 transition-colors">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Ledger
            </span>
          </Link>
        </section>

        {/* Dynamic Deployment List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Active Deployments
            </h2>
            {activeSubscriptions.length > 0 && (
              <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[8px] font-black italic">
                LIVE
              </Badge>
            )}
          </div>

          {subsLoading ? (
            <SkeletonList count={2} />
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {activeSubscriptions.slice(0, 3).map((sub) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
              {activeSubscriptions.length > 3 && (
                <Link href="/profile">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-dashed py-7 font-black uppercase tracking-widest text-[10px] hover:bg-muted/30"
                  >
                    View All Nodes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border/40 bg-card/20 p-12 text-center backdrop-blur-sm">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-muted-foreground/30" />
              <h3 className="text-xs font-black uppercase italic tracking-tighter text-foreground">
                Vault Empty
              </h3>
              <p className="mb-6 mt-2 text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground leading-relaxed">
                Connect to a cluster via the marketplace.
              </p>
              <Link href="/services">
                <Button className="rounded-xl px-8 font-black uppercase italic shadow-lg shadow-primary/20 h-12">
                  Explore Nodes
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}