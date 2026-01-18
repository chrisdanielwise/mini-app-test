"use client";

import * as React from "react";
import { UserCog, ShieldAlert, LogOut, Terminal, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";

/**
 * 🛰️ STAFF_IDENTITY_SWAP (Institutional v16.16.85)
 * Strategy: Session Tunneling & Visual Lockdown.
 * Mission: Allow high-level admins to impersonate merchant nodes for auditing.
 */
export function StaffIdentitySwap({ isImpersonating, originalAdminName, targetMerchantName }: any) {
  const { impact, notification } = useHaptics();
  const { sendSignal } = useGlobalSignal();

  // 🛡️ SECURITY_SIGNAL: Alerts the global ledger of an identity shift
  React.useEffect(() => {
    if (isImpersonating) {
      sendSignal(
        "Identity_Tunnel_Active",
        `Admin [${originalAdminName}] is currently viewing node [${targetMerchantName}]`,
        "WARN"
      );
    }
  }, [isImpersonating, originalAdminName, targetMerchantName, sendSignal]);

  if (!isImpersonating) return null;

  const handleExitTunnel = async () => {
    impact("heavy");
    notification("success");
    
    // Logic: Invalidate impersonation cookie and restore admin session
    toast.info("RESTORING_ADMIN_IDENTITY", {
      description: "Closing terminal tunnel and purging cache."
    });
    
    window.location.href = "/api/auth/impersonate/exit";
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-in slide-in-from-top duration-500">
      {/* ⚠️ TACTICAL TUNNEL BANNER */}
      <div className="bg-amber-500 text-black px-4 py-2 flex items-center justify-between shadow-[0_4px_20px_rgba(245,158,11,0.3)]">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <ShieldAlert className="size-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase italic tracking-tighter">Impersonation_Active</span>
          </div>
          
          <div className="h-4 w-px bg-black/10 shrink-0" />
          
          <div className="flex items-center gap-2 truncate">
            <Users className="size-3.5 opacity-60" />
            <p className="text-[9px] font-bold uppercase tracking-tight truncate">
              Viewing as: <span className="italic font-black">{targetMerchantName}</span>
            </p>
          </div>
        </div>

        <button 
          onClick={handleExitTunnel}
          className="ml-4 px-3 py-1 bg-black text-amber-500 rounded-lg text-[9px] font-black uppercase italic tracking-widest hover:bg-black/80 transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <LogOut className="size-3" />
          Exit
        </button>
      </div>

      {/* 🌫️ TUNNEL_GLOW: Ambient indicator that the UI is in a mirrored state */}
      <div className="absolute top-full left-0 right-0 h-px bg-amber-500/50 shadow-[0_0_15px_#f59e0b]" />
    </div>
  );
}