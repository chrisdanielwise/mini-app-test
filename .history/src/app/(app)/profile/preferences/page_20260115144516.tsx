"use client";

import { useState, useMemo } from "react";
import {
  Smartphone,
  ShieldCheck,
  Fingerprint,
  Terminal,
  Cpu,
  Info,
  Globe,
  Lock,
  UserCog,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
// import { useInstitutionalAuth } from "@lib/hooks/use-institutional-auth";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ USER PREFERENCES TERMINAL (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware hardware synchronization.
 */
export default function UserPreferencesPage() {
  const { auth, user, isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming full interface physics
  const { 
    screenSize, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    safeArea, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // 🛡️ HYDRATION & AUTH GUARD
  if (!isReady || isLocked) return <LoadingScreen message="SYNCING_HARDWARE_NODES..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  const toggleHaptics = (checked: boolean) => {
    setHapticsEnabled(checked);
    if (checked) impact("medium");
    localStorage.setItem("user_haptics_enabled", checked.toString());
  };

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating layout gravity based on 6-tier logic.
   */
  const gridLayout = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-8" : "grid-cols-1 gap-6";
  const headerPaddingTop = `calc(${safeArea.top}px + 1.5rem)`;

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 max-w-5xl mx-auto">
      
      {/* 🌊 HEADER: safeArea.top accountancy */}
      <header 
        className="px-6 pb-10 rounded-b-[3rem] md:rounded-b-[4rem] border-b border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex relative overflow-hidden transition-all duration-700"
        style={{ paddingTop: headerPaddingTop }}
      >
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 italic">
            <Cpu className={cn("size-4 animate-pulse", isStaff ? "text-amber-500" : "text-primary/60")} />
            <span className={cn("text-[9px] font-black uppercase tracking-[0.4em]", isStaff ? "text-amber-500" : "text-primary/60")}>
              {isStaff ? "Universal_Oversight_Link" : "Hardware_Node_Sync"}
            </span>
          </div>
          <h1 className="text-[var(--fluid-h1)] font-black uppercase italic tracking-tighter leading-none">
            App <span className={isStaff ? "text-amber-500/40" : "text-primary/40"}>Settings</span>
          </h1>
        </div>
        
        {/* Subsurface Flow (Scales with viewportWidth) */}
        <Waves className="absolute -bottom-4 left-0 w-full opacity-5 text-primary pointer-events-none" 
               style={{ height: `${Math.max(40, viewportWidth * 0.1)}px` }} />
      </header>

      <main className="flex-1 px-6 py-10 space-y-12 pb-40">
        
        {/* --- HARDWARE & TACTILE GRID --- */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic ml-2">Tactile_Protocol</h2>
          <div className={gridLayout}>
            <div className={cn(
              "group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border bg-card/40 p-6 md:p-8 flex items-center justify-between shadow-apex backdrop-blur-3xl transition-all duration-700",
              isStaff ? "hover:border-amber-500/20" : "hover:border-primary/20"
            )}>
              <div className="flex items-center gap-5 relative z-10">
                <div className={cn(
                  "size-12 md:size-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110",
                  isStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-primary/5 border-primary/20"
                )}>
                  <Smartphone className={cn("size-6", isStaff ? "text-amber-500" : "text-primary")} />
                </div>
                <div className="space-y-1">
                  <Label className="text-lg font-black uppercase italic tracking-tight leading-none">Haptic Feedback</Label>
                  <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Tactile_Sync_Occurred</p>
                </div>
              </div>
              <Switch checked={hapticsEnabled} onCheckedChange={toggleHaptics} className={isStaff ? "data-[state=checked]:bg-amber-500" : "data-[state=checked]:bg-primary"} />
            </div>

            {/* Placeholder for more hardware toggles (Desktop expansion) */}
            {isDesktop && (
               <div className="rounded-[2.5rem] border border-dashed border-white/5 flex items-center justify-center opacity-20 italic">
                  <span className="text-[10px] font-black uppercase tracking-widest">Awaiting_Hardware_Handshake</span>
               </div>
            )}
          </div>
        </section>

        {/* --- IDENTITY TELEMETRY MODULE --- */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic ml-2">Identity_Telemetry</h2>
          <div className="rounded-[2.5rem] md:rounded-[3rem] border border-white/5 bg-card/40 overflow-hidden shadow-apex backdrop-blur-md">
            <div className={cn("border-b border-white/5 flex items-center justify-between gap-6", isMobile ? "p-6" : "p-8 md:p-10")}>
              <div className="flex items-center gap-5 min-w-0">
                <Fingerprint className="size-6 text-primary/30 shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Node_Identifier</p>
                  <p className="text-lg md:text-xl font-black italic tracking-tight truncate">@{user?.username || auth.user?.username || "anon_node"}</p>
                </div>
              </div>
              <Badge className={cn("shrink-0 rounded-xl text-[9px] font-black tracking-[0.2em] px-3 py-1 border-none", isStaff ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                {isStaff ? "MASTER_CLEARANCE" : "SYNC_OK"}
              </Badge>
            </div>
            
            <div className={cn("flex items-center justify-between group hover:bg-white/[0.02] transition-colors", isMobile ? "p-6" : "p-8 md:p-10")}>
              <div className="flex items-center gap-5 min-w-0">
                <ShieldCheck className="size-6 text-primary/30 shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Identity_Protocol</p>
                  <p className="text-lg md:text-xl font-black italic tracking-tight truncate">{auth.user?.role?.toUpperCase() || "STANDARD_USER"}</p>
                </div>
              </div>
              <UserCog className="size-5 opacity-20 group-hover:rotate-12 transition-all duration-500" />
            </div>
          </div>
        </section>

        {/* --- SYSTEM NOTICES --- */}
        <div className="pt-6 space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-3 px-2 opacity-30 italic">
            <Terminal className="size-4 text-primary" />
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">Zipha_Intelligence_Core // {screenSize.toUpperCase()}_NODE</p>
          </div>
          <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-6 md:p-8 flex gap-5 relative overflow-hidden">
            <Info className="size-6 text-primary/40 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest italic relative z-10">
              Hardware settings are node-specific. Global identity revocation is managed via the <span className="text-foreground font-black">Institutional Hub</span>.
            </p>
            {/* Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>
      </main>

      <footer className="mt-auto flex flex-col items-center gap-4 py-12 opacity-20 italic">
         <Globe className="size-5" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center leading-none">
           Audit_Handshake established // Hardware_V16.29
         </p>
      </footer>
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-[var(--tg-viewport-h)] flex-col items-center justify-center p-6 bg-background">
      <div className="rounded-[3rem] bg-card border border-rose-500/10 p-12 shadow-apex text-center space-y-8 max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
        <Lock className="size-12 text-rose-500 mx-auto animate-pulse opacity-40" />
        <div className="space-y-3">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Access_Restricted</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-40 italic">
            Identity signature invalid.<br />Re-launch terminal from bot to verify node.
          </p>
        </div>
      </div>
    </div>
  );
}