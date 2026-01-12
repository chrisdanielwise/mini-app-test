"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, LayoutDashboard, Terminal, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ GLOBAL NAV GUARD
 * Logic: Synchronized with Universal Identity & Theme Flavors.
 * Adaptive: UI shifts to Amber for Staff (Oversight) or Emerald for Merchant (Node).
 */
export function NavGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { flavor } = useLayout();
  
  const isStaffFlavor = flavor === "AMBER";

  // 🛡️ Root-Level Protection: Hide on the primary dashboard HUD
  if (pathname === "/dashboard") return null;

  // Formatting the breadcrumb label for 2026 high-density displays
  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    // Logic: If in staff/dashboard/services, return CLUSTER // SERVICES
    return segments.length > 1 
      ? `CLUSTER // ${segments[segments.length - 1].toUpperCase()}`
      : "NODE // ROOT";
  };

  return (
    <nav className={cn(
      "sticky top-0 z-40 w-full backdrop-blur-2xl border-b transition-all duration-500 animate-in slide-in-from-top-4",
      isStaffFlavor ? "bg-amber-500/[0.02] border-amber-500/20" : "bg-background/40 border-border/40"
    )}>
      <div className="max-w-[1440px] mx-auto flex h-12 md:h-14 items-center justify-between px-4 md:px-6">
        
        {/* --- DYNAMIC BACK ACTION --- */}
        <Button 
          variant="ghost" 
          onClick={() => {
            hapticFeedback("light");
            router.back();
          }}
          className={cn(
            "group rounded-lg md:rounded-xl h-9 md:h-10 px-3 md:px-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all border border-transparent active:scale-95",
            isStaffFlavor 
              ? "text-amber-500/60 hover:text-amber-500 hover:border-amber-500/20 hover:bg-amber-500/5" 
              : "text-muted-foreground hover:text-primary hover:border-primary/10 hover:bg-primary/5"
          )}
        >
          <ArrowLeft className="mr-1.5 md:mr-2 h-3 w-3 md:h-3.5 md:w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden xs:inline">Previous Node</span>
          <span className="xs:hidden">Back</span>
        </Button>

        {/* --- BREADCRUMB INDICATOR --- */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 px-2">
          {isStaffFlavor ? (
            <Globe className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-500/40 shrink-0 animate-pulse" />
          ) : (
            <Terminal className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary/30 shrink-0" />
          )}
          <span className={cn(
            "text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] md:tracking-[0.4em] italic truncate",
            isStaffFlavor ? "text-amber-500/50" : "text-muted-foreground/40"
          )}>
            {getBreadcrumbLabel(pathname)}
          </span>
        </div>

        {/* --- COMMAND HUD EXIT --- */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden sm:block h-4 w-px bg-border/40 mx-2" />
          <Link href="/dashboard" onClick={() => hapticFeedback("light")}>
            <Button 
              variant="ghost" 
              className="rounded-lg md:rounded-xl h-9 md:h-10 px-3 md:px-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-transparent hover:border-rose-500/10 active:scale-95"
            >
              <span className="hidden xs:inline">Exit Node</span>
              <X className="xs:ml-2 h-3 w-3 md:h-3.5 md:w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}