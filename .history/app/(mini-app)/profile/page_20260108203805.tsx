"use client";

import { useState } from "react";
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
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { auth, isReady, user } = useTelegramContext();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Syncing profile..." />;
  }

  const isMerchant = auth.user?.role === "MERCHANT" || auth.user?.role === "ADMIN";

  const handleMenuClick = () => {
    const hapticsEnabled = localStorage.getItem("user_haptics_enabled") !== "false";
    if (hapticsEnabled) hapticFeedback("light");
  };

  /**
   * 🚀 ROBUST SWITCH LOGIC
   * 1. Prevents default event bubbling.
   * 2. Sets a loading state to give immediate visual feedback.
   * 3. Uses window.location.replace for a cleaner redirect.
   */
  const handleSwitchToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    handleMenuClick();
    
    const merchantId = auth.user?.merchantId;
    const telegramId = user?.id;

    if (merchantId && telegramId) {
      setIsRedirecting(true);
      // Constructing the full URL ensures no relative path confusion
      const callbackUrl = `/api/auth/callback?merchantId=${merchantId}&telegramId=${telegramId}`;
      window.location.replace(callbackUrl);
    } else {
      console.error("Auth Data Missing", { merchantId, telegramId });
      alert("Account data still syncing. Please wait a moment.");
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
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-3xl font-bold text-primary">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || <UserCircle className="h-10 w-10" />}
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
        {isMerchant && (
          <section className="space-y-4 rounded-3xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
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
              {isRedirecting ? "Connecting..." : "Full Merchant Dashboard"}
            </Button>
          </section>
        )}

        {/* ... Rest of your Subscription & Management Sections ... */}
      </div>
    </div>
  );
}