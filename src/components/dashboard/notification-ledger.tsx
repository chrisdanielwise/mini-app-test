"use client";

import * as React from "react";
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
  ShieldCheck, 
  Terminal, 
  History,
  Wifi,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ NOTIFICATION_LEDGER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Independent Tactical Scroll.
 * Fix: High-density rows (py-4) and stationary header prevents viewport blowout.
 */
export function NotificationLedger({ open, onOpenChange }: any) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const [logs, setLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (open && typeof window !== 'undefined') {
      const savedLogs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
      setLogs(savedLogs);
    }
  }, [open]);

  const clearLogs = React.useCallback(() => {
    impact("heavy");
    localStorage.removeItem("zipha_logs");
    setLogs([]);
  }, [impact]);

  if (!isReady) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "bg-zinc-950/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden shadow-2xl transition-all duration-700",
          isMobile ? "h-[80vh] rounded-t-[2rem]" : "w-full sm:max-w-md border-l"
        )}
      >
        <div className="flex flex-col h-full relative z-10">
          
          {/* --- 🛡️ STATIONARY HUD: Terminal Header --- */}
          <SheetHeader className="shrink-0 p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5 leading-none">
                <div className="flex items-center gap-2.5 opacity-20 italic">
                  <History className="size-3" />
                  <p className="text-[7.5px] font-black uppercase tracking-[0.3em]">Node_History</p>
                </div>
                <SheetTitle className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                  Signal <span className="text-primary">Ledger</span>
                </SheetTitle>
              </div>
              
              <button 
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="size-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-90 disabled:opacity-5"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </SheetHeader>

          {/* --- 🚀 INTERNAL SCROLL: Laminar Log Stream --- */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2.5 custom-scrollbar scrollbar-hide">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div 
                  key={log.id}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-colors animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "size-9 shrink-0 rounded-lg flex items-center justify-center border transition-all",
                      log.level === "SUCCESS" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      log.level === "ERROR" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                      log.level === "INFO" && "bg-primary/10 text-primary border-primary/20"
                    )}>
                      {log.level === "SUCCESS" ? <ShieldCheck className="size-4" /> : <Zap className="size-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1 leading-tight">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase italic tracking-tight text-foreground/80 truncate">
                          {log.title}
                        </p>
                        <div className="flex items-center gap-1.5 opacity-10">
                           <Wifi className="size-2.5" />
                           <span className="text-[7px] font-black uppercase tracking-widest tabular-nums">
                            {format(new Date(log.timestamp), "HH:mm")}
                          </span>
                        </div>
                      </div>
                      <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.1em] italic leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-10">
                <Database className="size-12 animate-pulse" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] italic">Awaiting_Ingress</p>
              </div>
            )}
          </div>

          {/* --- 🌊 SLIM FOOTER --- */}
          <div 
            className="shrink-0 p-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-center gap-3"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.25rem" }}
          >
             <div className="size-1 rounded-full bg-primary animate-pulse" />
             <p className="text-[7px] font-black uppercase tracking-[0.3em] opacity-10 italic">
               Memory_Node_v16.31_Active
             </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}