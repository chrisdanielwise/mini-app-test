"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 🏛️ CONSTANTS (Institutional v9.5.0)
const SB_CK = "node_sb_state";
const SB_W = "16.5rem";
const SB_W_I = "4.75rem";
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
 * 🌊 SIDEBAR PROVIDER
 * Logic: Merged Device Telemetry with Hardware Haptics.
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
  const { isMobile: isMob, isTablet: isTab, isDesktop: isDsk } = useDeviceContext();
  const { selectionChange } = useHaptics();
  
  const [openMob, setOpenMob] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);

  const setOpen = React.useCallback((v: boolean) => {
    _setOpen(v);
    document.cookie = `${SB_CK}=${v}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const toggle = React.useCallback(() => {
    selectionChange();
    return isMob ? setOpenMob((p) => !p) : setOpen(!_open);
  }, [isMob, _open, setOpen, selectionChange]);

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
          className={cn("group/sb-wrapper flex min-h-svh w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]", className)}
        >
          {children}
        </div>
      </TooltipProvider>
    </SBCtx.Provider>
  );
}

/**
 * 🌊 FLUID SIDEBAR
 * Morphology: Sheet (Mobile) -> Transparent Rail (Tablet) -> Glass Node (Desktop)
 */
export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isMob, state, openMobile, setOpenMobile } = React.useContext(SBCtx)!;

  if (isMob) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[280px] p-0 bg-card/95 backdrop-blur-2xl border-r-border/10">
          <SheetHeader className="sr-only"><SheetTitle>Nav</SheetTitle></SheetHeader>
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="group peer hidden md:block" data-state={state}>
      <div className={cn("relative h-full w-[var(--sb-w)] bg-transparent transition-[width] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-data-[state=collapsed]:w-[var(--sb-w-i)]")} />
      <div className={cn(
        "fixed inset-y-0 z-10 flex h-svh w-[var(--sb-w)] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "group-data-[state=collapsed]:w-[var(--sb-w-i)] border-r border-border/5 bg-card/20 backdrop-blur-xl",
        className
      )}>
        <div className="flex h-full w-full flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/**
 * 🌊 TACTICAL TRIGGER
 */
export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = React.useContext(SBCtx)!;
  return (
    <button onClick={toggle} className={cn("p-2 rounded-lg hover:bg-primary/10 transition-colors", className)}>
      <PanelLeftIcon className="size-5" />
    </button>
  );
}

// 🌊 UTILITIES
export const useSidebar = () => React.useContext(SBCtx)!;

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2 p-4", className)}>{children}</div>;
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-1 flex-col gap-2 overflow-auto p-2", className)}>{children}</div>;
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2 p-4 border-t border-border/5", className)}>{children}</div>;
}

const sbBtn = cva(
  "flex w-full items-center gap-3 rounded-xl p-3 text-[11px] font-black uppercase italic tracking-widest transition-all active:scale-95 disabled:opacity-30",
  {
    variants: {
      variant: {
        default: "text-foreground/60 hover:bg-primary/5 hover:text-primary",
        active: "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20",
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
  const { state } = useSidebar();
  
  const handle = () => {
    selectionChange();
    onClick?.();
  };

  return (
    <button onClick={handle} className={cn(sbBtn({ variant: isActive ? "active" : "default" }))}>
      {icon && <span className="shrink-0 size-5 flex items-center justify-center">{icon}</span>}
      {state === "expanded" && <span className="truncate">{children}</span>}
    </button>
  );
}