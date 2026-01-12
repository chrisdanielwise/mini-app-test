'use client'

import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Calendar as CalendarIcon,
  Zap
} from 'lucide-react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { hapticFeedback } from '@/lib/telegram/webapp'

/**
 * 🛰️ CALENDAR (Apex Tier)
 * Normalized: World-standard fluid typography and institutional squircle geometry.
 * Optimized: Adaptive haptics and touch-safe cell targets for Merchant temporal tracking.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-card/40 backdrop-blur-3xl border border-border/40 rounded-[2rem] p-4 group/calendar',
        '--cell-size:theme(spacing.10) md:--cell-size:theme(spacing.11)',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex gap-6 flex-col relative',
          defaultClassNames.months,
        ),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between z-20',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'size-9 rounded-xl border-border/20 bg-muted/10 hover:bg-primary/5 hover:text-primary transition-all active:scale-90',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'size-9 rounded-xl border-border/20 bg-muted/10 hover:bg-primary/5 hover:text-primary transition-all active:scale-90',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex items-center justify-center h-10 w-full px-12 relative z-10',
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          'select-none font-black uppercase italic tracking-tighter text-sm md:text-base text-foreground',
          defaultClassNames.caption_label,
        ),
        table: 'w-full border-separate border-spacing-y-1',
        weekdays: cn('flex mb-2', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground/40 rounded-md flex-1 font-black text-[9px] uppercase tracking-[0.2em] select-none text-center italic',
          defaultClassNames.weekday,
        ),
        week: cn('flex w-full mt-1', defaultClassNames.week),
        day: cn(
          'relative w-full h-full p-0 text-center group/day aspect-square select-none flex items-center justify-center',
          defaultClassNames.day,
        ),
        today: cn(
          'relative [&_button]:text-primary [&_button]:font-black',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-muted-foreground/20 aria-selected:text-muted-foreground/40',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'text-muted-foreground opacity-20',
          defaultClassNames.disabled,
        ),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          const Icon = orientation === 'left' ? ChevronLeftIcon : orientation === 'right' ? ChevronRightIcon : ChevronDownIcon;
          return <Icon className={cn('size-4', className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => hapticFeedback("light")}
      className={cn(
        'size-10 md:size-11 rounded-xl md:rounded-2xl transition-all duration-300 text-[10px] md:text-xs font-black uppercase italic tracking-widest leading-none',
        'hover:bg-primary/10 hover:text-primary active:scale-90',
        modifiers.selected && [
          'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground',
          'scale-105 z-10'
        ],
        modifiers.today && !modifiers.selected && 'border border-primary/20 bg-primary/5',
        className,
      )}
      {...props}
    >
      {day.date.getDate()}
      {modifiers.today && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
      )}
    </Button>
  )
}

export { Calendar, CalendarDayButton }