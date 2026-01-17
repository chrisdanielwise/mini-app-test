"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { 
  Globe, 
  Monitor, 
  Smartphone, 
  MapPin, 
  RefreshCcw,
  Terminal,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID SESSION TABLE (v16.16.12)
 * Logic: Haptic-synced ingress logs with Edge Node resolution.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function SessionActivityTable() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { impact, notification } = useHaptics();

  const fetchLogs = async () => {
    impact("medium"); // 🏁 TACTILE SYNC: Feel the refresh
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/sessions");
      const data = await res.json();
      setActivities(data.sessions || []);
    } catch (err) {
      notification("error");
      console.error("Telemetry_Sync_Failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="space-y-6 group animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3 italic opacity-40">
          <Terminal className="size-3 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">
            Ingress_History_Log
          </h3>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={isLoading}
          className={cn(
            "p-2 rounded-xl bg-white/5 border border-white/5 transition-all active:scale-90 hover:bg-white/10",
            isLoading && "animate-spin"
          )}
        >
          <RefreshCcw className="size-3.5 text-primary/60" />
        </button>
      </div>

      <div className="rounded-[2.5rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">Source_Vector</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">Edge_Node/IP</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic text-right">Epoch_Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="p-8">
                    <div className="h-10 bg-white/5 rounded-2xl w-full" />
                  </td>
                </tr>
              ))
            ) : activities.length > 0 ? (
              activities.map((session, index) => (
                <tr 
                  key={session.id} 
                  onMouseEnter={() => impact("light")}
                  className="group/row hover:bg-primary/[0.03] transition-all duration-500 ease-out"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "size-10 rounded-2xl border flex items-center justify-center transition-all duration-700 group-hover/row:scale-110 group-hover/row:rotate-3",
                        session.metadata?.ua?.includes("Mobile") 
                          ? "bg-primary/10 border-primary/20 text-primary" 
                          : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      )}>
                        {session.metadata?.ua?.includes("Mobile") ? (
                          <Smartphone className="size-4" />
                        ) : (
                          <Monitor className="size-4" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase italic tracking-tighter">
                          {session.metadata?.method || "GATEWAY_SYNC"}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
                          {session.metadata?.device || "Verified_Node"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-foreground/80">
                        <Globe className="size-3 opacity-20" />
                        {session.ipAddress}
                      </div>
                      <div className="flex items-center gap-2 text-[8px] text-muted-foreground/30 font-black uppercase tracking-[0.2em] italic">
                        <MapPin className="size-2.5" />
                        {session.metadata?.location || "Resolved_Edge_Node"}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-black italic tracking-tighter text-primary">
                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                      </span>
                      <span className="text-[8px] font-mono font-black opacity-10 tracking-widest">
                        {new Date(session.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-10 italic">
                    <ShieldAlert className="size-10" />
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]">Zero_Ingress_Data</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}