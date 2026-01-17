"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Twitter, 
  Github, 
  Terminal, 
  Activity,
  Waves,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🧩 Refined Tactical Components
import { Navbar } from "@/components/public/navbar";

/**
 * 🌊 PUBLIC_TIER_LAYOUT (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea).
 * Logic: morphology-aware atmospheric shell with hardware-fluid radiance.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { flavor } = useLayout(); //
  const { impact } = useHaptics(); //
  const isStaff = flavor === "AMBER"; //
  
  // 🛰️ DEVICE PHYSICS: Consuming full morphology spectrum
  const { 
    isReady, 
    screenSize, 
    viewportWidth, 
    viewportHeight, 
    safeArea, 
    isMobile 
  } = useDeviceContext(); //

  // 🛡️ HYDRATION GUARD: Stabilize hardware context
  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical vertical compression for 2026 hardware.
   */
  const footerPaddingTop = isMobile ? "pt-16" : "pt-[clamp(4rem,10vh,8rem)]";
  const horizontalPadding = screenSize === 'xs' ? "px-6" : "px-10";

  return (
    <div 
      className={cn(
        "flex flex-col w-full bg-background text-foreground transition-colors duration-1000",
        "selection:bg-primary/20 antialiased overflow-x-hidden relative",
        isStaff && "selection:bg-amber-500/20"
      )}
      style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }} //
    >
      
      {/* 🔮 LIQUID AMBIANCE: Hardware-Fluid Subsurface Radiance */}
      <div 
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 blur-[140px] pointer-events-none -z-10 transition-all duration-1000",
          isStaff ? "bg-amber-500/10" : "bg-primary/[0.04]"
        )} 
        style={{ width: `${viewportWidth}px`, height: `${viewportHeight * 0.6}px` }}
      />

      {/* 📡 RESPONSIVE COMMAND NAVIGATION: Hardware-aware membrane */}
      <Navbar /> //

      {/* 🚀 PRIMARY INGRESS POINT: LIQUID FLOW */}
      <main className="flex-1 w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
        {children}
      </main>

      {/* 🏗️ INFRASTRUCTURE FOOTER: COMPRESSED TACTICAL */}
      <footer 
        className={cn(
          "relative border-t border-white/5 bg-black/40 pb-10 overflow-hidden transition-all duration-1000",
          footerPaddingTop
        )}
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 2.5rem)` }} //
      >
        
        {/* Hardware Watermark: Kinetic Morphology */}
        <Terminal 
          className="absolute -bottom-10 -left-10 opacity-[0.015] -rotate-12 pointer-events-none" 
          style={{ width: `${viewportWidth * 0.2}px`, height: `${viewportWidth * 0.2}px` }}
        />

        <div className={cn("max-w-7xl mx-auto relative z-10", horizontalPadding)}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 mb-20">
            
            {/* BRAND CLUSTER: APEX Branding */}
            <div className="col-span-2 lg:col-span-2 space-y-8">
              <Link 
                href="/" 
                onClick={() => impact("light")}
                className="flex items-center gap-4 group"
              >
                <div className={cn(
                  "size-10 md:size-12 rounded-2xl flex items-center justify-center text-white shadow-apex transition-all duration-700 group-hover:rotate-12",
                  isStaff ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
                )}>
                  {isStaff ? <Globe className="size-5 md:size-6" /> : <Cpu className="size-5 md:size-6" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">
                    Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
                  </span>
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">
                    Apex_Infrastructure
                  </span>
                </div>
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 leading-relaxed max-w-[260px] italic">
                Architecting autonomous merchant infrastructure for the elite signal economy. 
              </p>
            </div>

            {/* INFRASTRUCTURE: NORMALIZED LISTS */}
            <FooterList 
              title="Infrastructure" 
              icon={<Zap className="size-3 text-primary/60" />}
              isStaff={isStaff}
              links={[
                { label: "Merchant_Nodes", href: "#pricing" },
                { label: "Global_Clusters", href: "#infrastructure" },
                { label: "Uptime_Telemetry", href: "/status" }
              ]}
            />

            {/* PROTOCOLS: NORMALIZED LISTS */}
            <FooterList 
              title="Protocols" 
              icon={<ShieldCheck className="size-3 text-primary/60" />}
              isStaff={isStaff}
              links={[
                { label: "Handshake_Rules", href: "/terms" },
                { label: "Data_Encryption", href: "/privacy" },
                { label: "Compliance_Nodes", href: "/compliance" }
              ]}
            />

            {/* SOCIAL HANDSHAKE: COMPACT GEOMETRY */}
            <div className="space-y-8 col-span-2 lg:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 italic">Connect</h4>
              <div className="flex gap-4">
                {[Twitter, Github].map((Icon, i) => (
                  <Link 
                    key={i} 
                    href="#" 
                    onClick={() => impact("light")}
                    className="size-11 rounded-2xl border border-white/5 bg-white/[0.03] flex items-center justify-center hover:border-primary/20 hover:bg-primary/5 transition-all group"
                  >
                    <Icon className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* COMPLIANCE STATUS BAR: NORMALISED */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
               <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground/10 italic">
                 ZIPHA PROTOCOL © 2026 
               </p>
               <div className="flex items-center gap-3 opacity-10">
                 <Terminal className="size-3" />
                 <span className="text-[8px] font-black uppercase tracking-widest italic leading-none">V16.30_APEX</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <Activity className="size-3.5 text-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">
                Network_Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* Liquid Aesthetic Floor */}
        <Waves className="absolute bottom-0 left-0 w-full h-24 opacity-[0.03] text-primary pointer-events-none" />
      </footer>

      {/* 🏛️ SUBSURFACE GRID: Fluid Design Protocol */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000 z-[-1]" 
        style={{ backgroundSize: screenSize === 'xs' ? '32px' : '48px' }}
      />
    </div>
  );
}

/** 🛠️ HELPER: TACTICAL FOOTER LISTS */
function FooterList({ title, icon, links, isStaff }: { title: string, icon: React.ReactNode, isStaff: boolean, links: { label: string, href: string }[] }) {
  const { impact } = useHaptics();
  return (
    <div className="space-y-8">
      <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 flex items-center gap-3 italic">
        {icon} {title}
      </h4>
      <ul className="space-y-5">
        {links.map((link) => (
          <li key={link.label}>
            <Link 
              href={link.href} 
              onMouseEnter={() => impact("light")}
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-all flex items-center group italic"
            >
              <div className={cn(
                "h-px w-0 mr-0 transition-all duration-500 group-hover:w-3 group-hover:mr-2",
                isStaff ? "bg-amber-500" : "bg-primary"
              )} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}