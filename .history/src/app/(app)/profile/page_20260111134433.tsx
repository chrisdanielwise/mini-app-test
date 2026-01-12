"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SubscriptionCard } from "@/components/app/subscription-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
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
  Terminal,
  Lock,
  UserCog
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ PROFILE IDENTITY NODE
 * Logic: Synchronized with Universal Identity Protocol. 
 * Supports Staff Oversight and Hardware Calibration routing.
 */
export default function UserProfilePage() {
  const { auth, isReady, user } = useTelegramContext();

  // 🛡️ AUTHENTICATED FETCH: Retrieves all user nodes if identity is verified
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: any[];
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null);

  // 1. SYSTEM INITIALIZATION: Wait for identity handshake
  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Identity Manifest..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unauthorized identity nodes
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-500">
        <div className="rounded-2xl bg-card border border-rose-500/10 p-8 shadow-2xl text-center space-y-4 max-w-xs relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-10 w-10 text-rose-500 mx-auto opacity-40" />
          <div className="space-y-1">
            <h1 className="text-lg font-black uppercase italic tracking-tight">Identity Mismatch</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Handshake Failed. Re-verify via official Bot node.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full mt-4 py-2 bg-muted/10 border border-border/10 rounded-lg text-[8px] font-black uppercase tracking-widest"
          >
            Force Re-Sync
          </button>
        </div>
      </div>
    );
  }

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);
  const allSubscriptions = subscriptions?.subscriptions || [];
  const activeCount = allSubscriptions.filter((s: any) => s.status === "ACTIVE").length;

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- IDENTITY HUD HEADER: ROLE AWARE --- */}
      <header className="px-6 py-6 md:py-8 rounded-b-2xl border-b border-border/10 bg-card/40 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className={cn(
          "absolute top-0 left-0 h-32 w-32 blur-[60px] rounded-full pointer-events-none",
          isStaff ? "bg-amber-500/10" : "bg-primary/5"
        )} />
        
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="relative">
            <div className={cn("absolute inset-0 blur-xl rounded-xl opacity-20", isStaff ? "bg-amber-500" : "bg-primary")} />
            <div className={cn(
              "relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-xl border text-xl md:text-2xl font-black italic shadow-inner",
              isStaff ? "bg-amber-500 border-amber-500/20 text-black" : "bg-primary border-primary/20 text-primary-foreground"
            )}>
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 opacity-60">
              <Fingerprint className={cn("h-3 w-3", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[8px] font-black uppercase tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Clearance: Institutional" : "Identity: Verified"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase italic leading-none text-foreground">
              {user?.first_name || auth.user?.fullName?.split(" ")[0]} <span className={isStaff ? "text-amber-500" : "text-primary"}>{user?.last_name || ""}</span>
            </h1>
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">
              PROTOCOL_ID: {user?.id || auth.user?.telegramId || "0x000000"}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8 pb-32">
        
        {/* --- TACTICAL SETTINGS MENU --- */}
        <section className="space-y-3">
           <div className="flex items-center gap-2 px-1 opacity-40 italic">
              <Zap className={cn("h-3 w-3", isStaff ? "text-amber-500" : "text-primary")} />
              <h3 className="text-[8px] font-black uppercase tracking-[0.4em]">Node Calibration</h3>
           </div>
           
           <div className="rounded-xl border border-border/40 bg-card/40 divide-y divide-border/10 shadow-sm overflow-hidden backdrop-blur-md">
              <Link 
                href="/settings" 
                onClick={() => hapticFeedback("light")} 
                className="flex items-center justify-between p-4 hover:bg-muted/5 active:bg-muted/10 transition-colors group"
              >
                 <div className="flex items-center gap-3.5 min-w-0">
                    <div className={cn(
                      "h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg flex items-center justify-center border shadow-inner group-hover:scale-105 transition-transform",
                      isStaff ? "bg-amber-500/5 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/20"
                    )}>
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
                    <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-inner group-hover:scale-105 transition-transform">
                       <HelpCircle className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-black uppercase italic tracking-tight text-foreground/80 group-hover:text-rose-500 transition-colors">Help & Intervention</span>
                 </div>
                 <ChevronRight className="h-4 w-4 opacity-20 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {isStaff && (
                <Link 
                  href="/dashboard" 
                  onClick={() => hapticFeedback("medium")} 
                  className="flex items-center justify-between p-4 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20 transition-colors group"
                >
                   <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg bg-amber-500 flex items-center justify-center text-black border border-amber-500/20 shadow-inner group-hover:scale-105 transition-transform">
                         <UserCog className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-black uppercase italic tracking-tight text-amber-500">Platform Command</span>
                   </div>
                   <Terminal className="h-4 w-4 text-amber-500 opacity-40" />
                </Link>
              )}
           </div>
        </section>

        {/* --- GLOBAL SIGNAL MANIFEST --- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 italic opacity-40">
               <Layers className="h-3 w-3 text-foreground" />
               <h2 className="text-[8px] font-black uppercase tracking-[0.4em]">Signal Manifest</h2>
            </div>
            <Badge variant="outline" className={cn(
              "text-[7px] font-black uppercase tracking-widest px-1.5 py-0",
              isStaff ? "border-amber-500/20 text-amber-500 bg-amber-500/5" : "border-border/10 bg-muted/5"
            )}>
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
            <Zap className={cn("h-3 w-3", isStaff ? "text-amber-500" : "text-primary")} />
            <p className="text-[7px] font-black uppercase tracking-[0.3em] italic">
              Zipha Identity Core // State: {isStaff ? "OVERSIGHT" : "OPTIMAL"}
            </p>
         </div>
      </footer>
    </div>
  );
}