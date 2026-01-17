"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Menu, X, Zap, Crown, Globe, 
  Terminal, LogOut, Loader2, Activity, Cpu 
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
  
  // 🛰️ DEVICE INGRESS: Recalibrated for Tactical Width
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 🛡️ ROLE PROTOCOL
  const role = (context?.role || "merchant").toLowerCase(); 
  const isPlatformStaff = flavor === "AMBER";
  const themeAmber = flavor === "AMBER";

  const config = context?.config || {};
  const displayName = config?.companyName || (isPlatformStaff ? "PLATFORM_ROOT" : "INITIALIZING...");
  const nodeStatus = isPlatformStaff ? role.replace('_', ' ') : (config?.planStatus || "Starter");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    impact("heavy");
    const toastId = toast.loading("De-provisioning Node...");

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      notification("success");
      window.location.href = "/dashboard/login";
    } catch (err) {
      toast.error("Wipe Failed", { id: toastId });
      setIsLoggingOut(false);
    }
  };

  const filteredNav = NAVIGATION_CONFIG.filter(item => item.roles.includes(role));

  if (!isReady) return <aside className="hidden lg:flex w-[240px] flex-col bg-black h-screen border-r border-white/5 animate-pulse" />;

  return (
    <>
      {/* 📱 MOBILE HUD TRIGGER: Tactical Precision */}
      <div 
        className="lg:hidden fixed z-[100] transition-all duration-700" 
        style={{ top: `calc(${safeArea.top}px + 1rem)`, left: '1rem' }}
      >
        <button 
          onClick={() => { impact("light"); setIsOpen(!isOpen); }} 
          className={cn(
            "size-12 backdrop-blur-3xl border rounded-xl shadow-apex flex items-center justify-center transition-all active:scale-90",
            themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-black/80 border-white/10 text-primary"
          )}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none h-screen overflow-hidden",
          themeAmber ? "bg-[#0A0700] border-amber-500/10" : "bg-[#050505] border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* --- TACTICAL BRANDING --- */}
        <div 
          className="flex items-center gap-4 border-b border-white/5 px-6 shrink-0 relative z-10 bg-white/[0.01]"
          style={{ height: '70px', paddingTop: isMobile ? `${safeArea.top}px` : '0px' }}
        >
          <div className={cn(
            "size-8 shrink-0 flex items-center justify-center rounded-lg shadow-inner transition-transform duration-1000 hover:rotate-6",
            themeAmber ? "bg-amber-500 text-black" : "bg-primary text-black"
          )}>
            {role === 'super_admin' ? <Crown className="size-4" /> : <Zap className="size-4 fill-current" />}
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

        {/* --- NAVIGATION LEDGER --- */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto scrollbar-hide relative z-10">
          <div className="flex items-center gap-3 mb-6 px-3 opacity-10 italic">
            <Cpu className="size-3" />
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
                    ? (themeAmber ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary") 
                    : "text-muted-foreground/30 hover:bg-white/[0.03] hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "size-4 shrink-0 transition-all duration-700 group-hover:scale-110",
                  isActive && "animate-pulse"
                )} />
                <span className="truncate italic">{item.name}</span>
                
                {isActive && (
                  <div className={cn(
                    "absolute left-0 w-1 h-4 rounded-full",
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
          style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : '1.5rem' }}
        >
          <div className={cn(
            "rounded-2xl border p-4 transition-all duration-1000",
            themeAmber ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-white/[0.02] border-white/5"
          )}>
            <div className="flex items-center justify-between mb-3 opacity-20 italic">
               <div className="flex items-center gap-2">
                <ShieldCheck className={cn("size-3", themeAmber ? "text-amber-500" : "text-primary")} />
                <p className="text-[8px] font-black uppercase tracking-[0.3em]">Status</p>
               </div>
               <Activity className="size-2 animate-pulse" />
            </div>
            <p className={cn("text-[10px] font-black uppercase tracking-widest italic", themeAmber ? "text-amber-500" : "text-foreground/60")}>
              {nodeStatus}
            </p>
          </div>

          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-12 flex items-center justify-between px-4 rounded-xl border border-white/5 bg-white/[0.02] text-muted-foreground/40 hover:text-destructive hover:border-destructive/20 hover:bg-destructive/5 transition-all active:scale-95 group"
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