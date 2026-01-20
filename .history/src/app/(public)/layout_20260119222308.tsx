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
 * Strategy: Adaptive Verticality & Hardware-Aware Padding.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  const { isReady, screenSize, viewportWidth, viewportHeight, safeArea, isMobile } = useDeviceContext();

  // 🛡️ INGRESS SHIELD
  if (!isReady) return <div className="min-h-screen bg-black animate-pulse" />;

  // 📐 MORPHOLOGY: Responsive horizontal axis
  const horizontalPadding = cn(
    screenSize === 'xs' ? "px-6" : "px-8 md:px-12 lg:px-16"
  );

  return (
    <div 
      className={cn(
        "flex flex-col w-full bg-background text-foreground transition-colors duration-700",
        "selection:bg-primary/20 antialiased relative min-h-screen",
        isStaff && "selection:bg-amber-500/20"
      )}
    >
      
      {/* 🌫️ TACTICAL RADIANCE: Responsive Bloom */}
      <div 
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 blur-[120px] opacity-[0.02] pointer-events-none -z-10",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} 
        style={{ 
          width: isMobile ? '100%' : `${viewportWidth * 0.8}px`, 
          height: `${viewportHeight * 0.3}px` 
        }}
      />

      <Navbar />

      {/* 🚀 CONTENT VOLUME */}
      <main className="flex-1 w-full relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-700 overflow-visible">
        {children}
      </main>

      {/* 🏗️ INFRASTRUCTURE FOOTER: Scale-Aware */}
      <footer 
        className="relative border-t border-white/5 bg-zinc-950/40 pt-16 pb-8 overflow-hidden transition-all duration-700"
        style={{ paddingBottom: `calc(${safeArea.bottom}px + 2rem)` }}
      >
        <div className={cn("max-w-7xl mx-auto relative z-10", horizontalPadding)}>
          
          {/* GRID: 1col (xs) -> 2col (sm) -> 5col (lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 mb-16">
            
            {/* BRAND CLUSTER */}
            <div className="sm:col-span-2 lg:col-span-2 space-y-6">
              <Link 
                href="/" 
                onClick={() => impact("light")}
                className="flex items-center gap-3 group leading-none"
              >
                <div className={cn(
                  "size-10 md:size-12 rounded-2xl flex items-center justify-center text-white transition-all duration-500",
                  isStaff ? "bg-amber-500 shadow-lg shadow-amber-500/10" : "bg-primary shadow-lg shadow-primary/10"
                )}>
                  {isStaff ? <Globe className="size-5" /> : <Cpu className="size-5" />}
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                    Zipha<span className={isStaff ? "text-amber-500" : "text-primary"}>.</span>
                  </span>
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">
                    V16.31_APEX_INFRA
                  </span>
                </div>
              </Link>
              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/30 leading-relaxed max-w-xs italic">
                Architecting autonomous merchant clusters for the elite signal economy. Engineered for zero-latency institutional scaling.
              </p>
            </div>

            <FooterList 
              title="Infrastructure" 
              icon={<Zap className="size-3 opacity-20" />}
              isStaff={isStaff}
              links={[
                { label: "Merchant_Nodes", href: "#pricing" },
                { label: "Global_Mesh", href: "#infrastructure" },
                { label: "Status_Live", href: "/status" }
              ]}
            />

            <FooterList 
              title="Protocols" 
              icon={<ShieldCheck className="size-3 opacity-20" />}
              isStaff={isStaff}
              links={[
                { label: "Compliance", href: "/terms" },
                { label: "Vault_Rules", href: "/privacy" },
                { label: "Node_API", href: "/docs" }
              ]}
            />

            {/* SOCIAL HANDSHAKE */}
            <div className="space-y-6 col-span-1">
              <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/20 italic">CONNECT_HANDSHAKE</h4>
              <div className="flex gap-3">
                {[Twitter, Github].map((Icon, i) => (
                  <Link 
                    key={i} 
                    href="#" 
                    className="size-11 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-center hover:bg-white/5 transition-all opacity-30 hover:opacity-100 group"
                  >
                    <Icon className="size-4 group-hover:scale-110 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* COMPLIANCE STATUS: HUD */}
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 leading-none">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/15 italic">
                 ZIPHA_SYSTEMS_INTL © 2026 // ALL_RIGHTS_RESERVED
               </p>
               <div className="flex items-center gap-2.5 opacity-5 italic">
                 <Terminal className="size-3" />
                 <span className="text-[8px] font-mono tracking-widest uppercase">NODE_BUILD: 16.31.20_STABLE</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
              <Activity className="size-3 text-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500/80">
                MESH_SIGNAL_ACTIVE
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 📐 STATIONARY GRID ANCHOR */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000 z-[-1]" 
        style={{ backgroundSize: screenSize === 'xs' ? '32px' : '64px' }}
      />
    </div>
  );
}

/** 🛠️ HELPER: Tactical Footer Lists */
function FooterList({ title, icon, links, isStaff }: any) {
  const { impact } = useHaptics();
  return (
    <div className="space-y-6">
      <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/20 flex items-center gap-2.5 italic">
        {icon} {title}
      </h4>
      <ul className="space-y-3.5">
        {links.map((link: any) => (
          <li key={link.label}>
            <Link 
              href={link.href} 
              onMouseEnter={() => impact("light")}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all flex items-center group italic"
            >
              <div className={cn(
                "h-[1.5px] w-0 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2",
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