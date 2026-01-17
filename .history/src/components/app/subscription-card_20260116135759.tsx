"use client";

import * as React from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ExternalLink, 
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

/**
 * 🛰️ SUBSCRIPTION_CARD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon.
 * Fix: High-density rows (p-4) and h-10 action profile prevents layout blowout.
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
  
  // 🛰️ DEVICE INGRESS
  const { isMobile, screenSize, isPortrait, isReady } = useDeviceContext();
  
  const isActive = status === "ACTIVE";
  const expiresDate = new Date(expiresAt);
  
  const isMerchantOperator = useMemo(() => 
    auth.user?.role?.toUpperCase() === "MERCHANT", 
    [auth.user?.role]
  );

  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = isActive && daysLeft <= 3 && daysLeft > 0;

  // 🛡️ HYDRATION SHIELD: Prevents "Bogus" layout snap
  if (!isReady) return <div className="h-24 w-full bg-white/5 animate-pulse rounded-xl border border-white/5" />;

  const handleAction = () => {
    impact("heavy"); 
    if (isMerchantOperator && merchant.botUsername) {
      openTelegramLink(`https://t.me/${merchant.botUsername}/dashboard`);
    } else if (inviteLink) {
      openTelegramLink(inviteLink);
    }
  };

  return (
    <div className={cn(
      "group relative overflow-hidden bg-zinc-950/40 border border-white/5 transition-all duration-500",
      "rounded-xl md:rounded-2xl shadow-2xl",
      !isActive && "grayscale opacity-30 pointer-events-none",
      className
    )}>
      {/* 🌫️ TACTICAL STATUS LINE */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1 transition-all duration-500",
        isActive ? (isExpiringSoon ? "bg-amber-500" : "bg-primary") : "bg-white/10"
      )} />

      <div className={cn(
        "flex justify-between items-center p-4 md:p-5 relative z-10 leading-none",
        (isMobile || isPortrait) && "flex-col items-stretch gap-4"
      )}>
        <div className="flex-1 space-y-3 min-w-0">
          
          {/* --- TOP: IDENTITY NODE --- */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-foreground truncate">
                {service.name}
              </h3>
              
              <div className={cn(
                "text-[7px] font-black uppercase border px-2 py-0.5 rounded italic tracking-widest",
                isActive ? "text-emerald-500 border-emerald-500/10 bg-emerald-500/5" : "text-muted-foreground border-white/5"
              )}>
                {status}
              </div>

              {isMerchantOperator && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/5 border border-amber-500/10">
                   <Terminal className="size-2.5 text-amber-500" />
                   <span className="text-[7px] font-black text-amber-500 uppercase">OVERSIGHT</span>
                </div>
              )}
            </div>

            {merchant.companyName && (
              <div className="flex items-center gap-2 opacity-20 italic">
                <Globe className="size-2.5" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] truncate">
                  Vector: {merchant.companyName}
                </p>
              </div>
            )}
          </div>

          {/* --- MIDDLE: RESOURCE TELEMETRY --- */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <Zap className={cn("size-3", isActive ? "text-primary animate-pulse" : "opacity-20")} />
              <span className="text-[8px] font-black uppercase tracking-widest text-foreground/80">
                {tier?.name} // ${tier?.price}
              </span>
            </div>
            
            <div className={cn(
              "flex items-center gap-2 italic opacity-20",
              isExpiringSoon && "text-amber-500 opacity-100"
            )}>
              {isExpiringSoon ? <Activity className="size-3 animate-bounce" /> : <Clock className="size-3" />}
              <span className="text-[8px] font-black uppercase tracking-widest">
                {isActive ? (daysLeft > 0 ? `${daysLeft}D_REMAIN` : "EXPIRING") : "NULL"}
              </span>
            </div>
          </div>
        </div>

        {/* --- ACTION: NODE INGRESS (Tactical h-10) --- */}
        {isActive && (
          <Button 
            onClick={handleAction} 
            className={cn(
              "h-10 md:h-11 px-6 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all active:scale-95 group/btn",
              isMerchantOperator ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}
          >
            {isMerchantOperator ? (
              <><LayoutDashboard className="mr-2 size-4" /><span>Manage</span></>
            ) : (
              <><ExternalLink className="mr-2 size-4" /><span>Open</span></>
            )}
          </Button>
        )}
      </div>

      {isActive && (
        <Waves className="absolute bottom-2 right-2 size-4 opacity-[0.03] text-primary pointer-events-none" />
      )}
    </div>
  )
}