"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, LayoutDashboard, Terminal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ GLOBAL NAV GUARD (Tier 2)
 * High-resiliency breadcrumb and exit protocol for nested dashboard nodes.
 * Optimized for Telegram Mini App "Swipe-to-Back" safety.
 */
export function NavGuard() {
  const pathname = usePathname();
  const router = useRouter();

  // 🛡️ Root-Level Protection: Hide on the primary dashboard HUD
  if (pathname === "/dashboard") return null;

  return (
    <div className="sticky top-0 z-40 w-full bg-background/40 backdrop-blur-2xl border-b border-border/40 animate-in slide-in-from-top-4 duration-500">
      <div className="max-w-[1400px] mx-auto flex h-14 items-center justify-between px-6">
        
        {/* --- DYNAMIC BACK ACTION --- */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/10 hover:bg-primary/5"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          Previous Node
        </Button>

        {/* --- BREADCRUMB INDICATOR --- */}
        <div className="hidden md:flex items-center gap-3">
          <Terminal className="h-3 w-3 text-primary/30" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
            {pathname.replace("/dashboard/", "CLUSTER // ").toUpperCase()}
          </span>
        </div>

        {/* --- COMMAND HUD EXIT --- */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block h-4 w-px bg-border/40 mx-2" />
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              className="rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-transparent hover:border-rose-500/10"
            >
              Exit Node
              <X className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}