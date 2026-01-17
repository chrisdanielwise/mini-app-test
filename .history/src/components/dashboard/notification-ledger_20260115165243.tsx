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
  Activity, 
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

interface NotificationLedgerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 🌊 NOTIFICATION_LEDGER (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Slide | Vapour-Glass depth.
 * Logic: morphology-aware log retrieval with staggered item ingress.
 */
export function NotificationLedger({ 
  open, 
  onOpenChange 
}: NotificationLedgerProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const [logs, setLogs] = React.useState<any[]>([]);

  // 🛰️ TELEMETRY_HYDRATION: Precision log recovery
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
        // 🕵️ MORPHOLOGY RESOLUTION: Dynamic positioning
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "bg-background/80 backdrop-blur-3xl border-white/5 p-0 overflow-hidden shadow-apex transition-all duration-1000",
          isMobile ? "h-[85vh] rounded-t-[3rem]" : "w-full sm:max-w-md border-l"
        )}
      >
        {/* 🌫️ VAPOUR MASK: Subsurface Kinetic Radiance */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div 
          className="flex flex-col h-full relative z-10"
          style={{ paddingBottom: isMobile ? `${safeArea.bottom}px` : "0px" }}
        >
          {/* --- TERMINAL HEADER --- */}
          <SheetHeader className="p-8 md:p-10 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 opacity-30 italic">
                  <History className="size-3.5" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Node_History_v16.31</p>
                </div>
                <SheetTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                  Signal <span className="text-primary">Ledger</span>
                </SheetTitle>
              </div>
              
              <button 
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="size-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-90 disabled:opacity-10 group"
              >
                <Trash2 className="size-5 transition-transform group-hover:rotate-12" />
              </button>
            </div>
          </SheetHeader>

          {/* --- LAMINAR LOG STREAM --- */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar scrollbar-hide">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div 
                  key={log.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="p-6 rounded-[2.2rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all duration-700 animate-in fade-in slide-in-from-bottom-6"
                >
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "size-12 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-700",
                      log.level === "SUCCESS" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      log.level === "ERROR" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                      log.level === "INFO" && "bg-primary/10 text-primary border-primary/20"
                    )}>
                      {log.level === "SUCCESS" ? <ShieldCheck className="size-5" /> : <Zap className="size-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-black uppercase italic tracking-tighter truncate text-foreground/90">
                          {log.title}
                        </p>
                        <div className="flex items-center gap-2 opacity-20">
                           <Wifi className="size-2.5" />
                           <span className="text-[8px] font-black uppercase tracking-widest tabular-nums">
                            {format(new Date(log.timestamp), "HH:mm")}
                          </span>
                        </div>
                      </div>
                      <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mt-1 leading-relaxed italic">
                        {log.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000">
                <div className="relative">
                  <Terminal className="size-16 opacity-5" />
                  <Database className="absolute -top-3 -right-3 size-6 text-primary/10 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-20 italic">Ledger_Empty</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-10">Awaiting_Signal_Ingress</p>
                </div>
              </div>
            )}
          </div>

          {/* --- TERMINAL FOOTER --- */}
          <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-center gap-4">
             <div className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
             <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20 italic">
               Institutional_Memory_Node_Active
             </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}