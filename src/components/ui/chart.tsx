"use client";

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';
import { Activity, Zap } from 'lucide-react';

const THEMES = { light: '', dark: '.dark' } as const;

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
  if (!context) throw new Error('useChart must be used within a <ChartContainer />');
  return context;
}

/**
 * 🛰️ CHART CONTAINER (Apex Tier)
 * Normalized: Fluid aspect ratios for cross-viewport telemetry legibility.
 * Optimized: Adaptive CSS variable injection for real-time theme parity.
 */
function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-[4/3] sm:aspect-video justify-center text-[9px] md:text-[10px] font-black uppercase tracking-widest italic",
          // Global Recharts Override Protocol
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground/40 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/10",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-primary/20 [&_.recharts-dot]:stroke-transparent",
          "[&_.recharts-surface]:outline-none",
          className,
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
 * 🛰️ CHART TOOLTIP CONTENT (Apex Tier)
 * Optimized for high-fidelity glass refraction and institutional data density.
 */
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    return (
      <div className={cn('font-black uppercase italic tracking-tighter text-[10px] md:text-xs mb-1 text-primary', labelClassName)}>
        {labelFormatter ? labelFormatter(value, payload) : value}
      </div>
    );
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  return (
    <div className={cn(
      'min-w-[10rem] rounded-xl border border-border/20 bg-card/80 backdrop-blur-3xl p-3 shadow-2xl',
      className
    )}>
      {tooltipLabel}
      <div className="grid gap-2">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div key={item.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {!hideIndicator && (
                  <div 
                    className={cn("shrink-0 rounded-full", indicator === 'dot' ? 'size-2' : 'w-1 h-3')}
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
                  {itemConfig?.label || item.name}
                </span>
              </div>
              <span className="text-[10px] md:text-xs font-black italic tabular-nums text-foreground">
                {item.value?.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Internal Style & Logic Helpers
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
            }).join('\n')}
          }
        `).join('\n')
    }} />
  );
};

function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
  if (typeof payload !== 'object' || payload === null) return undefined;
  const p = payload.payload;
  let labelKey = key;
  if (key in payload && typeof payload[key] === 'string') labelKey = payload[key];
  else if (p && key in p && typeof p[key] === 'string') labelKey = p[key];
  return labelKey in config ? config[labelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltipContent, ChartStyle };