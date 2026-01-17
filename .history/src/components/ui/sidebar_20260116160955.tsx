"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon, Activity } from "lucide-react";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { cn } from "@/lib/utils";

// 🛰️ Component Primitives
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 🏛️ CONSTANTS: Technical Slim Standard
const SB_CK = "apex_sb_state";
const SB_W = "15.5rem";      // Shrunken from 16.5
const SB_W_I = "4.25rem";    // Shrunken from 4.75
const SB_KEY = "b";

type SB_Ctx = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (o: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (o: boolean) => void;
  toggle: () => void;
  isMob: boolean;
  isTab: boolean;
  isDsk: boolean;
};

const SBCtx = React.createContext<SB_Ctx | null>(null);

/**
 * 🛰️ SIDEBAR_PROVIDER
 * Strategy: Stationary HUD Anchor & Hardware Handshake.
 */
export function SidebarProvider({
  defaultOpen = true,
  className,
  children,
}: {
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const { isMobile: isMob, isTablet: isTab, isDesktop: isDsk, isReady } = useDeviceContext();
  const { selectionChange } = useHaptics();
  
  const [openMob, setOpenMob] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);

  const setOpen = React.useCallback((v: boolean) => {
    _setOpen(v);
    document.cookie = `${SB_CK}=${v}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const toggle = React.useCallback(() => {
    if (isReady) selectionChange();
    return isMob ? setOpenMob((p) => !p) : setOpen(!_open);
  }, [isMob, _open, setOpen, selectionChange, isReady]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === SB_KEY && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [toggle]);

  const val = React.useMemo(() => ({
    state: _open ? ("expanded" as const) : ("collapsed" as const),
    open: _open,
    setOpen,
    openMobile: openMob,
    setOpenMobile: setOpenMob,
    toggle,
    isMob, isTab, isDsk
  }), [_open, setOpen, openMob, toggle, isMob, isTab, isDsk]);

  return (
    <SBCtx.Provider value={val}>
      <TooltipProvider delayDuration={0}>
        <div
          style={{ "--sb-w": SB_W, "--sb-w-i": SB_W_I } as React.CSSProperties}
          className={cn(
            "group/sb-wrapper flex min-h-svh w-full transition-all duration-500",
            className
          )}
        >
          {children}
        </div>
      </TooltipProvider>
    </SBCtx.Provider>
  );
}

/**
 * 🛰️ SIDEBAR_MEMBRANE
 * Strategy: Obsidian-OLED Depth & Laminar Boundary.
 */
export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isMob, state, openMobile, setOpenMobile, isReady } = React.useContext(SBCtx)!;

  if (isMob) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950/95 backdrop-blur-3xl border-r-white/5">
          <SheetHeader className="sr-only"><SheetTitle>Navigation_Terminal</SheetTitle></SheetHeader>
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="group peer hidden md:block" data-state={state}>
      <div className={cn(
        "relative h-full w-[var(--sb-w)] bg-transparent transition-[width] duration-500",
        "group-data-[state=collapsed]:w-[var(--sb-w-i)]"
      )} />
      <div className={cn(
        "fixed inset-y-0 z-[100] flex h-svh w-[var(--sb-w)] transition-all duration-500",
        "group-data-[state=collapsed]:w-[var(--sb-w-i)] border-r border-white/5 bg-zinc-950/20 backdrop-blur-3xl",
        className
      )}>
        <div className="flex h-full w-full flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/**
 * 🛰️ SIDEBAR_TRIGGER
 */
export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = React.useContext(SBCtx)!;
  return (
    <button 
      onClick={toggle} 
      className={cn(
        "p-2 rounded-lg text-muted-foreground/40 hover:bg-primary/5 hover:text-primary transition-all active:scale-95", 
        className
      )}
    >
      <PanelLeftIcon className="size-4" />
    </button>
  );
}

export const useSidebar = () => React.useContext(SBCtx)!;

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5 p-4", className)}>{children}</div>;
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-1 flex-col gap-1 overflow-auto p-2 scrollbar-none", className)}>{children}</div>;
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2 p-4 border-t border-white/5", className)}>{children}</div>;
}

/**
 * 🛰️ SIDEBAR_MENU_BUTTON
 * Strategy: Technical Metadata Scale.
 */
const sbBtn = cva(
  "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[9px] font-black uppercase italic tracking-widest transition-all active:scale-95 disabled:opacity-10",
  {
    variants: {
      variant: {
        default: "text-muted-foreground/40 hover:bg-primary/5 hover:text-primary",
        active: "bg-primary/10 text-primary shadow-lg ring-1 ring-primary/20",
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export function SidebarMenuButton({ 
  children, 
  isActive, 
  icon, 
  onClick 
}: { 
  children: React.ReactNode; 
  isActive?: boolean; 
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const { selectionChange } = useHaptics();
  const { state, isReady } = useSidebar();
  
  const handle = () => {
    if (isReady) selectionChange();
    onClick?.();
  };

  return (
    <button onClick={handle} className={cn(sbBtn({ variant: isActive ? "active" : "default" }))}>
      {icon && <span className="shrink-0 size-4 flex items-center justify-center">{icon}</span>}
      {state === "expanded" && <span className="truncate">{children}</span>}
    </button>
  );
}