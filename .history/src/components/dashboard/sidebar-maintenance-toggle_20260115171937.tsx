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
  Save, 
  Zap, 
  Activity, 
  Lock,
  Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface ToggleProps {
  initialState: {
    maintenanceMode: boolean;
    broadcastActive: boolean;
    broadcastMessage: string;
    broadcastLevel: "INFO" | "WARN" | "CRITICAL";
  };
}

/**
 * 🌊 COMMAND_OVERRIDE_TERMINAL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Friction sync.
 */
export function SidebarMaintenanceToggle({ initialState }: ToggleProps) {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🛰️ DEVICE & TACTILE INGRESS
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  const updateNode = useCallback(async (payload: Partial<typeof initialState>) => {
    // 🏁 TACTILE SYNC: Trigger friction based on signal gravity
    if (payload.maintenanceMode === true) {
      notification("warning"); // Heavy physical warning for lockdown
    } else if (payload.broadcastActive === true) {
      impact("heavy"); // Hard thud for signal injection
    } else {
      impact("medium");
    }

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
      toast.success("NODE_SYNC_COMPLETE", { 
        description: "Global parameters successfully broadcasted." 
      });
    } catch (err) {
      notification("error");
      toast.error("FAULT_DETECTED", { 
        description: "Could not synchronize system node parameters." 
      });
    } finally {
      setIsLoading(false);
    }
  }, [state, impact, notification]);

  if (!isReady) return <div className="h-48 w-full bg-amber-500/5 animate-pulse rounded-[2.5rem]" />;

  return (
    <div className={cn(
      "relative group mt-8 overflow-hidden rounded-[2.5rem] border backdrop-blur-3xl shadow-apex transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "p-8 md:p-10",
      state.maintenanceMode 
        ? "bg-rose-500/[0.04] border-rose-500/30 shadow-apex-rose" 
        : "bg-amber-500/[0.04] border-amber-500/20 shadow-apex-amber"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Oversight Aura */}
      <div className={cn(
        "absolute -top-12 -right-12 size-48 blur-[80px] opacity-10 pointer-events-none transition-colors duration-1000",
        state.maintenanceMode ? "bg-rose-500" : "bg-amber-500"
      )} />

      <div className="space-y-10 relative z-10">
        
        {/* --- ⛔ MAINTENANCE OVERRIDE --- */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className={cn(
              "size-12 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-inner border",
              state.maintenanceMode 
                ? "bg-rose-500/20 border-rose-500/40 text-rose-500 animate-pulse" 
                : "bg-white/5 border-white/10 text-amber-500/30"
            )}>
              {state.maintenanceMode ? <Lock className="size-5" /> : <ShieldAlert className="size-5" />}
            </div>
            <div className="flex flex-col gap-1">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em] italic leading-none transition-colors",
                state.maintenanceMode ? "text-rose-500" : "text-amber-500/60"
              )}>
                Maintenance_Node
              </span>
              <div className="flex items-center gap-2 opacity-30 italic tabular-nums">
                <Wifi className="size-2.5" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                  {state.maintenanceMode ? "STATUS: ACTIVE_BLOCK" : "STATUS: STANDBY_READY"}
                </span>
              </div>
            </div>
          </div>
          <Switch 
            disabled={isLoading}
            checked={state.maintenanceMode} 
            onCheckedChange={(val) => updateNode({ maintenanceMode: val })}
            className="data-[state=checked]:bg-rose-500 scale-110 shadow-lg"
          />
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* --- 📢 EMERGENCY BROADCAST --- */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className={cn(
                "size-12 rounded-2xl border flex items-center justify-center shadow-inner transition-all",
                state.broadcastActive 
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-500" 
                  : "bg-white/5 border-white/10 text-white/10"
              )}>
                <Megaphone className={cn("size-5", state.broadcastActive && "animate-bounce")} />
              </div>
              <div className="flex flex-col gap-1">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.4em] italic leading-none transition-colors",
                  state.broadcastActive ? "text-amber-500" : "text-white/20"
                )}>
                  Broadcast_Pulse
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/10 leading-none">
                  Global_Signal_Ingress
                </span>
              </div>
            </div>
            <Switch 
              disabled={isLoading}
              checked={state.broadcastActive} 
              onCheckedChange={(val) => updateNode({ broadcastActive: val })}
              className="data-[state=checked]:bg-amber-500 shadow-apex-amber scale-110"
            />
          </div>

          {state.broadcastActive && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-6 duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
              <div className="grid gap-3">
                <Label className="text-[9px] font-black uppercase tracking-[0.4em] ml-2 opacity-30 italic">Signal_Level</Label>
                <Select 
                  value={state.broadcastLevel} 
                  onValueChange={(val: any) => updateNode({ broadcastLevel: val })}
                >
                  <SelectTrigger className="h-14 bg-white/[0.03] border-white/5 text-[11px] font-black uppercase italic rounded-2xl tracking-widest px-6 focus:ring-amber-500/20 transition-all">
                    <SelectValue placeholder="Protocol_Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 border-white/10 rounded-3xl backdrop-blur-3xl shadow-apex">
                    <SelectItem value="INFO" className="py-4 text-[11px] font-black uppercase italic tracking-widest focus:bg-blue-500/10 focus:text-blue-500">INFO_TELEMETRY</SelectItem>
                    <SelectItem value="WARN" className="py-4 text-[11px] font-black uppercase italic tracking-widest focus:bg-amber-500/10 focus:text-amber-500">WARN_HANDSHAKE</SelectItem>
                    <SelectItem value="CRITICAL" className="py-4 text-[11px] font-black uppercase italic tracking-widest focus:bg-rose-500/10 focus:text-rose-500">CRITICAL_OVERRIDE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label className="text-[9px] font-black uppercase tracking-[0.4em] ml-2 opacity-30 italic">Signal_Message</Label>
                <div className="relative group/input">
                  <Input 
                    value={state.broadcastMessage}
                    onFocus={() => impact("light")}
                    onChange={(e) => setState({ ...state, broadcastMessage: e.target.value })}
                    onBlur={() => updateNode({ broadcastMessage: state.broadcastMessage })}
                    placeholder="Enter_Transmission_Data..."
                    className="h-14 bg-white/[0.03] border-white/5 text-[11px] font-black uppercase italic rounded-2xl pl-6 pr-14 tracking-widest placeholder:opacity-10 focus:border-amber-500/40 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-xl bg-white/5">
                    <Save className="size-4 text-amber-500/20 group-focus-within/input:text-amber-500 group-focus-within/input:animate-pulse transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- SYSTEM TELEMETRY FOOTER --- */}
        <div className="flex items-center justify-between opacity-10 italic">
          <div className="flex items-center gap-3">
            <Terminal className="size-3.5" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em]">Oversight_Node_v16.31</span>
          </div>
          <Activity className="size-3 animate-pulse" />
        </div>
      </div>
      
      <Zap className="absolute -bottom-16 -left-16 size-64 opacity-[0.015] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
    </div>
  );
}