"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Menu, X, Zap, Crown, Globe, 
  Terminal, LogOut, Loader2, Activity, Cpu, ShieldCheck 
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

  if (!isReady) return <aside className="hidden lg:flex w-[240px] flex-col bg-black h-screen border-r border-white/5 animate-pulse" />;

  return (
    <>
      {/* 📱 MOBILE TRIGGER */}
      <div className="lg:hidden fixed z-[100]" style={{ top: `calc(${safeArea.top}px + 1rem)`, left: '1rem' }}>
        <button 
          onClick={() => { impact("light"); setIsOpen(!isOpen); }} 
          className={cn(
            "size-12 backdrop-blur-3xl border rounded-xl shadow-2xl flex items-center justify-center transition-all active:scale-90",
            themeAmber ? "bg-amber-500/20 border-amber-500/40 text-amber-500" : "bg-primary/20 border-primary/40 text-primary"
          )}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:relative lg:translate-x-0 h-screen overflow-hidden",
          themeAmber ? "bg-[#0A0700] border-amber-500/20" : "bg-[#000502] border-primary/20",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* 🌫️ VAPOUR RADIANCE: Restored Atmosphere */}
        <div className={cn(
          "absolute -left-20 -top-20 size-60 blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000",
          themeAmber ? "bg-amber-500" : "bg-primary"
        )} />

        {/* --- IDENTITY NODE --- */}
        <div 
          className="flex items-center gap-4 border-b border-white/5 px-6 shrink-0 relative z-10 bg-white/[0.01]"
          style={{ height: '70px', paddingTop: isMobile ? `${safeArea.top}px` : '0px' }}
        >
          <div className={cn(
            "size-9 shrink-0 flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-700",
            themeAmber ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-black shadow-primary/20"
          )}>
            {role === 'super_admin' ? <Crown className="size-5" /> : <Zap className="size-5 fill-current" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn("font-black tracking-[0.5em] uppercase text-[8px] italic leading-none", themeAmber ? "text-amber-500" : "text-primary")}>
              V16.31
            </span>
            <span className="font-black text-[11px] uppercase tracking-tighter text-foreground truncate mt-1 leading-none italic">
              {displayName}
            </span>
          </div>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto scrollbar-hide relative z-10">
          <div className="flex items-center gap-3 mb-6 px-3 opacity-40 italic">
            <Cpu className={cn("size-3", themeAmber ? "text-amber-500" : "text-primary")} />
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">Node_Vector</p>
          </div>

          {filteredNav.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => impact("light")}
                className={cn(
                  "group relative flex items-center gap-4 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all duration-500",
                  isActive 
                    ? (themeAmber ? "bg-amber-500/20 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-primary/20 text-primary shadow-[0_0_20px_rgba(16,185,129,0.1)]") 
                    : "text-muted-foreground/40 hover:bg-white/[0.03] hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "size-4 shrink-0 transition-all duration-700 group-hover:scale-110",
                  isActive && "animate-pulse"
                )} />
                <span className="truncate italic">{item.name}</span>
                
                {isActive && (
                  <div className={cn(
                    "absolute left-0 w-1 h-5 rounded-full",
                    themeAmber ? "bg-amber-500" : "bg-primary"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* --- SYSTEM HUD --- */}
        <div 
          className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4 relative z-10"
          style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1.5rem)` : '1.5rem' }}
        >
          <div className={cn(
            "rounded-2xl border p-4 transition-all duration-1000",
            themeAmber ? "bg-amber-500/[0.05] border-amber-500/20 shadow-lg" : "bg-primary/[0.05] border-primary/20 shadow-lg"
          )}>
            <div className="flex items-center justify-between mb-3 opacity-40 italic">
               <div className="flex items-center gap-2">
                <ShieldCheck className={cn("size-3", themeAmber ? "text-amber-500" : "text-primary")} />
                <p className="text-[8px] font-black uppercase tracking-[0.3em]">Status</p>
               </div>
               <Activity className={cn("size-2 animate-pulse", themeAmber ? "text-amber-500" : "text-primary")} />
            </div>
            <p className={cn("text-[10px] font-black uppercase tracking-widest italic", themeAmber ? "text-amber-500" : "text-primary")}>
              {nodeStatus}
            </p>
          </div>

          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-12 flex items-center justify-between px-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95 group"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">Disconnect</span>
            {isLoggingOut ? <Loader2 className="size-3 animate-spin" /> : <LogOut className="size-3 opacity-40 group-hover:opacity-100 transition-all" />}
          </button>
        </div>
      </aside>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl lg:hidden animate-in fade-in duration-1000" 
        />
      )}
    </>
  );
}