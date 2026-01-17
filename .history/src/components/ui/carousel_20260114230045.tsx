"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/lib/hooks/use-haptics";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}

/**
 * 🌊 FLUID CAROUSEL (Institutional v16.16.12)
 * Logic: Kinetic-synced stream with momentum snapping.
 */
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const { impact, selectionChange } = useHaptics();
  
  const [carouselRef, api] = useEmblaCarousel(
    { 
      ...opts, 
      axis: orientation === "horizontal" ? "x" : "y",
      duration: 35, // 🚀 Momentum Hardening
    },
    plugins
  );
  
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    selectionChange(); // 🏁 KINETIC SYNC: Feel the snap as a new item anchors
  }, [selectionChange]);

  const scrollPrev = React.useCallback(() => {
    impact("light");
    api?.scrollPrev();
  }, [api, impact]);

  const scrollNext = React.useCallback(() => {
    impact("light");
    api?.scrollNext();
  }, [api, impact]);

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => { api?.off("select", onSelect); };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        className={cn("relative group/carousel", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden rounded-[2rem] md:rounded-[3rem]"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          orientation === "horizontal" ? "-ml-4 md:-ml-6" : "-mt-4 md:-mt-6 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full transition-all duration-700",
        orientation === "horizontal" ? "pl-4 md:pl-6" : "pt-4 md:pt-6",
        className
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      className={cn(
        // 🏛️ Style Hardening: v9.9.1 Glassmorphism
        "absolute size-12 rounded-2xl bg-card/80 backdrop-blur-2xl border-white/10 shadow-2xl transition-all active:scale-90 z-20",
        orientation === "horizontal"
          ? "top-1/2 -left-6 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:left-4"
          : "-top-6 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="size-5" />
      <span className="sr-only">Previous</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      className={cn(
        "absolute size-12 rounded-2xl bg-card/80 backdrop-blur-2xl border-white/10 shadow-2xl transition-all active:scale-90 z-20",
        orientation === "horizontal"
          ? "top-1/2 -right-6 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:right-4"
          : "-bottom-6 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="size-5" />
      <span className="sr-only">Next</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};