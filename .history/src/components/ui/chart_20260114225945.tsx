"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 FLUID CHART CONTAINER (Institutional v16.16.12)
 * Logic: Atmospheric telemetry with Momentum-based grid injection.
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

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-[4/3] sm:aspect-video justify-center text-[10px] font-black uppercase tracking-widest italic",
          // 🏛️ Recharts Logic Hardening: v16.16.12 Global Protocol
          "[&_.recharts-cartesian-axis-tick_text]:fill-foreground/30",
          "[&_.recharts-cartesian-grid_line]:stroke-white/5",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-primary/20 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-dasharray-4",
          "[&_.recharts-dot]:stroke-transparent",
          "[&_.recharts-active-dot]:stroke-primary [&_.recharts-active-dot]:stroke-[3px]",
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
 * 🌊 WATER TOOLTIP CONTENT
 * Logic: Haptic-synced telemetry scrub with v9.9.1 Glassmorphism.
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

  // 🏁 TACTILE SYNC: Trigger a micro-tick when the tooltip moves between data nodes
  React.useEffect(() => {
    if (active && payload?.length) {
      selectionChange();
    }
  }, [active, payload, selectionChange]);

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    return (
      <div className="mb-2 text-[11px] font-black uppercase italic tracking-tighter text-primary">
        {labelFormatter ? labelFormatter(value, payload) : value}
      </div>
    );
  }, [label, labelFormatter, payload, hideLabel, config, labelKey]);

  if (!active || !payload?.length) return null;

  return (
    <div className={cn(
      "min-w-[12rem] rounded-2xl border border-white/10 bg-card/90 p-4 shadow-2xl backdrop-blur-2xl",
      "animate-in fade-in zoom-in-95 duration-300",
      className
    )}>
      {tooltipLabel}
      <div className="grid gap-2.5">
        {payload.map((item) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div key={item.dataKey} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div 
                  className={cn("shrink-0 rounded-full", indicator === "dot" ? "size-2" : "w-1 h-3")}
                  style={{ backgroundColor: indicatorColor }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/50">
                  {itemConfig?.label || item.name}
                </span>
              </div>
              <span className="text-[11px] font-black italic tabular-nums text-foreground">
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
 * 🏛️ STYLE ENGINE & LOGIC HELPERS
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