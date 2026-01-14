"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  ChevronRight, 
  Lock, 
  Terminal 
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 🛰️ HANDSHAKE SUCCESS UI
 * Logic: Displays cryptographic synchronization state post-auth.
 */
export function HandshakeSuccess({ user }: { user: any }) {
  const [progress, setProgress] = useState(0);

  // 🚀 Simulate the final identity node anchoring
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* 🏛️ TERMINAL STATUS HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] mb-4">
          <ShieldCheck className="h-10 w-10 text-emerald-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
          Identity <span className="text-emerald-500">Anchored</span>
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40 italic">
          Handshake_Protocol_v14.1 // SECURE
        </p>
      </div>

      {/* 📊 TELEMETRY DATA CARD */}
      <div className="rounded-[2.5rem] bg-card/40 border border-border/10 p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
        <Activity className="absolute -top-4 -right-4 h-24 w-24 opacity-[0.03] rotate-12 text-emerald-500" />
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between border-b border-border/5 pb-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-4 w-4 text-emerald-500/60" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Node Identity</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-500">
              {user?.role?.toUpperCase() || "MERCHANT"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
              <span>Synchronizing Mesh</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-muted/5 border border-border/5 text-center">
              <p className="text-[7px] font-black uppercase text-muted-foreground opacity-40 mb-1">Status</p>
              <p className="text-[9px] font-black text-emerald-500 uppercase italic">Encrypted</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/5 border border-border/5 text-center">
              <p className="text-[7px] font-black uppercase text-muted-foreground opacity-40 mb-1">Gateway</p>
              <p className="text-[9px] font-black text-emerald-500 uppercase italic">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔐 CRYPTOGRAPHIC FOOTER */}
      <div className="flex items-center justify-center gap-4 py-4 border-t border-border/5">
        <Lock className="h-3 w-3 text-muted-foreground/20" />
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/20">
          AES_256_GCM_SYNC
        </span>
        <Activity className="h-3 w-3 text-muted-foreground/20" />
      </div>
    </div>
  );
}