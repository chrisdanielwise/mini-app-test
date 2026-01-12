import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Cpu, Globe, ShieldCheck, Twitter, Github, Terminal, Activity } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { cn } from "@/lib/utils";

/**
 * 🌐 PUBLIC TIER LAYOUT (Apex Standard)
 * Normalized: Fixed fluid typography and responsive grid constraints.
 * Optimized: Enhanced touch targets and visual hierarchy for mobile staff.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background selection:bg-primary/30 antialiased overflow-x-hidden">
      
      {/* 📡 RESPONSIVE COMMAND NAVIGATION */}
      <Navbar />

      {/* 🚀 PRIMARY INGRESS POINT */}
      <main className="flex-1 w-full relative">
        {/* Ambient Page Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/[0.02] blur-[120px] pointer-events-none -z-10" />
        {children}
      </main>

      {/* 🏗️ INFRASTRUCTURE FOOTER: THE TRUST ANCHOR */}
      <footer className="relative border-t border-border/40 bg-muted/20 pt-16 md:pt-24 lg:pt-32 pb-12 md:pb-16 overflow-hidden">
        
        {/* Background Watermark */}
        <Terminal className="absolute -bottom-10 -left-10 h-48 w-48 md:h-64 md:w-64 opacity-[0.02] -rotate-12 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20 mb-16 md:mb-24">
            
            {/* Brand Cluster */}
            <div className="space-y-6 md:space-y-8">
              <Link href="/" className="flex items-center gap-3 md:gap-4 group">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-all duration-500">
                  <Cpu className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                </div>
                <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">
                  Zipha<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-relaxed max-w-xs opacity-60">
                Architecting autonomous merchant infrastructure for the elite signal economy. 
                Deploy your node. Scale your cluster.
              </p>
            </div>

            {/* Infrastructure Manifest */}
            <div className="space-y-6 md:space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground flex items-center gap-2 italic">
                <Zap className="h-3 w-3 text-primary" /> Infrastructure
              </h4>
              <ul className="space-y-4 md:space-y-5">
                {[
                  { label: "Merchant Nodes", href: "#pricing" },
                  { label: "Global Clusters", href: "#infrastructure" },
                  { label: "Uptime Telemetry", href: "/status" }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center group">
                      <div className="h-0.5 w-0 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Manifest */}
            <div className="space-y-6 md:space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground flex items-center gap-2 italic">
                <ShieldCheck className="h-3 w-3 text-primary" /> Protocols
              </h4>
              <ul className="space-y-4 md:space-y-5">
                {[
                  { label: "Handshake Rules", href: "/terms" },
                  { label: "Data Encryption", href: "/privacy" },
                  { label: "Compliance Nodes", href: "/compliance" }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center group">
                       <div className="h-0.5 w-0 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Handshake */}
            <div className="space-y-6 md:space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground italic">Connect</h4>
              <div className="flex gap-3 md:gap-4">
                {[Twitter, Github].map((Icon, i) => (
                  <Link key={i} href="#" className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl border border-border/40 bg-card/40 flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all group">
                    <Icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
              <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">
                Direct_Channel_Active
              </p>
            </div>
          </div>

          {/* Institutional Compliance Bar */}
          <div className="pt-8 md:pt-12 lg:pt-16 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
               <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground/40 italic">
                 ZIPHA PROTOCOL © 2026 
               </p>
               <div className="h-1 w-1 rounded-full bg-border hidden sm:block" />
               <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground/40 italic">
                 V2.0.26_STABLE
               </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-inner">
                <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-500">
                  Network Synchronized
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}