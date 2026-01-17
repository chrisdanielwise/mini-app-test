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
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID CALENDAR (Institutional v16.16.12)
 * Logic: Haptic-synced temporal tracking with organic momentum.
 * Design: v9.9.1 Hardened Glassmorphism.
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

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism Volume
        "bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 group/calendar shadow-2xl",
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
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
        months: cn("flex gap-8 flex-col relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-6", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between z-20",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-10 rounded-2xl border-white/10 bg-card/40 hover:bg-primary/10 hover:text-primary transition-all active:scale-90",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-10 rounded-2xl border-white/10 bg-card/40 hover:bg-primary/10 hover:text-primary transition-all active:scale-90",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-12 w-full px-12 relative z-10",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "select-none font-black uppercase italic tracking-widest text-[13px] text-foreground/90",
          defaultClassNames.caption_label
        ),
        table: "w-full border-separate border-spacing-y-2",
        weekday: cn(
          "text-muted-foreground/30 flex-1 font-black text-[10px] uppercase tracking-[0.3em] select-none text-center italic",
          defaultClassNames.weekday
        ),
        day: cn(
          "relative w-full h-full p-0 text-center select-none flex items-center justify-center",
          defaultClassNames.day
        ),
        outside: cn("text-muted-foreground/10", defaultClassNames.outside),
        disabled: cn("text-muted-foreground opacity-20", defaultClassNames.disabled),
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
          return <Icon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * 🌊 WATER DAY BUTTON
 * Logic: Kinetic selection with primary radiance.
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const { impact } = useHaptics();

  return (
    <button
      {...props}
      onClick={(e) => {
        impact("light"); // 🏁 TACTILE SYNC: Micro-click on date engage
        props.onClick?.(e);
      }}
      className={cn(
        "relative size-10 md:size-12 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "text-[11px] font-black uppercase italic tracking-widest leading-none outline-none",
        "hover:bg-primary/10 hover:text-primary active:scale-90",
        
        // 🌊 SELECTION RADIANCE
        modifiers.selected && [
          "bg-primary text-primary-foreground shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)]",
          "hover:bg-primary hover:text-primary-foreground scale-110 z-10"
        ],
        
        // 🏛️ TODAY INDICATOR
        modifiers.today && !modifiers.selected && "border border-primary/30 bg-primary/5 text-primary",
        className
      )}
    >
      {day.date.getDate()}
      {modifiers.today && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary animate-pulse" />
      )}
    </button>
  );
}

export { Calendar, CalendarDayButton };