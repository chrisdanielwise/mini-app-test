"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { 
  Menu, X, Zap, Crown, AlertTriangle, Globe, 
  Terminal, LogOut, Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";
import { toast } from "sonner";

/**
 * 🛰️ DASHBOARD SIDEBAR (Hardened Apex Tier v14.1.2)
 * Features: Atomic Logout, RBAC Filtering, and Flavor-Sync.
 */
export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { flavor } = useLayout();

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
   * 🧹 ATOMIC LOGOUT PROTOCOL
   * Logic: Dispatches termination signal to AuditService before cookie purge.
   */
  /**
   * 🧹 ATOMIC LOGOUT PROTOCOL (v14.96.0)
   * Logic: Purges server session and broadcasts termination signal to all nodes.
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    hapticFeedback("warning");
    const toastId = toast.loading("De-provisioning Identity Node...");

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      
      if (!res.ok) throw new Error("TERMINATION_SEQUENCE_FAILED");

      // 🛰️ SIGNAL CROSS-TAB SYNC
      // This tells the AuthSyncProvider in other tabs to reload/logout.
      const authChannel = new BroadcastChannel("zipha_auth_sync");
      authChannel.postMessage({ 
        action: "TERMINATE_SESSION",
        timestamp: Date.now() 
      });
      authChannel.close(); // Close channel immediately after pulse

      hapticFeedback("success");
      toast.success("Node Disconnected Successfully", { id: toastId });
      
      // Force immediate redirect to clear local state
      // router.replace forces a client-side transition, 
      // window.location.href ensures a total state wipe.
      window.location.href = "/dashboard/login";
    } catch (err) {
      toast.error("Handshake Error: Remote Wipe Failed", { id: toastId });
      setIsLoggingOut(false);
    }
  };
  const filteredNav = NAVIGATION_CONFIG.filter(item => 
    item.roles.includes(role) || item.roles.includes(rawRole)
  );

  const displayNav = filteredNav.length > 0 
    ? filteredNav 
    : NAVIGATION_CONFIG.filter(item => item.roles.includes("merchant"));

  if (!mounted) return <aside className="hidden lg:flex w-64 md:w-72 flex-col border-r border-border/10 bg-background/95" />;

  return (
    <>
      <div className="lg:hidden fixed top-3 left-4 z-[100]">
        <button 
          onClick={() => {
            hapticFeedback("light");
            setIsOpen(!isOpen);
          }} 
          className={cn(
            "p-3 backdrop-blur-3xl border rounded-xl shadow-2xl active:scale-90 transition-all",
            themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-card/90 border-border/20 text-primary"
          )}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 md:w-72 flex-col border-r transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
        themeAmber ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-background/95 border-border/10 backdrop-blur-3xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* --- IDENTITY NODE --- */}
        <div className="flex h-16 md:h-20 items-center gap-3 border-b border-border/10 px-6 md:px-8 shrink-0 bg-muted/5">
          <div className={cn(
            "flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl shadow-lg",
            themeAmber ? "bg-amber-500" : "bg-primary"
          )}>
            {role === 'super_admin' ? <Crown className="h-5 w-5 text-black" /> : <span className="text-sm font-black text-white italic">Z</span>}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn("font-black tracking-tighter uppercase text-[9px] md:text-[10px] truncate italic", themeAmber ? "text-amber-500" : "text-primary")}>Zipha_Terminal</span>
            <span className="font-bold text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground truncate opacity-40 mt-1 italic leading-none">
              {displayName}
            </span>
          </div>
        </div>

        {/* --- NAVIGATION LEDGER --- */}
        <nav className="flex-1 space-y-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4 px-3 opacity-20 italic">
            {themeAmber ? <Globe className="h-3 w-3" /> : <Terminal className="h-3 w-3" />}
            <p className="text-[7px] font-black uppercase tracking-[0.3em]">
              {themeAmber ? "Platform_Oversight" : "Merchant_Node"}
            </p>
          </div>

          {displayNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} onClick={() => hapticFeedback("light")}
                className={cn(
                  "group flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl px-4 py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all",
                  isActive ? (themeAmber ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground") : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- SYSTEM STATUS & LOGOUT --- */}
        <div className="p-4 md:p-6 border-t border-border/10 bg-muted/5 space-y-3">
          <div className={cn(
            "rounded-xl border p-4 shadow-inner",
            themeAmber ? "bg-amber-500/5 border-amber-500/10" : "bg-card border-border/10"
          )}>
            <div className="flex items-center gap-2 mb-1.5 opacity-40 italic">
               <Zap className={cn("h-2.5 w-2.5", themeAmber ? "text-amber-500" : "text-primary")} />
               <p className="text-[7px] font-black uppercase tracking-[0.2em]">Clearance</p>
            </div>
            <p className={cn("text-[9px] font-black uppercase tracking-tighter italic", themeAmber ? "text-amber-500" : "text-foreground")}>
              {nodeStatus}
            </p>
          </div>

          {/* 🚨 DISCONNECT ACTION */}
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 transition-all active:scale-[0.98] group"
          >
            <span className="text-[9px] font-black uppercase tracking-widest italic">Disconnect_Node</span>
            {isLoggingOut ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <LogOut className="h-3 w-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            )}
          </button>
        </div>
      </aside>

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />}
    </>
  );
}