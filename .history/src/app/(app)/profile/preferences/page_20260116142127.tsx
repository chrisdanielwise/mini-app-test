"use client";

import { useState } from "react";
import {
  Smartphone,
  ShieldCheck,
  Fingerprint,
  Terminal,
  Cpu,
  Globe,
  Lock,
  UserCog,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ USER_PREFERENCES (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density rows (p-4) and shrunken typography prevent blowout.
 */
export default function UserPreferencesPage() {
  const { user, isAuthenticated, isLocked, isStaff } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    safeArea, 
    isReady 
  } = useDeviceContext();

  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  if (!isReady || isLocked) return <LoadingScreen message="SYNCING_HARDWARE_NODES..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  const toggleHaptics = (checked: boolean) => {
    setHapticsEnabled(checked);
    if (checked) impact("medium");
    localStorage.setItem("user_haptics_enabled", checked.toString());
  };

  const gridLayout = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2 gap-4" : "grid-cols-1 gap-3";

  return (
    <div className="flex flex-col min-h-screen animate-in fade-in duration-700 max-w-5xl mx-auto leading-none">
      
      {/* 🛡️ FIXED HUD: Stationary Header */}
      <header 
        className="px-5 py-6 md:px-8 md:py-8 rounded-b-2xl border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all"
        style={{ paddingTop: `calc(${safeArea.top}px * 0.5 + 1rem)` }}
      >
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 opacity-10 italic">
            <Cpu className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              {isStaff ? "Universal_Oversight" : "Hardware_Sync_v16"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            App <span className="opacity-20">Settings</span>
          </h1>
        </div>
      </header>

      {/* 🚀 INDEPENDENT TACTICAL VOLUME */}
      <main className="flex-1 px-5 py-8 space-y-8 pb-32">
        
        {/* --- TACTILE PROTOCOL: High Density Grid --- */}
        <section className="space-y-3">
          <h2 className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic ml-1">Tactile_Protocol</h2>
          <div className={gridLayout}>
            <div className={cn(
              "group relative overflow-hidden rounded-xl border bg-zinc-950/40 p-4 md:p-5 flex items-center justify-between transition-all",
              isStaff ? "hover:border-amber-500/20" : "hover:border-primary/20"
            )}>
              <div className="flex items-center gap-3.5 relative z-10">
                <div className={cn(
                  "size-10 rounded-lg border flex items-center justify-center shadow-inner transition-all",
                  isStaff ? "bg-amber-500/5 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
                )}>
                  <Smartphone className="size-4.5" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-black uppercase italic tracking-tight">Haptic Feedback</Label>
                  <p className="text-[7.5px] font-black text-muted-foreground/20 uppercase">Tactile_Ingress_Active</p>
                </div>
              </div>
              <Switch checked={hapticsEnabled} onCheckedChange={toggleHaptics} className={isStaff ? "data-[state=checked]:bg-amber-500" : "data-[state=checked]:bg-primary"} />
            </div>
          </div>
        </section>

        {/* --- IDENTITY TELEMETRY: Clinical Module --- */}
        <section className="space-y-3">
          <h2 className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic ml-1">Identity_Telemetry</h2>
          <div className="rounded-xl border border-white/5 bg-zinc-950/40 overflow-hidden shadow-2xl">
            <div className="border-b border-white/5 flex items-center justify-between p-4 md:p-5 gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <Fingerprint className="size-4.5 text-primary opacity-20 shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-[6.5px] font-black uppercase tracking-widest text-muted-foreground/20">Node_ID</p>
                  <p className="text-base font-black italic tracking-tight truncate text-foreground/80">@{user?.username || "anon_node"}</p>
                </div>
              </div>
              <Badge className={cn("shrink-0 rounded text-[7px] font-black px-2 py-0.5 border-none", isStaff ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                {isStaff ? "OVERSIGHT" : "SYNC_OK"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 md:p-5 group hover:bg-white/[0.01] transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <ShieldCheck className="size-4.5 text-primary opacity-20 shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-[6.5px] font-black uppercase tracking-widest text-muted-foreground/20">Protocol</p>
                  <p className="text-base font-black italic tracking-tight truncate text-foreground/80">{user?.role?.toUpperCase() || "STANDARD"}</p>
                </div>
              </div>
              <UserCog className="size-4 opacity-5 group-hover:opacity-20 transition-opacity" />
            </div>
          </div>
        </section>

        {/* --- SYSTEM NOTICES --- */}
        <div className="pt-4 space-y-4 relative">
          <div className="flex items-center gap-2 opacity-10 italic">
            <Terminal className="size-3" />
            <p className="text-[7.5px] font-black uppercase tracking-[0.3em]">Zipha_Core // Authorized_Egress</p>
          </div>
          <div className="rounded-xl bg-white/[0.01] border border-white/5 p-4 md:p-5 flex gap-4 relative overflow-hidden">
            <div className="size-1.5 rounded-full bg-primary mt-1 shadow-[0_0_8px_var(--primary)]" />
            <p className="text-[8px] font-black text-muted-foreground/30 leading-relaxed uppercase tracking-widest italic">
              Hardware settings are node-specific. Global identity revocation is managed via the institutional hub.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-auto flex flex-col items-center gap-2 py-8 opacity-10 italic leading-none">
         <Globe className="size-4" />
         <p className="text-[7px] font-black uppercase tracking-[0.4em]">
           Audit_Handshake // Hardware_v16.31_Apex
         </p>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background leading-none">
      <div className="rounded-2xl bg-zinc-950/60 border border-rose-500/10 p-8 shadow-2xl text-center space-y-6 max-w-sm">
        <Lock className="size-10 text-rose-500 mx-auto opacity-20" />
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Access_Locked</h1>
          <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest italic">
            Invalid identity signature detected. Re-verify node.
          </p>
        </div>
      </div>
    </div>
  );
}