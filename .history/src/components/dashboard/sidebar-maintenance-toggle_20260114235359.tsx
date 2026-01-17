"use client";

import * as React from "react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ShieldAlert, Terminal, Megaphone, Save, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface ToggleProps {
  initialState: {
    maintenanceMode: boolean;
    broadcastActive: boolean;
    broadcastMessage: string;
    broadcastLevel: "INFO" | "WARN" | "CRITICAL";
  };
}

/**
 * 🌊 FLUID COMMAND TERMINAL (Institutional v16.16.12)
 * Logic: High-friction system overrides with haptic safety interlocks.
 * Design: Amber-Flavor Glassmorphism (Staff Oversight Mode).
 */
export function SidebarMaintenanceToggle({ initialState }: ToggleProps) {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { impact, notification } = useHaptics();

  const updateNode = async (payload: Partial<typeof initialState>) => {
    // 🏁 TACTILE SYNC: Trigger friction based on action gravity
    if (payload.maintenanceMode) {
      notification("warning");
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
      toast.success("SYSTEM_NODE: Configuration synchronized.");
    } catch (err) {
      notification("error");
      toast.error("FAULT: Could not update system node.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "relative group mt-8 overflow-hidden rounded-[2.5rem] border p-8 backdrop-blur-3xl shadow-2xl transition-all duration-700",
      "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5"
    )}>
      {/* 🌊 AMBIENT RADIANCE: Oversight Aura */}
      <div className="absolute -top-12 -right-12 size-32 bg-amber-500/10 blur-[60px] pointer-events-none" />

      <div className="space-y-8 relative z-10">
        {/* --- ⛔ MAINTENANCE OVERRIDE --- */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "size-8 rounded-xl flex items-center justify-center transition-colors shadow-inner border",
              state.maintenanceMode ? "bg-rose-500/20 border-rose-500/30 text-rose-500" : "bg-white/5 border-white/10 text-amber-500/40"
            )}>
              <ShieldAlert className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-foreground">
                Maintenance_Node
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40">
                {state.maintenanceMode ? "STATUS: ACTIVE_BLOCK" : "STATUS: STANDBY"}
              </span>
            </div>
          </div>
          <Switch 
            disabled={isLoading}
            checked={state.maintenanceMode} 
            onCheckedChange={(val) => updateNode({ maintenanceMode: val })}
            className="data-[state=checked]:bg-rose-500"
          />
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* --- 📢 EMERGENCY BROADCAST --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="size-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-inner">
                <Megaphone className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-amber-500">
                  Broadcast_Pulse
                </span>
                <span className="text-[7px] font-black uppercase tracking-widest text-amber-500/40">
                  Global_Signal_Injection
                </span>
              </div>
            </div>
            <Switch 
              disabled={isLoading}
              checked={state.broadcastActive} 
              onCheckedChange={(val) => updateNode({ broadcastActive: val })}
              className="data-[state=checked]:bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            />
          </div>

          {state.broadcastActive && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <div className="grid gap-3">
                <Label className="text-[8px] font-black uppercase tracking-[0.3em] ml-1 opacity-40">Signal_Level</Label>
                <Select 
                  value={state.broadcastLevel} 
                  onValueChange={(val: any) => updateNode({ broadcastLevel: val })}
                >
                  <SelectTrigger className="h-10 bg-white/5 border-white/10 text-[10px] font-black uppercase italic rounded-2xl tracking-widest">
                    <SelectValue placeholder="Select_Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 rounded-2xl backdrop-blur-3xl shadow-2xl">
                    <SelectItem value="INFO" className="text-[10px] font-black uppercase italic tracking-widest focus:bg-blue-500/10 focus:text-blue-500">INFO_BLUE</SelectItem>
                    <SelectItem value="WARN" className="text-[10px] font-black uppercase italic tracking-widest focus:bg-amber-500/10 focus:text-amber-500">WARN_AMBER</SelectItem>
                    <SelectItem value="CRITICAL" className="text-[10px] font-black uppercase italic tracking-widest focus:bg-rose-500/10 focus:text-rose-500">CRITICAL_ROSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label className="text-[8px] font-black uppercase tracking-[0.3em] ml-1 opacity-40">Protocol_Message</Label>
                <div className="relative group/input">
                  <Input 
                    value={state.broadcastMessage}
                    onFocus={() => impact("light")}
                    onChange={(e) => setState({ ...state, broadcastMessage: e.target.value })}
                    onBlur={() => updateNode({ broadcastMessage: state.broadcastMessage })}
                    placeholder="Enter_Signal_Data..."
                    className="h-11 bg-white/5 border-white/10 text-[10px] font-black uppercase italic rounded-2xl pr-10 tracking-widest placeholder:opacity-20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Save className="size-3.5 text-amber-500/40 group-focus-within/input:text-amber-500 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/20 italic">
          <Terminal className="size-3.5" />
          <span>Oversight_Override // v16.16.12</span>
        </div>
      </div>
      
      <Zap className="absolute -bottom-10 -left-10 size-48 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
    </div>
  );
}