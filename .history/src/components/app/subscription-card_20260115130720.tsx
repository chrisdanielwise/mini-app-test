"use client";

import * as React from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Zap, 
  LayoutDashboard,
  Terminal,
  Waves
} from "lucide-react";
import { openTelegramLink } from "@/lib/telegram/webapp";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface SubscriptionCardProps {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  expiresAt: string;
  inviteLink?: string;
  service: {
    id: string;
    name: string;
    description?: string;
  };
  tier?: {
    name: string;
    price: string;
  };
  merchant: {
    companyName?: string;
    botUsername?: string;
  };
  className?: string;
}

/**
 * 🌊 FLUID SUBSCRIPTION NODE (Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: Proximity-aware telemetry with Morphology-aware layout switching.
 */
export function SubscriptionCard({
  status,
  expiresAt,
  inviteLink,
  service,
  tier,
  merchant,
  className,
}: SubscriptionCardProps) {
  const { auth } = useTelegramContext();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    screenSize, 
    isPortrait, 
    isReady,
    viewportWidth 
  } = useDeviceContext();
  
  const isActive = status === "ACTIVE";
  const expiresDate = new Date(expiresAt);
  
  const isMerchantOperator = useMemo(() => 
    auth.user?.role?.toUpperCase() === "MERCHANT", 
    [auth.user?.role]
  );

  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = isActive && daysLeft <= 3 && daysLeft > 0;

  // 🛡️ HYDRATION GUARD
  if (!isReady) return <div className="h-32 animate-pulse bg-card/20 rounded-[2.5rem] border border-white/5" />;

  const handleAction = () => {
    impact("heavy"); 
    if (isMerchantOperator && merchant.botUsername) {
      openTelegramLink(`https://t.me/${merchant.botUsername}/dashboard`);
    } else if (inviteLink) {
      openTelegramLink(inviteLink);
    }
  };

  /**
   * 🕵️ LAYOUT MORPHOLOGY
   * Adjusts padding, spacing, and flex-direction based on 6-tier logic.
   */
  const cardPadding = screenSize === 'xs' ? "p-5" : screenSize === 'sm' ? "p-8" : "p-10 md:p-12";
  const layoutDirection = (isMobile || isPortrait) ? "flex-col items-stretch" : "flex-row items-center";
  const telemetryGap = screenSize === 'xs' ? "gap-3" : "gap-4";

  return (
    <div 
      className={cn(
        "group relative overflow-hidden shadow-apex backdrop-blur-3xl border",
        "transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "rounded-[2.5rem] md:rounded-[3.5rem]",
        isActive 
          ? "border-white/5 bg-card/40 hover:border-primary/30" 
          : "border-white/5 bg-white/[0.02] grayscale opacity-40",
        className
      )}
    >
      {/* 🌊 STATUS INDICATOR: Scales with viewportWidth */}
      <div className={cn(
        "absolute left-0 top-0 h-full transition-all duration-1000 z-20",
        viewportWidth > 1200 ? "w-3" : "w-1.5",
        isActive ? (isExpiringSoon ? "bg-amber-500 shadow-glow" : "bg-primary shadow-glow") : "bg-white/10"
      )} />

      {/* Subsurface Flow (isDesktop increases radiance) */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none",
        isDesktop && "scale-150"
      )} />

      <div className={cn("flex justify-between relative z-10", layoutDirection, cardPadding)}>
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* --- TOP: IDENTITY & PROTOCOL --- */}
          <div className="space-y-3">
            <div className={cn("flex items-center gap-4 flex-wrap", (isMobile || isPortrait) && "justify-center")}>
              <h3 className="text-[var(--fluid-h2)] font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
                {service.name}
              </h3>
              
              {/* Hide labels on XS to preserve horizontal space */}
              {screenSize !== 'xs' && (
                <Badge className={cn(
                  "rounded-xl text-[8px] font-black border px-3 py-1 tracking-widest uppercase italic",
                  isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-muted-foreground/40 border-white/5"
                )}>
                  {status}
                </Badge>
              )}

              {isMerchantOperator && (
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                   <Terminal className="size-3 text-amber-500" />
                   <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Oversight</span>
                </div>
              )}
            </div>

            {merchant.companyName && screenSize !== 'xs' && (
              <div className={cn("flex items-center gap-2.5 opacity-30 italic", (isMobile || isPortrait) && "justify-center")}>
                <Globe className="size-3.5 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] truncate">
                  Vector: {merchant.companyName}
                </p>
              </div>
            )}
          </div>

          {/* --- MIDDLE: RESOURCE TELEMETRY --- */}
          <div className={cn("flex flex-wrap", (isMobile || isPortrait) ? "justify-center" : "justify-start", telemetryGap)}>
            {tier && (
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-2.5 transition-all duration-700 hover:bg-white/[0.08]">
                <Zap className={cn("size-4 shrink-0", isActive ? "text-primary animate-pulse" : "text-white/20")} />
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-foreground/80">
                  {tier.name} <span className="mx-1 opacity-20">/</span> ${tier.price}
                </p>
              </div>
            )}
            
            <div className={cn(
              "flex items-center gap-3 border rounded-2xl px-5 py-2.5 transition-all duration-1000",
              isExpiringSoon ? "bg-amber-500/10 border-amber-500/40 text-amber-500" : "bg-white/[0.03] border-white/10 text-muted-foreground/40"
            )}>
              {isExpiringSoon ? <Activity className="size-4 animate-bounce" /> : <Clock className="size-4" />}
              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest italic">
                {isActive ? (daysLeft > 0 ? `${daysLeft}D_REMAIN` : "EXPIRING") : "ARCHIVED"}
              </p>
            </div>
          </div>
        </div>

        {/* --- ACTION: NODE INGRESS --- */}
        {isActive && (inviteLink || isMerchantOperator) && (
          <div className={cn("relative group/btn shrink-0", (isMobile || isPortrait) ? "mt-6" : "ml-6")}>
            <div className={cn(
              "absolute inset-0 blur-3xl rounded-full opacity-0 group-hover/btn:opacity-30 transition-all duration-1000",
              isMerchantOperator ? "bg-amber-500" : "bg-primary"
            )} />
            <Button 
              size="lg" 
              onClick={handleAction} 
              className={cn(
                "relative rounded-[1.8rem] md:rounded-[2.2rem] font-black uppercase italic tracking-widest shadow-apex transition-all duration-1000 active:scale-95",
                isMerchantOperator ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground",
                (isMobile || isPortrait) ? "w-full h-18" : "h-20 px-10"
              )}
            >
              {isMerchantOperator ? (
                <><LayoutDashboard className="mr-3 size-6" /><span>Manage</span></>
              ) : (
                <><ExternalLink className="mr-3 size-6" /><span>Open</span></>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* 🏛️ INSTITUTIONAL WATERMARK: Full viewportWidth scaling */}
      <ShieldCheck 
        className="absolute -bottom-8 -right-8 opacity-[0.02] -rotate-12 pointer-events-none transition-all duration-[2000ms]" 
        style={{ width: `${Math.max(160, viewportWidth * 0.15)}px`, height: `${Math.max(160, viewportWidth * 0.15)}px` }}
      />
      
      {isActive && (
        <Waves className="absolute bottom-4 left-4 size-6 opacity-[0.05] animate-pulse text-primary pointer-events-none" />
      )}
    </div>
  )
}