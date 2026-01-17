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
 * 🌊 FLUID_SESSION_AUDIT (Institutional Apex v16.16.30)
 * Priority: Morphology-Aware Handshake HUD.
 * Design: Kinetic Water-Flow Progress with Hardware-Clamped viewports.
 */
export function SessionAudit({ token }: { token: string | null }) {
  const auth = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming full hardware spectrum
  const { 
    isReady, 
    screenSize, 
    isMobile, 
    viewportWidth,
    safeArea 
  } = useDeviceContext();
  
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

  if (!isReady) return <div className="w-full h-48 animate-pulse bg-card/20 rounded-[2.5rem]" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Mapping hardware tiers to visual density.
   */
  const isLarge = screenSize === 'xl' || screenSize === 'xxl';
  const containerPadding = screenSize === 'xs' ? "p-6" : isLarge ? "p-12" : "p-10";
  const stepGap = isLarge ? "gap-12" : "gap-6";
  const labelSize = screenSize === 'xs' ? "text-[9px]" : "text-[11px]";

  return (
    <div className={cn(
      "w-full mt-10 shadow-apex relative overflow-hidden group transition-all duration-1000",
      "bg-card/40 backdrop-blur-3xl border border-white/5",
      "rounded-[2.5rem] md:rounded-[3.5rem]",
      containerPadding
    )}>
      
      {/* 🌊 KINETIC SCANNER: Speed adapts to Viewport Width */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.08)_50%,transparent_100%)] bg-[length:100%_60px] pointer-events-none z-0"
        style={{ 
          animation: `scan ${viewportWidth > 1200 ? '6s' : '4s'} linear infinite` 
        }} 
      />

      {/* --- HUD HEADER --- */}
      <div className="flex items-center justify-between relative z-10 mb-8">
        <div className="flex items-center gap-4 italic">
          <Activity className={cn(
            "size-3.5 animate-pulse transition-colors duration-700",
            state.error ? "text-rose-500" : "text-amber-500"
          )} />
          <h3 className={cn("font-black uppercase tracking-[0.5em] text-foreground/40 italic leading-none", labelSize)}>
            Node_Protocol_Audit
          </h3>
        </div>
        
        {!isMobile && (
          <div className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">
            Hardware_Tier: {screenSize.toUpperCase()} // Stable
          </div>
        )}
      </div>

      {/* --- PROTOCOL STEPS: Multi-tier Layout --- */}
      <div className={cn(
        "relative z-10",
        isLarge ? "grid grid-cols-3 gap-8" : "space-y-6"
      )}>
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
      
      {/* 🚀 PROGRESS VECTOR: Fluid easing based on hardware tier */}
      <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden mt-10">
        <div 
          className={cn(
            "h-full transition-all duration-[2500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            state.error ? "bg-rose-500 shadow-apex" : state.handshakeComplete ? "bg-emerald-500 shadow-apex" : "bg-amber-500"
          )} 
          style={{ width: state.handshakeComplete ? '100%' : state.isVerifying ? '66%' : state.hasToken ? '33%' : '2%' }}
        />
      </div>
    </div>
  );
}

/** 🛠️ HELPER: ATOMIC AUDIT STEP (Fluid) */
function AuditStep({ label, status, isComplete, isLoading, isError, colorClass, density }: any) {
  const isXS = density === 'xs';
  
  return (
    <div className={cn(
      "flex items-center justify-between transition-all duration-700",
      density === 'xl' || density === 'xxl' ? "flex-col items-start gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5" : ""
    )}>
      <span className={cn(
        "font-black uppercase tracking-[0.3em] italic leading-none transition-all duration-1000",
        isXS ? "text-[9px]" : "text-[11px]",
        isComplete || isLoading ? "text-foreground" : "text-muted-foreground/10"
      )}>
        {label}
      </span>
      
      <div className={cn("flex items-center gap-4", isXS ? "gap-2" : "gap-4")}>
        <span className={cn(
          "font-black italic tracking-[0.2em] transition-colors duration-1000",
          isXS ? "text-[8px]" : "text-[10px]",
          isError ? "text-rose-500" : isComplete ? colorClass : isLoading ? "text-amber-500 animate-pulse" : "text-white/5"
        )}>
          {status}
        </span>
        
        <div className={cn(
          "rounded-xl border flex items-center justify-center transition-all duration-1000",
          isXS ? "size-6" : "size-8",
          isComplete ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/5"
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