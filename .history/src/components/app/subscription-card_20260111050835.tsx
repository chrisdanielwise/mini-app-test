"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, ShieldCheck, Activity, Globe, Zap } from "lucide-react";
import { openTelegramLink, hapticFeedback } from "@/lib/telegram/webapp";

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
 * 🛰️ SUBSCRIPTION DEPLOYMENT NODE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive horizontal constraints.
 * Optimized: Adaptive action hubs and institutional haptics for service ingress.
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
  const isActive = status === "ACTIVE";
  const expiresDate = new Date(expiresAt);
  
  // Logic: Calculate relative days with Institutional Precision
  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = isActive && daysLeft <= 3 && daysLeft > 0;

  const handleJoinChannel = () => {
    hapticFeedback("medium");
    if (inviteLink) {
      openTelegramLink(inviteLink);
    }
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 shadow-xl backdrop-blur-3xl",
        "rounded-2xl md:rounded-[2.5rem] border",
        isActive 
          ? "border-emerald-500/20 bg-card/40 hover:border-emerald-500/40" 
          : "border-border/40 bg-muted/10 grayscale-[0.8] opacity-60",
        className
      )}
    >
      {/* Dynamic Status Glow: Kinetic side-bar for immediate status lookup */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1 md:w-1.5 transition-colors z-20",
        isActive ? (isExpiringSoon ? "bg-amber-500 animate-pulse" : "bg-emerald-500") : "bg-muted-foreground/20"
      )} />

      <div className="flex items-start justify-between gap-4 md:gap-6 p-5 md:p-8 relative z-10">
        <div className="flex-1 space-y-4 md:space-y-5 min-w-0">
          {/* --- TOP: IDENTITY & STATUS --- */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
                {service.name}
              </h3>
              <Badge
                className={cn(
                  "text-[7px] md:text-[8px] font-black border shadow-sm px-2 py-0.5 tracking-widest uppercase",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-muted/20 text-muted-foreground border-border/40"
                )}
              >
                {status}
              </Badge>
            </div>
            {merchant.companyName && (
              <div className="flex items-center gap-2 opacity-40 italic">
                <Globe className="h-2.5 w-2.5 md:h-3 md:w-3 shrink-0" />
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] truncate">
                  NODE: {merchant.companyName}
                </p>
              </div>
            )}
          </div>

          {/* --- MIDDLE: RESOURCE ALLOCATION --- */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            {tier && (
              <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg md:rounded-xl px-2.5 py-1 md:px-3 md:py-1.5">
                <Zap className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary shrink-0" />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-foreground/80 whitespace-nowrap">
                  {tier.name} <span className="mx-1 opacity-20">•</span> ${tier.price}
                </p>
              </div>
            )}
            
            <div className={cn(
              "flex items-center gap-2 border rounded-lg md:rounded-xl px-2.5 py-1 md:px-3 md:py-1.5 transition-all shrink-0",
              isExpiringSoon 
                ? "bg-amber-500/5 border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]" 
                : "bg-muted/20 border-border/20 text-muted-foreground"
            )}>
              {isExpiringSoon ? <Activity className="h-3 w-3 md:h-3.5 md:w-3.5 animate-pulse" /> : <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />}
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                {isActive ? (
                  daysLeft > 0 ? `${daysLeft}D REMAINING` : "EXPIRING_NOW"
                ) : (
                  `EXPIRED: ${expiresDate.toLocaleDateString()}`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* --- ACTION: INGRESS TRIGGER --- */}
        {isActive && inviteLink && (
          <div className="relative group/btn shrink-0">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <Button 
              size="sm" 
              onClick={handleJoinChannel} 
              className="relative h-11 w-11 md:h-14 md:w-14 lg:h-auto lg:w-auto lg:px-8 rounded-xl md:rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest shadow-2xl transition-all hover:translate-y-[-2px] active:scale-95"
            >
              <ExternalLink className="lg:mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden lg:inline">Broadcaster</span>
            </Button>
          </div>
        )}
      </div>

      {/* Blueprint Subliminal Branding */}
      <ShieldCheck className="absolute -bottom-4 -right-4 h-24 w-24 md:h-32 md:w-32 opacity-[0.03] -rotate-12 pointer-events-none" />
    </div>
  )
}