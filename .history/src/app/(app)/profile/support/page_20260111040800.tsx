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
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ USER SUPPORT NODE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive haptics and touch-safe targets for high-resiliency support.
 */
export default function UserSupportPage() {
  const { isReady, auth } = useTelegramContext();

  if (!isReady) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-8 md:space-y-10 pb-32 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HUD HEADER --- */}
      <header className="px-5 py-8 md:p-8 md:pt-12 bg-card/40 border-b border-border/40 backdrop-blur-2xl rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-xl">
        <div className="flex items-center gap-4 md:gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="rounded-xl md:rounded-2xl h-10 w-10 md:h-12 md:w-12 bg-muted/10 border border-border/40 transition-all active:scale-90 shrink-0"
          >
            <Link href="/home">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary">
                Protocol Assistance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter leading-none truncate">
              Help <span className="text-muted-foreground/40">& Support</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-8 md:space-y-10">
        
        {/* --- MAIN INTERVENTION CARD --- */}
        <section className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-border/40 bg-card/40 p-6 md:p-10 backdrop-blur-3xl shadow-2xl text-center space-y-6 md:space-y-8 group">
          {/* Subtle Background Icon */}
          <Terminal className="absolute -bottom-6 -right-6 h-24 w-24 md:h-32 md:w-32 opacity-[0.03] -rotate-12 pointer-events-none" />

          <div className="mx-auto w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
            <LifeBuoy className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">Identity Crisis?</h2>
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed opacity-60 max-w-[280px] md:max-w-md mx-auto">
              Our intervention team is available via the <span className="text-primary font-black">Telegram Secure Node</span> to resolve any synchronization or billing anomalies.
            </p>
          </div>
          
          <Button 
            className="w-full rounded-xl md:rounded-2xl h-14 md:h-16 font-black uppercase italic tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] gap-2 md:gap-3 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95" 
            asChild
          >
            <a href="https://t.me/your_support_bot" target="_blank" rel="noreferrer">
              <MessageSquare className="h-4 w-4 md:h-5 md:w-5 fill-current" />
              Initialize Comms
              <ExternalLink className="h-3 w-3 md:h-4 md:w-4 opacity-50" />
            </a>
          </Button>
        </section>

        {/* --- COMMON TELEMETRY TOPICS --- */}
        <section className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 px-2 opacity-40 italic">
             <HelpCircle className="h-3 w-3" />
             <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Knowledge Manifest</h3>
          </div>
          
          <div className="rounded-3xl md:rounded-[2.5rem] border border-border/40 bg-card/20 divide-y divide-border/10 shadow-xl overflow-hidden">
            {[
              "Join Protocol: Access signals",
              "Renewal Cycle: Extend node",
              "Billing: Asset refunds",
              "Encryption: Data standards"
            ].map((topic) => (
              <div 
                key={topic} 
                className="flex items-center justify-between p-5 md:p-6 transition-all hover:bg-muted/10 active:bg-muted/20 group cursor-pointer"
              >
                <span className="text-[10px] md:text-[11px] font-black uppercase italic tracking-tighter text-foreground/80 group-hover:text-primary transition-colors">
                  {topic}
                </span>
                <ChevronRight className="h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* --- SYSTEM FOOTNOTE --- */}
        <div className="pt-4 flex items-center justify-center gap-3 opacity-20 group italic">
           <ShieldCheck className="h-3 w-3" />
           <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-center">
             Authorized Support Channel // Node_{auth.user?.id?.slice(0, 8)}
           </p>
        </div>
      </div>
    </div>
  );
}