"use client";

import * as React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Activity, Trash2, Zap, ShieldCheck, AlertTriangle, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 NOTIFICATION_LEDGER (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Slide | Vapour-Glass depth.
 * Logic: morphology-aware log retrieval with staggered item ingress.
 */
export function NotificationLedger({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { impact } = useHaptics();
  const [logs, setLogs] = React.useState<any[]>([]);

  // 🛰️ TELEMETRY_FETCH: Hydrate logs from local storage
  React.useEffect(() => {
    if (open) {
      const savedLogs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
      setLogs(savedLogs);
    }
  }, [open]);

  const clearLogs = () => {
    impact("heavy");
    localStorage.removeItem("zipha_logs");
    setLogs([]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-background/60 backdrop-blur-3xl border-white/5 p-0 overflow-hidden shadow-apex">
        {/* 🌫️ VAPOUR MASK */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="flex flex-col h-full relative z-10">
          <SheetHeader className="p-8 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3 opacity-30 italic">
                  <Activity className="size-3 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Node_History</p>
                </div>
                <SheetTitle className="text-3xl font-black uppercase italic tracking-tighter">
                  Signal <span className="text-primary">Ledger</span>
                </SheetTitle>
              </div>
              <button 
                onClick={clearLogs}
                className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-90"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </SheetHeader>

          {/* --- LOG STREAM --- */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div 
                  key={log.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="p-5 rounded-[1.8rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all duration-700 animate-in fade-in slide-in-from-right-8"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "size-10 shrink-0 rounded-xl flex items-center justify-center border",
                      log.level === "SUCCESS" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      log.level === "ERROR" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                      log.level === "INFO" && "bg-primary/10 text-primary border-primary/20"
                    )}>
                      {log.level === "SUCCESS" ? <ShieldCheck className="size-4" /> : <Zap className="size-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black uppercase italic tracking-tighter truncate">{log.title}</p>
                        <span className="text-[8px] font-black opacity-20 uppercase tracking-widest">
                          {format(new Date(log.timestamp), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1 leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 italic">
                <Terminal className="size-12" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Ledger_Empty</p>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/5 bg-white/[0.02] text-center">
             <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-20">Institutional_Ingress_Node_v16.31</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}