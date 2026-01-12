"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Globe,
  Lock,
  Headset
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ USER SUPPORT NODE
 * Logic: Role-Aware intervention and cryptographic identity validation.
 */
export default function UserSupportPage() {
  const { isReady, auth } = useTelegramContext();

  // 1. SYSTEM INITIALIZATION: Wait for identity handshake
  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Linking Assistance Protocol..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-500">
        <div className="rounded-2xl bg-card border border-rose-500/10 p-8 shadow-2xl text-center space-y-4 max-w-xs relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-10 w-10 text-rose-500 mx-auto opacity-40" />
          <div className="space-y-1">
            <h1 className="text-lg font-black uppercase italic tracking-tight">Support Locked</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Identity signature required to establish a secure comms channel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* --- HUD HEADER: ROLE AWARE --- */}
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
            <div className="flex items-center gap-1.5">
              <Zap className={cn("h-3 w-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[8px] font-black uppercase tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Internal Override" : "Protocol Assistance"}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black uppercase italic tracking-tight leading-none truncate text-foreground">
              Help <span className={cn(isStaff ? "text-amber-500/40" : "text-primary/40")}>& Support</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-32">
        
        {/* --- MAIN INTERVENTION CARD --- */}
        <section className={cn(
          "relative overflow-hidden rounded-xl border p-5 md:p-6 backdrop-blur-md shadow-sm text-center space-y-5 group",
          isStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-card/40 border-border/40"
        )}>
          <Terminal className="absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.03] -rotate-12 pointer-events-none" />

          <div className={cn(
            "mx-auto w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner group-hover:scale-105 transition-transform",
            isStaff ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/5 border-primary/20"
          )}>
            {isStaff ? <Headset className="h-6 w-6 text-amber-500" /> : <LifeBuoy className="h-6 w-6 text-primary" />}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-black uppercase italic tracking-tight text-foreground">
              {isStaff ? "Engineering Sync" : "Identity Crisis?"}
            </h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed max-w-[240px] mx-auto italic">
              {isStaff 
                ? "Access the priority developer node for system-level intervention and audit resolution."
                : "Our team is available via the secure node to resolve any synchronization anomalies."}
            </p>
          </div>
          
          <Button 
            className={cn(
              "w-full rounded-xl h-11 md:h-12 font-black uppercase italic tracking-widest text-[9px] gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-primary-foreground shadow-primary/10"
            )} 
            asChild
          >
            <a href={isStaff ? "https://t.me/zipha_dev_hq" : "https://t.me/your_support_bot"} target="_blank" rel="noreferrer">
              <MessageSquare className="h-3.5 w-3.5 fill-current" />
              {isStaff ? "Contact Engineering" : "Initialize Comms"}
              <ExternalLink className="h-3 w-3 opacity-40" />
            </a>
          </Button>
        </section>

        {/* --- KNOWLEDGE MANIFEST --- */}
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
                <span className={cn(
                  "text-[10px] font-black uppercase italic tracking-tight transition-colors",
                  isStaff ? "text-amber-500/70 group-hover:text-amber-500" : "text-foreground/70 group-hover:text-primary"
                )}>
                  {topic}
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* --- SYSTEM FOOTNOTE --- */}
        <div className="pt-4 flex items-center justify-center gap-2 opacity-20 italic">
           <ShieldCheck className={cn("h-3 w-3", isStaff && "text-amber-500")} />
           <p className="text-[7px] font-black uppercase tracking-[0.4em] text-center">
             {isStaff ? "Oversight Support Tunnel // Verified" : "Verified Support Channel // State: Optimal"}
           </p>
        </div>
      </main>

      <footer className="mt-auto flex items-center justify-center gap-3 opacity-20 py-6">
         <Globe className="h-2.5 w-2.5 text-muted-foreground" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Zipha Support Core // Identity_Node: {auth.user?.role?.toUpperCase()}
         </p>
      </footer>
    </div>
  );
}