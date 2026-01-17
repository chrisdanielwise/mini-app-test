"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Menu, X, Zap, Crown, Globe, 
  Terminal, LogOut, Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { toast } from "sonner";

export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOpen(false);
  }, [pathname]);

  // 🛡️ ROLE NORMALIZATION
  const rawRole = context?.role || "merchant";
  const role = rawRole.toLowerCase(); 
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  const themeAmber = flavor === "AMBER";

  const config = context?.config || {};
  const displayName = config?.companyName || (isPlatformStaff ? "PLATFORM_ROOT" : "INITIALIZING...");
  const nodeStatus = isPlatformStaff ? role.replace('_', ' ') : (config?.planStatus || "Starter");

  /**
   * 🧹 ATOMIC LOGOUT PROTOCOL (v14.96.0)
   * Logic: Dispatches a Broadcast pulse to terminate all open socket clusters.
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    impact("heavy");
    const toastId = toast.loading("De-provisioning Identity Node...");

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("TERMINATION_SEQUENCE_FAILED");

      // 🛰️ CROSS-TAB SIGNAL BROADCAST
      const authChannel = new BroadcastChannel("zipha_auth_sync");
      authChannel.postMessage({ action: "TERMINATE_SESSION", timestamp: Date.now() });
      authChannel.close();

      notification("success");
      toast.success("Node Disconnected Successfully", { id: toastId });
      
      window.location.href = "/dashboard/login";
    } catch (err) {
      notification("error");
      toast.error("Handshake Error: Remote Wipe Failed", { id: toastId });
      setIsLoggingOut(false);
    }
  };

  const filteredNav = NAVIGATION_CONFIG.filter(item => item.roles.includes(role));

  if (!mounted) return <aside className="hidden lg:flex w-72 flex-col bg-background/50 border-r border-white/5" />;

  return (
    <>
      {/* 📱 MOBILE TRIGGER HUB */}
      <div className="lg:hidden fixed top-4 left-5 z-[100]">
        <button 
          onClick={() => { impact("light"); setIsOpen(!isOpen); }} 
          className={cn(
            "size-12 backdrop-blur-3xl border rounded-2xl shadow-2xl transition-all active:scale-90 flex items-center justify-center",
            themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-card/90 border-white/10 text-primary"
          )}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
        themeAmber ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-card/40 border-white/5 backdrop-blur-3xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* --- IDENTITY NODE --- */}
        <div className="flex h-22 items-center gap-4 border-b border-white/5 px-8 shrink-0 bg-white/[0.02]">
          <div className={cn(
            "size-12 shrink-0 flex items-center justify-center rounded-2xl shadow-2xl transition-transform duration-700 hover:rotate-12",
            themeAmber ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}>
            {role === 'super_admin' ? <Crown className="size-6" /> : <Zap className="size-6 fill-current" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn("font-black tracking-[0.2em] uppercase text-[10px] italic", themeAmber ? "text-amber-500" : "text-primary")}>
              Zipha_Terminal
            </span>
            <span className="font-bold text-[9px] uppercase tracking-widest text-muted-foreground/40 truncate mt-1.5 italic leading-none">
              {displayName}
            </span>
          </div>
        </div>

        {/* --- NAVIGATION LEDGER --- */}
        <nav className="flex-1 space-y-2 p-6 overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-3 mb-6 px-4 opacity-20 italic">
            {themeAmber ? <Globe className="size-3.5 text-amber-500" /> : <Terminal className="size-3.5 text-primary" />}
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">
              {themeAmber ? "Platform_Oversight" : "Merchant_Node_Vector"}
            </p>
          </div>

          {filteredNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => impact("light")}
                className={cn(
                  "group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                  isActive 
                    ? (themeAmber ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20") 
                    : "text-muted-foreground/40 hover:bg-white/5 hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-current rounded-full blur-[2px] animate-in slide-in-from-left-2 duration-500" />
                )}
                <item.icon className="size-4.5 shrink-0 transition-all duration-500 group-hover:scale-110 group-active:scale-90" />
                <span className="truncate italic">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- SYSTEM STATUS & LOGOUT --- */}
        <div className="p-8 border-t border-white/5 bg-white/[0.02] space-y-4">
          <div className={cn(
            "rounded-[1.5rem] border p-5 shadow-inner transition-all duration-700",
            themeAmber ? "bg-amber-500/[0.05] border-amber-500/20" : "bg-black/20 border-white/5"
          )}>
            <div className="flex items-center gap-3 mb-2.5 opacity-30 italic">
               <Zap className={cn("size-3", themeAmber ? "text-amber-500" : "text-primary")} />
               <p className="text-[8px] font-black uppercase tracking-[0.3em]">Clearance</p>
            </div>
            <p className={cn("text-[10px] font-black uppercase tracking-widest italic", themeAmber ? "text-amber-500" : "text-foreground")}>
              {nodeStatus}
            </p>
          </div>

          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-destructive/10 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all active:scale-95 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest italic">Disconnect_Node</span>
            {isLoggingOut ? <Loader2 className="size-3.5 animate-spin" /> : <LogOut className="size-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
          </button>
        </div>
      </aside>

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden" />}
    </>
  );
}