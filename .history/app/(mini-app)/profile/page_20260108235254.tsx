"use client";

import { useState, useEffect } from "react";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen, LoadingSpinner } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/mini-app/subscription-card";
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
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { auth, isReady, user } = useTelegramContext();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 1. Fetch subscriptions - only if authenticated
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Syncing profile..." />;
  }

  // 🛡️ ROLE CHECK: Matches your MerchantService role update
  const isMerchant = auth.user?.role === "MERCHANT" || auth.user?.role === "ADMIN";

  const handleMenuClick = () => {
    const hapticsEnabled = localStorage.getItem("user_haptics_enabled") !== "false";
    if (hapticsEnabled) {
      hapticFeedback("light");
    }
  };

  /**
   * 🚀 THE BRIDGE REDIRECT:
   * Fixed to handle the "Auth Data Missing" error by checking 
   * multiple possible ID locations (merchantId vs merchantProfile.id)
   */
  const handleSwitchToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleMenuClick();
    
    // 🏁 DATA MAPPING FIX:
    // In your schema, the user object has a relation called merchantProfile.
    // We check auth.user.merchantId OR auth.user.merchantProfile?.id
    const merchantId = auth.user?.merchantId || auth.user?.merchantProfile?.id;
    const telegramId = user?.id?.toString(); // Ensure BigInt to String

    if (merchantId && telegramId) {
      setIsRedirecting(true);
      // Constructing URL for the Auth Callback bridge
      const callbackUrl = `/api/auth/callback?merchantId=${merchantId}&telegramId=${telegramId}`;
      window.location.replace(callbackUrl);
    } else {
      console.error("Auth Data Missing", { 
        merchantId, 
        telegramId, 
        rawUser: auth.user 
      });
      alert("Merchant data is still syncing. Please wait 3 seconds and tap again.");
    }
  };

  const menuItems = [
    { icon: Settings, label: "Settings", description: "App preferences & alerts", href: "/profile/preferences" },
    { icon: HelpCircle, label: "Help & Support", description: "Contact merchant support", href: "/profile/support" },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-background pb-20">
      <header className="border-b border-border bg-card/30 p-6 pt-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-3xl font-bold text-primary shadow-inner">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || (
                <UserCircle className="h-10 w-10" />
              )}
            </div>
            {user?.is_premium && (
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-amber-500 shadow-lg">
                <Star className="h-4 w-4 fill-white text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              {user?.first_name} {user?.last_name}
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {auth.user?.role || "USER"} ACCOUNT
            </Badge>
          </div>
        </div>
      </header>

      <div className="space-y-8 px-4">
        {/* MERCHANT TOOLS SECTION */}
        {isMerchant && (
          <section className="space-y-4 rounded-3xl border border-primary/20 bg-primary/5 p-4 shadow-sm animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-1">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" /> Merchant Admin
              </h2>
              <Badge className="bg-primary text-[9px] font-black italic">LIVE HUB</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isRedirecting}
                onClick={handleSwitchToDashboard}
                className="flex flex-col gap-2 rounded-2xl bg-card p-4 border border-border active:scale-95 transition-all text-left disabled:opacity-50"
              >
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-bold uppercase">Analytics</span>
              </button>
              <button
                disabled={isRedirecting}
                onClick={handleSwitchToDashboard}
                className="flex flex-col gap-2 rounded-2xl bg-card p-4 border border-border active:scale-95 transition-all text-left disabled:opacity-50"
              >
                <Wallet className="h-5 w-5 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">Payouts</span>
              </button>
            </div>

            <Button
              variant="outline"
              disabled={isRedirecting}
              onClick={handleSwitchToDashboard}
              className="w-full rounded-xl border-primary/20 bg-card text-[10px] font-black uppercase h-10 shadow-sm"
            >
              {isRedirecting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <LayoutDashboard className="mr-2 h-3 w-3" />
              )}
              {isRedirecting ? "Connecting to GreysuitFx..." : "Full Merchant Dashboard"}
            </Button>
          </section>
        )}

        {/* SUBSCRIPTIONS SECTION */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 px-1">
            Active Subscriptions
          </h2>
          {subsLoading ? (
            <SkeletonList count={1} />
          ) : (subscriptions?.subscriptions?.length || 0) > 0 ? (
            <div className="space-y-4">
              {subscriptions?.subscriptions.map((sub: any) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-10 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase opacity-60 tracking-tighter">
                No active signal services
              </p>
            </div>
          )}
        </section>

        {/* MENU SECTION */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
            App Management
          </h2>
          <div className="grid gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleMenuClick}
                className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all active:scale-95"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold uppercase tracking-tight">{item.label}</p>
                  <p className="text-[10px] font-medium text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
              </Link>
            ))}
          </div>
        </section>

        {/* FOOTER SECTION */}
        <section className="pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full rounded-2xl border border-destructive/20 bg-destructive/5 py-6 font-black uppercase text-[10px] tracking-widest text-destructive hover:bg-destructive/10"
            onClick={() => {
              handleMenuClick();
              auth.logout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout Account
          </Button>
          <div className="mt-6 flex flex-col items-center gap-1 opacity-40">
            <p className="text-[9px] font-black tracking-widest uppercase">Zipha Forex Provision</p>
            <p className="text-[8px] font-bold">Build 2026.01 • v2.4.0</p>
          </div>
        </section>
      </div>
    </div>
  );
}