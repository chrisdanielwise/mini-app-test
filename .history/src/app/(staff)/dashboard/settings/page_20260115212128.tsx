"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Bot, ShieldCheck, Maximize, Key, Settings2,
  CheckCircle2, X, Layout, Terminal, ShieldAlert, ServerCog,
  Globe, Zap, ShieldX, Activity, Cpu, Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useTelegramContext } from "@/components/providers/telegram-provider"; 
import { useAuth } from "@/lib/hooks/use-institutional-auth";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SessionActivityTable } from "@/components/dashboard/session-activity-table";

/**
 * 🌊 SETTINGS_MEMBRANE (Institutional Apex v2026.1.15)
 * Architecture: Device-Aware Configuration HUD.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export default function SettingsPage() {
  const { isFullSize, toggleFullSize, mounted } = useLayout();
  const { user } = useAuth();
  const router = useRouter();
  
  // 🛰️ DEVICE INGRESS: Full State Consumption
  const { 
    isReady, isMobile, screenSize, safeArea, 
    viewportHeight, isPortrait 
  } = useDeviceContext();
  
  const { setMainButton, hapticFeedback, isTelegram } = useTelegramContext(); 
  
  const isSuperAdmin = user?.role?.toUpperCase() === "SUPER_ADMIN";
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [settings, setSettings] = useState({
    botUsername: "@ZiphaSignals_Bot",
    webhookEnabled: true,
    terminalAlias: "",
  });

  /**
   * 🔘 NATIVE MAIN BUTTON SYNC (TMA 8.0+)
   * Logic: Bridges virtual commit actions to physical hardware.
   */
  useEffect(() => {
    if (!isTelegram || !isReady) return;

    setMainButton({
      text: isSaving ? "🛰️ SYNCHRONIZING..." : "💾 COMMIT_CONFIGURATION",
      isVisible: isMobile, // Only show native button on mobile hardware
      isLoader: isSaving,
      color: isSuperAdmin ? "#f59e0b" : "#10b981",
      onClick: () => !isSaving && handleSaveSequence()
    });

    return () => setMainButton({ text: "", isVisible: false });
  }, [isTelegram, isSaving, isSuperAdmin, isReady, isMobile]);

  const handleSaveSequence = async () => {
    setIsSaving(true);
    hapticFeedback("medium");
    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success("Identity Node Re-Anchored");
      hapticFeedback("success");
    } catch (err) {
      toast.error("Handshake Failure");
      hapticFeedback("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGlobalRevocation = async () => {
    hapticFeedback("heavy");
    const confirm = window.confirm("⚠️ WARNING: Terminal wipe will void ALL active sessions. Proceed?");
    if (!confirm) return;

    setIsRevoking(true);
    try {
      const res = await fetch("/api/auth/logout-global", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("GLOBAL_WIPE_COMPLETE");
      hapticFeedback("success");
      router.replace("/dashboard/login");
    } catch (err) {
      toast.error("REVOCATION_FAILED");
      hapticFeedback("error");
    } finally {
      setIsRevoking(false);
    }
  };

  // 🛡️ HYDRATION GUARD
  if (!mounted || !isReady) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="size-12 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Adaptive Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <Link href="/dashboard" className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 hover:text-primary transition-all duration-700 italic">
            <ArrowLeft className="size-3 group-hover:-translate-x-2 transition-transform duration-700" /> 
            Back_to_Command
          </Link>
          <div className="space-y-4">
            <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
              {isSuperAdmin ? "Platform" : "Node"} <span className={isSuperAdmin ? "text-amber-500" : "text-primary"}>Config</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] italic">
              Active_Session: {user?.role} // Stamp: Verified_v16.31
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT MATRIX: Adaptive Configuration Grid --- */}
      <div className={cn(
        "grid gap-8 lg:gap-12",
        isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
      )}>
        
        {/* --- LEFT: PROTOCOLS & ARCHITECTURE --- */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-8">
            <div className={cn(
              "flex items-center gap-4 border-b border-white/5 pb-6 transition-colors duration-1000",
              isSuperAdmin ? "text-amber-500/40" : "text-primary/40"
            )}>
              {isSuperAdmin ? <ServerCog className="size-5" /> : <Bot className="size-5" />}
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] italic">System_Protocols</h2>
            </div>
            
            <div className={cn(
              "grid gap-6",
              isMobile && isPortrait ? "grid-cols-1" : "grid-cols-2"
            )}>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground/30 italic">Terminal_Alias</Label>
                <div className="relative group">
                  <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors duration-700" />
                  <Input 
                    value={settings.terminalAlias}
                    onChange={(e) => setSettings({...settings, terminalAlias: e.target.value})}
                    className="h-14 rounded-2xl border-white/5 bg-white/[0.03] pl-14 font-black text-[11px] uppercase tracking-widest italic transition-all focus:ring-primary/10" 
                    placeholder="NODE_IDENTITY_ALPHA" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] ml-2 text-muted-foreground/30 italic">API_Handshake</Label>
                <div className="relative">
                  <Input type="password" defaultValue="••••••••••••••••" className="h-14 rounded-2xl border-white/5 bg-white/[0.01] pr-14 font-mono text-xs opacity-40 cursor-not-allowed italic" disabled />
                  <Key className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/20" />
                </div>
              </div>
            </div>

            {/* Session Analytics: Full Width in this sub-grid */}
            <div className="pt-6">
              <SessionActivityTable />
            </div>
          </section>

          {/* Architecture Selection */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 text-emerald-500/40 border-b border-white/5 pb-6">
              <Maximize className="size-5" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Interface_Architecture</h2>
            </div>
            <div className="flex items-center justify-between p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 shadow-apex transition-all hover:bg-white/[0.04]">
                <div className="space-y-2">
                  <p className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">Ultra-Wide Flow</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">1920PX_CANVAS_MESH_SYNC</p>
                </div>
                <Switch checked={isFullSize} onCheckedChange={toggleFullSize} className="data-[state=checked]:bg-emerald-500" />
            </div>
          </section>
        </div>

        {/* --- RIGHT: SECURITY HUB (Sticky on Desktop) --- */}
        <div className="space-y-8">
          <div className="rounded-[3.5rem] bg-card/30 border border-white/5 p-10 backdrop-blur-3xl shadow-apex relative overflow-hidden group transition-all duration-1000">
            <ShieldCheck className="absolute -top-10 -right-10 size-48 opacity-[0.01] rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
            
            <div className="space-y-10 relative z-10">
              <div className="flex items-center gap-4 opacity-40">
                <Fingerprint className="size-5 text-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">Security_Node</h3>
              </div>
              
              <ul className="space-y-6">
                <li className="flex items-center gap-4 group/item">
                  <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-inner transition-transform group-hover/item:scale-110">
                     <CheckCircle2 className="size-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 italic">Node_Sync: Live</span>
                </li>
              </ul>

              {/* 🚨 EMERGENCY REVOCATION TERMINAL */}
              <div className="pt-10 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-4 text-rose-500/40 italic">
                   <ShieldAlert className="size-4" />
                   <span className="text-[9px] font-black uppercase tracking-[0.4em]">Danger_Zone</span>
                </div>
                <Button 
                  onClick={handleGlobalRevocation}
                  disabled={isRevoking}
                  variant="outline"
                  className="w-full h-16 rounded-[1.5rem] border-rose-500/20 bg-rose-500/[0.03] text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black uppercase italic text-[10px] tracking-[0.3em] shadow-apex active:scale-95"
                >
                  <ShieldX className="mr-3 size-5" />
                  {isRevoking ? "REVOKING_NODES..." : "Global_Remote_Wipe"}
                </Button>
                <p className="text-[9px] text-muted-foreground/20 uppercase font-black tracking-[0.2em] text-center leading-relaxed italic px-4">
                  Rotating security stamp will invalidate every active JWT session cluster-wide.
                </p>
              </div>

              {!isMobile && (
                <div className="pt-6">
                  <Button 
                    onClick={handleSaveSequence} 
                    disabled={isSaving} 
                    className={cn(
                      "w-full h-16 rounded-2xl font-black uppercase italic text-[11px] tracking-[0.3em] shadow-apex transition-all active:scale-95",
                      isSuperAdmin ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
                    )}
                  >
                    {isSaving ? "Syncing..." : "Commit_Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 py-10 opacity-10 italic">
             <div className="flex items-center gap-4">
                <Cpu className="size-4" />
                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Mesh_Processing_Active</p>
             </div>
             <div className="flex items-center gap-3">
                <Activity className="size-3 animate-pulse text-amber-500" />
                <span className="text-[7px] font-mono tabular-nums">[v16.31_STABLE]</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}