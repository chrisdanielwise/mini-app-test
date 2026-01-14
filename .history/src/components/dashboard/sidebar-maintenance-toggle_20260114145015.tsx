"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Terminal, Megaphone, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ToggleProps {
  initialState: {
    maintenanceMode: boolean;
    broadcastActive: boolean;
    broadcastMessage: string;
    broadcastLevel: "INFO" | "WARN" | "CRITICAL";
  };
}

/**
 * 🕹️ STAFF COMMAND TERMINAL
 * Feature: Integrated Maintenance & Broadcast Oversight.
 */
export function SidebarMaintenanceToggle({ initialState }: ToggleProps) {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const updateNode = async (payload: Partial<typeof initialState>) => {
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
      toast.error("FAULT: Could not update system node.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 px-4 py-5 rounded-[2rem] bg-amber-500/[0.03] border border-amber-500/10 space-y-5 animate-in fade-in duration-500">
      {/* --- ⛔ MAINTENANCE OVERRIDE --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className={cn("h-3.5 w-3.5", state.maintenanceMode ? "text-rose-500" : "text-amber-500/40")} />
          <span className="text-[8px] font-black uppercase tracking-widest italic text-muted-foreground">
            Maintenance_Node
          </span>
        </div>
        <Switch 
          disabled={isLoading}
          checked={state.maintenanceMode} 
          onCheckedChange={(val) => updateNode({ maintenanceMode: val })}
          className="data-[state=checked]:bg-rose-500"
        />
      </div>

      <div className="h-px w-full bg-border/5" />

      {/* --- 📢 EMERGENCY BROADCAST --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <Megaphone className="h-3.5 w-3.5" />
            <span className="text-[8px] font-black uppercase tracking-widest italic">Broadcast_Pulse</span>
          </div>
          <Switch 
            disabled={isLoading}
            checked={state.broadcastActive} 
            onCheckedChange={(val) => updateNode({ broadcastActive: val })}
            className="data-[state=checked]:bg-amber-500"
          />
        </div>

        {state.broadcastActive && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <Select 
              value={state.broadcastLevel} 
              onValueChange={(val: any) => updateNode({ broadcastLevel: val })}
            >
              <SelectTrigger className="h-8 bg-background/40 border-border/10 text-[9px] font-bold uppercase italic rounded-xl">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border/10">
                <SelectItem value="INFO" className="text-[9px] font-bold uppercase italic">INFO_BLUE</SelectItem>
                <SelectItem value="WARN" className="text-[9px] font-bold uppercase italic">WARN_AMBER</SelectItem>
                <SelectItem value="CRITICAL" className="text-[9px] font-bold uppercase italic">CRITICAL_ROSE</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative group">
              <Input 
                value={state.broadcastMessage}
                onChange={(e) => setState({ ...state, broadcastMessage: e.target.value })}
                onBlur={() => updateNode({ broadcastMessage: state.broadcastMessage })}
                placeholder="Enter alert message..."
                className="h-9 bg-background/40 border-border/10 text-[9px] font-bold uppercase italic rounded-xl pr-8"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
                <Save className="h-3 w-3 text-amber-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-[7px] font-black uppercase tracking-[0.2em] text-amber-500/40">
        <Terminal className="h-3 w-3" />
        <span>Oversight_Override // Institutional_v16</span>
      </div>
    </div>
  );
}