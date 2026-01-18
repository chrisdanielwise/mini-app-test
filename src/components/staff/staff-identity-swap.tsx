"use client";

import * as React from "react";
import { 
  ShieldAlert, 
  LogOut, 
  Users, 
  ArrowRightLeft,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";

interface StaffIdentitySwapProps {
  isImpersonating: boolean;
  originalAdminName?: string;
  targetMerchantName?: string;
}

/**
 * 🛰️ STAFF_IDENTITY_SWAP (Institutional v16.40.15)
 * Strategy: Session Tunneling & Persistent Notch-Sentinel.
 * Mission: Secure identity mirroring with global signal broadcast.
 */
export function StaffIdentitySwap({ 
  isImpersonating, 
  originalAdminName, 
  targetMerchantName 
}: StaffIdentitySwapProps) {
  const { impact, notification } = useHaptics();
  const { isMobile, safeArea } = useDeviceContext();
  const { sendSignal } = useGlobalSignal();

  // 🛡️ SECURITY_SIGNAL: Broadcasts identity shift to the global ledger
  React.useEffect(() => {
    if (isImpersonating) {
      sendSignal(
        "Identity_Tunnel_Active",
        `Operator [${originalAdminName}] in node [${targetMerchantName}]`,
        "WARN"
      );
    }
  }, [isImpersonating, originalAdminName, targetMerchantName, sendSignal]);

  // 🛡️ SECURITY_EXIT: Terminate mirror session and restore admin state
  const handleExitTunnel = async () => {
    impact("heavy");
    notification("success");
    
    toast.info("TERMINATING_TUNNEL", {
      description: "Restoring admin identity and purging session cache.",
      icon: <Activity className="size-4 animate-spin" />
    });
    
    // Logic: Invalidate impersonation node and return to staff hub
    window.location.href = "/api/auth/impersonate/exit";
  };

  if (!isImpersonating) return null;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-[250] bg-amber-500 text-black px-4 shadow-[0_4px_30px_rgba(245,158,11,0.4)] transition-all duration-700 animate-in slide-in-from-top",
        isMobile ? "h-11" : "h-12"
      )}
      style={{ paddingTop: isMobile ? safeArea.top : 0 }}
    >
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* --- 🛡️ TUNNEL TELEMETRY --- */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <ShieldAlert className="size-4 animate-pulse" />
            <h3 className="text-[10px] font-black uppercase italic tracking-tighter hidden sm:block">
              Impersonation_Active
            </h3>
          </div>
          
          <div className="h-4 w-px bg-black/20 shrink-0" />
          
          <div className="flex items-center gap-2 truncate">
            <Users className="size-3.5 opacity-60 shrink-0" />
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight truncate">
              <span className="opacity-70">{originalAdminName || "ADMIN"}</span>
              <ArrowRightLeft className="size-3 opacity-40 shrink-0" />
              <span className="font-black italic truncate">{targetMerchantName || "TARGET_NODE"}</span>
            </div>
          </div>
        </div>

        {/* --- 🕹️ EXIT HANDSHAKE --- */}
        <button 
          onClick={handleExitTunnel}
          className="ml-4 px-3 py-1 bg-black text-amber-500 rounded-lg text-[9px] font-black uppercase italic tracking-widest hover:bg-black/80 transition-all active:scale-95 flex items-center gap-2 shrink-0 shadow-lg border border-black/5"
        >
          <LogOut className="size-3" />
          <span className="hidden xs:block">Exit_Tunnel</span>
        </button>
      </div>

      {/* 🌫️ RADIANCE_INDICATOR: Visual leakage for the underlying chassis */}
      <div className="absolute inset-x-0 -bottom-px h-px bg-amber-500/50 shadow-[0_0_20px_#f59e0b]" />
    </div>
  );
}