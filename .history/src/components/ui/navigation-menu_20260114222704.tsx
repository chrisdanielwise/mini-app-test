"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID NAVIGATION MENU (Institutional v16.16.12)
 * Logic: Haptic-synced context stream with 700ms "Water Flow" timing.
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
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center transition-all duration-700",
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
      className={cn("group flex flex-1 list-none items-center justify-center gap-2", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-xl",
    "text-[11px] font-black uppercase italic tracking-widest text-foreground/60 transition-all",
    "hover:bg-primary/5 hover:text-primary active:scale-95 disabled:opacity-30 outline-none",
    "data-[state=open]:text-primary data-[state=open]:bg-primary/5"
  )
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  const { selectionChange } = useHaptics();

  return (
    <NavigationMenuPrimitive.Trigger
      onClick={() => selectionChange()}
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-[1px] ml-1.5 size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-data-[state=open]:rotate-180"
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
        "left-0 top-0 w-full p-2 md:absolute md:w-auto",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * 🌊 WATER VIEWPORT
 * Logic: Morphs its geometry like a liquid droplet based on content size.
 */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full flex justify-center perspective-[2000px]">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "relative mt-3 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-2xl border border-white/10 bg-card/80 backdrop-blur-2xl shadow-2xl",
          "md:w-[var(--radix-navigation-menu-viewport-width)]",
          "origin-[top_center] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
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

  return (
    <NavigationMenuPrimitive.Link
      onPointerEnter={() => impact("light")}
      className={cn(
        "flex flex-col gap-1 rounded-lg p-3 text-[12px] font-bold transition-all outline-none",
        "hover:bg-primary/10 hover:text-primary focus:bg-primary/10",
        "data-[active=true]:bg-primary/5 data-[active=true]:text-primary",
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