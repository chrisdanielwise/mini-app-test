"use client";

import { useState, useEffect, useCallback } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  message: string;
}

/**
 * 🌊 USE_TERMINAL_LOGS (Institutional Apex v16.16.30)
 * Priority: Simulated Data Handshake.
 * Logic: Generates a sequence of Zipha Protocol events for UI calibration.
 */
export function useTerminalLogs(isActivating: boolean = false) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, level: LogEntry["level"] = "INFO") => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      level,
      message: message.toUpperCase(),
    };
    setLogs((prev) => [...prev, newLog].slice(-50)); // Buffer clamped to 50 entries
  }, []);

  useEffect(() => {
    if (!isActivating) return;

    // 🕵️ PROTOCOL SEQUENCE: Simulated Boot-Up Handshake
    const sequence = [
      { msg: "Initializing Apex_Ingress_Membrane...", delay: 0, level: "INFO" },
      { msg: "Loading Cryptographic_Handshake_Keys...", delay: 800, level: "INFO" },
      { msg: "Synchronizing with Global_Cluster_01...", delay: 1500, level: "SUCCESS" },
      { msg: "Handshake_Signature: 0x88A...F21 Verified.", delay: 2200, level: "SUCCESS" },
      { msg: "Scanning Local_Hardware_Morphology...", delay: 3000, level: "INFO" },
      { msg: "Latency_Spike: 142ms detected in Relay_Node.", delay: 3800, level: "WARN" },
      { msg: "Recalibrating Subsurface_Flow_Buffer...", delay: 4500, level: "INFO" },
      { msg: "Zipha_Node_v16.30: Stable_Connection established.", delay: 5500, level: "SUCCESS" },
    ];

    sequence.forEach((step) => {
      setTimeout(() => addLog(step.msg, step.level as LogEntry["level"]), step.delay);
    });

  }, [isActivating, addLog]);

  return { logs, addLog, clearLogs: () => setLogs([]) };
}