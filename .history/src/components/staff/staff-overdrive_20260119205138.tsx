"use client";

import * as React from "react";
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Database, 
  ShieldAlert, 
  X, 
  ChevronRight,
  Activity,
  History
} from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";
import { SystemHealthMonitor } from "./system-health-monitor";

// 📊 NEW TELEMETRY WIDGET
// import { SystemHealthMonitor } from "./system-health-monitor";

/**
 * 🛰️ STAFF_OVERDRIVE (Institutional v16.16.92)
 * Strategy: Low-Latency Telemetry Stream & Command Execution.
 * Mission: High-stakes platform oversight for L80+ personnel.
 */
export function StaffOverdrive({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { impact, notification } = useHaptics();
  const { sendSignal } = useGlobalSignal();
  const [logs, setLogs] = React.useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // 🛡️ TELEMETRY_INGRESS: Simulate live system heartbeat
  React.useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const events = [
        "MESH_NODE_09_STABLE",
        "SYNC_LATENCY_24MS",
        "AUTH_TOKEN_ROTATED",
        "INFLOW_BUFFER_CLEARED",
        "LEDGER_SYNC_SUCCESS"
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [...prev.slice(-15), `[${timestamp}] 🛰️ ${randomEvent}`]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-scroll to bottom of terminal
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    impact("medium");
    setLogs(prev => [...prev, `> EXECUTING_${cmd.toUpperCase()}...`]);
    
    if (cmd === "flush") {
      notification("success");
      sendSignal("Node_Purge", "Local system cache flushed by Overdrive.", "INFO");
    }
    // Add logic for sync, reboot, debug as needed
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-4xl h-[70vh] bg-zinc-950 border border-amber-500/20 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.1)] flex flex-col overflow-hidden">
        
        {/* --- 🛡️ OVERDRIVE HUD --- */}
        <div className="shrink-0 p-5 border-b border-amber-500/10 bg-amber-500/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Terminal className="size-4" />
            </div>
            <div className="leading-none space-y-1">
              <div className="flex items-center gap-2 opacity-40 italic">
                <Activity className="size-2.5" />
                <span className="text-[7px] font-black uppercase tracking-[0.4em]">Overdrive_v16.92</span>
              </div>
              <h2 className="text-sm font-black uppercase italic tracking-tighter text-amber-500">
                System <span className="text-foreground">Console</span>
              </h2>
            </div>
          </div>
          
          <button 
            onClick={() => { impact("light"); onClose(); }}
            className="size-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all"
          >
            <X className="size-4 opacity-40" />
          </button>
        </div>

        {/* 📊 REAL-TIME VITALS: High-Frequency Telemetry Ingress */}
        <SystemHealthMonitor />

        {/* --- 🚀 LIVE TELEMETRY STREAM --- */}
        <div 
          ref={scrollRef}
          className="flex-1 p-6 font-mono text-[10px] space-y-1.5 overflow-y-auto scrollbar-hide bg-black/40"
        >
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-1">
              <span className="text-amber-500/40 shrink-0">#</span>
              <p className="text-amber-500/80 tracking-tight leading-relaxed">{log}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
               <Cpu className="size-12 animate-pulse" />
               <p className="text-[9px] font-black uppercase tracking-[0.5em]">Awaiting_Telemetry</p>
            </div>
          )}
        </div>

        {/* --- 🕹️ QUICK COMMANDS --- */}
        <div className="shrink-0 p-4 border-t border-amber-500/10 bg-amber-500/[0.01] grid grid-cols-2 md:grid-cols-4 gap-2">
          {["sync", "flush", "reboot", "debug"].map((cmd) => (
            <button 
              key={cmd}
              onClick={() => handleCommand(cmd)}
              className="h-10 rounded-xl border border-amber-500/10 bg-amber-500/5 hover:bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase italic tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="size-3" />
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}