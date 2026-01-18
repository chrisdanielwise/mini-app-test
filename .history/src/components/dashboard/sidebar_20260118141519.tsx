"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Zap, Crown, LogOut, Loader2, Activity, Cpu, ShieldCheck, Terminal 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";

export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const role = (context?.role || "merchant").toLowerCase();
  const themeAmber = flavor === "AMBER";
  const config = context?.config || {};
  const displayName = config?.companyName || (themeAmber ? "PLATFORM_ROOT" : "INITIALIZING...");
  const nodeStatus = themeAmber ? role.replace("_", " ") : (config?.planStatus || "Starter");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    impact("heavy");
    const toastId = toast.loading("De-provisioning Identity Node...");
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("TERMINATION_FAILED");
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

  if (!isReady) return <div className="flex-1 bg-black animate-pulse" />;

  return (
    // 🛡️ REMOVED: 'fixed', 'isOpen', and 'MOBILE_TOGGLE_TRIGGER'.
    // This is now a clean container that sits perfectly inside the Sheet.
    <aside
      className={cn(
        "flex flex-col w-full h-full overflow-hidden transition-all duration-500",
        themeAmber ? "bg-[#050300]" : "bg-zinc-950"
      )}
    >
      {/* --- IDENTITY NODE --- */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 shrink-0 bg-white/[0.01] h-14 md:h-16 leading-none">
        <div className={cn(
          "size-8 flex items-center justify-center rounded-lg",
          themeAmber ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
        )}>
          {role === "super_admin" ? <Crown className="size-4" /> : <Zap className="size-4 fill-current" />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-black text-[10px] uppercase tracking-tighter text-foreground truncate italic">
            {displayName}
          </span>
          <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-20">Secure Node</span>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 space-y-0.5 p-4 overflow-y-auto scrollbar-hide overscroll-contain">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={() => impact("light")}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                isActive ? (themeAmber ? "bg-amber-500/10 text-amber-500" : "bg-white/[0.04] text-primary") : "text-muted-foreground/20 hover:bg-white/[0.02] hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-3.5 shrink-0", isActive && "animate-pulse")} />
              <span className="text-[9px] font-black uppercase tracking-[0.15em] italic">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- SYSTEM HUD --- */}
      <div
        className="p-5 border-t border-white/5 bg-white/[0.01] space-y-3"
        // 🏁 THE BASELINE: Uses safeArea.bottom to clear the home indicator
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.25rem" }}
      >
        <div className={cn("rounded-xl border p-3", themeAmber ? "border-amber-500/10" : "border-white/5")}>
          <p className="text-[7px] font-black uppercase tracking-[0.3em] opacity-20 italic mb-2">Status_Report</p>
          <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] italic", themeAmber ? "text-amber-500/60" : "text-primary/60")}>
            {nodeStatus}
          </p>
        </div>

        <button onClick={handleLogout} className="w-full h-10 flex items-center justify-between px-3 rounded-lg border border-rose-500/10 text-rose-500/60 text-[8px] font-black uppercase tracking-[0.2em] italic">
          <span>Disconnect_Node</span>
          <LogOut className="size-3 opacity-20" />
        </button>
      </div>
    </aside>
  );
}