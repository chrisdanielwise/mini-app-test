"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2, ShieldAlert, Terminal, Activity } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
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
 * 🛰️ SESSION_AUDIT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Standardized h-1.5 bars and high-density row gaps (gap-4) prevent blowout.
 */
export function SessionAudit({ token }: { token: string | null }) {
  const auth = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS
  const { isReady, screenSize, isMobile, viewportWidth } = useDeviceContext();
  
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

    if (auth.isAuthenticated || (token && !state.hasToken)) {
      impact("light");
    }
  }, [token, auth.isAuthenticated, auth.isLoading, auth.error, impact, state.hasToken]);

  if (!isReady) return <div className="h-40 w-full animate-pulse bg-white/5 rounded-2xl" />;

  return (
    <div className={cn(
      "w-full mt-6 shadow-2xl relative overflow-hidden transition-all duration-700",
      "bg-zinc-950/40 backdrop-blur-3xl border border-white/5",
      "rounded-2xl md:rounded-3xl p-6 md:p-8"
    )}>
      
      {/* 🌫️ TACTICAL SCANNER */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.05)_50%,transparent_100%)] bg-[length:100%_40px] pointer-events-none z-0"
        style={{ animation: `scan ${viewportWidth > 1200 ? '8s' : '5s'} linear infinite` }} 
      />

      {/* --- 🛡️ FIXED HUD: Stationary Header --- */}
      <div className="flex items-center justify-between relative z-10 mb-6 leading-none">
        <div className="flex items-center gap-3 italic opacity-30">
          <Activity className={cn("size-3 animate-pulse", state.error ? "text-rose-500" : "text-amber-500")} />
          <h3 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Node_Protocol_Audit</h3>
        </div>
        
        {!isMobile && (
          <div className="text-[6.5px] font-mono font-black uppercase tracking-widest opacity-10">
            Hardware: {screenSize.toUpperCase()} // Stable
          </div>
        )}
      </div>

      {/* --- 🚀 PROTOCOL STEPS: Independent Signal Stream --- */}
      <div className={cn("relative z-10 space-y-4 md:space-y-5")}>
        <AuditStep 
          label="1. Identity_Ingress" 
          status={state.hasToken ? "RESOLVED" : "PENDING"} 
          isComplete={state.hasToken}
          colorClass="text-amber-500"
          density={screenSize}
        />

        <AuditStep 
          label="2. Handshake_Sync" 
          status={state.isVerifying ? "VALIDATING" : state.handshakeComplete ? "SECURE" : "PENDING"} 
          isComplete={state.handshakeComplete}
          isLoading={state.isVerifying}
          colorClass="text-emerald-500"
          density={screenSize}
        />

        <AuditStep 
          label="3. Session_Anchor" 
          status={state.handshakeComplete ? "ESTABLISHED" : state.error ? "FAILED" : "PENDING"} 
          isComplete={state.handshakeComplete}
          isError={!!state.error}
          colorClass="text-emerald-500"
          density={screenSize}
        />
      </div>
      
      {/* 📊 PROGRESS VECTOR: Compressed h-1.5 */}
      <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-8 border border-white/5">
        <div 
          className={cn(
            "h-full transition-all duration-[1500ms] ease-out",
            state.error ? "bg-rose-500" : state.handshakeComplete ? "bg-emerald-500" : "bg-amber-500"
          )} 
          style={{ width: state.handshakeComplete ? '100%' : state.isVerifying ? '66%' : state.hasToken ? '33%' : '2%' }}
        />
      </div>
    </div>
  );
}

/** 🛠️ HELPER: ATOMIC AUDIT STEP (Compressed) */
function AuditStep({ label, status, isComplete, isLoading, isError, colorClass, density }: any) {
  const isXS = density === 'xs';
  
  return (
    <div className="flex items-center justify-between leading-none">
      <span className={cn(
        "font-black uppercase tracking-[0.2em] italic transition-all",
        isXS ? "text-[8px]" : "text-[10px]",
        isComplete || isLoading ? "text-foreground" : "text-muted-foreground/10"
      )}>
        {label}
      </span>
      
      <div className="flex items-center gap-3">
        <span className={cn(
          "font-black italic tracking-[0.2em] transition-colors",
          isXS ? "text-[7.5px]" : "text-[9px]",
          isError ? "text-rose-500" : isComplete ? colorClass : isLoading ? "text-amber-500 animate-pulse" : "text-white/5"
        )}>
          {status}
        </span>
        
        <div className={cn(
          "rounded-lg border flex items-center justify-center transition-all",
          isXS ? "size-6" : "size-7",
          isComplete ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/5"
        )}>
          {isLoading ? (
            <Loader2 className="size-3 animate-spin text-amber-500" />
          ) : isComplete ? (
            <CheckCircle2 className={cn("size-3", colorClass)} />
          ) : isError ? (
            <ShieldAlert className="size-3 text-rose-500" />
          ) : (
            <Circle className="size-3 text-white/5" />
          )}
        </div>
      </div>
    </div>
  );
}