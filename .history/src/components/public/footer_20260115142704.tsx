"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Globe, 
  Terminal, 
  Twitter, 
  Github,
  Activity,
  Waves,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ TERMINAL_FOOTER (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware site map with kinetic system telemetry.
 */
export function Footer() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE PHYSICS: Hardware Ingress
  const { 
    screenSize, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    safeArea, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";

  const FOOTER_LINKS = [
    {
      label: "Infrastructure",
      links: [
        { name: "Node_Status", href: "#" },
        { name: "Protocol_Specs", href: "#" },
        { name: "Geo_Zones", href: "#" },
      ],
    },
    {
      label: "Protocols",
      links: [
        { name: "Liquidity_Sync", href: "#" },
        { name: "Audit_Vault", href: "#" },
        { name: "API_Handshake", href: "#" },
      ],
    },
    {
      label: "Governance",
      links: [
        { name: "Legal_Manifest", href: "#" },
        { name: "Privacy_Mask", href: "#" },
        { name: "Terms_of_Service", href: "#" },
      ],
    },
  ];

  // 🛡️ HYDRATION GUARD
  if (!isReady) return <footer className="h-64 bg-card/10 animate-pulse mx-6 rounded-t-[3rem]" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating layout gravity for the architectural sitemap.
   */
  const gridLayout = (isDesktop || (isTablet && !isPortrait)) 
    ? "grid-cols-5 gap-x-12" 
    : "grid-cols-2 gap-y-12 gap-x-8";
  
  const footerPaddingBottom = `calc(${safeArea.bottom}px + 2.5rem)`;

  return (
    <footer 
      className="relative border-t border-white/5 bg-black/40 pt-[clamp(4rem,10vh,8rem)] px-6 overflow-hidden transition-all duration-1000"
      style={{ paddingBottom: footerPaddingBottom }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={cn("grid mb-20", gridLayout)}>
          
          {/* --- BRAND NODE: KINETIC INGRESS --- */}
          <div className={cn(
            "space-y-8 transition-all duration-1000",
            (isDesktop || (isTablet && !isPortrait)) ? "col-span-2" : "col-span-2"
          )}>
            <Link 
              href="/" 
              onClick={() => impact("light")}
              className="flex items-center gap-4 group"
            >
              <div className={cn(
                "size-10 md:size-12 rounded-[1.2rem] flex items-center justify-center text-white shadow-apex transition-all duration-700 group-hover:rotate-12 group-hover:scale-110",
                isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
              )}>
                {isStaff ? <Globe className="size-5 md:size-6" /> : <Cpu className="size-5 md:size-6" />}
              </div>
              <span className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
              </span>
            </Link>
            
            <p className="max-w-[280px] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 italic leading-relaxed">
              Institutional_Grade Telegram Monetization Infrastructure. Deploying Signal Clusters Since 2024.
            </p>

            <div className="flex items-center gap-4">
              {[Twitter, Github].map((Icon, idx) => (
                <button 
                  key={idx} 
                  onClick={() => impact("light")}
                  className="size-10 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all opacity-30 hover:opacity-100 flex items-center justify-center group"
                >
                  <Icon className="size-4 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* --- LINK CLUSTERS: NORMALISED --- */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.label} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 italic">
                {section.label}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onMouseEnter={() => impact("light")}
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-all duration-500 italic inline-block hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- SYSTEM STATUS & COMPLIANCE --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="flex items-center gap-8 flex-wrap justify-center">
            <div className="flex items-center gap-3">
              <div className="relative size-2">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                <div className="relative size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/80 italic">
                SYSTEM_LIVE_100%
              </span>
            </div>
            
            <div className="flex items-center gap-3 opacity-20">
              <Activity className="size-4 animate-pulse" />
              <div className="h-4 w-px bg-white/10" />
              <Terminal className="size-4" />
              <span className="text-[8px] font-black uppercase tracking-widest italic leading-none">
                v16.16.30_APEX_STABLE
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/10 italic text-center md:text-right">
              © 2026 Zipha_Infrastructure // Authorized_By_Root
            </p>
            <ShieldCheck className="size-4 opacity-5" />
          </div>
        </div>
      </div>

      {/* 🏛️ BACKGROUND PHYSICS: HARDWARE-AWARE FLOW */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Subsurface Radiance */}
        <div className={cn(
          "absolute -bottom-20 -left-20 rounded-full blur-[120px] opacity-5 transition-all duration-1000",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} style={{ width: `${viewportWidth * 0.3}px`, height: `${viewportWidth * 0.3}px` }} />
        
        {/* Kinetic Grid Mask */}
        <div className="absolute inset-0 opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(to_top,black,transparent)]" />
        
        {/* Water Flow Aesthetic */}
        <Waves className="absolute bottom-0 left-0 w-full h-24 opacity-[0.03] animate-pulse text-primary" />
      </div>
    </footer>
  );
}