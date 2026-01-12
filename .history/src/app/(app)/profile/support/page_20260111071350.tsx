"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MessageSquare, 
  ExternalLink, 
  LifeBuoy, 
  ChevronRight, 
  Terminal, 
  ShieldCheck, 
  Zap,
  HelpCircle,
  Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ USER SUPPORT NODE (Tactical Medium)
 * Normalized: High-density scannable scale for mobile mini-apps.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
 */
export default function UserSupportPage() {
  const { isReady, auth } = useTelegramContext();

  if (!isReady) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: TACTICAL SYNC --- */}
      <header className="px-5 py-4 md:py-6 bg-card/40 border-b border-border/10 backdrop-blur-xl rounded-b-2xl shadow-lg">
        <div className="flex items-center gap-3.5">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="rounded-lg h-9 w-9 bg-muted/10 border border-border/10 transition-all active:scale-90 shrink-0"
          >
            <Link href="/home">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 opacity-60">
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">
                Protocol Assistance
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black uppercase italic tracking-tight leading-none truncate text-foreground">
              Help <span className="text-primary/40">& Support</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-32">
        
        {/* --- MAIN INTERVENTION CARD: NORMALIZED --- */}
        <section className="relative overflow-hidden rounded-xl border border-border/40 bg-card/40 p-5 md:p-6 backdrop-blur-md shadow-sm text-center space-y-5 group">
          <Terminal className="absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.03] -rotate-12 pointer-events-none" />

          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
            <LifeBuoy className="h-6 w-6 text-primary" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-black uppercase italic tracking-tight text-foreground">Identity Crisis?</h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed max-w-[240px] mx-auto italic">
              Our team is available via the <span className="text-primary font-black">Secure Node</span> to resolve any synchronization anomalies.
            </p>
          </div>
          
          <Button 
            className="w-full rounded-xl h-11 md:h-12 font-black uppercase italic tracking-widest text-[9px] gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-95" 
            asChild
          >
            <a href="https://t.me/your_support_bot" target="_blank" rel="noreferrer">
              <MessageSquare className="h-3.5 w-3.5 fill-current" />
              Initialize Comms
              <ExternalLink className="h-3 w-3 opacity-40" />
            </a>
          </Button>
        </section>

        {/* --- KNOWLEDGE MANIFEST: TIGHT GRID --- */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 px-1 opacity-40 italic">
             <HelpCircle className="h-3 w-3" />
             <h3 className="text-[8px] font-black uppercase tracking-[0.4em]">Knowledge Manifest</h3>
          </div>
          
          <div className="rounded-xl border border-border/40 bg-card/40 divide-y divide-border/10 shadow-sm overflow-hidden">
            {[
              "Join Protocol: Access signals",
              "Renewal Cycle: Extend node",
              "Billing: Asset refunds",
              "Encryption: Data standards"
            ].map((topic) => (
              <div 
                key={topic} 
                className="flex items-center justify-between p-4 transition-all hover:bg-muted/5 active:bg-muted/10 group cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase italic tracking-tight text-foreground/70 group-hover:text-primary transition-colors">
                  {topic}
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* --- SYSTEM FOOTNOTE --- */}
        <div className="pt-4 flex items-center justify-center gap-2 opacity-20 italic">
           <ShieldCheck className="h-3 w-3" />
           <p className="text-[7px] font-black uppercase tracking-[0.4em] text-center">
             Verified Support Channel // State: Optimal
           </p>
        </div>
      </main>

      {/* --- FOOTER SIGNAL --- */}
      <footer className="mt-auto flex items-center justify-center gap-3 opacity-20 py-6">
         <Globe className="h-2.5 w-2.5 text-muted-foreground" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Zipha Support Core // Cluster_Sync: Online
         </p>
      </footer>
    </div>
  );
}