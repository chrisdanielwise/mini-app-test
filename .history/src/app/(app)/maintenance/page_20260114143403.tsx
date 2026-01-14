"use client";

import { useSearchParams } from "next/navigation";
import { ShieldAlert, Globe, Terminal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MaintenancePage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "NODE_OFFLINE: Scheduled maintenance protocol in progress.";

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background selection:bg-rose-500/30 overflow-hidden relative">
      
      {/* 🌌 ATMOSPHERIC OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.05),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-8 animate-in fade-in zoom-in duration-1000">
        
        {/* --- IDENTITY HEADER --- */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)] relative">
            <ShieldAlert className="h-10 w-10 text-rose-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full border-4 border-background" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
              Maintenance <span className="text-rose-500">Node</span>
            </h1>
            <div className="flex items-center justify-center gap-2 opacity-40">
              <Globe className="h-3 w-3" />
              <p className="text-[8px] font-black uppercase tracking-[0.3em]">Protocol // Offline</p>
            </div>
          </div>
        </div>

        {/* --- STATUS TERMINAL --- */}
        <div className="rounded-[2.5rem] bg-card/40 border border-border/10 p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-50" />
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-rose-500/60">
              <Terminal className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-widest italic">Status_Log</span>
            </div>

            <p className="text-xs font-medium leading-relaxed text-muted-foreground italic">
              "{message}"
            </p>

            <div className="pt-4 border-t border-border/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Expected Recovery</span>
                <span className="text-[10px] font-bold uppercase italic text-foreground/60">TBD // SYNC_PENDING</span>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                variant="ghost" 
                size="sm"
                className="h-8 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 border border-rose-500/10"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin-slow" />
                <span className="text-[8px] font-black uppercase italic">Retry</span>
              </Button>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <p className="text-center text-[7px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 italic">
          Institutional Ingress Control // v16.9.2
        </p>
      </div>
    </div>
  );
}