"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Zap, 
  Crown, 
  LogOut, 
  Loader2, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Terminal 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";

/**
 * 🛰️ DASHBOARD_SIDEBAR (Institutional Apex v2026.1.18)
 * Strategy: Passive Viewport Ingress.
 * Fix: Removed internal mobile triggers and 'fixed' positioning to resolve 
 * competing geometry with the Shell-level Sheet.
 */
export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🛡️ ROLE_NORMALIZATION
  const role = (context?.role || "merchant").toLowerCase();
  const themeAmber = flavor === "AMBER";
  const config = context?.config || {};

  const displayName = config?.companyName || (themeAmber ? "PLATFORM_ROOT" : "INITIALIZING...");
  const nodeStatus = themeAmber ? role.replace("_", " ") : (config?.planStatus || "Starter");

  /**
   * 🧹 ATOMIC_LOGOUT_PROTOCOL
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    impact("heavy");
    const toastId = toast.loading("De-provisioning Identity Node...");

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("TERMINATION_FAILED");

      // 🛰️ CROSS-TAB SIGNAL BROADCAST
      const authChannel = new BroadcastChannel("zipha_auth_sync");
      authChannel.postMessage({ action: "TERMINATE_SESSION", timestamp: Date.now() });
      authChannel.close();

      notification("success");
      toast.success("Node Disconnected", { id: toastId });
      window.location.href = "/dashboard/login";
    } catch (err) {
      toast.error("Handshake Error", { id: toastId });
      setIsLoggingOut(false);
    }
  };

  const filteredNav = NAVIGATION_CONFIG.filter((item) => item.roles.includes(role));

  // 🛡️ HYDRATION_SHIELD: Prevents bogus layout snaps
  if (!isReady) return <div className="flex-1 bg-black animate-pulse" />;

  return (
    <aside
      className={cn(
        "flex flex-col w-full h-full overflow-hidden transition-all duration-500",
        themeAmber ? "bg-[#050300]" : "bg-zinc-950"
      )}
    >
      {/* --- IDENTITY NODE: Baseline height locked to h-14 --- */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 shrink-0 bg-white/[0.01] h-14 leading-none">
        <div className={cn(
          "size-8 shrink-0 flex items-center justify-center rounded-lg shadow-lg",
          themeAmber ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
        )}>
          {role === "super_admin" ? <Crown className="size-4" /> : <Zap className="size-4 fill-current" />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-black text-[10px] uppercase tracking-tighter text-foreground truncate italic">
            {displayName}
          </span>
          <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-20 italic">
            Node_v16.apex
          </span>
        </div>
      </div>

      {/* --- NAVIGATION: High-Density Scroll Reservoir --- */}
      <nav className="flex-1 space-y-0.5 p-4 overflow-y-auto scrollbar-hide overscroll-contain">
        <div className="flex items-center gap-2 mb-4 px-2 opacity-20 italic">
          <Cpu className={cn("size-2.5", themeAmber ? "text-amber-500" : "text-primary")} />
          <p className="text-[7px] font-black uppercase tracking-[0.4em]">Tactical_Vector</p>
        </div>

        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={() => impact("light")}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                isActive 
                  ? (themeAmber ? "bg-amber-500/10 text-amber-500" : "bg-white/[0.04] text-primary") 
                  : "text-muted-foreground/20 hover:bg-white/[0.02] hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-3.5 shrink-0", isActive && "animate-pulse")} />
              <span className="text-[9px] font-black uppercase tracking-[0.15em] italic truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- SYSTEM HUD: Synchronized with Mobile Safe Areas --- */}
      <div
        className="p-5 border-t border-white/5 bg-white/[0.01] space-y-3"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.25rem" }}
      >
        <div className={cn("rounded-xl border p-3", themeAmber ? "border-amber-500/10" : "border-white/5")}>
          <div className="flex items-center justify-between mb-2 opacity-10 italic">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={cn("size-2.5", themeAmber ? "text-amber-500" : "text-primary")} />
              <p className="text-[7px] font-black uppercase tracking-[0.2em]">Oversight_OK</p>
            </div>
            <Activity className={cn("size-2 animate-pulse", themeAmber ? "text-amber-500" : "text-primary")} />
          </div>
          <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] italic leading-none", themeAmber ? "text-amber-500/60" : "text-primary/60")}>
            {nodeStatus}
          </p>
        </div>

        <button 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className="w-full h-10 flex items-center justify-center gap-3 rounded-lg border border-rose-500/10 bg-rose-500/[0.02] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.25em] italic">Disconnect_Node</span>
          {isLoggingOut ? <Loader2 className="size-3 animate-spin" /> : <LogOut className="size-3" />}
        </button>
      </div>
    </aside>
  );
}