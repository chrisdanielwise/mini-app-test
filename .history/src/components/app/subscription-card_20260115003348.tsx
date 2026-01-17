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
  Terminal
} from "lucide-react";
import { openTelegramLink } from "@/lib/telegram/webapp";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 FLUID SUBSCRIPTION NODE (Institutional v16.16.12)
 * Logic: Proximity-aware telemetry with Ingress-Lock safety.
 * Design: v9.9.1 Hardened Glassmorphism with Momentum Ingress.
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
  const isActive = status === "ACTIVE";
  const expiresDate = new Date(expiresAt);
  
  const isMerchantOperator = useMemo(() => 
    auth.user?.role?.toUpperCase() === "MERCHANT", 
    [auth.user?.role]
  );

  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = isActive && daysLeft <= 3 && daysLeft > 0;

  const handleAction = () => {
    impact("medium"); // 🏁 TACTILE SYNC: Feel the ingress into the node
    
    if (isMerchantOperator && merchant.botUsername) {
      openTelegramLink(`https://t.me/${merchant.botUsername}/dashboard`);
    } else if (inviteLink) {
      openTelegramLink(inviteLink);
    }
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl backdrop-blur-3xl",
        "rounded-[2rem] md:rounded-[3rem] border",
        isActive 
          ? "border-white/5 bg-card/40 hover:border-primary/30" 
          : "border-white/5 bg-white/[0.02] grayscale opacity-40",
        className
      )}
    >
      {/* 🌊 STATUS INDICATOR: Kinetic energy bar */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-2 transition-all duration-700 z-20",
        isActive ? (isExpiringSoon ? "bg-amber-500 shadow-[0_0_15px_#f59e0b]" : "bg-primary shadow-[0_0_15px_#10b981]") : "bg-white/10"
      )} />

      <div className="flex items-start justify-between gap-6 p-8 md:p-10 relative z-10">
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* --- TOP: IDENTITY & PROTOCOL --- */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
                {service.name}
              </h3>
              <Badge
                className={cn(
                  "rounded-xl text-[9px] font-black border shadow-xl px-3 py-1 tracking-[0.2em] uppercase italic",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-white/5 text-muted-foreground/40 border-white/5"
                )}
              >
                {status}
              </Badge>
              {isMerchantOperator && (
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                   <Terminal className="size-3 text-amber-500" />
                   <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Oversight_Node</span>
                </div>
              )}
            </div>
            {merchant.companyName && (
              <div className="flex items-center gap-2.5 opacity-30 italic">
                <Globe className="size-3.5 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] truncate">
                  Vector: {merchant.companyName}
                </p>
              </div>
            )}
          </div>

          {/* --- MIDDLE: RESOURCE TELEMETRY --- */}
          <div className="flex flex-wrap gap-4">
            {tier && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                <Zap className={cn("size-4 shrink-0", isActive ? "text-primary animate-pulse" : "text-white/20")} />
                <p className="text-[11px] font-black uppercase tracking-widest text-foreground/80">
                  {tier.name} <span className="mx-2 opacity-10">//</span> ${tier.price}
                </p>
              </div>
            )}
            
            <div className={cn(
              "flex items-center gap-3 border rounded-2xl px-4 py-2 transition-all duration-700",
              isExpiringSoon 
                ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-xl" 
                : "bg-white/5 border-white/10 text-muted-foreground/40"
            )}>
              {isExpiringSoon ? <Activity className="size-4 animate-bounce" /> : <Clock className="size-4" />}
              <p className="text-[11px] font-black uppercase tracking-widest italic">
                {isActive ? (
                  daysLeft > 0 ? `${daysLeft}D_REMAINING` : "CRITICAL_EXPIRY"
                ) : (
                  `ARCHIVED_${expiresDate.toLocaleDateString()}`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* --- ACTION: NODE INGRESS --- */}
        {isActive && (inviteLink || isMerchantOperator) && (
          <div className="relative group/btn shrink-0 pt-2">
            <div className={cn(
              "absolute inset-0 blur-2xl rounded-full opacity-0 group-hover/btn:opacity-20 transition-all duration-700",
              isMerchantOperator ? "bg-amber-500" : "bg-primary"
            )} />
            <Button 
              size="lg" 
              onClick={handleAction} 
              className={cn(
                "relative h-16 w-16 md:h-20 md:w-20 lg:h-auto lg:w-auto lg:px-10 rounded-2xl md:rounded-[1.5rem] font-black uppercase italic tracking-widest shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95",
                isMerchantOperator ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
              )}
            >
              {isMerchantOperator ? (
                <>
                  <LayoutDashboard className="lg:mr-3 size-5 md:size-6" />
                  <span className="hidden lg:inline">Management</span>
                </>
              ) : (
                <>
                  <ExternalLink className="lg:mr-3 size-5 md:size-6" />
                  <span className="hidden lg:inline">Open_Relay</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* 🏛️ INSTITUTIONAL WATERMARK */}
      <ShieldCheck className="absolute -bottom-8 -right-8 size-40 md:size-48 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
    </div>
  )
}