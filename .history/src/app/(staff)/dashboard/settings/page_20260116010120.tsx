 "use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Bot, ShieldCheck, Maximize, Key, Settings2,
  CheckCircle2, X, Layout, Terminal, ShieldAlert, ServerCog,
  Globe, Zap, ShieldX, Activity, Cpu, Fingerprint, Save
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useTelegramContext } from "@/components/providers/telegram-provider"; 
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth"; // 🚀 FIXED IMPORT

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SessionActivityTable } from "@/components/dashboard/session-activity-table";

/**
 * 🌊 SETTINGS_MEMBRANE (Institutional Apex v2026.1.16)
 * Strategy: Resolution of Build Error + Defensive Ingress.
 * Aesthetics: Chroma-Rich Momentum | Obsidian-OLED Depth.
 */
export default function SettingsPage() {
  const { isFullSize, toggleFullSize, mounted, flavor } = useLayout();
  const { user } = useInstitutionalAuth(); // 🛡️ Synchronized with established tactical hook
  const router = useRouter();
  
  // 🛰️ DEVICE INGRESS
  const { 
    isReady, isMobile, screenSize, safeArea, 
    isPortrait 
  } = useDeviceContext();
  
  const { setMainButton, hapticFeedback, isTelegram } = useTelegramContext(); 
  
  const isSuperAdmin = useMemo(() => flavor === "AMBER", [flavor]);
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [settings, setSettings] = useState({
    botUsername: "@ZiphaSignals_Bot",
    webhookEnabled: true,
    terminalAlias: "",
  });

  /**
   * 🔘 NATIVE MAIN BUTTON SYNC (TMA 8.0+)
   * Bridges virtual commit actions to physical hardware.
   */
  useEffect(() => {
    if (!isTelegram || !isReady) return;

    setMainButton({
      text: isSaving ? "🛰️ SYNCHRONIZING..." : "💾 COMMIT_CONFIGURATION",
      isVisible: isMobile,
      isLoader: isSaving,
      color: isSuperAdmin ? "#f59e0b" : "#10b981",
      onClick: () => !isSaving && handleSaveSequence()
    });

    return () => setMainButton({ text: "", isVisible: false });
  }, [isTelegram, isSaving, isSuperAdmin, isReady, isMobile, setMainButton]);

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

  // 🛡️ HYDRATION GUARD: Prevents layout snap during handshake
  if (!mounted || !isReady) return (
    <div className="flex h-screen items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto space-y-10 md:space-y-14 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.25rem" : "0px",
        paddingRight: isMobile ? "1.25rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-5">
          <Link href="/dashboard" className="group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 hover:text-primary transition-all duration-700 italic">
            <ArrowLeft className="size-3 group-hover:-translate-x-1.5 transition-transform" /> 
            Back_to_Command
          </Link>
          <div className="space-y-3">
            <h1 className="text-[clamp(2rem,8vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
              {isSuperAdmin ? "Platform" : "Node"} <span className={isSuperAdmin ? "text-amber-500" : "text-primary"}>Config</span>
            </h1>
            <div className="flex items-center gap-3 opacity-30 italic">
              <Activity className="size-3 animate-pulse text-primary" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em]">
                Active_Session: {user?.role || "GUEST"} // Stamp: Verified_v16.31
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT MATRIX --- */}
      <div className={cn(
        "grid gap-6 md:gap-10",
        isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
      )}>
        
        {/* --- LEFT: PROTOCOLS --- */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <div className={cn(
              "flex items-center gap-3 border-b border-white/5 pb-4 transition-colors duration-1000",
              isSuperAdmin ? "text-amber-500/40" : "text-primary/40"
            )}>
              {isSuperAdmin ? <ServerCog className="size-4" /> : <Bot className="size-4" />}
              <h2 className="text-[9px] font-black uppercase tracking-[0.4em] italic">System_Protocols</h2>
            </div>
            
            <div className={cn(
              "grid gap-4 md:gap-6",
              isMobile && isPortrait ? "grid-cols-1" : "grid-cols-2"
            )}>
              <div className="space-y-3">
                <Label className="text-[8px] font-black uppercase tracking-[0.3em] ml-1 text-muted-foreground/30 italic">Terminal_Alias</Label>
                <div className="relative group">
                  <Terminal className={cn("absolute left-4 top-1/2 -translate-y-1/2 size-3.5 transition-colors", isSuperAdmin ? "text-amber-500/20 group-focus-within:text-amber-500" : "text-primary/20 group-focus-within:text-primary")} />
                  <Input 
                    value={settings.terminalAlias}
                    onChange={(e) => setSettings({...settings, terminalAlias: e.target.value})}
                    className="h-12 rounded-xl bg-black/40 border-white/5 pl-11 font-black text-[10px] uppercase tracking-widest italic transition-all" 
                    placeholder="NODE_IDENTITY_ALPHA" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[8px] font-black uppercase tracking-[0.3em] ml-1 text-muted-foreground/30 italic">API_Handshake</Label>
                <div className="relative">
                  <Input type="password" defaultValue="••••••••••••••••" className="h-12 rounded-xl bg-black/40 border-white/5 pr-11 font-mono text-xs opacity-20 cursor-not-allowed italic" disabled />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/10" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <SessionActivityTable />
            </div>
          </section>

          {/* Interface Node */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-500/40 border-b border-white/5 pb-4">
              <Maximize className="size-4" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.4em] italic">Interface_Architecture</h2>
            </div>
            <div className="flex items-center justify-between p-8 rounded-[2rem] bg-black/40 border border-white/5 hover:bg-white/[0.02] transition-all">
                <div className="space-y-1">
                  <p className="text-lg font-black uppercase italic tracking-tighter text-foreground leading-none">Ultra-Wide Flow</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">1920PX_CANVAS_MESH_SYNC</p>
                </div>
                <Switch checked={isFullSize} onCheckedChange={toggleFullSize} className="data-[state=checked]:bg-emerald-500" />
            </div>
          </section>
        </div>

        {/* --- RIGHT: SECURITY HUB --- */}
        <div className="space-y-6">
          <div className={cn(
            "rounded-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group transition-all duration-700",
            isSuperAdmin ? "bg-amber-500/[0.02] border-amber-500/10 shadow-amber-500/5" : "bg-primary/[0.02] border-primary/10 shadow-primary/5"
          )}>
            <ShieldCheck className="absolute -top-10 -right-10 size-48 opacity-[0.01] rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-3 opacity-30">
                <Fingerprint className={cn("size-4", isSuperAdmin ? "text-amber-500" : "text-primary")} />
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">Security_Node</h3>
              </div>
              
              <ul className="space-y-5">
                <li className="flex items-center gap-3 group/item">
                  <div className={cn(
                    "size-9 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover/item:scale-105",
                    isSuperAdmin ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                  )}>
                     <CheckCircle2 className="size-4" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/30 italic">Node_Sync: Live</span>
                </li>
              </ul>

              {/* 🚨 DANGER ZONE */}
              <div className="pt-8 border-t border-white/5 space-y-5">
                <div className="flex items-center gap-3 text-rose-500/30 italic">
                   <ShieldAlert className="size-3.5" />
                   <span className="text-[8px] font-black uppercase tracking-[0.4em]">Danger_Zone</span>
                </div>
                <Button 
                  onClick={handleGlobalRevocation}
                  disabled={isRevoking}
                  variant="outline"
                  className="w-full h-14 rounded-xl border-rose-500/10 bg-rose-500/[0.02] text-rose-500 hover:bg-rose-500/10 transition-all font-black uppercase italic text-[9px] tracking-[0.2em] shadow-lg"
                >
                  <ShieldX className="mr-2.5 size-4" />
                  {isRevoking ? "REVOKING..." : "Global_Remote_Wipe"}
                </Button>
                <p className="text-[7px] text-muted-foreground/20 uppercase font-black tracking-[0.2em] text-center leading-relaxed italic px-2">
                  Rotating security stamp will invalidate every active session cluster-wide.
                </p>
              </div>

              {!isMobile && (
                <div className="pt-4">
                  <Button 
                    onClick={handleSaveSequence} 
                    disabled={isSaving} 
                    className={cn(
                      "w-full h-14 rounded-xl font-black uppercase italic text-[10px] tracking-[0.2em] shadow-lg transition-all",
                      isSuperAdmin ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-white shadow-primary/30"
                    )}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                         <Loader2 className="size-3.5 animate-spin" />
                         <span>Syncing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                         <Save className="size-4" />
                         <span>Commit_Changes</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 py-8 opacity-10 italic">
             <div className="flex items-center gap-3">
                <Cpu className="size-3" />
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">Mesh_Processing_Active</p>
             </div>
             <span className="text-[7px] font-mono tabular-nums">[v16.31_STABLE]</span>
          </div>
        </div>
      </div>
    </div>
  );
}