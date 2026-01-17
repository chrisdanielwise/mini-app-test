"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Activity } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

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
 * 🛰️ CAROUSEL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Kinetic Handshake.
 * Fix: Tactical size-10 triggers and shrunken typography prevent layout blowout.
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
  const { isReady } = useDeviceContext();
  
  const [carouselRef, api] = useEmblaCarousel(
    { 
      ...opts, 
      axis: orientation === "horizontal" ? "x" : "y",
      duration: 30, // 📐 Clinical Momentum
    },
    plugins
  );
  
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    if (isReady) selectionChange();
  }, [selectionChange, isReady]);

  const scrollPrev = React.useCallback(() => {
    if (isReady) impact("light");
    api?.scrollPrev();
  }, [api, impact, isReady]);

  const scrollNext = React.useCallback(() => {
    if (isReady) impact("light");
    api?.scrollNext();
  }, [api, impact, isReady]);

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
      className="overflow-hidden rounded-xl md:rounded-2xl"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex transition-all duration-500",
          orientation === "horizontal" ? "-ml-3 md:-ml-4" : "-mt-3 md:-mt-4 flex-col",
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
        "min-w-0 shrink-0 grow-0 basis-full transition-all",
        orientation === "horizontal" ? "pl-3 md:pl-4" : "pt-3 md:pt-4",
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
        // 📐 TACTICAL MASS: h-10/size-10 standard
        "absolute size-10 rounded-xl bg-zinc-950/80 backdrop-blur-xl border-white/5 shadow-2xl transition-all active:scale-95 z-20",
        orientation === "horizontal"
          ? "top-1/2 -left-4 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:left-2"
          : "-top-4 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="size-4 opacity-40" />
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
        "absolute size-10 rounded-xl bg-zinc-950/80 backdrop-blur-xl border-white/5 shadow-2xl transition-all active:scale-95 z-20",
        orientation === "horizontal"
          ? "top-1/2 -right-4 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:right-2"
          : "-bottom-4 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="size-4 opacity-40" />
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