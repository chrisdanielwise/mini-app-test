"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2, ShieldAlert, Activity } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

interface AuditState {
  hasToken: boolean;
  handshakeComplete: boolean;
  isVerifying: boolean;
  error: string | null;
}

/**
 * 🛰️ SESSION AUDIT PROTOCOL (Institutional v13.1.8)
 * Logic: Visualizes the Handshake between Identity Providers and the Database Node.
 * Hardened: Reactive to HttpOnly session anchoring.
 */
export function SessionAudit({ token }: { token: string | null }) {
  const auth = useAuth();
  
  const [state, setState] = useState<AuditState>({
    hasToken: !!token,
    handshakeComplete: auth.isAuthenticated,
    isVerifying: !!token && !auth.isAuthenticated,
    error: null
  });

  useEffect(() => {
    // 🕵️ MONITORING LOGIC
    // We observe the sliding auth state to move through the protocol stages.
    setState((prev) => ({
      ...prev,
      hasToken: !!token,
      handshakeComplete: auth.isAuthenticated,
      isVerifying: auth.isLoading || (!!token && !auth.isAuthenticated),
      error: auth.error
    }));
  }, [token, auth.isAuthenticated, auth.isLoading, auth.error]);

  return (
    <div className="w-full mt-8 p-6 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-2xl space-y-5 shadow-2xl relative overflow-hidden group">
      {/* HUD Scanner Line */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.03)_50%,transparent_100%)] bg-[length:100%_10px] animate-[scan_3s_linear_infinite] pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-amber-500 animate-pulse" />
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/70">
            Node_Protocol_Audit
          </h3>
        </div>
        {state.error && (
          <span className="text-[8px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 animate-pulse">
            FAULT_DETECTED
          </span>
        )}
      </div>

      <div className="space-y-4 relative z-10">
        {/* Step 1: Identity Ingress */}
        <AuditStep 
          label="1. Identity_Ingress" 
          status={state.hasToken ? "RESOLVED" : "PENDING"} 
          isComplete={state.hasToken}
          colorClass="text-amber-500"
        />

        {/* Step 2: Cryptographic Handshake */}
        <AuditStep 
          label="2. Handshake_Sync" 
          status={state.isVerifying ? "VALIDATING" : state.handshakeComplete ? "SECURE" : "PENDING"} 
          isComplete={state.handshakeComplete}
          isLoading={state.isVerifying}
          colorClass="text-emerald-500"
        />

        {/* Step 3: Session Anchor */}
        <AuditStep 
          label="3. Session_Anchor" 
          status={state.handshakeComplete ? "ESTABLISHED" : state.error ? "FAILED" : "PENDING"} 
          isComplete={state.handshakeComplete}
          isError={!!state.error}
          colorClass="text-emerald-500"
        />
      </div>
      
      {/* Institutional Progress Bar */}
      <div className="relative h-[3px] w-full bg-white/5 rounded-full overflow-hidden mt-6">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(245,158,11,0.5)]",
            state.error ? "bg-rose-500 shadow-rose-500/50" : "bg-amber-500"
          )} 
          style={{ width: state.handshakeComplete ? '100%' : state.isVerifying ? '66%' : state.hasToken ? '33%' : '2%' }}
        />
      </div>
    </div>
  );
}

/**
 * 🛠️ SUB-COMPONENT: AUDIT STEP
 */
function AuditStep({ 
  label, 
  status, 
  isComplete, 
  isLoading, 
  isError, 
  colorClass 
}: { 
  label: string; 
  status: string; 
  isComplete: boolean; 
  isLoading?: boolean; 
  isError?: boolean;
  colorClass: string;
}) {
  return (
    <div className="flex items-center justify-between group">
      <span className={cn(
        "text-[10px] font-bold transition-all uppercase tracking-widest italic",
        isComplete || isLoading ? "text-foreground" : "text-muted-foreground opacity-30"
      )}>
        {label}
      </span>
      
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-[8px] font-black italic tracking-widest",
          isError ? "text-rose-500" : isComplete ? colorClass : isLoading ? "text-amber-500 animate-pulse" : "text-white/10"
        )}>
          {status}
        </span>
        
        {isLoading ? (
          <Loader2 className="h-3 w-3 text-amber-500 animate-spin" />
        ) : isComplete ? (
          <CheckCircle2 className={cn("h-3 w-3", colorClass)} />
        ) : isError ? (
          <ShieldAlert className="h-3 w-3 text-rose-500" />
        ) : (
          <Circle className="h-3 w-3 text-white/5" />
        )}
      </div>
    </div>
  );
}