"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2, ShieldAlert, Terminal } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth"; // 🛡️ Fix: Corrected Named Export
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface AuditState {
  hasToken: boolean;
  handshakeComplete: boolean;
  isVerifying: boolean;
  error: string | null;
}

/**
 * 🌊 SESSION_AUDIT_PROTOCOL (Institutional Apex v16.16.30)
 * Priority: Full Identity Handshake Synchronization.
 * Logic: Triple-stage morphology-aware validation scanner.
 */
export function SessionAudit({ token }: { token: string | null }) {
  const auth = useInstitutionalAuth(); // 🛡️ Handshake Sync
  const { impact } = useHaptics();
  const { isReady, screenSize } = useDeviceContext();
  
  const [state, setState] = useState<AuditState>({
    hasToken: !!token,
    handshakeComplete: auth.isAuthenticated,
    isVerifying: !!token && !auth.isAuthenticated,
    error: null
  });

  // 🛰️ PROTOCOL SYNC: Dynamic Lifecycle Management
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      hasToken: !!token,
      handshakeComplete: auth.isAuthenticated,
      isVerifying: auth.isLoading || (!!token && !auth.isAuthenticated),
      error: auth.error
    }));

    // 🏁 TACTILE: Institutional confirmation tick
    if (auth.isAuthenticated || (token && !state.hasToken)) {
      impact("light");
    }
  }, [token, auth.isAuthenticated, auth.isLoading, auth.error, impact, state.hasToken]);

  // 🛡️ HYDRATION GUARD
  if (!isReady) return null;

  return (
    <div className={cn(
      "w-full mt-10 rounded-[2.5rem] border border-white/5 bg-card/40 backdrop-blur-3xl space-y-6 shadow-apex relative overflow-hidden group transition-all duration-1000",
      screenSize === 'xs' ? "p-6" : "p-10"
    )}>
      
      {/* 🏛️ HUD SCANNER: Kinetic Hardware-Aligned Radiance */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.08)_50%,transparent_100%)] bg-[length:100%_40px] animate-[scan_4s_linear_infinite] pointer-events-none z-0" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4 italic">
          <div className={cn(
            "size-2 rounded-full animate-pulse transition-colors duration-700",
            state.error ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
          )} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40 italic leading-none">
            Node_Protocol_Audit
          </h3>
        </div>
        
        {state.error && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in zoom-in duration-500">
            <Terminal className="size-3 text-rose-500" />
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest italic">
              FAULT_DETECTED
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6 relative z-10">
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
      
      {/* 🚀 KINETIC PROGRESS VECTOR: Institutional Gravity */}
      <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-10">
        <div 
          className={cn(
            "h-full transition-all duration-[2000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            state.error ? "bg-rose-500 shadow-apex" : state.handshakeComplete ? "bg-emerald-500 shadow-apex" : "bg-amber-500"
          )} 
          style={{ width: state.handshakeComplete ? '100%' : state.isVerifying ? '66%' : state.hasToken ? '33%' : '2%' }}
        />
      </div>
    </div>
  );
}

/** 🛠️ HELPER: ATOMIC AUDIT STEP */
function AuditStep({ label, status, isComplete, isLoading, isError, colorClass }: any) {
  return (
    <div className="flex items-center justify-between group/step transition-all duration-500">
      <span className={cn(
        "text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] italic transition-all duration-700",
        isComplete || isLoading ? "text-foreground" : "text-muted-foreground/10"
      )}>
        {label}
      </span>
      
      <div className="flex items-center gap-4">
        <span className={cn(
          "text-[9px] font-black italic tracking-[0.2em] transition-colors duration-700",
          isError ? "text-rose-500" : isComplete ? colorClass : isLoading ? "text-amber-500 animate-pulse" : "text-white/5"
        )}>
          {status}
        </span>
        
        <div className={cn(
          "size-7 rounded-xl border flex items-center justify-center transition-all duration-1000",
          isComplete ? "bg-emerald-500/10 border-emerald-500/20 shadow-inner" : "bg-white/5 border-white/5"
        )}>
          {isLoading ? (
            <Loader2 className="size-3.5 text-amber-500 animate-spin" />
          ) : isComplete ? (
            <CheckCircle2 className={cn("size-3.5", colorClass)} />
          ) : isError ? (
            <ShieldAlert className="size-3.5 text-rose-500" />
          ) : (
            <Circle className="size-3.5 text-white/5" />
          )}
        </div>
      </div>
    </div>
  );
}