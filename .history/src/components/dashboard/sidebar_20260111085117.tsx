"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Users, CreditCard, Settings,
  BarChart3, MessageSquare, Bot, Tag, Wallet, User, Menu, X, Zap, ShieldCheck, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ NAVIGATION PROTOCOL DEFINITIONS
 */
const MERCHANT_LINKS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["merchant", "super_admin"] },
  { name: "Services", href: "/dashboard/services", icon: Package, roles: ["merchant", "super_admin"] },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users, roles: ["merchant", "super_admin", "platform_manager"] },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard, roles: ["merchant", "super_admin"] },
  { name: "Payouts", href: "/dashboard/payouts", icon: Wallet, roles: ["merchant", "super_admin"] },
  { name: "Coupons", href: "/dashboard/coupons", icon: Tag, roles: ["merchant", "super_admin"] },
];

const PLATFORM_LINKS = [
  { name: "Global Support", href: "/dashboard/support", icon: MessageSquare, roles: ["super_admin", "platform_manager", "platform_support", "merchant"] },
  { name: "Bot Config", href: "/dashboard/bot", icon: Bot, roles: ["merchant", "super_admin"] },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["merchant", "super_admin", "platform_manager"] },
  { name: "Business Settings", href: "/dashboard/settings", icon: Settings, roles: ["merchant", "super_admin"] },
];

export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Safely extract context properties
  const role = context?.role || "merchant";
  const config = context?.config || {};
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // Identity Fallbacks
  const displayName = config?.companyName || (isPlatformStaff ? "PLATFORM_CORE" : "UNNAMED_NODE");
  const nodeStatus = isPlatformStaff ? role.replace('_', ' ') : (config?.planStatus || "Starter");

  // Filter navigation based on current user role
  const allLinks = [...MERCHANT_LINKS, ...PLATFORM_LINKS];
  const filteredNav = allLinks.filter(item => item.roles.includes(role));

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <>
      {/* 📱 MOBILE OVERLAY TRIGGER */}
      <div className="lg:hidden fixed top-3 left-4 z-[100]">
        <button 
          onClick={() => {
            hapticFeedback("light");
            setIsOpen(!isOpen);
          }} 
          className={cn(
            "p-3 backdrop-blur-3xl border rounded-xl shadow-2xl active:scale-90 transition-all",
            isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-card/90 border-border/20 text-primary"
          )}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 md:w-72 flex-col border-r border-border/10 bg-background/95 backdrop-blur-3xl transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header: Dynamic Identity Node */}
        <div className="flex h-16 md:h-20 items-center gap-3 border-b border-border/10 px-6 md:px-8 shrink-0 bg-muted/5">
          <div className={cn(
            "flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95",
            isPlatformStaff ? "bg-amber-500" : "bg-primary"
          )}>
            {role === 'super_admin' ? <Crown className="h-5 w-5 text-black" /> : <span className="text-sm font-black text-white italic">Z</span>}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn(
              "font-black tracking-tighter uppercase text-[9px] md:text-[10px] truncate italic",
              isPlatformStaff ? "text-amber-500" : "text-primary"
            )}>Zipha_Terminal</span>
            <span className="font-bold text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground truncate opacity-40">
              {displayName}
            </span>
          </div>
        </div>

        {/* Navigation Map */}
        <nav className="flex-1 space-y-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => hapticFeedback("light")}
                className={cn(
                  "group flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl px-4 py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all",
                  "active:scale-[0.98] truncate",
                  isActive 
                    ? (isPlatformStaff ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-xl shadow-primary/20") 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Node Hierarchy Indicator */}
        <div className="p-4 md:p-6 border-t border-border/10 bg-muted/5">
          <div className="rounded-xl md:rounded-2xl bg-card border border-border/10 p-4 md:p-5 shadow-inner">
            <div className="flex items-center gap-2 mb-1.5 opacity-40 italic">
               <Zap className={cn("h-2.5 w-2.5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
               <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">Node Level</p>
            </div>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-foreground italic">
              {nodeStatus}
            </p>
          </div>
        </div>
      </aside>

      {/* 🛡️ MOBILE BACKDROP */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300" 
        />
      )}
    </>
  );
}