"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2, ShieldAlert, Activity, Terminal } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-institutional-auth";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface AuditState {
  hasToken: boolean;
  handshakeComplete: boolean;
  isVerifying: boolean;
  error: string | null;
}

/**
 * 🌊 SESSION_AUDIT_PROTOCOL (v16.16.12)
 * Logic: Triple-stage Identity Handshake with real-time block-sync visualization.
 * Design: v9.9.2 Hyper-Glass with Kinetic Scanner HUD.
 */
export function SessionAudit({ token }: { token: string | null }) {
  const auth = useAuth();
  const { impact } = useHaptics();
  
  const [state, setState] = useState<AuditState>({
    hasToken: !!token,
    handshakeComplete: auth.isAuthenticated,
    isVerifying: !!token && !auth.isAuthenticated,
    error: null
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      hasToken: !!token,
      handshakeComplete: auth.isAuthenticated,
      isVerifying: auth.isLoading || (!!token && !auth.isAuthenticated),
      error: auth.error
    }));

    // 🏁 TACTILE: Light tick as we move between protocol stages
    if (auth.isAuthenticated || token) {
      impact("light");
    }
  }, [token, auth.isAuthenticated, auth.isLoading, auth.error, impact]);

  return (
    <div className="w-full mt-10 p-8 rounded-[2.5rem] border border-white/5 bg-card/40 backdrop-blur-3xl space-y-6 shadow-apex relative overflow-hidden group">
      
      {/* 🏛️ HUD SCANNER: Kinetic Overlayer */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.05)_50%,transparent_100%)] bg-[length:100%_20px] animate-[scan_4s_linear_infinite] pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/60 italic">
            Node_Protocol_Audit
          </h3>
        </div>
        {state.error && (
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in zoom-in">
            <Terminal className="size-3 text-rose-500" />
            <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">
              FAULT_DETECTED
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5 relative z-10">
        <AuditStep 
          label="1. Identity_Ingress" 
          status={state.hasToken ? "RESOLVED" : "PENDING"} 
          isComplete={state.hasToken}
          colorClass="text-amber-500"
        />

        <AuditStep 
          label="2. Handshake_Sync" 
          status={state.isVerifying ? "VALIDATING" : state.handshakeComplete ? "SECURE" : "PENDING"} 
          isComplete={state.handshakeComplete}
          isLoading={state.isVerifying}
          colorClass="text-emerald-500"
        />

        <AuditStep 
          label="3. Session_Anchor" 
          status={state.handshakeComplete ? "ESTABLISHED" : state.error ? "FAILED" : "PENDING"} 
          isComplete={state.handshakeComplete}
          isError={!!state.error}
          colorClass="text-emerald-500"
        />
      </div>
      
      {/* 🚀 KINETIC PROGRESS VECTOR */}
      <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden mt-8">
        <div 
          className={cn(
            "h-full transition-all duration-[1500ms] ease-[var(--ease-institutional)] shadow-[0_0_15px_rgba(245,158,11,0.4)]",
            state.error ? "bg-rose-500 shadow-rose-500/50" : state.handshakeComplete ? "bg-emerald-500 shadow-emerald-500/50" : "bg-amber-500"
          )} 
          style={{ width: state.handshakeComplete ? '100%' : state.isVerifying ? '66%' : state.hasToken ? '33%' : '2%' }}
        />
      </div>
    </div>
  );
}

function AuditStep({ label, status, isComplete, isLoading, isError, colorClass }: any) {
  return (
    <div className="flex items-center justify-between group/step transition-all duration-500">
      <span className={cn(
        "text-[11px] font-black uppercase tracking-[0.2em] italic transition-all",
        isComplete || isLoading ? "text-foreground" : "text-muted-foreground/20"
      )}>
        {label}
      </span>
      
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-[9px] font-black italic tracking-[0.2em]",
          isError ? "text-rose-500" : isComplete ? colorClass : isLoading ? "text-amber-500 animate-pulse" : "text-white/5"
        )}>
          {status}
        </span>
        
        <div className={cn(
          "size-6 rounded-lg border flex items-center justify-center transition-all duration-500",
          isComplete ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/5"
        )}>
          {isLoading ? (
            <Loader2 className="size-3 text-amber-500 animate-spin" />
          ) : isComplete ? (
            <CheckCircle2 className={cn("size-3", colorClass)} />
          ) : isError ? (
            <ShieldAlert className="size-3 text-rose-500" />
          ) : (
            <Circle className="size-3 text-white/10" />
          )}
        </div>
      </div>
    </div>
  );
}