"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Menu, X, Zap, Crown, Globe, 
  Terminal, LogOut, Loader2, Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";

export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware physics integration
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOpen(false);
  }, [pathname]);

  // 🛡️ ROLE NORMALIZATION
  const role = (context?.role || "merchant").toLowerCase(); 
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  const themeAmber = flavor === "AMBER";

  const config = context?.config || {};
  const displayName = config?.companyName || (isPlatformStaff ? "PLATFORM_ROOT" : "INITIALIZING...");
  const nodeStatus = isPlatformStaff ? role.replace('_', ' ') : (config?.planStatus || "Starter");

  /**
   * 🧹 ATOMIC_DISCONNECT_PROTOCOL
   * Logic: Broadcasts a termination pulse to close all open socket clusters.
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    impact("heavy");
    const toastId = toast.loading("De-provisioning Identity Node...");

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("TERMINATION_SEQUENCE_FAILED");

      const authChannel = new BroadcastChannel("zipha_auth_sync");
      authChannel.postMessage({ action: "TERMINATE_SESSION", timestamp: Date.now() });
      authChannel.close();

      notification("success");
      toast.success("Node Disconnected", { id: toastId });
      window.location.href = "/dashboard/login";
    } catch (err) {
      notification("error");
      toast.error("Wipe Failed", { id: toastId });
      setIsLoggingOut(false);
    }
  };

  const filteredNav = NAVIGATION_CONFIG.filter(item => item.roles.includes(role));

  if (!mounted || !isReady) {
    return <aside className="hidden lg:flex w-80 flex-col bg-card/20 animate-pulse border-r border-white/5" />;
  }

  return (
    <>
      {/* 📱 MOBILE TRIGGER HUB: Positioned via Hardware Safe-Area */}
      <div 
        className="lg:hidden fixed z-[100]" 
        style={{ top: `calc(${safeArea.top}px + 1rem)`, left: '1.25rem' }}
      >
        <button 
          onClick={() => { impact("light"); setIsOpen(!isOpen); }} 
          className={cn(
            "size-14 backdrop-blur-3xl border rounded-2xl shadow-apex transition-all active:scale-75 flex items-center justify-center",
            themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-card/90 border-white/10 text-primary"
          )}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:relative lg:translate-x-0 shadow-apex lg:shadow-none",
          themeAmber ? "bg-amber-500/[0.04] border-amber-500/10" : "bg-card/30 border-white/5 backdrop-blur-3xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* 🌫️ SUBSURFACE RADIANCE: Ambient Aura */}
        <div className={cn(
          "absolute -left-20 -top-20 size-60 blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000",
          themeAmber ? "bg-amber-500" : "bg-primary"
        )} />

        {/* --- IDENTITY NODE --- */}
        <div 
          className="flex items-center gap-5 border-b border-white/5 px-8 shrink-0 relative z-10 bg-white/[0.01]"
          style={{ height: isMobile ? '7rem' : '8rem', paddingTop: isMobile ? `${safeArea.top}px` : '0px' }}
        >
          <div className={cn(
            "size-14 shrink-0 flex items-center justify-center rounded-[1.4rem] shadow-apex transition-all duration-1000 hover:rotate-12",
            themeAmber ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}>
            {role === 'super_admin' ? <Crown className="size-7" /> : <Zap className="size-7 fill-current" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn("font-black tracking-[0.4em] uppercase text-[10px] italic leading-none", themeAmber ? "text-amber-500" : "text-primary")}>
              TERMINAL_v16
            </span>
            <span className="font-black text-[11px] uppercase tracking-tighter text-foreground truncate mt-2 leading-none italic">
              {displayName}
            </span>
          </div>
        </div>

        {/* --- NAVIGATION LEDGER: Laminar Flow --- */}
        <nav className="flex-1 space-y-3 p-6 overflow-y-auto scrollbar-hide relative z-10">
          <div className="flex items-center justify-between mb-8 px-4 opacity-20 italic">
            <div className="flex items-center gap-3">
              {themeAmber ? <Globe className="size-4 text-amber-500" /> : <Terminal className="size-4 text-primary" />}
              <p className="text-[9px] font-black uppercase tracking-[0.5em]">
                {themeAmber ? "Platform_Core" : "Node_Vector"}
              </p>
            </div>
            <Activity className="size-3 animate-pulse" />
          </div>

          {filteredNav.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => impact("light")}
                style={{ animationDelay: `${i * 50}ms` }}
                className={cn(
                  "group relative flex items-center gap-5 rounded-3xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 animate-in fade-in slide-in-from-left-4",
                  isActive 
                    ? (themeAmber ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary") 
                    : "text-muted-foreground/30 hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="size-5 shrink-0 transition-transform duration-700 group-hover:scale-125 group-active:scale-90" />
                <span className="truncate italic tracking-widest">{item.name}</span>
                
                {/* Vapour Highlight */}
                {isActive && (
                  <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl opacity-20 animate-pulse pointer-events-none" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* --- SYSTEM STATUS & DISCONNECT --- */}
        <div 
          className="p-8 border-t border-white/5 bg-white/[0.01] space-y-5 relative z-10"
          style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : '2rem' }}
        >
          <div className={cn(
            "rounded-[2rem] border p-6 transition-all duration-1000",
            themeAmber ? "bg-amber-500/[0.03] border-amber-500/20 shadow-inner" : "bg-white/[0.02] border-white/5 shadow-inner"
          )}>
            <div className="flex items-center justify-between mb-4 opacity-20 italic">
               <div className="flex items-center gap-3">
                <Zap className={cn("size-3", themeAmber ? "text-amber-500" : "text-primary")} />
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Clearance</p>
               </div>
               <span className="text-[7px] font-mono">[STABLE]</span>
            </div>
            <p className={cn("text-[11px] font-black uppercase tracking-[0.3em] italic", themeAmber ? "text-amber-500" : "text-foreground")}>
              {nodeStatus}
            </p>
          </div>

          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-16 flex items-center justify-between px-6 rounded-[1.8rem] border border-destructive/10 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all active:scale-95 group"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Disconnect_Node</span>
            {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-700" />}
          </button>
        </div>
      </aside>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-2xl lg:hidden animate-in fade-in duration-1000" 
        />
      )}
    </>
  );
}