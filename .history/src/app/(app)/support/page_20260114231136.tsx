"use client";

import { useTelegramContext } from "@/components/providers/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MessageSquare, 
  ExternalLink, 
  LifeBuoy, 
  ChevronRight, 
  Terminal, 
  Zap,
  Globe,
  Lock,
  Headset
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

/**
 * 🛰️ UNIVERSAL SUPPORT NODE (v12.30.0)
 * Logic: Open Ingress for all Users. 
 * Feature: Automatic Routing (Engineering for Staff, Support Bot for Users).
 */
export default function UserSupportPage() {
  const { isReady, auth, mounted } = useTelegramContext();
  const [tunnelReady, setTunnelReady] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (mounted) setTunnelReady(true);
    const timer = setTimeout(() => { if (!isReady) setIsStuck(true); }, 4000);
    return () => clearTimeout(timer);
  }, [mounted, isReady]);

  // 🛡️ ROLE PROTOCOL: Determines which support channel to show
  const isStaff = useMemo(() => 
    auth.user?.role && ["super_admin", "platform_manager", "platform_support"].includes(auth.user.role),
    [auth.user?.role]
  );

  // 1. SYSTEM INITIALIZATION
  if (!auth.isAuthenticated && (!isReady && !isStuck || !tunnelReady || auth.isLoading)) {
    return <LoadingScreen message="Linking Assistance Protocol..." subtext="SECURE TUNNEL ACTIVE" />;
  }

  // 2. IDENTITY FALLBACK: If user isn't logged in, they still see a "Public Support" option
  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <PublicSupportFallback />
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] animate-in fade-in duration-700 max-w-3xl mx-auto text-foreground">
      <header className="px-6 py-6 md:py-8 bg-card/40 border-b border-border/10 backdrop-blur-2xl rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl h-11 w-11 bg-muted/10 border border-border/10">
            <Link href="/home"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className={cn("h-4 w-4", isStaff ? "text-amber-500" : "text-primary")} />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Institutional Oversight" : "Protocol Assistance"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none">
              Help <span className={cn(isStaff ? "text-amber-500/40" : "text-primary/40")}>& Support</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 pb-36">
        <section className={cn(
          "relative overflow-hidden rounded-[2rem] border p-8 text-center space-y-6 group shadow-2xl transition-all duration-500",
          isStaff ? "bg-amber-500/5 border-amber-500/20" : "bg-card/40 border-border/40 hover:border-primary/20"
        )}>
          <div className={cn(
            "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner",
            isStaff ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/5 border-primary/20"
          )}>
            {isStaff ? <Headset className="h-8 w-8 text-amber-500" /> : <LifeBuoy className="h-8 w-8 text-primary" />}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              {isStaff ? "Engineering Sync" : "Handshake Error?"}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto italic">
              {isStaff 
                ? "Priority developer cluster for root-level intervention." 
                : "Initialize a secure node connection with our tactical support agents."}
            </p>
          </div>
          
          <Button 
            className={cn(
              "w-full rounded-xl h-14 font-black uppercase italic tracking-widest text-[11px] gap-3 shadow-xl transition-all active:scale-95",
              isStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
            )} 
            asChild
          >
            <a href={isStaff ? "https://t.me/your_dev_link" : "https://t.me/your_user_support_bot"} target="_blank" rel="noreferrer">
              <MessageSquare className="h-4 w-4 fill-current" />
              {isStaff ? "Connect to Engineering" : "Initialize Secure Comms"}
              <ExternalLink className="h-3.5 w-3.5 opacity-40" />
            </a>
          </Button>
        </section>

        {/* FAQ List for Users */}
        {!isStaff && <FAQSection />}
      </main>

      <footer className="mt-auto flex items-center justify-center gap-4 opacity-20 py-10">
         <Globe className="h-5 w-5" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] italic text-center">
           Audit Ingress Synchronized // Node: {auth.user?.role?.toUpperCase() || "USER"}
         </p>
      </footer>
    </div>
  );
}

function PublicSupportFallback() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background">
            <div className="rounded-[2.5rem] bg-card border border-primary/10 p-10 shadow-2xl text-center space-y-6">
                <Lock className="h-10 w-10 text-primary mx-auto opacity-40" />
                <h1 className="text-xl font-black uppercase italic tracking-tighter">Public Support Access</h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Identity node offline. You can still reach public support below.</p>
                <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black" asChild>
                    <a href="https://t.me/your_public_support">Open Public Channel</a>
                </Button>
            </div>
        </div>
    );
}

function FAQSection() {
    return (
        <div className="rounded-[2rem] border border-border/40 bg-card/40 divide-y divide-border/10 overflow-hidden shadow-2xl">
            {["Payment Sync Issues", "Account Recovery", "Service Node Status"].map(item => (
                <div key={item} className="p-6 text-xs font-black uppercase italic tracking-tight opacity-70 hover:opacity-100 hover:bg-muted/5 flex justify-between cursor-pointer group">
                    {item}
                    <ChevronRight className="h-4 w-4 opacity-20 group-hover:opacity-100 transition-all" />
                </div>
            ))}
        </div>
    );
}