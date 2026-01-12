"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  LifeBuoy, 
  Menu, 
  X, 
  Cpu,
  BarChart3,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * 🛠️ STAFF TIER SHELL
 * Professional, high-density dashboard for Merchant operations.
 */
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
    { name: "User Nodes", href: "/dashboard/subscribers", icon: Users },
    { name: "Revenue Ledger", href: "/dashboard/revenue", icon: CreditCard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Node Config", href: "/dashboard/settings", icon: Settings },
    { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* 🖥️ DESKTOP SIDEBAR (Tier 2 Primary Nav) */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
              <Cpu className="h-6 w-6" />
            </div>
            <span className="text-xl font-black uppercase italic tracking-tighter">
              Zipha<span className="text-primary text-2xl">.</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group",
                pathname === item.href 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                pathname === item.href ? "stroke-[2.5px]" : "stroke-[2px]"
              )} />
              <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-border/40">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Protocol Active</p>
            <p className="text-xs font-bold mt-1">V2.4.0 High-Resiliency</p>
          </div>
        </div>
      </aside>

      {/* 📱 MOBILE HEADER (Tier 2 Mobile Nav) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-border/40 z-[50] flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary" />
          <span className="text-lg font-black uppercase italic tracking-tighter">Zipha</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 📱 MOBILE OVERLAY DRAWER */}
      <div className={cn(
        "fixed inset-0 bg-background/95 backdrop-blur-2xl z-[100] transition-transform duration-500 lg:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between">
          <span className="text-xl font-black uppercase italic tracking-tighter">Control Hub</span>
          <button onClick={() => setSidebarOpen(false)} className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-8 space-y-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-6 text-2xl font-black uppercase italic tracking-tighter text-foreground"
            >
              <item.icon className="h-8 w-8 text-primary" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 🚀 MAIN DATA RECEPTACLE */}
      <main className="flex-1 lg:p-12 p-6 pt-28 lg:pt-12 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}