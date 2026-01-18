"use client";

import * as React from "react";
import { format } from "date-fns";
import { 
  ShieldAlert, 
  UserCircle2, 
  Terminal, 
  History, 
  Search, 
  Filter,
  Eye,
  Settings,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface AuditEntry {
  id: string;
  adminName: string;
  action: "IMPERSONATION_START" | "SETTLEMENT_APPROVED" | "CONFIG_CHANGE" | "SECURITY_OVERRIDE";
  target: string;
  timestamp: string;
  severity: "INFO" | "CRITICAL" | "SECURITY";
}

/**
 * 🛰️ STAFF_AUDIT_LOG (Institutional v16.38.10)
 * Strategy: Stationary HUD & Forensic Table Compression.
 */
export function StaffAuditLog({ entries }: { entries: AuditEntry[] }) {
  const { isMobile, isReady } = useDeviceContext();
  const { impact } = useHaptics();
  const [query, setQuery] = React.useState("");

  const filtered = entries.filter(e => 
    e.adminName.toLowerCase().includes(query.toLowerCase()) ||
    e.action.includes(query) ||
    e.target.toLowerCase().includes(query.toLowerCase())
  );

  if (!isReady) return <div className="h-64 w-full bg-white/5 animate-pulse rounded-2xl" />;

  return (
    <div className="flex flex-col h-full w-full bg-black border border-white/5 rounded-[2rem] overflow-hidden shadow-3xl">
      
      {/* --- 🛡️ AUDIT HUD --- */}
      <div className="shrink-0 p-6 border-b border-white/5 bg-zinc-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
            <History className="size-5" />
          </div>
          <div className="leading-none">
            <h2 className="text-lg font-black uppercase italic tracking-tighter">System <span className="text-amber-500">Audit_Log</span></h2>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-20">L80_Forensic_Telemetry</p>
          </div>
        </div>

        <div className="relative group w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 opacity-20 group-focus-within:text-amber-500 transition-colors" />
           <input 
             onFocus={() => impact("light")}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="QUERY_SYSTEM_NODE..." 
             className="h-10 w-full pl-10 pr-4 rounded-xl bg-white/[0.02] border border-white/10 text-[9px] font-black uppercase tracking-widest outline-none focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all italic"
           />
        </div>
      </div>

      {/* --- 🚀 FORENSIC VOLUME --- */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
          <thead className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-white/5">
            <tr>
              <th className="w-[20%] px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">Time_Stamp</th>
              <th className="w-[20%] px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">Operator</th>
              <th className="w-[25%] px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">Action_Node</th>
              <th className="w-[25%] px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">Target_Context</th>
              <th className="w-[10%] px-6 py-4 text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic text-right">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((entry) => (
              <tr key={entry.id} className="hover:bg-amber-500/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-[10px] font-mono font-bold tracking-tighter tabular-nums opacity-40">
                    {format(new Date(entry.timestamp), "MMM dd, HH:mm:ss")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="size-3.5 opacity-20 group-hover:text-amber-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase italic tracking-tight">{entry.adminName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      {getActionIcon(entry.action)}
                      <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{entry.action.replace('_', ' ')}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[9px] font-mono opacity-30 truncate block">{entry.target}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <SeverityBadge severity={entry.severity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** --- ATOMIC HELPERS --- */

function getActionIcon(action: string) {
  switch (action) {
    case "IMPERSONATION_START": return <Eye className="size-3 text-amber-500" />;
    case "CONFIG_CHANGE": return <Settings className="size-3 text-blue-500" />;
    case "SECURITY_OVERRIDE": return <Lock className="size-3 text-rose-500" />;
    default: return <Terminal className="size-3 opacity-20" />;
  }
}

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <div className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-widest italic",
      severity === "SECURITY" && "bg-rose-500/10 border-rose-500/20 text-rose-500",
      severity === "CRITICAL" && "bg-amber-500/10 border-amber-500/20 text-amber-500",
      severity === "INFO" && "bg-blue-500/10 border-blue-500/20 text-blue-500"
    )}>
      {severity}
    </div>
  );
}