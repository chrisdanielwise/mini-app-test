"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, ShieldCheck, AlertCircle, Activity, Globe, Zap } from "lucide-react";
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
 * Real-time monitoring card for active signal services.
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
        "group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 shadow-2xl backdrop-blur-3xl",
        isActive 
          ? "border-emerald-500/20 bg-card/40 hover:border-emerald-500/40" 
          : "border-border/40 bg-muted/10 grayscale-[0.8] opacity-60",
        className
      )}
    >
      {/* Dynamic Status Glow */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1.5 transition-colors",
        isActive ? (isExpiringSoon ? "bg-amber-500 animate-pulse" : "bg-emerald-500") : "bg-muted-foreground/20"
      )} />

      <div className="flex items-start justify-between gap-6 p-8 relative z-10">
        <div className="flex-1 space-y-5">
          {/* --- TOP: IDENTITY & STATUS --- */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                {service.name}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8px] font-black border shadow-sm px-2 py-0.5 tracking-widest uppercase",
                  isActive 
                    ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                    : "bg-muted/20 text-muted-foreground border-border/40"
                )}
              >
                {status}
              </Badge>
            </div>
            {merchant.companyName && (
              <div className="flex items-center gap-2 opacity-40 italic">
                <Globe className="h-3 w-3" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                  NODE: {merchant.companyName}
                </p>
              </div>
            )}
          </div>

          {/* --- MIDDLE: RESOURCE ALLOCATION --- */}
          <div className="flex flex-wrap gap-4">
            {tier && (
              <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl px-3 py-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/80">
                  {tier.name} <span className="mx-1 opacity-20">•</span> ${tier.price}
                </p>
              </div>
            )}
            
            <div className={cn(
              "flex items-center gap-2 border rounded-xl px-3 py-1.5 transition-all",
              isExpiringSoon 
                ? "bg-amber-500/5 border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                : "bg-muted/20 border-border/20 text-muted-foreground"
            )}>
              {isExpiringSoon ? <Activity className="h-3.5 w-3.5 animate-pulse" /> : <Clock className="h-3.5 w-3.5" />}
              <p className="text-[10px] font-black uppercase tracking-widest">
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
          <div className="relative group/btn">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <Button 
              size="sm" 
              onClick={handleJoinChannel} 
              className="relative h-14 w-14 sm:h-auto sm:w-auto sm:px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest shadow-2xl transition-all hover:translate-y-[-2px] active:scale-90"
            >
              <ExternalLink className="sm:mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Broadcaster</span>
            </Button>
          </div>
        )}
      </div>

      {/* Blueprint Subliminal Branding */}
      <ShieldCheck className="absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.03] -rotate-12 pointer-events-none" />
    </div>
  )
}