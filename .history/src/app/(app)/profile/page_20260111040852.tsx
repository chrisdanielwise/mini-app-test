"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/app/subscription-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hapticFeedback } from "@/lib/telegram/webapp";
import {
  Settings,
  ShieldCheck,
  User,
  ChevronRight,
  Fingerprint,
  Layers,
  Zap,
  HelpCircle,
  Bell
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ PROFILE IDENTITY NODE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Enhanced touch-safe targets and haptic feedback for identity audit.
 */
export default function UserProfilePage() {
  const { auth, isReady, user } = useTelegramContext();

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Identity Manifest..." />;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 p-6 text-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-destructive/5 blur-[100px] pointer-events-none" />
        <div className="relative rounded-3xl bg-card border border-destructive/20 p-6 md:p-8 shadow-2xl">
          <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-destructive animate-pulse" />
        </div>
        <div className="space-y-3 max-w-xs relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
            Identity <span className="text-destructive">Mismatch</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60 leading-relaxed">
            Verify session via the official Zipha Bot node to synchronize your identity.
          </p>
        </div>
      </div>
    );
  }

  const allSubscriptions = subscriptions?.subscriptions || [];
  const activeCount = allSubscriptions.filter((s: any) => s.status === "ACTIVE").length;

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-8 md:space-y-12 bg-background pb-32 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      
      {/* --- IDENTITY HUD HEADER --- */}
      <header className="px-6 py-10 md:p-10 md:pt-16 rounded-b-[2.5rem] md:rounded-b-[4rem] border-b border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 h-64 w-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl md:rounded-[2.5rem]" />
            <div className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-3xl md:rounded-[2.5rem] bg-primary border-2 border-primary/20 text-3xl md:text-4xl font-black text-primary-foreground italic shadow-inner">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Fingerprint className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Identity: Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none">
              {user?.first_name} <span className="text-primary">{user?.last_name || ""}</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
              UID: {user?.id || "0x000000"}
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-10 md:space-y-12">
        
        {/* --- TACTICAL SETTINGS MENU --- */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-2 opacity-40 italic">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Node Calibration</h3>
           </div>
           
           <div className="rounded-3xl md:rounded-[2.5rem] border border-border/40 bg-card/40 divide-y divide-border/10 shadow-xl overflow-hidden backdrop-blur-md">
              <Link 
                href="/settings" 
                onClick={() => hapticFeedback("light")} 
                className="flex items-center justify-between p-5 md:p-7 hover:bg-muted/10 active:scale-[0.99] transition-all group"
              >
                 <div className="flex items-center gap-4 md:gap-5 min-w-0">
                    <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                       <Settings className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black uppercase italic tracking-tighter truncate">Hardware Settings</span>
                 </div>
                 <ChevronRight className="h-5 w-5 opacity-20 shrink-0" />
              </Link>
              
              <Link 
                href="/support" 
                onClick={() => hapticFeedback("light")} 
                className="flex items-center justify-between p-5 md:p-7 hover:bg-muted/10 active:scale-[0.99] transition-all group"
              >
                 <div className="flex items-center gap-4 md:gap-5 min-w-0">
                    <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-105 transition-transform">
                       <HelpCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black uppercase italic tracking-tighter truncate">Help & Intervention</span>
                 </div>
                 <ChevronRight className="h-5 w-5 opacity-20 shrink-0" />
              </Link>
           </div>
        </section>

        {/* --- GLOBAL SIGNAL MANIFEST --- */}
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 italic opacity-40">
               <Layers className="h-3.5 w-3.5 text-foreground" />
               <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                 Signal Manifest
               </h2>
            </div>
            <Badge variant="outline" className="text-[8px] font-black bg-muted/10 border-border/10 uppercase tracking-widest px-2 py-0.5">
              {activeCount} ACTIVE_NODES
            </Badge>
          </div>

          {subsLoading ? (
            <SkeletonList count={3} />
          ) : allSubscriptions.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {allSubscriptions.map((sub: any) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl md:rounded-[3rem] border-2 border-dashed border-border/40 bg-card/10 p-12 md:p-16 text-center space-y-4">
               <User className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground opacity-20" />
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">
                 No historical nodes found in this cluster.
               </p>
            </div>
          )}
        </section>
      </div>

      {/* --- FOOTER: SYSTEM TERMINATION --- */}
      <footer className="px-8 pb-12 flex flex-col items-center gap-3 opacity-20">
         <div className="flex items-center gap-3">
            <Zap className="h-3 w-3 text-primary" />
            <p className="text-[8px] font-black uppercase tracking-[0.4em] italic">
              Zipha_Core_v2.6 // Secure Identity Node
            </p>
         </div>
      </footer>
    </div>
  );
}