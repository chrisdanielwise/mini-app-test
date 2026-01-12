import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Cpu, Globe, ShieldCheck, Twitter, Github } from "lucide-react";
import { Navbar } from "@/components/public/navbar";

/**
 * 🌐 PUBLIC TIER LAYOUT
 * The master shell for Marketing, SEO, and Landing pages.
 * Features: Fluid Responsiveness, High-Resiliency Footer, and Anti-Aliased rendering.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30 antialiased overflow-x-hidden">
      
      {/* 📡 RESPONSIVE NAVIGATION HUB */}
      <Navbar />

      {/* 🚀 MAIN CONTENT FEED */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* 🏗️ INFRASTRUCTURE FOOTER */}
      <footer className="border-t border-border/40 bg-muted/30 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-black italic text-primary-foreground group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="text-xl font-black uppercase italic tracking-tighter">
                  Zipha<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed max-w-xs">
                Empowering the next generation of Telegram merchants with autonomous infrastructure and institutional-grade signal automation.
              </p>
            </div>

            {/* Product Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Infrastructure</h4>
              <ul className="space-y-4">
                <li><Link href="#pricing" className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors">Merchant Nodes</Link></li>
                <li><Link href="#infrastructure" className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors">Global Clusters</Link></li>
                <li><Link href="/status" className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors">System Uptime</Link></li>
              </ul>
            </div>

            {/* Security Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Protocols</h4>
              <ul className="space-y-4">
                <li><Link href="/terms" className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors">Handshake Rules</Link></li>
                <li><Link href="/privacy" className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors">Data Encryption</Link></li>
                <li><Link href="/compliance" className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary transition-colors">KYC Nodes</Link></li>
              </ul>
            </div>

            {/* Social Column */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Connect</h4>
              <div className="flex gap-4">
                <Link href="#" className="h-10 w-10 rounded-xl border border-border/60 bg-card/50 flex items-center justify-center hover:border-primary/50 transition-all">
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link href="#" className="h-10 w-10 rounded-xl border border-border/60 bg-card/50 flex items-center justify-center hover:border-primary/50 transition-all">
                  <Github className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="pt-12 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 text-center md:text-left">
              ZIPHA PROTOCOL © 2026 • AUTOMATION FOR ELITE MERCHANTS
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Node Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}