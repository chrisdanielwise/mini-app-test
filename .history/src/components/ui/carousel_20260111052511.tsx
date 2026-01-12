'use client'

import * as React from 'react'
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { hapticFeedback } from '@/lib/telegram/webapp'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error('useCarousel must be used within a <Carousel />')
  return context
}

/**
 * 🛰️ CAROUSEL (Apex Tier)
 * Normalized: World-standard fluid typography and institutional squircle geometry.
 * Optimized: Adaptive haptics and kinetic navigation for high-resiliency signal feeds.
 */
function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    hapticFeedback("light")
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    hapticFeedback("light")
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => { api?.off('select', onSelect) }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative group/carousel', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden rounded-2xl md:rounded-[2.5rem]"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4 md:-ml-6' : '-mt-4 md:-mt-6 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full transition-all duration-500',
        orientation === 'horizontal' ? 'pl-4 md:pl-6' : 'pt-4 md:pt-6',
        className,
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      className={cn(
        'absolute size-10 md:size-12 rounded-xl md:rounded-2xl bg-card/40 backdrop-blur-xl border-border/40 shadow-2xl transition-all active:scale-90 z-20',
        orientation === 'horizontal'
          ? 'top-1/2 -left-4 md:-left-6 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:left-4 md:group-hover/carousel:-left-6'
          : '-top-4 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="size-4 md:size-5" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      className={cn(
        'absolute size-10 md:size-12 rounded-xl md:rounded-2xl bg-card/40 backdrop-blur-xl border-border/40 shadow-2xl transition-all active:scale-90 z-20',
        orientation === 'horizontal'
          ? 'top-1/2 -right-4 md:-right-6 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:right-4 md:group-hover/carousel:-right-6'
          : '-bottom-4 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="size-4 md:size-5" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}