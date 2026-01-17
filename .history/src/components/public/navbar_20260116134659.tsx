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
  Activity, 
  Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ GLOBAL_NAVIGATION (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Command Horizon.
 * Fix: High-density h-14/h-16 profile prevents vertical blowout.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isStaff } = useInstitutionalAuth();
  const { impact } = useHaptics();
  const { 
    safeArea, 
    isReady, 
    screenSize, 
    isMobile, 
    viewportWidth 
  } = useDeviceContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  // 🛡️ TACTICAL SLIM: Shrunken height profiles
  const navHeight = scrolled ? "h-14" : "h-16 md:h-18";
  const paddingTop = scrolled ? "0px" : `calc(${safeArea.top}px * 0.5)`;

  const navLinks = useMemo(() => [
    { name: "Infrastructure", href: "#infrastructure" },
    { name: "Protocols", href: "#pricing" },
    { name: isStaff ? "Oversight" : "Terminal", href: "/dashboard" },
  ], [isStaff]);

  if (!isReady) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 backdrop-blur-xl px-5 md:px-8",
        scrolled 
          ? "bg-black/60 border-b border-white/5 shadow-2xl" 
          : "bg-transparent",
        navHeight
      )}
      style={{ paddingTop }}
    >
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between relative z-10">
        
        {/* --- 🛡️ LOGO NODE: Compressed h-10 --- */}
        <Link 
          href="/" 
          onClick={() => impact("light")}
          className="flex items-center gap-3 group z-[110]"
        >
          <div className={cn(
            "size-9 md:size-10 rounded-xl flex items-center justify-center text-white transition-all duration-500",
            isStaff ? "bg-amber-500 shadow-lg shadow-amber-500/10" : "bg-primary shadow-lg shadow-primary/10"
          )}>
            {isStaff ? <Globe className="size-4" /> : <Cpu className="size-4" />}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground">
              Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
            </span>
            <span className="text-[6.5px] font-black uppercase tracking-[0.3em] opacity-20 italic mt-1">
              APEX_INFRA
            </span>
          </div>
        </Link>

        {/* --- DESKTOP PROTOCOL: High Density --- */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => impact("light")}
              className={cn(
                "text-[8px] xl:text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-500 italic",
                isStaff 
                  ? "text-amber-500/20 hover:text-amber-500" 
                  : "text-muted-foreground/20 hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <Button
            asChild
            onClick={() => impact("medium")}
            className={cn(
              "rounded-xl h-10 md:h-11 px-8 font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-primary-foreground shadow-primary/10"
            )}
          >
            <Link href="/register">
              {isStaff ? "Global_Audit" : "Deploy_Node"}
            </Link>
          </Button>
        </div>

        {/* --- MOBILE TRIGGER: Compressed size-10 --- */}
        <button
          onClick={() => { impact("medium"); setIsOpen(!isOpen); }}
          className={cn(
            "lg:hidden size-10 z-[110] flex items-center justify-center rounded-xl border transition-all active:scale-90",
            isStaff ? "bg-amber-500/5 border-amber-500/10 text-amber-500" : "bg-white/5 border-white/5 text-foreground"
          )}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* --- MOBILE DRAWER: Tactical Overflow --- */}
      <div
        className={cn(
          "fixed inset-0 h-[var(--vh,100dvh)] bg-black/80 backdrop-blur-2xl z-[105] lg:hidden transition-all duration-700 ease-out px-8 flex flex-col justify-between overflow-hidden",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        style={{ paddingTop: `calc(${safeArea.top}px + 5rem)`, paddingBottom: `calc(${safeArea.bottom}px + 1.5rem)` }}
      >
        <div className="flex flex-col gap-2 relative z-10">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => { impact("light"); setIsOpen(false); }}
              style={{ transitionDelay: `${index * 40}ms` }}
              className={cn(
                "text-[2rem] font-black uppercase italic tracking-tighter transition-all duration-500 border-b border-white/5 pb-4 group flex items-center justify-between",
                isStaff ? "text-amber-500/20 hover:text-amber-500" : "text-foreground/20 hover:text-primary"
              )}
            >
              <span>{link.name}</span>
              <Zap className="size-6 opacity-0 group-hover:opacity-40" />
            </Link>
          ))}
        </div>
        
        <div className="space-y-6 relative z-10 pb-4">
          <div className="flex items-center justify-between opacity-10 italic">
            <div className="flex items-center gap-2">
              <Shield className={cn("size-3", isStaff ? "text-amber-500" : "text-primary")} />
              <p className="text-[7.5px] font-black uppercase tracking-[0.3em]">
                {isStaff ? "Sync_Ok" : "Identity_Secure"}
              </p>
            </div>
            <Activity className="size-3 animate-pulse" />
          </div>

          <Button
            asChild
            className={cn(
              "w-full h-14 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )}
            onClick={() => { impact("heavy"); setIsOpen(false); }}
          >
            <Link href="/register" className="flex items-center justify-center gap-3">
              <span>{isStaff ? "Audit_Terminal" : "Deploy_Node"}</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}