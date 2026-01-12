"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Users, CreditCard, Settings,
  BarChart3, MessageSquare, Bot, Tag, Wallet, User, Menu, X, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

// 🏁 THE FULL MAPPING: Integrated all merchant properties
export const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/dashboard/services", icon: Package },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Payouts", href: "/dashboard/payouts", icon: Wallet },
  { name: "Coupons", href: "/dashboard/coupons", icon: Tag },
  { name: "Support", href: "/dashboard/support", icon: MessageSquare },
  { name: "Bot Config", href: "/dashboard/bot", icon: Bot },
  { name: "Business Settings", href: "/dashboard/settings", icon: Settings },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
];

/**
 * 🛰️ DASHBOARD SIDEBAR (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive safe-zones and institutional touch-targets for mobile staff.
 */
export function DashboardSidebar({ merchant }: { merchant: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 🛡️ MOBILE SYNC: Close overlay on navigation
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
          className="p-3 bg-card/90 backdrop-blur-3xl border border-border/20 rounded-xl shadow-2xl text-primary active:scale-90 transition-all"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 md:w-72 flex-col border-r border-border/10 bg-background/95 backdrop-blur-3xl transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header: Dynamic Merchant Identity */}
        <div className="flex h-16 md:h-20 items-center gap-3 border-b border-border/10 px-6 md:px-8 shrink-0 bg-muted/5">
          <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
            <span className="text-sm font-black text-primary-foreground italic">Z</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black tracking-tighter uppercase text-[9px] md:text-[10px] truncate italic text-primary">Zipha_Node</span>
            <span className="font-bold text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground truncate opacity-40">
              {merchant.companyName || "STAFF_ACCESS"}
            </span>
          </div>
        </div>

        {/* Navigation Map */}
        <nav className="flex-1 space-y-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
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
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" 
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

        {/* Tier Indicator */}
        <div className="p-4 md:p-6 border-t border-border/10 bg-muted/5">
          <div className="rounded-xl md:rounded-2xl bg-card border border-border/10 p-4 md:p-5 shadow-inner">
            <div className="flex items-center gap-2 mb-1.5 opacity-40 italic">
               <Zap className="h-2.5 w-2.5 text-primary" />
               <p className="text-[7px] md:text-[8px] font-black text-primary uppercase tracking-[0.2em]">Node Hierarchy</p>
            </div>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-foreground italic">
              {merchant.planStatus || "Starter"} Access
            </p>
          </div>
        </div>
      </aside>

      {/* 🛡️ MOBILE BACKDROP PROTOCOL */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300" 
        />
      )}
    </>
  );
}