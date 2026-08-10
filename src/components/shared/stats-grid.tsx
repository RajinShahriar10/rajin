"use client";

import { AnimatedNumber } from "@/components/shared/animated-number";
import { parseStat } from "@/lib/stats";
import { cn } from "@/lib/utils";

export type StatItem = { id: string; label: string; value: string };

type StatsGridProps = {
  stats: StatItem[];
  className?: string;
  valueClassName?: string;
};

/**
 * Key-value stat grid that animates numeric values with a count-up effect.
 * Non-numeric values render as plain text.
 */
export function StatsGrid({ stats, className, valueClassName }: StatsGridProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border",
        className,
      )}
    >
      {stats.map((stat) => {
        const parsed = parseStat(stat.value);
        return (
          <div key={stat.id} className="flex flex-col gap-1 bg-card px-5 py-4">
            <dd
              className={cn(
                "order-1 font-display text-2xl font-semibold text-foreground",
                valueClassName,
              )}
            >
              {parsed.number !== null ? (
                <AnimatedNumber
                  value={parsed.number}
                  prefix={parsed.prefix}
                  suffix={parsed.suffix}
                />
              ) : (
                stat.value
              )}
            </dd>
            <dt className="order-2 text-xs text-muted-foreground">{stat.label}</dt>
          </div>
        );
      })}
    </dl>
  );
}
