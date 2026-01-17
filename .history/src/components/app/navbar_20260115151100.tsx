"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Cpu, 
  Globe, 
  LayoutGrid, 
  History as HistoryIcon, 
  User, 
  ShieldCheck,
  Menu,
  X,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/hooks/use-institutional-auth";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";

export function AppNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isStaff, user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  // 🛰️ HARDWARE INGRESS
  const { isMobile, isReady, safeArea } = useDeviceContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: If NOT mobile, we must show the App links here.
   * If mobile, we rely on the BottomNav to save vertical space.
   */
  const navLinks = useMemo(() => {
    const base = [
      { name: "Node_Status", href: "/home", icon: Cpu },
    ];

    if (!isMobile) {
      return [
        ...base,
        { name: "Market_Relay", href: "/services", icon: LayoutGrid },
        { name: "Ledger_Sync", href: "/history", icon: HistoryIcon },
        { name: "Identity", href: "/profile", icon: User },
      ];
    }
    return base;
  }, [isMobile]);

  if (!isReady) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 px-6 md:px-10",
        scrolled 
          ? "h-16 bg-background/40 backdrop-blur-3xl border-b border-white/5 shadow-apex" 
          : "h-20 bg-transparent"
      )}
      style={{ paddingTop: scrolled ? "0px" : `calc(${safeArea.top}px + 0.5rem)` }}
    >
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between relative z-10">
        
        {/* LOGO NODE */}
        <Link 
          href="/home" 
          onClick={() => impact("light")}
          className="flex items-center gap-4 group"
        >
          <div className={cn(
            "size-10 rounded-2xl flex items-center justify-center text-white shadow-apex transition-all duration-700 group-hover:rotate-12",
            isStaff ? "bg-amber-500" : "bg-primary"
          )}>
            {isStaff ? <Globe className="size-5" /> : <Cpu className="size-5" />}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase italic tracking-tighter leading-none">
              Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">
              Internal_Node_{user?.id?.slice(0,4) || "LIVE"}
            </span>
          </div>
        </Link>

        {/* 🛰️ DESKTOP COMMAND CLUSTER */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => impact("light")}
                className={cn(
                  "text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-500 italic",
                  isActive 
                    ? (isStaff ? "text-amber-500" : "text-primary") 
                    : "text-muted-foreground/30 hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          
          <Button
            asChild
            className={cn(
              "rounded-xl h-11 px-8 font-black uppercase italic tracking-[0.2em] text-[10px] shadow-apex",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}
          >
            <Link href="/dashboard">
              {isStaff ? "Oversight" : "Merchant_Hub"}
            </Link>
          </Button>
        </div>

        {/* 🛡️ MOBILE STATUS ICON (Visible only when BottomNav is handling nav) */}
        {isMobile && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <Activity className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Sync_OK</span>
          </div>
        )}
      </div>

      {/* 🏛️ BACKGROUND MESH */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[grid-white_32px] z-[-1]" />
    </nav>
  );
}