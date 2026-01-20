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
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🧩 Tactical Components
import { Navbar } from "@/components/public/navbar";

/**
 * 🛰️ PUBLIC_LAYOUT (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density footer (pt-12) and shrunken iconography prevent blowout.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  const { isReady, screenSize, viewportWidth, viewportHeight, safeArea, isMobile } = useDeviceContext();

  if (!isReady) return <div className="min-h-screen bg-black animate-pulse" />;

  const horizontalPadding = screenSize === 'xs' ? "px-5" : "px-8";

  return (
    <div 
      className={cn(
        "flex flex-col w-full bg-background text-foreground transition-colors duration-700",
        "selection:bg-primary/20 antialiased overflow-x-hidden relative",
        isStaff && "selection:bg-amber-500/20"
      )}
      style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }}
    >
      
      {/* 🌫️ TACTICAL RADIANCE */}
      <div 
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 blur-[120px] opacity-[0.02] pointer-events-none -z-10",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} 
        style={{ width: `${viewportWidth}px`, height: `${viewportHeight * 0.3}px` }}
      />

      <Navbar />

      <main className="flex-1 w-full relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>

      {/* 🏗️ INFRASTRUCTURE FOOTER: Tactical Slim */}
      <footer 
        className="relative border-t border-white/5 bg-zinc-950/40 pt-12 pb-8 overflow-hidden transition-all duration-700"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 1.5rem)` }}
      >
        <div className={cn("max-w-6xl mx-auto relative z-10", horizontalPadding)}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 mb-12">
            
            {/* BRAND CLUSTER: Compressed size-9 */}
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <Link 
                href="/" 
                onClick={() => impact("light")}
                className="flex items-center gap-3 group leading-none"
              >
                <div className={cn(
                  "size-9 md:size-10 rounded-xl flex items-center justify-center text-white transition-all duration-500",
                  isStaff ? "bg-amber-500 shadow-lg shadow-amber-500/10" : "bg-primary shadow-lg shadow-primary/10"
                )}>
                  {isStaff ? <Globe className="size-4" /> : <Cpu className="size-4" />}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground">
                    Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
                  </span>
                  <span className="text-[6.5px] font-black uppercase tracking-[0.3em] opacity-20 italic">
                    APEX_INFRA
                  </span>
                </div>
              </Link>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 leading-tight max-w-[220px] italic">
                Architecting autonomous merchant clusters for the elite signal economy. 
              </p>
            </div>

            <FooterList 
              title="Infra" 
              icon={<Zap className="size-2.5 opacity-20" />}
              isStaff={isStaff}
              links={[
                { label: "Merchant_Nodes", href: "#pricing" },
                { label: "Global_Mesh", href: "#infrastructure" },
                { label: "Status_Live", href: "/status" }
              ]}
            />

            <FooterList 
              title="Protocols" 
              icon={<ShieldCheck className="size-2.5 opacity-20" />}
              isStaff={isStaff}
              links={[
                { label: "Compliance", href: "/terms" },
                { label: "Vault_Rules", href: "/privacy" }
              ]}
            />

            {/* SOCIAL HANDSHAKE: size-9 Standard */}
            <div className="space-y-6 col-span-2 lg:col-span-1">
              <h4 className="text-[7.5px] font-black uppercase tracking-[0.3em] text-foreground/10 italic">CONNECT</h4>
              <div className="flex gap-2.5">
                {[Twitter, Github].map((Icon, i) => (
                  <Link 
                    key={i} 
                    href="#" 
                    className="size-9 rounded-lg border border-white/5 bg-white/[0.01] flex items-center justify-center hover:bg-white/5 transition-all opacity-20 hover:opacity-100"
                  >
                    <Icon className="size-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* COMPLIANCE STATUS: Stationary HUD */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 leading-none">
            <div className="flex items-center gap-6">
               <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/10 italic">
                 ZIPHA_PROTOCOL © 2026 
               </p>
               <div className="flex items-center gap-2 opacity-5 italic">
                 <Terminal className="size-2.5" />
                 <span className="text-[7px] font-mono tracking-widest uppercase">v16.31_APEX</span>
               </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <Activity className="size-2.5 text-emerald-500 animate-pulse" />
              <span className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500/60">
                SIGNAL_OK
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000 z-[-1]" 
        style={{ backgroundSize: screenSize === 'xs' ? '32px' : '48px' }}
      />
    </div>
  );
}

/** 🛠️ HELPER: Tactical Footer Lists */
function FooterList({ title, icon, links, isStaff }: any) {
  const { impact } = useHaptics();
  return (
    <div className="space-y-5">
      <h4 className="text-[7.5px] font-black uppercase tracking-[0.3em] text-foreground/10 flex items-center gap-2 italic">
        {icon} {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link: any) => (
          <li key={link.label}>
            <Link 
              href={link.href} 
              onMouseEnter={() => impact("light")}
              className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-all flex items-center group italic"
            >
              <div className={cn(
                "h-[1.5px] w-0 mr-0 transition-all duration-300 group-hover:w-2.5 group-hover:mr-1.5",
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