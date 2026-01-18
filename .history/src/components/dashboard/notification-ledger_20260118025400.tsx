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
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ NOTIFICATION_LEDGER (Hardened v16.16.69)
 * Strategy: High-Density Signal History & Independent Tactical Scroll.
 * Fix: Implemented clearLogs protocol with heavy haptic feedback.
 */
export function NotificationLedger({ open, onOpenChange }: any) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const [logs, setLogs] = useState<any[]>([]);

  // 🛡️ INGRESS_PROTOCOL: Hydrate logs from local buffer
  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      try {
        const savedLogs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
        setLogs(savedLogs);
      } catch (e) {
        console.warn("🛰️ [Ledger_Sync_Fault]: Buffer corrupted.");
      }
    }
  }, [open]);

  /**
   * 🚀 SIGNAL_CLEARANCE_PROTOCOL (The Fix)
   * Logic: Atomic wipe of the local history node.
   * Feedback: Heavy haptic confirm for destructive actions.
   */
  const clearLogs = useCallback(() => {
    impact("heavy");
    if (typeof window !== 'undefined') {
      localStorage.removeItem("zipha_logs");
      setLogs([]);
    }
  }, [impact]);

  if (!isReady) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "bg-zinc-950/98 backdrop-blur-3xl border-white/5 p-0 overflow-hidden shadow-3xl transition-all duration-700",
          isMobile ? "h-[85vh] rounded-t-[2.5rem]" : "w-full sm:max-w-md border-l"
        )}
      >
        <div className="flex flex-col h-full relative z-[150]">
          
          {/* --- 🛡️ STATIONARY HUD --- */}
          <SheetHeader className="shrink-0 p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5 leading-none">
                <div className="flex items-center gap-2 opacity-30 italic">
                  <Terminal className="size-3 text-primary" />
                  <span className="text-[7.5px] font-black uppercase tracking-[0.4em]">Signal_Ledger_v16.69</span>
                </div>
                <SheetTitle className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                  History <span className="text-primary">Node</span>
                </SheetTitle>
              </div>
              
              <button 
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="size-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-500 transition-all active:scale-90 disabled:opacity-5"
              >
                <Trash2 className="size-4" />
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
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={cn(
                      "size-8 shrink-0 rounded-lg flex items-center justify-center border",
                      log.level === "SUCCESS" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      log.level === "ERROR" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                      log.level === "INFO" && "bg-primary/10 text-primary border-primary/20"
                    )}>
                      <Zap className="size-3.5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 leading-none">
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-foreground truncate pr-2">
                          {log.title}
                        </p>
                        <span className="text-[7px] font-mono uppercase opacity-20 whitespace-nowrap">
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
                <div className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[7px] font-black uppercase tracking-[0.4em] italic">Synchronized_v16.69</span>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}