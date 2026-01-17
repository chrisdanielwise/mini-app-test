"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

/**
 * 🛰️ CHART_CONTAINER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Velocity & Tactical Grid Ingress.
 * Fix: High-density axis ticks and clinical typography prevent layout blowout.
 */
function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  const { isMobile } = useDeviceContext();

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex justify-center text-[7.5px] md:text-[8.5px] font-black uppercase tracking-[0.3em] italic leading-none",
          // 📐 GEOMETRY LOCK: Clinical mass shrunken for HUD integration
          isMobile ? "aspect-[4/3]" : "aspect-video",
          
          // 🛡️ RECHARTS HARDENING: Institutional Protocol
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground/20",
          "[&_.recharts-cartesian-grid_line]:stroke-white/5",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-primary/10 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-dasharray-4",
          "[&_.recharts-dot]:stroke-transparent",
          "[&_.recharts-active-dot]:stroke-primary [&_.recharts-active-dot]:stroke-[2px]",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/**
 * 🛰️ TOOLTIP_CONTENT
 * Strategy: High-Density Telemetry Scrub.
 */
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  label,
  labelFormatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }) {
  const { config } = useChart();
  const { selectionChange } = useHaptics();
  const { isReady } = useDeviceContext();

  // 🏁 TACTILE SYNC: Hardware-aware node scrub
  React.useEffect(() => {
    if (isReady && active && payload?.length) {
      selectionChange();
    }
  }, [active, payload, selectionChange, isReady]);

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    return (
      <div className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-primary/60">
        {labelFormatter ? labelFormatter(value, payload) : value}
      </div>
    );
  }, [label, labelFormatter, payload, hideLabel, config, labelKey]);

  if (!active || !payload?.length) return null;

  return (
    <div className={cn(
      "min-w-[10rem] rounded-xl border border-white/5 bg-zinc-950/80 p-3 shadow-2xl backdrop-blur-xl",
      "animate-in fade-in zoom-in-98 duration-500",
      className
    )}>
      {tooltipLabel}
      <div className="grid gap-2">
        {payload.map((item) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div key={item.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className={cn("shrink-0 rounded-full", indicator === "dot" ? "size-1.5" : "w-0.5 h-2.5")}
                  style={{ backgroundColor: indicatorColor }}
                />
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">
                  {itemConfig?.label || item.name}
                </span>
              </div>
              <span className="text-[9px] font-black italic tabular-nums text-foreground/80">
                {item.value?.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 🏛️ STYLE ENGINE
 */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;

  return (
    <style dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES).map(([theme, prefix]) => `
          ${prefix} [data-chart=${id}] {
            ${colorConfig.map(([key, item]) => {
              const color = item.theme?.[theme as keyof typeof item.theme] || item.color;
              return color ? `--color-${key}: ${color};` : null;
            }).join("\n")}
          }
        `).join("\n")
    }} />
  );
};

function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const p = payload.payload;
  let labelKey = key;
  if (key in payload && typeof payload[key] === "string") labelKey = payload[key];
  else if (p && key in p && typeof p[key] === "string") labelKey = p[key];
  return labelKey in config ? config[labelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltipContent, ChartStyle };