"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, X, LayoutDashboard } from "lucide-react";
import Link from "next/link";

/**
 * 🛡️ GLOBAL NAV GUARD
 * Automatically provides a "Back" or "Exit" action for sub-pages.
 * Prevents user "dead-ends" in the UI.
 */
export function NavGuard() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide the guard on the main home dashboard to keep it clean
  if (pathname === "/dashboard") return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        
        {/* --- DYNAMIC BACK ACTION --- */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group rounded-xl h-10 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        {/* --- BRAND INDICATOR --- */}
        <div className="hidden sm:flex items-center gap-2 opacity-20">
          <LayoutDashboard className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Zipha Command</span>
        </div>

        {/* --- EMERGENCY EXIT --- */}
        <Link href="/dashboard">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          >
            <X className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}