"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Menu, X, Zap, Crown, 
  LogOut, Loader2, Activity, Cpu, ShieldCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";

/**
 * 🛰️ DASHBOARD_SIDEBAR (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon Lock.
 * Fix: Standardized h-12/h-14 profile and tight py-2.5 nav items.
 */
export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const role = (context?.role || "merchant").toLowerCase(); 
  const isStaffFlavor = flavor === "AMBER";
  const themeAmber = flavor === "AMBER";

  const config = context?.config || {};
  const displayName = config?.companyName || (isStaffFlavor ? "PLATFORM_ROOT" : "INITIALIZING...");
  const nodeStatus = isStaffFlavor ? role.replace('_', ' ') : (config?.planStatus || "Starter");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    impact("heavy");
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      notification("success");
      window.location.href = "/dashboard/login";
    } catch (err) {
      toast.error("Wipe Failed");
      setIsLoggingOut(false);
    }
  };

  const filteredNav = NAVIGATION_CONFIG.filter(item => item.roles.includes(role));

  if (!isReady) return (
    <aside className="hidden lg:flex w-[240px] flex-col bg-black h-screen border-r border-white/5 animate-pulse" />
  );

  return (
    <>
      {/* 📱 MOBILE TRIGGER: Tactical Floating h-10 */}
      <div className="lg:hidden fixed z-[100]" style={{ top: `calc(${safeArea.top}px + 0.75rem)`, left: '0.75rem' }}>
        <button 
          onClick={() => { impact("light"); setIsOpen(!isOpen); }} 
          className={cn(
            "size-10 backdrop-blur-3xl border rounded-lg shadow-2xl flex items-center justify-center transition-all active:scale-90",
            themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}
        >
          {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r transition-all duration-700 ease-out lg:relative lg:translate-x-0 h-screen overflow-hidden",
          themeAmber ? "bg-[#050300] border-amber-500/10" : "bg-black border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* --- IDENTITY NODE: Compressed h-14 --- */}
        <div 
          className="flex items-center gap-3 border-b border-white/5 px-5 shrink-0 relative z-10 bg-white/[0.01] leading-none"
          style={{ height: '56px', paddingTop: isMobile ? `calc(${safeArea.top}px * 0.5)` : '0px' }}
        >
          <div className={cn(
            "size-8 shrink-0 flex items-center justify-center rounded-lg shadow-lg transition-all",
            themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            {role === 'super_admin' ? <Crown className="size-4" /> : <Zap className="size-4 fill-current" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn("font-black tracking-[0.2em] uppercase text-[7px] italic", themeAmber ? "text-amber-500/40" : "text-primary/40")}>
              NODE_v16
            </span>
            <span className="font-black text-[10px] uppercase tracking-tighter text-foreground truncate mt-1 italic">
              {displayName}
            </span>
          </div>
        </div>

        {/* --- NAVIGATION: High Density --- */}
        <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto scrollbar-hide relative z-10">
          <div className="flex items-center gap-2 mb-4 px-2 opacity-20 italic">
            <Cpu className={cn("size-2.5", themeAmber ? "text-amber-500" : "text-primary")} />
            <p className="text-[7.5px] font-black uppercase tracking-[0.3em]">Node_Vector</p>
          </div>

          {filteredNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => impact("light")}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all",
                  isActive 
                    ? (themeAmber ? "bg-amber-500/10 text-amber-500 shadow-sm" : "bg-white/[0.04] text-primary shadow-sm") 
                    : "text-muted-foreground/20 hover:bg-white/[0.02] hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "size-3.5 shrink-0 transition-transform group-hover:scale-110",
                  isActive && "animate-pulse"
                )} />
                <span className="truncate italic">{item.name}</span>
                
                {isActive && (
                  <div className={cn(
                    "absolute left-0 w-0.5 h-4 rounded-full",
                    themeAmber ? "bg-amber-500" : "bg-primary"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* --- SYSTEM HUD: Slim Protocol --- */}
        <div 
          className="p-4 border-t border-white/5 bg-white/[0.01] space-y-3 relative z-10"
          style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : '1.25rem' }}
        >
          <div className={cn(
            "rounded-xl border p-3 transition-all",
            themeAmber ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-white/[0.01] border-white/5"
          )}>
            <div className="flex items-center justify-between mb-2 opacity-10 italic">
               <div className="flex items-center gap-1.5">
                <ShieldCheck className={cn("size-2.5", themeAmber ? "text-amber-500" : "text-primary")} />
                <p className="text-[7px] font-black uppercase tracking-[0.2em]">Oversight</p>
               </div>
               <Activity className={cn("size-2 animate-pulse", themeAmber ? "text-amber-500" : "text-primary")} />
            </div>
            <p className={cn("text-[9px] font-black uppercase tracking-widest italic leading-none", themeAmber ? "text-amber-500/60" : "text-primary/60")}>
              {nodeStatus}
            </p>
          </div>

          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-10 flex items-center justify-between px-3 rounded-lg border border-rose-500/10 bg-rose-500/[0.02] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95 group"
          >
            <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">Disconnect</span>
            {isLoggingOut ? <Loader2 className="size-2.5 animate-spin" /> : <LogOut className="size-2.5 opacity-20 group-hover:opacity-100" />}
          </button>
        </div>
      </aside>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden" 
        />
      )}
    </>
  );
}