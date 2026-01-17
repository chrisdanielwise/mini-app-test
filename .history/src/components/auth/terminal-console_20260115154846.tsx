"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Terminal, Cpu, ShieldCheck, Activity, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  message: string;
}

/**
 * 🌊 TERMINAL_CONSOLE (Institutional Apex v16.16.30)
 * Priority: High-Density Telemetry Stream.
 * Logic: morphology-aware kinetic log-buffer with hardware auto-scroll.
 */
export function TerminalConsole({ logs = [] }: { logs?: LogEntry[] }) {
  const { screenSize, isReady } = useDeviceContext();
  const { impact } = useHaptics();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);

  // 🛰️ TELEMETRY STREAM: Cascading ingress
  useEffect(() => {
    if (logs.length > displayedLogs.length) {
      const nextLog = logs[displayedLogs.length];
      const timer = setTimeout(() => {
        setDisplayedLogs(prev => [...prev, nextLog]);
        if (nextLog.level === "ERROR") impact("medium");
        else impact("light");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [logs, displayedLogs, impact]);

  // 🌊 AUTO-SCROLL: Clamped viewport logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  if (!isReady) return null;

  return (
    <div className={cn(
      "w-full rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-apex overflow-hidden flex flex-col transition-all duration-1000",
      screenSize === 'xs' ? "h-[280px]" : "h-[400px]"
    )}>
      
      {/* --- TERMINAL HEADER --- */}
      <div className="px-6 h-12 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Terminal className="size-3.5 text-primary/60" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/40 italic">
            Apex_Oversight_v16.30
          </span>
        </div>
        <div className="flex items-center gap-4 opacity-30">
          <Activity className="size-3 text-emerald-500 animate-pulse" />
          <Cpu className="size-3 text-primary" />
        </div>
      </div>

      {/* --- LOG VIEWPORT --- */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-2 select-none"
      >
        {displayedLogs.map((log) => (
          <div 
            key={log.id} 
            className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-500"
          >
            <span className="text-[8px] font-mono text-white/10 shrink-0 pt-0.5">
              [{log.timestamp}]
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <ChevronRight className={cn(
                "size-2.5 shrink-0",
                log.level === "ERROR" ? "text-rose-500" :
                log.level === "WARN" ? "text-amber-500" :
                log.level === "SUCCESS" ? "text-emerald-500" : "text-primary"
              )} />
              <p className={cn(
                "text-[10px] font-bold font-mono tracking-tight break-all leading-tight",
                log.level === "ERROR" ? "text-rose-500/80" :
                log.level === "SUCCESS" ? "text-emerald-500/80" : "text-foreground/60"
              )}>
                <span className="opacity-40 uppercase mr-1">[{log.level}]</span>
                {log.message}
              </p>
            </div>
          </div>
        ))}
        
        {/* Kinetic Cursor */}
        <div className="flex items-center gap-2 opacity-20">
          <ChevronRight className="size-2.5" />
          <div className="w-2 h-3.5 bg-primary animate-pulse" />
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="px-6 h-10 border-t border-white/5 flex items-center gap-4 bg-white/[0.01]">
        <ShieldCheck className="size-3 text-emerald-500/40" />
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10 italic">
          Encrypted_Handshake_Active
        </span>
      </div>
    </div>
  );
}