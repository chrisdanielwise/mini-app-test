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
 * 🛰️ TERMINAL_CONSOLE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density rows (py-1.5) and stationary HUD profile prevents blowout.
 */
export function TerminalConsole({ logs = [] }: { logs?: LogEntry[] }) {
  const { screenSize, isReady } = useDeviceContext();
  const { impact } = useHaptics();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);

  // 🛰️ TELEMETRY STREAM: High-frequency ingress
  useEffect(() => {
    if (logs.length > displayedLogs.length) {
      const nextLog = logs[displayedLogs.length];
      const timer = setTimeout(() => {
        setDisplayedLogs(prev => [...prev, nextLog]);
        if (nextLog.level === "ERROR") impact("medium");
        else impact("light");
      }, 100); // Accelerated from 150ms
      return () => clearTimeout(timer);
    }
  }, [logs, displayedLogs, impact]);

  // 🌊 AUTO-SCROLL: Stationary horizon logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  if (!isReady) return <div className="h-40 w-full bg-white/5 animate-pulse rounded-xl" />;

  return (
    <div className={cn(
      "w-full rounded-xl border border-white/5 bg-zinc-950/60 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-700",
      screenSize === 'xs' ? "h-[220px]" : "h-[320px]"
    )}>
      
      {/* --- 🛡️ FIXED HUD: Compressed Header --- */}
      <div className="shrink-0 h-9 px-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] leading-none">
        <div className="flex items-center gap-2.5">
          <Terminal className="size-3 text-primary/40" />
          <span className="text-[7.5px] font-black uppercase tracking-[0.3em] text-foreground/20 italic">
            Apex_Oversight_v16.30
          </span>
        </div>
        <div className="flex items-center gap-3 opacity-20">
          <Activity className="size-2.5 text-emerald-500 animate-pulse" />
          <Cpu className="size-2.5 text-primary" />
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL: Log Ingress Volume --- */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-1.5 select-none scroll-smooth"
      >
        {displayedLogs.map((log) => (
          <div 
            key={log.id} 
            className="flex items-start gap-2.5 animate-in fade-in slide-in-from-left-1 duration-500"
          >
            <span className="text-[7px] font-mono text-white/5 shrink-0 pt-0.5 tabular-nums">
              [{log.timestamp}]
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className={cn(
                "size-2 shrink-0",
                log.level === "ERROR" ? "text-rose-500" :
                log.level === "WARN" ? "text-amber-500" :
                log.level === "SUCCESS" ? "text-emerald-500" : "text-primary"
              )} />
              <p className={cn(
                "text-[9px] font-mono tracking-tighter break-all leading-none",
                log.level === "ERROR" ? "text-rose-500/60" :
                log.level === "SUCCESS" ? "text-emerald-500/60" : "text-foreground/40"
              )}>
                <span className="opacity-20 uppercase mr-1">[{log.level}]</span>
                {log.message}
              </p>
            </div>
          </div>
        ))}
        
        {/* Kinetic Cursor */}
        <div className="flex items-center gap-1.5 opacity-10">
          <ChevronRight className="size-2" />
          <div className="w-1.5 h-2.5 bg-primary animate-pulse" />
        </div>
      </div>

      {/* --- 🌊 SLIM FOOTER --- */}
      <div className="shrink-0 h-8 px-4 border-t border-white/5 flex items-center gap-3 bg-white/[0.01]">
        <ShieldCheck className="size-2.5 text-emerald-500/20" />
        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/5 italic">
          AES_256_SIGNAL_OK
        </span>
      </div>
    </div>
  );
}