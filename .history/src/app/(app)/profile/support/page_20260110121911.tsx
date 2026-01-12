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
 * Strategic intervention and help-desk gateway for Zipha subscribers.
 */
export default function UserSupportPage() {
  const { isReady, auth } = useTelegramContext();

  if (!isReady) return null;

  return (
    <div className="min-h-screen space-y-10 pb-32 animate-in fade-in duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <header className="p-8 pt-12 bg-card/40 border-b border-border/40 backdrop-blur-2xl rounded-b-[3.5rem] shadow-2xl">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 bg-muted/10 border border-border/40 transition-all active:scale-90">
            <Link href="/home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Protocol Assistance
              </span>
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              Help <span className="text-muted-foreground/40">& Support</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="px-6 space-y-10">
        
        {/* --- MAIN INTERVENTION CARD --- */}
        <section className="relative overflow-hidden rounded-[3rem] border border-border/40 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl text-center space-y-8 group">
          {/* Subtle Background Icon */}
          <Terminal className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.03] -rotate-12 pointer-events-none" />

          <div className="mx-auto w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <LifeBuoy className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Identity Crisis?</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed opacity-60">
              Our intervention team is available via the <span className="text-primary">Telegram Secure Node</span> to resolve any synchronization or billing anomalies.
            </p>
          </div>
          
          <Button className="w-full rounded-2xl h-16 font-black uppercase italic tracking-[0.2em] text-[11px] gap-3 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" asChild>
            <a href="https://t.me/your_support_bot" target="_blank" rel="noreferrer">
              <MessageSquare className="h-5 w-5 fill-current" />
              Initialize Comms
              <ExternalLink className="h-4 w-4 opacity-50" />
            </a>
          </Button>
        </section>

        {/* --- COMMON TELEMETRY TOPICS --- */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2 opacity-40">
             <HelpCircle className="h-3 w-3" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Knowledge Manifest</h3>
          </div>
          
          <div className="rounded-[2.5rem] border border-border/40 bg-card/20 divide-y divide-border/20 shadow-xl overflow-hidden">
            {[
              "Join Protocol: How to access signals",
              "Renewal Cycle: Extending your node",
              "Billing: Refunding digital assets",
              "Encryption: Data security standards"
            ].map((topic) => (
              <div key={topic} className="flex items-center justify-between p-6 transition-all hover:bg-muted/10 active:bg-muted/20 group cursor-pointer">
                <span className="text-[11px] font-black uppercase italic tracking-tighter text-foreground/80 group-hover:text-primary transition-colors">
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
           <p className="text-[8px] font-black uppercase tracking-[0.5em]">
             Authorized Support Channel // {auth.user?.id?.slice(0, 10)}
           </p>
        </div>
      </div>
    </div>
  );
}