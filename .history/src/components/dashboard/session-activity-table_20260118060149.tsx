"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { 
  Globe, 
  Monitor, 
  Smartphone, 
  MapPin, 
  RefreshCcw,
  Terminal,
  ShieldAlert,
  Activity,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SESSION_ACTIVITY_TABLE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density row density (py-3.5) and shrunken iconography prevents blowout.
 */
export function SessionActivityTable() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();

  const fetchLogs = useCallback(async (isManual = false) => {
    if (isManual) impact("medium");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/sessions", { cache: 'no-store' });
      const data = await res.json();
      setActivities(data.sessions || []);
    } catch (err) {
      notification("error");
    } finally {
      setIsLoading(false);
    }
  }, [impact, notification]);

  useEffect(() => {
    if (isReady) fetchLogs();
  }, [isReady, fetchLogs]);

  if (!isReady) return <div className="h-40 w-full bg-card/10 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- 🛡️ FIXED HUD: Compressed Control Header --- */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3 italic opacity-30 leading-none">
          <Terminal className="size-3 text-primary" />
          <div className="flex flex-col">
            <h3 className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              Ingress_Telemetry
            </h3>
            <span className="text-[6px] font-black uppercase tracking-widest mt-1">v16.16.31_Stable</span>
          </div>
        </div>
        
        <button 
          onClick={() => fetchLogs(true)}
          disabled={isLoading}
          className="size-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all active:scale-90 hover:bg-white/5"
        >
          <RefreshCcw className={cn("size-3 text-primary/40", isLoading && "animate-spin")} />
        </button>
      </div>

      {/* --- 🚀 KINETIC DATA VOLUME: High-Density Table --- */}
      <div className={cn(
        "relative overflow-hidden border backdrop-blur-3xl shadow-2xl",
        "rounded-2xl md:rounded-3xl",
        "bg-zinc-950/40 border-white/5"
      )}>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-[650px]">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="w-[35%] px-6 py-2.5 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Source_Vector</th>
                <th className="w-[40%] px-6 py-2.5 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Edge_Protocol</th>
                <th className="w-[25%] px-6 py-2.5 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic text-right">Epoch_Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={3} className="px-6 py-6">
                      <div className="h-8 bg-white/[0.02] rounded-lg w-full" />
                    </td>
                  </tr>
                ))
              ) : activities.length > 0 ? (
                activities.map((session, index) => (
                  <tr 
                    key={session.id} 
                    onMouseEnter={() => impact("light")}
                    className="group/row hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "size-9 shrink-0 rounded-lg border flex items-center justify-center transition-all shadow-inner",
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
                        <div className="flex flex-col min-w-0 leading-tight">
                          <span className="text-[11px] font-black uppercase italic tracking-tighter text-foreground truncate">
                            {session.metadata?.method || "LEGACY_GATEWAY"}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 opacity-20">
                            <Cpu className="size-2" />
                            <span className="text-[6.5px] font-black uppercase tracking-widest truncate">
                              {session.metadata?.device || "Verified_Node"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-col leading-none gap-1.5">
                        <div className="flex items-center gap-2 text-[9px] font-mono font-bold tracking-widest text-foreground/40">
                          <Globe className="size-3 opacity-20" />
                          {session.ipAddress}
                        </div>
                        <div className="flex items-center gap-1.5 text-[6.5px] text-muted-foreground/20 font-black uppercase tracking-[0.2em] italic truncate">
                          <MapPin className="size-2.5" />
                          {session.metadata?.location || "RESOLVING_EDGE..."}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex flex-col items-end gap-1 leading-none">
                        <div className="flex items-center gap-1.5">
                          <Activity className="size-2 text-primary animate-pulse" />
                          <span className="text-[9px] font-black italic tracking-tighter text-foreground">
                            {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <span className="text-[6px] font-mono font-black opacity-10 uppercase">
                          {new Date(session.createdAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-5 italic">
                      <ShieldAlert className="size-10" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero_Ingress_Data</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- TACTICAL FOOTER --- */}
        <div className="px-6 py-3 bg-white/[0.01] border-t border-white/5 flex items-center justify-between opacity-10">
          <p className="text-[6.5px] font-black uppercase tracking-[0.3em]">Integrity: VERIFIED</p>
          <span className="text-[6.5px] font-mono">[AES_256_SYNC]</span>
        </div>
      </div>
    </div>
  );
}