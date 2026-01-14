"use client";

import { useEffect, useState } from "react";
import { 
  Globe, 
  Monitor, 
  Smartphone, 
  Clock, 
  MapPin, 
  ShieldCheck,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

/**
 * 🛰️ SESSION TELEMETRY TABLE
 * Logic: Pulls active ingress points from the Audit Log.
 */
export function SessionActivityTable() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/sessions"); // We'll build this next
      const data = await res.json();
      setActivities(data.sessions || []);
    } catch (err) {
      console.error("Telemetry Sync Failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 italic">
          Ingress_History_Log
        </h3>
        <button 
          onClick={fetchLogs}
          className="hover:rotate-180 transition-transform duration-700"
        >
          <RefreshCcw className="h-3 w-3 text-primary/40" />
        </button>
      </div>

      <div className="rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/10 bg-muted/5">
              <th className="p-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground">Source</th>
              <th className="p-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground">Location/IP</th>
              <th className="p-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground text-right">Epoch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/5">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={3} className="p-6 h-12 bg-muted/5" />
                </tr>
              ))
            ) : activities.length > 0 ? (
              activities.map((session) => (
                <tr key={session.id} className="group hover:bg-primary/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg border border-border/20 flex items-center justify-center bg-background">
                        {session.metadata?.ua?.includes("Mobile") ? (
                          <Smartphone className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Monitor className="h-3.5 w-3.5 text-amber-500" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase truncate max-w-[100px]">
                        {session.metadata?.method || "GATEWAY_SYNC"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-[9px] font-black">
                        <Globe className="h-2.5 w-2.5 opacity-30" />
                        {session.ipAddress}
                      </div>
                      <div className="flex items-center gap-1.5 text-[7px] text-muted-foreground font-bold uppercase tracking-tighter">
                        <MapPin className="h-2 w-2" />
                        Resolved_Edge_Node
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[9px] font-black italic text-primary/80">
                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                      </span>
                      <span className="text-[7px] font-mono opacity-20">
                        {new Date(session.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-12 text-center text-[9px] font-black uppercase opacity-20 italic">
                  No Ingress Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}