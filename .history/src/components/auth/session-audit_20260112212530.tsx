"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies"; // Optional: or use document.cookie
import { CheckCircle2, Circle, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { JWT_CONFIG } from "@/lib/auth/config";

interface AuditState {
  hasToken: boolean;
  hasCookie: boolean;
  isVerifying: boolean;
}

export function SessionAudit({ token }: { token: string | null }) {
  const [state, setState] = useState<AuditState>({
    hasToken: !!token,
    hasCookie: false,
    isVerifying: !!token,
  });

  useEffect(() => {
    const checkSession = () => {
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);

      const hasCookie = !!cookies[JWT_CONFIG.cookieName];
      
      setState((prev) => ({
        ...prev,
        hasCookie,
        isVerifying: !!token && !hasCookie,
      }));
    };

    // Initial check
    checkSession();
    
    // Poll for cookie changes during exchange
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="w-full mt-6 p-4 rounded-xl border border-white/5 bg-black/20 backdrop-blur-md space-y-3">
      <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
        Terminal_Audit_Protocol
      </h3>

      <div className="space-y-2">
        {/* Step 1: Telegram Ingress */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            1. Telegram_Identity
          </span>
          {state.hasToken ? (
            <div className="flex items-center gap-2 text-amber-500">
              <span className="text-[8px] font-black italic">DETECTED</span>
              <CheckCircle2 className="h-3 w-3" />
            </div>
          ) : (
            <Circle className="h-3 w-3 text-white/10" />
          )}
        </div>

        {/* Step 2: Cryptographic Exchange */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            2. Handshake_Status
          </span>
          {state.isVerifying ? (
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <span className="text-[8px] font-black italic">EXCHANGING</span>
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          ) : state.hasCookie ? (
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="text-[8px] font-black italic">COMPLETE</span>
              <CheckCircle2 className="h-3 w-3" />
            </div>
          ) : (
            <Circle className="h-3 w-3 text-white/10" />
          )}
        </div>

        {/* Step 3: Local Storage Commit */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            3. Session_Commit
          </span>
          {state.hasCookie ? (
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="text-[8px] font-black italic">COMMITTED</span>
              <CheckCircle2 className="h-3 w-3" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white/20 italic">
              <span className="text-[8px] font-black">PENDING</span>
              <Circle className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}