"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { JWT_CONFIG } from "@/lib/auth/config";

interface AuditState {
  hasToken: boolean;
  handshakeComplete: boolean;
  isVerifying: boolean;
  error: string | null;
}

/**
 * 🛰️ SESSION AUDIT PROTOCOL (Institutional v13.1.8)
 * Logic: Visualizes the Handshake between Telegram and the Neon Database.
 * Security: Optimized for HttpOnly - checks internal Auth State instead of JS Cookies.
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
    // Since we use HttpOnly, we can't see the cookie. 
    // Instead, we watch the 'isAuthenticated' state from our Auth Provider.
    setState((prev) => ({
      ...prev,
      hasToken: !!token,
      handshakeComplete: auth.isAuthenticated,
      isVerifying: auth.isLoading || (!!token && !auth.isAuthenticated),
      error: auth.error
    }));
  }, [token, auth.isAuthenticated, auth.isLoading, auth.error]);

  return (
    <div className="w-full mt-6 p-5 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl space-y-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Protocol_Audit_Active
        </h3>
        {state.error && (
          <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
            SYNC_ERROR
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Step 1: Telegram Ingress */}
        <div className="flex items-center justify-between group">
          <span className="text-[10px] font-bold text-muted-foreground group-hover:text-white transition-colors uppercase tracking-widest">
            1. Identity_Node
          </span>
          {state.hasToken ? (
            <div className="flex items-center gap-2 text-amber-500">
              <span className="text-[8px] font-black italic">RESOLVED</span>
              <CheckCircle2 className="h-3 w-3" />
            </div>
          ) : (
            <Circle className="h-3 w-3 text-white/5" />
          )}
        </div>

        {/* Step 2: Cryptographic Handshake */}
        <div className="flex items-center justify-between group">
          <span className="text-[10px] font-bold text-muted-foreground group-hover:text-white transition-colors uppercase tracking-widest">
            2. Handshake_Sync
          </span>
          {state.isVerifying ? (
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <span className="text-[8px] font-black italic">VALIDATING</span>
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          ) : state.handshakeComplete ? (
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="text-[8px] font-black italic">VERIFIED</span>
              <CheckCircle2 className="h-3 w-3" />
            </div>
          ) : (
            <Circle className="h-3 w-3 text-white/5" />
          )}
        </div>

        {/* Step 3: Server Session Commit */}
        <div className="flex items-center justify-between group">
          <span className="text-[10px] font-bold text-muted-foreground group-hover:text-white transition-colors uppercase tracking-widest">
            3. Session_Anchor
          </span>
          {state.handshakeComplete ? (
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="text-[8px] font-black italic">ANCHORED</span>
              <CheckCircle2 className="h-3 w-3" />
            </div>
          ) : state.error ? (
            <div className="flex items-center gap-2 text-red-500">
              <span className="text-[8px] font-black italic">FAILED</span>
              <ShieldAlert className="h-3 w-3" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white/10">
              <span className="text-[8px] font-black italic">PENDING</span>
              <Circle className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
      
      {/* Visual Progress Bar */}
      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-700 ease-out" 
          style={{ width: state.handshakeComplete ? '100%' : state.isVerifying ? '66%' : state.hasToken ? '33%' : '0%' }}
        />
      </div>
    </div>
  );
}