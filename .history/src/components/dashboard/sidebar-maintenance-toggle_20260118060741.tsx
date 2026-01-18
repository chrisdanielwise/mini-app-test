"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ShieldAlert, 
  Terminal, 
  Megaphone, 
  Zap, 
  Activity, 
  Lock,
  Wifi,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface MaintenanceState {
  maintenanceMode: boolean;
  broadcastActive: boolean;
  broadcastMessage: string;
  broadcastLevel: "INFO" | "WARN" | "CRITICAL";
}

/**
 * 🛰️ COMMAND_OVERRIDE_TERMINAL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Integration: Merged Legacy Logic with Hardened Hardware Bridge.
 */
export function SidebarMaintenanceToggle({ initialState }: { initialState: MaintenanceState }) {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  
  const { impact, notification } = useHaptics();
  const { isReady } = useDeviceContext();

  const updateNode = useCallback(async (payload: Partial<MaintenanceState>) => {
    // 🛡️ HAPTIC_HANDSHAKE: Scale intensity based on action severity
    if (payload.maintenanceMode === true) notification("warning");
    else if (payload.broadcastActive === true) impact("heavy");
    else impact("medium");

    setIsLoading(true);
    const updatedState = { ...state, ...payload };
    
    try {
      const res = await fetch("/api/admin/config/maintenance", {
        method: "PATCH",
        body: JSON.stringify(updatedState),
      });
      if (!res.ok) throw new Error("OVERRIDE_REJECTED");
      
      setState(updatedState);
      notification("success");
      toast.success("NODE_SYNC_COMPLETE");
    } catch (err) {
      notification("error");
      toast.error("FAULT_DETECTED", { description: "Override rejected by core node." });
    } finally {
      setIsLoading(false);
    }
  }, [state, impact, notification]);

  // 🛡️ HYDRATION_SHIELD: Prevents layout snaps on mobile ingress
  if (!isReady) return <div className="h-48 w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-2xl" />;

  return (
    <div className={cn(
      "relative flex flex-col w-full transition-all duration-700 shadow-2xl overflow-hidden",
      "rounded-2xl border backdrop-blur-xl p-5",
      state.maintenanceMode ? "bg-rose-500/[0.02] border-rose-500/20 shadow-rose-500/5" : "bg-amber-500/[0.01] border-amber-500/10"
    )}>
      
      {/* 🌫️ TACTICAL RADIANCE: Ambient status cue */}
      <div className={cn(
        "absolute -top-12 -right-12 size-32 blur-[60px] opacity-10 pointer-events-none transition-all duration-1000",
        state.maintenanceMode ? "bg-rose-500" : "bg-amber-500"
      )} />

      <div className="space-y-6 relative z-10">
        
        {/* --- ⛔ LOCKDOWN OVERRIDE --- */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "size-9 rounded-xl flex items-center justify-center border transition-all shadow-inner",
              state.maintenanceMode ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-white/5 border-white/10 text-amber-500/20"
            )}>
              {state.maintenanceMode ? <Lock className="size-4" /> : <ShieldAlert className="size-4" />}
            </div>
            <div className="leading-none">
              <span className={cn(
                "text-[7.5px] font-black uppercase tracking-[0.3em] italic",
                state.maintenanceMode ? "text-rose-500" : "text-amber-500/40"
              )}>Maintenance_Node</span>
              <div className="flex items-center gap-1.5 mt-1.5 opacity-20 italic">
                <Wifi className="size-2.5" />
                <span className="text-[6.5px] font-black uppercase tracking-widest leading-none">
                  {state.maintenanceMode ? "ACTIVE_BLOCK" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>
          <Switch 
            disabled={isLoading}
            checked={state.maintenanceMode} 
            onCheckedChange={(val) => updateNode({ maintenanceMode: val })}
            className="data-[state=checked]:bg-rose-500 scale-90"
          />
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* --- 📢 SIGNAL INJECTION --- */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "size-9 rounded-xl border flex items-center justify-center transition-all shadow-inner",
                state.broadcastActive ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/5 border-white/10 text-white/5"
              )}>
                <Megaphone className="size-4" />
              </div>
              <div className="leading-none">
                <span className={cn(
                  "text-[7.5px] font-black uppercase tracking-[0.3em] italic",
                  state.broadcastActive ? "text-amber-500" : "text-white/10"
                )}>Broadcast_Pulse</span>
                <span className="block text-[6.5px] font-black uppercase tracking-widest text-white/5 mt-1.5">Signal_Ingress</span>
              </div>
            </div>
            <Switch 
              disabled={isLoading}
              checked={state.broadcastActive} 
              onCheckedChange={(val) => updateNode({ broadcastActive: val })}
              className="data-[state=checked]:bg-amber-500 scale-90"
            />
          </div>

          {state.broadcastActive && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[7px] font-black uppercase opacity-20 italic ml-1">Protocol</Label>
                  <Select value={state.broadcastLevel} onValueChange={(val: any) => updateNode({ broadcastLevel: val })}>
                    <SelectTrigger className="h-9 bg-white/[0.02] border-white/5 text-[9px] font-black uppercase italic rounded-lg px-3">
                      <SelectValue placeholder="Protocol" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950/95 border-white/10 rounded-xl">
                      <SelectItem value="INFO" className="text-[9px] font-black uppercase italic">INFO_BLUE</SelectItem>
                      <SelectItem value="WARN" className="text-[9px] font-black uppercase italic">WARN_AMBER</SelectItem>
                      <SelectItem value="CRITICAL" className="text-[9px] font-black uppercase italic text-rose-500">CRITICAL_ROSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[7px] font-black uppercase opacity-20 italic ml-1">Telemetry</Label>
                  <div className="relative group/input">
                    <Input 
                      value={state.broadcastMessage}
                      onChange={(e) => setState({ ...state, broadcastMessage: e.target.value })}
                      onBlur={() => updateNode({ broadcastMessage: state.broadcastMessage })}
                      placeholder="SIGNAL_DATA..."
                      className="h-9 bg-white/[0.02] border-white/5 text-[9px] font-black uppercase italic rounded-lg px-3 pr-8 placeholder:opacity-10 shadow-inner"
                    />
                    <Save className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-amber-500 opacity-20 group-hover/input:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- 🌊 TACTICAL FOOTER --- */}
        <div className="flex items-center justify-between opacity-10 italic pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Terminal className="size-2.5" />
            <span className="text-[7px] font-black uppercase tracking-[0.4em]">Oversight_Override // v16.31</span>
          </div>
          <Activity className="size-2.5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}