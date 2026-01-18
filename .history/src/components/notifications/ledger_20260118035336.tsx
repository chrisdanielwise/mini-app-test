"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { 
  Trash2, 
  Zap, 
  Terminal, 
  History,
  Database,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ NOTIFICATION_LEDGER (Hardened v16.16.91)
 * Strategy: High-Density Signal History & Independent Tactical Scroll.
 * Mission: Audit the local archival buffer with zero layout jitter.
 */
export function NotificationLedger({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const [logs, setLogs] = useState<any[]>([]);

  // 🛡️ INGRESS_PROTOCOL: Hydrate logs from local buffer on portal mounting
  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      try {
        const savedLogs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
        // Sort by timestamp descending to ensure newest signals appear at the horizon
        setLogs(savedLogs.sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      } catch (e) {
        console.warn("🛰️ [Ledger_Sync_Fault]: Buffer corrupted or node unreachable.");
      }
    }
  }, [open]);

  /**
   * 🚀 SIGNAL_CLEARANCE_PROTOCOL
   * Logic: Atomic wipe of the local history node.
   * Feedback: Heavy haptic confirm + Warning notification.
   */
  const clearLogs = useCallback(() => {
    impact("heavy");
    notification("warning");
    if (typeof window !== 'undefined') {
      localStorage.removeItem("zipha_logs");
      setLogs([]);
    }
  }, [impact, notification]);

  if (!isReady) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "bg-zinc-950/98 backdrop-blur-3xl border-white/5 p-0 overflow-hidden shadow-3xl transition-all duration-700 z-[160]",
          isMobile ? "h-[85vh] rounded-t-[2.5rem]" : "w-full sm:max-w-md border-l"
        )}
      >
        <div className="flex flex-col h-full relative">
          
          {/* --- 🛡️ STATIONARY HUD --- */}
          <SheetHeader className="shrink-0 p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5 leading-none">
                <div className="flex items-center gap-2 opacity-30 italic">
                  <Terminal className="size-3 text-primary" />
                  <span className="text-[7.5px] font-black uppercase tracking-[0.4em]">Signal_Ledger_v16.91</span>
                </div>
                <SheetTitle className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                  History <span className="text-primary">Node</span>
                </SheetTitle>
              </div>
              
              <button 
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="size-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-500 transition-all active:scale-90 disabled:opacity-5 disabled:cursor-not-allowed group"
              >
                <Trash2 className="size-4 opacity-40 group-hover:opacity-100" />
              </button>
            </div>
          </SheetHeader>

          {/* --- 🚀 LAMINAR LOG STREAM --- */}
          <div className="flex-1 overflow-y-auto overscroll-y-contain p-4 md:p-6 space-y-3 scrollbar-hide">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div 
                  key={log.id}
                  style={{ animationDelay: `${i * 35}ms` }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "size-9 shrink-0 rounded-xl flex items-center justify-center border transition-colors",
                      log.level === "SUCCESS" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      log.level === "ERROR" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                      log.level === "WARN" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                      (!log.level || log.level === "INFO") && "bg-primary/10 text-primary border-primary/20"
                    )}>
                      <Zap className="size-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 leading-none">
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-foreground truncate pr-2">
                          {log.title}
                        </p>
                        <span className="text-[7.5px] font-mono uppercase opacity-20 whitespace-nowrap tabular-nums">
                          {log.timestamp ? format(new Date(log.timestamp), "HH:mm:ss") : "--:--:--"}
                        </span>
                      </div>
                      <p className="text-[8px] font-medium text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-5 space-y-4">
                <Database className="size-16" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">No_Signals_Detected</span>
              </div>
            )}
          </div>

          {/* --- 🌊 HARDWARE SAFE FOOTER --- */}
          <div 
            className="shrink-0 p-5 bg-black/40 border-t border-white/5 flex items-center justify-center gap-3"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.5rem" }}
          >
             <div className="flex items-center gap-2 opacity-20 leading-none">
                <Activity className="size-3 animate-pulse text-primary" />
                <span className="text-[7px] font-black uppercase tracking-[0.4em] italic">Synchronized_v16.91</span>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}