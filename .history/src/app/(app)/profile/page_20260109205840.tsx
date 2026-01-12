"use client";

import { useState, useEffect } from "react";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { useApi } from "@/src/lib/hooks/use-api";
import { LoadingScreen, LoadingSpinner } from "@/src/components/ui/loading-spinner";
import { SubscriptionCard } from "@/src/components/mini-app/subscription-card";
import { SkeletonList } from "@/src/components/ui/skeleton-card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { hapticFeedback } from "@/src/lib/telegram/webapp";
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
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

/**
 * 👤 USER PROFILE NODE (Tier 3)
 * Handles identity sync and provides the bridge to Tier 2 (Staff Dashboard).
 */
export default function ProfilePage() {
  const { auth, isReady, user } = useTelegramContext();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [syncedMerchantId, setSyncedMerchantId] = useState<string | null>(null);

  /**
   * 🔄 IDENTITY RECONCILIATION
   * Resolves the Neon DB Merchant UUID for administrative users.
   */
  useEffect(() => {
    async function resolveMerchantIdentity() {
      if (isReady && user?.id && !auth.user?.merchantId) {
        try {
          const response = await fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telegramId: user.id.toString() }),
          });
          const data = await response.json();
          if (data.merchantId) {
            setSyncedMerchantId(data.merchantId);
          }
        } catch (e) {
          console.error("Identity sync protocol failed:", e);
        }
      }
    }
    resolveMerchantIdentity();
  }, [isReady, user?.id, auth.user?.merchantId]);

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Profile..." />;
  }

  const isMerchant = auth.user?.role === "MERCHANT" || auth.user?.role === "ADMIN";

  const handleMenuClick = () => {
    const hapticsEnabled = typeof window !== 'undefined' && localStorage.getItem("user_haptics_enabled") !== "false";
    if (hapticsEnabled) {
      hapticFeedback("light");
    }
  };

  /**
   * 🚀 THE STAFF BRIDGE (Tier 2 Redirect)
   * Uses a secure callback protocol to transition from Mini App to Dashboard.
   */
  const handleSwitchToDashboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    handleMenuClick();
    setIsRedirecting(true);

    let merchantId = syncedMerchantId || auth.user?.merchantId || auth.user?.merchantProfile?.id;
    const telegramId = user?.id?.toString();

    if (merchantId && telegramId) {
      const callbackUrl = `/api/auth/callback?merchantId=${merchantId}&telegramId=${telegramId}`;
      window.location.replace(callbackUrl);
    } else {
      setIsRedirecting(false);
      console.error("Critical: Identity handshake data missing.");
    }
  };

  const menuItems = [
    { icon: Settings, label: "System Config", description: "Haptics & Notifications", href: "/profile/preferences" },
    { icon: HelpCircle, label: "Operator Support", description: "Direct Merchant Contact", href: "/profile/support" },
  ];

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700 pb-28">
      {/* Header: Identity Visualization */}
      <header className="border-b border-border/40 bg-card/30 p-8 pt-12 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] border-2 border-primary/20 bg-primary/10 text-4xl font-black text-primary italic shadow-2xl transition-transform group-active:scale-95">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || (
                <UserCircle className="h-10 w-10" />
              )}
            </div>
            {user?.is_premium && (
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-amber-500 shadow-xl animate-bounce">
                <Star className="h-4 w-4 fill-white text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
              {user?.first_name} {user?.last_name}
            </h1>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-primary opacity-60" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                {auth.user?.role || "USER"} ACCOUNT
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-10 px-6">
        {/* Merchant Control Layer: Tier 2 Bridge */}
        {isMerchant && (
          <section className="space-y-4 rounded-[2.5rem] border border-primary/30 bg-primary/5 p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-2">
              <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                <Sparkles className="h-3 w-3 fill-primary" /> Command Center
              </h2>
              <Badge className="bg-primary text-[8px] font-black italic tracking-tighter rounded-md px-2">Live Node</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={isRedirecting}
                onClick={handleSwitchToDashboard}
                className="flex flex-col gap-3 rounded-2xl bg-card/50 p-5 border border-border/40 active:scale-95 transition-all text-left group"
              >
                <BarChart3 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Market Data</span>
              </button>
              <button
                disabled={isRedirecting}
                onClick={handleSwitchToDashboard}
                className="flex flex-col gap-3 rounded-2xl bg-card/50 p-5 border border-border/40 active:scale-95 transition-all text-left group"
              >
                <Wallet className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest">Ledger</span>
              </button>
            </div>

            <Button
              variant="outline"
              disabled={isRedirecting}
              onClick={handleSwitchToDashboard}
              className="w-full rounded-2xl border-primary/20 bg-background text-[10px] font-black uppercase h-14 shadow-lg hover:bg-primary/5 transition-colors"
            >
              {isRedirecting ? (
                <LoadingSpinner size="sm" className="mr-3" />
              ) : (
                <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
              )}
              {isRedirecting ? "Establishing Handshake..." : "Enter Merchant Hub"}
            </Button>
          </section>
        )}

        {/* User Assets Layer */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">
            Active Deployments
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
            <div className="rounded-[2.5rem] border-2 border-dashed border-border/40 bg-card/20 py-12 text-center backdrop-blur-sm">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                Zero active signals detected
              </p>
            </div>
          )}
        </section>

        {/* Global Configuration */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">
            Management
          </h2>
          <div className="grid gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleMenuClick}
                className="group flex w-full items-center gap-5 rounded-3xl border border-border/40 bg-card/50 p-5 transition-all active:scale-95 hover:border-primary/20"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-black uppercase tracking-widest">{item.label}</p>
                  <p className="text-[10px] font-bold text-muted-foreground opacity-60 mt-1">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary/40 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Terminal Section */}
        <section className="pt-6 border-t border-border/20">
          <Button
            variant="ghost"
            className="w-full rounded-[1.8rem] border border-destructive/20 bg-destructive/5 py-8 font-black uppercase text-[10px] tracking-widest text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => {
              handleMenuClick();
              auth.logout();
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Deactivate Session
          </Button>
          <div className="mt-8 flex flex-col items-center gap-1 opacity-20">
            <p className="text-[9px] font-black tracking-[0.4em] uppercase italic">Zipha Precision Forex</p>
            <p className="text-[8px] font-bold">NODE BUILD 2026.01 • V2.4.5</p>
          </div>
        </section>
      </div>
    </div>
  );
}