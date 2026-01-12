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
  Globe,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ PROFILE IDENTITY NODE (Tactical Medium)
 * Normalized: World-standard fluid scaling for institutional identity audit.
 * Optimized: Resilient grid geometry to prevent viewport cropping.
 */
export default function UserProfilePage() {
  const { auth, isReady, user } = useTelegramContext();

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Identity Manifest..." />;
  }

  // Identity Mismatch State: Normalized
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background">
        <div className="rounded-2xl bg-card border border-rose-500/20 p-6 shadow-xl text-center space-y-4 max-w-xs animate-in zoom-in-95 duration-500">
          <ShieldCheck className="h-8 w-8 text-rose-500 mx-auto animate-pulse" />
          <div className="space-y-1">
            <h1 className="text-lg font-black uppercase italic tracking-tight">Identity Mismatch</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Handshake Failed. Re-verify via official Bot node.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const allSubscriptions = subscriptions?.subscriptions || [];
  const activeCount = allSubscriptions.filter((s: any) => s.status === "ACTIVE").length;

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- IDENTITY HUD HEADER: TACTICAL SYNC --- */}
      <header className="px-6 py-6 md:py-8 rounded-b-2xl border-b border-border/10 bg-card/40 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 h-32 w-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-xl" />
            <div className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-primary border border-primary/20 text-xl md:text-2xl font-black text-primary-foreground italic shadow-inner">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 opacity-60">
              <Fingerprint className="h-3 w-3 text-primary" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Identity: Verified</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase italic leading-none text-foreground">
              {user?.first_name} <span className="text-primary">{user?.last_name || ""}</span>
            </h1>
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">
              UID: {user?.id || "0x000000"}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8 pb-32">
        
        {/* --- TACTICAL SETTINGS MENU: HIGH DENSITY --- */}
        <section className="space-y-3">
           <div className="flex items-center gap-2 px-1 opacity-40 italic">
              <Zap className="h-3 w-3 text-primary" />
              <h3 className="text-[8px] font-black uppercase tracking-[0.4em]">Node Calibration</h3>
           </div>
           
           <div className="rounded-xl border border-border/40 bg-card/40 divide-y divide-border/10 shadow-sm overflow-hidden backdrop-blur-md">
              <Link 
                href="/settings" 
                onClick={() => hapticFeedback("light")} 
                className="flex items-center justify-between p-4 hover:bg-muted/5 active:bg-muted/10 transition-colors group"
              >
                 <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                       <Settings className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-black uppercase italic tracking-tight text-foreground/80 group-hover:text-primary transition-colors">Hardware Settings</span>
                 </div>
                 <ChevronRight className="h-4 w-4 opacity-20 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              <Link 
                href="/support" 
                onClick={() => hapticFeedback("light")} 
                className="flex items-center justify-between p-4 hover:bg-muted/5 active:bg-muted/10 transition-colors group"
              >
                 <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg bg-amber-500/5 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner group-hover:scale-105 transition-transform">
                       <HelpCircle className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-black uppercase italic tracking-tight text-foreground/80 group-hover:text-amber-500 transition-colors">Help & Intervention</span>
                 </div>
                 <ChevronRight className="h-4 w-4 opacity-20 group-hover:translate-x-0.5 transition-transform" />
              </Link>
           </div>
        </section>

        {/* --- GLOBAL SIGNAL MANIFEST: TIGHT GRID --- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 italic opacity-40">
               <Layers className="h-3 w-3 text-foreground" />
               <h2 className="text-[8px] font-black uppercase tracking-[0.4em]">Signal Manifest</h2>
            </div>
            <Badge variant="outline" className="text-[7px] font-black bg-muted/5 border-border/10 uppercase tracking-widest px-1.5 py-0">
              {activeCount} ACTIVE
            </Badge>
          </div>

          {subsLoading ? (
            <SkeletonList count={3} />
          ) : allSubscriptions.length > 0 ? (
            <div className="space-y-3">
              {allSubscriptions.map((sub: any) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/10 bg-card/5 p-8 text-center space-y-3">
               <User className="h-8 w-8 mx-auto text-muted-foreground opacity-10" />
               <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30 italic">
                 No historical nodes detected.
               </p>
            </div>
          )}
        </section>
      </main>

      {/* --- FOOTER SIGNAL --- */}
      <footer className="mt-auto px-8 pb-8 flex flex-col items-center gap-3 opacity-20">
         <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            <p className="text-[7px] font-black uppercase tracking-[0.3em] italic">
              Zipha Identity Core // Sync_State: Optimal
            </p>
         </div>
      </footer>
    </div>
  );
}