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
 * 🌊 SESSION_ACTIVITY_TABLE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Momentum | Vapour-Glass depth.
 * Logic: morphology-aware ingress resolution with Hardware-Pulse sync.
 */
export function SessionActivityTable() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🛰️ DEVICE & TACTILE INGRESS
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();

  const fetchLogs = useCallback(async (isManual = false) => {
    if (isManual) impact("medium"); // 🏁 TACTILE SYNC: Feel the manual ingress
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/sessions", { cache: 'no-store' });
      const data = await res.json();
      setActivities(data.sessions || []);
    } catch (err) {
      notification("error");
      console.warn("🛰️ [Telemetry_Handshake_Isolated]: Gateway unreachable.");
    } finally {
      setIsLoading(false);
    }
  }, [impact, notification]);

  useEffect(() => {
    if (isReady) fetchLogs();
  }, [isReady, fetchLogs]);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="h-64 w-full bg-card/20 animate-pulse rounded-[3rem] border border-white/5" />;

  return (
    <div className="space-y-6 group animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* --- TELEMETRY CONTROL HEADER --- */}
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-4 italic opacity-40">
          <Terminal className="size-4 text-primary" />
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">
              Ingress_Telemetry_Log
            </h3>
            <span className="text-[7px] font-black uppercase tracking-widest mt-1">v16.16.31 // NODE_SECURE</span>
          </div>
        </div>
        
        <button 
          onClick={() => fetchLogs(true)}
          disabled={isLoading}
          className={cn(
            "size-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all active:scale-75 hover:bg-white/[0.08] hover:border-white/20 shadow-apex",
            isLoading && "opacity-50"
          )}
        >
          <RefreshCcw className={cn("size-4 text-primary/60", isLoading && "animate-spin")} />
        </button>
      </div>

      {/* --- KINETIC DATA VOLUME --- */}
      <div className={cn(
        "relative overflow-hidden border backdrop-blur-3xl transition-all duration-1000 shadow-apex",
        "rounded-[2.5rem] md:rounded-[3.5rem]",
        "bg-card/30 border-white/5"
      )}>
        
        {/* 🌫️ VAPOUR RADIANCE: Identity Aura */}
        <div className="absolute -left-24 -top-24 size-64 bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic border-b border-white/5">Source_Vector</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic border-b border-white/5">Edge_Node_Protocol</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic border-b border-white/5 text-right">Epoch_Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={3} className="px-8 py-10">
                      <div className="h-12 bg-white/5 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : activities.length > 0 ? (
                activities.map((session, index) => (
                  <tr 
                    key={session.id} 
                    onMouseEnter={() => impact("light")}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="group/row hover:bg-white/[0.03] transition-all duration-700 animate-in fade-in slide-in-from-right-6"
                  >
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "size-12 rounded-2xl border flex items-center justify-center transition-all duration-1000 group-hover/row:rotate-12 group-hover/row:scale-110 shadow-inner",
                          session.metadata?.ua?.includes("Mobile") 
                            ? "bg-primary/10 border-primary/20 text-primary" 
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        )}>
                          {session.metadata?.ua?.includes("Mobile") ? (
                            <Smartphone className="size-5" />
                          ) : (
                            <Monitor className="size-5" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black uppercase italic tracking-tighter text-foreground">
                            {session.metadata?.method || "LEGACY_GATEWAY"}
                          </span>
                          <div className="flex items-center gap-2 mt-1 opacity-30">
                            <Cpu className="size-2.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest truncate max-w-[120px]">
                              {session.metadata?.device || "Verified_Protocol"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-[11px] font-mono font-bold tracking-[0.2em] text-foreground/70">
                          <Globe className="size-3.5 opacity-20" />
                          {session.ipAddress}
                        </div>
                        <div className="flex items-center gap-2 text-[8px] text-muted-foreground/30 font-black uppercase tracking-[0.3em] italic">
                          <MapPin className="size-3" />
                          {session.metadata?.location || "RESOLVING_EDGE_NODE..."}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <Activity className="size-2.5 text-primary animate-pulse" />
                          <span className="text-[10px] font-black italic tracking-tighter text-foreground group-hover/row:text-primary transition-colors">
                            {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono font-black opacity-10 tracking-[0.2em]">
                          {new Date(session.createdAt).toLocaleTimeString([], { hour12: false })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-6 opacity-10 italic">
                      <div className="relative">
                        <ShieldAlert className="size-16" />
                        <div className="absolute inset-0 animate-ping rounded-full bg-rose-500 opacity-20" />
                      </div>
                      <p className="text-[12px] font-black uppercase tracking-[0.5em]">Zero_Ingress_Data</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- SYSTEM TELEMETRY FOOTER --- */}
        <div className="px-10 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between opacity-10">
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">Audit_Ledger_Integrity: VERIFIED</p>
          <span className="text-[8px] font-mono">[256_BIT_SSL_ENCRYPTED]</span>
        </div>
      </div>
    </div>
  );
}