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
  LogOut,
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
 * Strategic management of user identity, security, and global signal manifest.
 */
export default function UserProfilePage() {
  const { auth, isReady, user } = useTelegramContext();

  // 🏁 Data Fetch: Fetching the complete manifest of all historical nodes
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Identity Manifest..." />;
  }

  // 🛡️ AUTH GUARD: Identity Handshake Verification
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-10 text-center bg-background">
        <div className="relative rounded-[2.5rem] bg-destructive/5 p-8 border border-destructive/20 shadow-2xl">
          <ShieldCheck className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-4 max-w-xs">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            Identity <span className="text-destructive">Mismatch</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground leading-relaxed">
            Verify session via the official Zipha Bot node to synchronize.
          </p>
        </div>
      </div>
    );
  }

  const allSubscriptions = subscriptions?.subscriptions || [];
  const activeCount = allSubscriptions.filter((s: any) => s.status === "ACTIVE").length;

  return (
    <div className="min-h-screen space-y-12 bg-background pb-32 animate-in fade-in duration-1000">
      
      {/* --- IDENTITY HUD HEADER --- */}
      <header className="p-10 pt-16 rounded-b-[4rem] border-b border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 h-64 w-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[2.5rem] animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary border-2 border-primary/20 text-4xl font-black text-primary-foreground italic shadow-inner">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Fingerprint className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">Identity: Verified</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              {user?.first_name} <span className="text-primary">{user?.last_name || ""}</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
              UID: {user?.id || "0x000000"}
            </p>
          </div>
        </div>
      </header>

      <div className="px-6 space-y-12">
        
        {/* --- TACTICAL SETTINGS MENU --- */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-2 opacity-40 italic">
              <Zap className="h-3 w-3" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Node Calibration</h3>
           </div>
           
           <div className="rounded-[2.5rem] border border-border/40 bg-card/40 divide-y divide-border/20 shadow-xl overflow-hidden backdrop-blur-md">
              <Link href="/settings" onClick={() => hapticFeedback("light")} className="flex items-center justify-between p-7 hover:bg-muted/10 transition-all group">
                 <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                       <Settings className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black uppercase italic tracking-tighter">Hardware Settings</span>
                 </div>
                 <ChevronRight className="h-5 w-5 opacity-20" />
              </Link>
              
              <Link href="/support" onClick={() => hapticFeedback("light")} className="flex items-center justify-between p-7 hover:bg-muted/10 transition-all group">
                 <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
                       <HelpCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black uppercase italic tracking-tighter">Help & Intervention</span>
                 </div>
                 <ChevronRight className="h-5 w-5 opacity-20" />
              </Link>
           </div>
        </section>

        {/* --- GLOBAL SIGNAL MANIFEST --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 italic opacity-40">
               <Layers className="h-3 w-3" />
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">
                 Signal Manifest
               </h2>
            </div>
            <Badge variant="outline" className="text-[8px] font-black bg-muted/20 border-border/40 uppercase tracking-widest px-3 py-1">
              {activeCount} ACTIVE_NODES
            </Badge>
          </div>

          {subsLoading ? (
            <SkeletonList count={3} />
          ) : allSubscriptions.length > 0 ? (
            <div className="space-y-6">
              {allSubscriptions.map((sub: any) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-[3rem] border-2 border-dashed border-border/40 bg-card/20 p-16 text-center space-y-6">
               <User className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                 No historical nodes found in this cluster.
               </p>
            </div>
          )}
        </section>
      </div>

      {/* --- FOOTER: SYSTEM TERMINATION --- */}
      <footer className="px-8 flex flex-col items-center gap-6 opacity-30 group">
         <div className="flex items-center gap-3">
            <Zap className="h-3 w-3" />
            <p className="text-[8px] font-black uppercase tracking-[0.5em] italic">
              Zipha_Core_v2.6 // Secure Identity Node
            </p>
         </div>
      </footer>
    </div>
  );
}