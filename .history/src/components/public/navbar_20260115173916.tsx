"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Cpu, 
  ArrowRight, 
  Globe, 
  Shield, 
  Waves, 
  Activity, 
  Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🌊 FLUID_GLOBAL_NAVIGATION (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea, isPortrait).
 * Logic: morphology-aware navigation membrane with hyper-glass momentum.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // 🛡️ IDENTITY & HARDWARE INGRESS
  const { isStaff, isAuthenticated } = useInstitutionalAuth();
  const { impact } = useHaptics();
  const { 
    safeArea, 
    isReady, 
    screenSize, 
    isMobile, 
    isDesktop, 
    isPortrait, 
    viewportWidth 
  } = useDeviceContext();

  // 🌊 SCROLL MONITOR: Hardware-fluid recalibration
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🛡️ LOCK SCROLL ON INGRESS
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  // 🛰️ MORPHOLOGY RESOLUTION
  const navHeight = scrolled ? "h-16 md:h-20" : "h-20 md:h-28";
  const paddingTop = `calc(${safeArea.top}px + 0.5rem)`;
  const drawerPaddingBottom = `calc(${safeArea.bottom}px + 2.5rem)`;

  const navLinks = useMemo(() => [
    { name: "Infrastructure", href: "#infrastructure" },
    { name: "Protocols", href: "#pricing" },
    { name: isStaff ? "Oversight_Terminal" : "Merchant_Hub", href: "/dashboard" },
  ], [isStaff]);

  // 🛡️ HYDRATION GUARD
  if (!isReady) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] px-6 md:px-10",
        scrolled 
          ? "bg-background/40 backdrop-blur-3xl border-b border-white/5 shadow-apex" 
          : "bg-transparent",
        navHeight
      )}
      style={{ paddingTop: scrolled ? "0px" : paddingTop }}
    >
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between relative z-10">
        
        {/* --- LOGO NODE: Apex Branding --- */}
        <Link 
          href="/" 
          onClick={() => impact("light")}
          className="flex items-center gap-4 group z-[110]"
        >
          <div className={cn(
            "size-10 md:size-12 rounded-2xl flex items-center justify-center text-white shadow-apex transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110",
            isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
          )}>
            {isStaff ? <Globe className="size-5 md:size-6" /> : <Cpu className="size-5 md:size-6" />}
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">
              Apex_Infrastructure
            </span>
          </div>
        </Link>

        {/* --- DESKTOP PROTOCOL: Tactical Navigation --- */}
        <div className="hidden lg:flex items-center gap-10 xl:gap-16">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => impact("light")}
              className={cn(
                "text-[9px] xl:text-[10px] font-black uppercase tracking-[0.5em] transition-all duration-700 italic",
                isStaff 
                  ? "text-amber-500/30 hover:text-amber-500" 
                  : "text-muted-foreground/30 hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <Button
            asChild
            onClick={() => impact("medium")}
            className={cn(
              "rounded-[1.2rem] h-12 px-10 font-black uppercase italic tracking-[0.2em] text-[10px] shadow-apex transition-all duration-1000 hover:scale-[1.05] active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/30"
            )}
          >
            <Link href="/register">
              {isStaff ? "Global_Oversight" : "Deploy_Node"}
            </Link>
          </Button>
        </div>

        {/* --- MOBILE TRIGGER: Hardware-Aware Interface --- */}
        <button
          onClick={() => { impact("medium"); setIsOpen(!isOpen); }}
          className={cn(
            "lg:hidden size-12 z-[110] flex items-center justify-center rounded-2xl border transition-all duration-1000 shadow-apex active:scale-90",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/5 border-white/5 text-foreground"
          )}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* --- MOBILE DRAWER: LIQUID INGRESS --- */}
      <div
        className={cn(
          "fixed inset-0 h-[var(--vh,100dvh)] bg-background/60 backdrop-blur-3xl z-[105] lg:hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] px-10 flex flex-col justify-between overflow-hidden",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        style={{ paddingTop: `calc(${paddingTop} + 4rem)`, paddingBottom: drawerPaddingBottom }}
      >
        {/* Steam/Radiance Effect */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[140px] opacity-10 pointer-events-none transition-colors duration-1000",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} style={{ width: `${viewportWidth}px`, height: `${viewportWidth}px` }} />

        <div className="flex flex-col gap-4 relative z-10">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => { impact("light"); setIsOpen(false); }}
              style={{ transitionDelay: `${index * 50}ms` }}
              className={cn(
                "text-[clamp(2.5rem,10vw,4.5rem)] font-black uppercase italic tracking-tighter transition-all duration-700 border-b border-white/5 pb-6 group flex items-center justify-between",
                isStaff ? "text-amber-500/30 hover:text-amber-500" : "text-foreground/40 hover:text-primary"
              )}
            >
              <span>{link.name}</span>
              <Zap className="size-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
        
        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between opacity-30 italic">
            <div className="flex items-center gap-3">
              <Shield className={cn("size-4", isStaff ? "text-amber-500" : "text-primary")} />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                {isStaff ? "Universal_Sync_Ok" : "Identity_Signature_Active"}
              </p>
            </div>
            <Activity className="size-4 animate-pulse" />
          </div>

          <Button
            asChild
            className={cn(
              "w-full h-20 rounded-[2rem] font-black uppercase italic tracking-[0.2em] text-[11px] shadow-apex active:scale-95 transition-all duration-1000",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}
            onClick={() => { impact("heavy"); setIsOpen(false); }}
          >
            <Link href="/register" className="flex items-center justify-center gap-4">
              <span>{isStaff ? "Initialize_Audit_Terminal" : "Deploy_Signal_Node"}</span>
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>

        {/* Liquid Aesthetic Floor */}
        <Waves className="absolute bottom-0 left-0 w-full h-32 opacity-5 text-primary pointer-events-none" />
      </div>

      {/* 🏛️ SUBSURFACE GRID WATERMARK */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000 z-[-1]" />
    </nav>
  );
}