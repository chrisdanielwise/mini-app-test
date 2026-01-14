"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert, Terminal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SidebarMaintenanceToggle({ 
  initialState = false 
}: { 
  initialState: boolean 
}) {
  const [isMaintenance, setIsMaintenance] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/config/maintenance", {
        method: "PATCH",
        body: JSON.stringify({ active: checked }),
      });

      if (!res.ok) throw new Error("UPGRADE_FAILED");

      setIsMaintenance(checked);
      toast.success(checked ? "NODE_LOCKED: Maintenance active." : "NODE_LIVE: Maintenance disabled.");
    } catch (err) {
      toast.error("SYSTEM_FAULT: Toggle rejected.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 px-4 py-4 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-2 w-2 rounded-full animate-pulse",
            isMaintenance ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          )} />
          <span className="text-[8px] font-black uppercase tracking-widest italic text-muted-foreground">
            {isMaintenance ? "Protocol_Offline" : "Protocol_Active"}
          </span>
        </div>
        <Switch 
          disabled={isLoading}
          checked={isMaintenance} 
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-rose-500 data-[state=unchecked]:bg-emerald-500/40"
        />
      </div>

      <div className="flex items-center gap-2 text-[7px] font-black uppercase tracking-[0.15em] text-amber-500/60">
        <Terminal className="h-3 w-3" />
        <span>Oversight_Override</span>
      </div>
    </div>
  );
}