"use client";

import * as React from "react";
import { 
  Terminal, 
  RefreshCcw, 
  ShieldAlert, 
  X, 
  Zap, 
  Activity,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";

/**
 * 🛰️ NODE_RESET_PROTOCOL (Institutional v16.16.93)
 * Strategy: Multi-Stage Destruction Handshake.
 * Mission: Targeted node purge for remote merchant support.
 */
export function NodeReset({ isOpen, onClose, targetNodeId }: any) {
  const { impact, notification } = useHaptics();
  const { sendSignal } = useGlobalSignal();
  const [stage, setStage] = React.useState<"TARGET" | "CONFIRM" | "PURGING">("TARGET");

  if (!isOpen) return null;

  const handleExecution = async () => {
    setStage("PURGING");
    impact("heavy");
    notification("warning");

    // 🚀 ATOMIC_WIPE: Simulate server-side cache purge
    await new Promise(r => setTimeout(r, 2000));
    
    sendSignal(
      "Node_Reset_Success", 
      `Cache & Sessions purged for Node [${targetNodeId}]`, 
      "SUCCESS"
    );
    
    notification("success");
    onClose();
    setStage("TARGET");
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-950 border border-rose-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(244,63,94,0.15)]">
        
        {/* --- 🛡️ WARNING HUD --- */}
        <div className="p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="size-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <ShieldAlert className={cn("size-8", stage === "PURGING" && "animate-spin")} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
              Node <span className="text-rose-500">Reset</span>
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
              Target Node: <span className="text-foreground">{targetNodeId || "GLOBAL_CACHE"}</span>
            </p>
          </div>

          {/* 🕹️ TACTICAL ACTIONS */}
          <div className="space-y-3">
            {stage === "TARGET" && (
              <button 
                onClick={() => { impact("medium"); setStage("CONFIRM"); }}
                className="w-full h-14 rounded-2xl bg-rose-500 text-black text-[11px] font-black uppercase italic tracking-widest hover:bg-rose-600 transition-all active:scale-95"
              >
                Initiate Purge
              </button>
            )}

            {stage === "CONFIRM" && (
              <div className="space-y-3 animate-in zoom-in-95 duration-300">
                <p className="text-[8px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">
                  ⚠️ Irreversible_Action_Confirmed?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setStage("TARGET")}
                    className="h-12 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={handleExecution}
                    className="h-12 rounded-xl bg-rose-500 text-black text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {stage === "PURGING" && (
              <div className="py-4 space-y-4">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 animate-progress w-full" />
                </div>
                <p className="text-[8px] font-black uppercase italic tracking-[0.5em] text-rose-500 animate-pulse">
                  Broadcast_Purge_Signal...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 🌫️ FOOTER SIGNAL */}
        <div className="bg-rose-500/5 border-t border-rose-500/10 p-4 flex items-center justify-center gap-2 opacity-30">
          <Terminal className="size-3 text-rose-500" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em] italic">Protocol_v16.93 // L80_Auth_Required</span>
        </div>
      </div>
    </div>
  );
}