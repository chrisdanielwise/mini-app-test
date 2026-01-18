"use client";

import * as React from "react";
import { Activity, Cpu, Database, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SYSTEM_HEALTH_MONITOR (Institutional v16.16.92)
 * Strategy: High-Frequency Telemetry Ingress.
 * Mission: Live oversight of platform vitals for Overdrive terminal.
 */
export function SystemHealthMonitor() {
  const [metrics, setMetrics] = React.useState({
    cpu: 12,
    latency: 24,
    nodes: 8,
    uptime: "99.99%"
  });

  // 🛡️ TELEMETRY_INGRESS: Simulate live hardware jitter
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * (18 - 8 + 1) + 8),
        latency: Math.floor(Math.random() * (32 - 18 + 1) + 18),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const dataNodes = [
    { label: "CPU_LOAD", value: `${metrics.cpu}%`, icon: Cpu },
    { label: "MESH_LATENCY", value: `${metrics.latency}MS`, icon: Zap },
    { label: "ACTIVE_NODES", value: metrics.nodes, icon: Globe },
    { label: "DB_UPTIME", value: metrics.uptime, icon: Database },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-amber-500/[0.02] border-y border-amber-500/10 mb-4">
      {dataNodes.map((node) => (
        <div key={node.label} className="flex flex-col gap-1.5 leading-none">
          <div className="flex items-center gap-2 opacity-30 italic">
            <node.icon className="size-2.5 text-amber-500" />
            <span className="text-[7px] font-black uppercase tracking-widest">{node.label}</span>
          </div>
          <p className="text-sm font-black italic tracking-tighter text-foreground tabular-nums">
            {node.value}
          </p>
        </div>
      ))}
    </div>
  );
}