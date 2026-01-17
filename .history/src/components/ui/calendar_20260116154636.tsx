"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ CALENDAR (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology Handshake.
 * Fix: Tactical size-9/10 nodes and shrunken typography prevent layout blowout.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();
  const { isMobile } = useDeviceContext();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // 📐 GEOMETRY LOCK: Clinical mass shrunken by 20%
        "bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-2xl transition-all duration-500",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }).toUpperCase(),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between z-20",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-8 rounded-lg border-white/5 bg-zinc-950/40 hover:bg-primary/10 hover:text-primary transition-all active:scale-95",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-8 rounded-lg border-white/5 bg-zinc-950/40 hover:bg-primary/10 hover:text-primary transition-all active:scale-95",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-10 w-full px-10 relative z-10",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "select-none font-black uppercase italic tracking-widest text-[11px] text-foreground/80 leading-none",
          defaultClassNames.caption_label
        ),
        table: "w-full border-separate border-spacing-y-1",
        weekday: cn(
          "text-muted-foreground/20 flex-1 font-black text-[7.5px] uppercase tracking-[0.2em] select-none text-center italic leading-none",
          defaultClassNames.weekday
        ),
        day: cn(
          "relative w-full h-full p-0 text-center select-none flex items-center justify-center",
          defaultClassNames.day
        ),
        outside: cn("text-muted-foreground/10", defaultClassNames.outside),
        disabled: cn("text-muted-foreground opacity-10", defaultClassNames.disabled),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeftIcon
              : orientation === "right"
              ? ChevronRightIcon
              : ChevronDownIcon;
          return <Icon className={cn("size-3", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * 🛰️ DAY_BUTTON
 * Strategy: High-Density Kinetic Selection.
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const { impact } = useHaptics();
  const { isMobile, isReady } = useDeviceContext();

  return (
    <button
      {...props}
      onClick={(e) => {
        if (isReady) impact("light");
        props.onClick?.(e);
      }}
      className={cn(
        // 📐 TACTICAL MASS: Institutional Standard
        "relative size-9 md:size-10 rounded-xl transition-all duration-300",
        "text-[9px] font-black uppercase italic tracking-widest leading-none outline-none",
        "hover:bg-primary/10 hover:text-primary active:scale-95",
        
        // 🌫️ SELECTION RADIANCE (Laminar Depth)
        modifiers.selected && [
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
          "hover:bg-primary hover:text-primary-foreground scale-105 z-10"
        ],
        
        // 🛡️ TODAY INDICATOR
        modifiers.today && !modifiers.selected && "border border-primary/20 bg-primary/5 text-primary",
        className
      )}
    >
      {day.date.getDate()}
      {modifiers.today && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary opacity-40 animate-pulse" />
      )}
    </button>
  );
}

export { Calendar, CalendarDayButton };