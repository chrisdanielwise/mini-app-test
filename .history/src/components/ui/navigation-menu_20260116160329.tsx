"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ NAVIGATION_MENU (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Kinetic Handshake.
 * Fix: Tactical h-9 rail and shrunken metadata scale prevent layout blowout.
 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative z-10 flex max-w-max flex-1 items-center justify-center transition-all duration-500",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn("group flex flex-1 list-none items-center justify-center gap-1.5", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  cn(
    "group inline-flex h-9 w-max items-center justify-center rounded-lg px-3.5",
    "text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/40 transition-all",
    "hover:bg-primary/5 hover:text-primary active:scale-95 disabled:opacity-10 outline-none",
    "data-[state=open]:text-primary data-[state=open]:bg-primary/10"
  )
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  const { selectionChange } = useHaptics();
  const { isReady } = useDeviceContext();

  return (
    <NavigationMenuPrimitive.Trigger
      onClick={() => isReady && selectionChange()}
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-[0.5px] ml-1.5 size-3 transition-transform duration-400 group-data-[state=open]:rotate-180 opacity-20"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "left-0 top-0 w-full p-1.5 md:absolute md:w-auto",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🛰️ VIEWPORT
 * Strategy: Stationary HUD Membrane.
 */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full flex justify-center perspective-[2000px]">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-950/90 backdrop-blur-3xl shadow-2xl",
          "md:w-[var(--radix-navigation-menu-viewport-width)]",
          "origin-[top_center] transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-100",
          className
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  const { impact } = useHaptics();
  const { isReady } = useDeviceContext();

  return (
    <NavigationMenuPrimitive.Link
      onPointerEnter={() => isReady && impact("light")}
      className={cn(
        "flex flex-col gap-1 rounded-md p-2.5 transition-all outline-none",
        "text-[10px] font-black uppercase italic tracking-widest text-muted-foreground/40",
        "hover:bg-primary/5 hover:text-primary focus:bg-primary/5",
        "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
        className
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};