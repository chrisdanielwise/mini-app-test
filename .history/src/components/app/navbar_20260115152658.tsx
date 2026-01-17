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
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ APP_NAVBAR (Institutional Apex v16.16.30)
 * Architecture: Anchored Membrane.
 * Logic: morphology-aware link injection with kinetic glass-refraction.
 */
export function AppNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isStaff, user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  const { isMobile, isReady, safeArea } = useDeviceContext();

  // 🌊 SCROLL MONITOR: Institutional calibration
  useEffect(() => {
    const handleScroll = () => {
      // Threshold set to 10px for ultra-responsive glass-trigger
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = useMemo(() => {
    const base = [
      { name: "Node_Status", href: "/home", icon: Cpu },
    ];

    // 🛰️ DESKTOP_EXPANSION: Absorbs links when BottomNav is hidden
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
        // 🛡️ STICKY_LOCK: Re-hardened fixed positioning
        "fixed top-0 left-0 right-0 z-[120] w-full transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        scrolled 
          ? "h-16 bg-background/60 backdrop-blur-3xl border-b border-white/5 shadow-apex" 
          : "h-20 bg-transparent"
      )}
      style={{ 
        // 🛰️ SAFE_AREA: Accounts for dynamic islands and hardware notches
        paddingTop: scrolled ? "0px" : `calc(${safeArea.top}px + 0.5rem)` 
      }}
    >
      <div className="max-w-7xl mx-auto w-full h-full px-6 md:px-10 flex items-center justify-between relative z-10">
        
        {/* --- LOGO NODE --- */}
        <Link 
          href="/home" 
          onClick={() => impact("light")}
          className="flex items-center gap-4 group"
        >
          <div className={cn(
            "size-9 md:size-10 rounded-2xl flex items-center justify-center text-white shadow-apex transition-all duration-700 group-hover:rotate-12",
            isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
          )}>
            {isStaff ? <Globe className="size-5 md:size-6" /> : <Cpu className="size-5 md:size-6" />}
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none">
              Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">
              Node_{user?.id?.slice(0,4) || "LIVE"}
            </span>
          </div>
        </Link>

        {/* --- DESKTOP COMMAND CLUSTER --- */}
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
              "rounded-xl h-10 px-8 font-black uppercase italic tracking-[0.2em] text-[10px] shadow-apex transition-all hover:scale-105 active:scale-95",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}
          >
            <Link href="/dashboard">
              {isStaff ? "Oversight" : "Merchant_Hub"}
            </Link>
          </Button>
        </div>

        {/* --- MOBILE_TELEMETRY: Visible only when BottomNav exists --- */}
        {isMobile && (
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
            <Activity className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Sync_OK</span>
          </div>
        )}
      </div>

      {/* 📐 SUBSURFACE GRID MASK */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('/assets/grid.svg')] bg-center z-[-1]" />
    </nav>
  );
}