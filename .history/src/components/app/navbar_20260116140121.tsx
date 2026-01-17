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
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ APP_NAVBAR (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Laminar Stacking.
 * Fix: High-density h-14/h-16 profile prevents vertical blowout.
 */
export function AppNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isStaff, user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  const { isMobile, isReady, safeArea } = useDeviceContext();

  // 🌊 SCROLL MONITOR: Attached to Independent Tactical Volume
  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    const handleScroll = () => {
      if (scrollContainer) setScrolled(scrollContainer.scrollTop > 10);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, [isReady]);

  const navLinks = useMemo(() => {
    const base = [{ name: "Node_Status", href: "/home", icon: Cpu }];
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
        "w-full transition-all duration-500 ease-out",
        scrolled 
          ? "h-14 bg-zinc-950/60 backdrop-blur-xl border-b border-white/5 shadow-2xl" 
          : "h-16 bg-transparent"
      )}
      style={{ 
        paddingTop: scrolled ? "0px" : `calc(${safeArea.top}px * 0.5)` 
      }}
    >
      <div className="max-w-7xl mx-auto w-full h-full px-5 md:px-8 flex items-center justify-between relative z-10">
        
        {/* --- 🛡️ LOGO NODE: Compressed h-9 --- */}
        <Link 
          href="/home" 
          onClick={() => impact("light")}
          className="flex items-center gap-3 group leading-none"
        >
          <div className={cn(
            "size-8 md:size-9 rounded-xl flex items-center justify-center text-white shadow-lg transition-all",
            isStaff ? "bg-amber-500 shadow-amber-500/10" : "bg-primary shadow-primary/10"
          )}>
            {isStaff ? <Globe className="size-4" /> : <Cpu className="size-4" />}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground">
              Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
            </span>
            <span className="text-[6.5px] font-black uppercase tracking-[0.3em] opacity-20 italic">
              NODE_{user?.id?.slice(0,4) || "LIVE"}
            </span>
          </div>
        </Link>

        {/* --- DESKTOP COMMANDS: Tactical Navigation --- */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => impact("light")}
                className={cn(
                  "text-[8px] xl:text-[9px] font-black uppercase tracking-[0.4em] transition-colors italic",
                  isActive 
                    ? (isStaff ? "text-amber-500" : "text-primary") 
                    : "text-muted-foreground/20 hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            );
          })}
          
          <Button
            asChild
            className={cn(
              "rounded-xl h-9 px-6 font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all active:scale-95",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}
          >
            <Link href="/dashboard">
              {isStaff ? "Oversight" : "Terminal"}
            </Link>
          </Button>
        </div>

        {/* --- MOBILE_TELEMETRY: High Density --- */}
        {isMobile && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 backdrop-blur-md">
            <Activity className={cn("size-2.5 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
            <span className="text-[7px] font-black uppercase tracking-widest opacity-30">Sync_OK</span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center z-[-1]" />
    </nav>
  );
}