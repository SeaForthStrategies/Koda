"use client";

import { Clock, TrendingUp, Calendar } from "lucide-react";
import { formatMinutes, formatDecimalHours } from "@/lib/utils";
import { DayEntry } from "@/types";

interface WeeklyTotalProps {
  entries: DayEntry[];
  weeklyTotal: number;
  weekLabel: string;
}

export function WeeklyTotal({ entries, weeklyTotal, weekLabel }: WeeklyTotalProps) {
  const activeDays = entries.filter((e) => e.enabled && e.dailyTotal > 0).length;
  const avgPerDay = activeDays > 0 ? Math.round(weeklyTotal / activeDays) : 0;

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: "rgba(16,16,25,0.95)",
        border: "1px solid rgba(124,106,247,0.3)",
        boxShadow: "0 0 40px rgba(124,106,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,106,247,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Grand Total */}
        <div className="sm:col-span-1 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-koda-accent" />
            <span className="text-xs text-koda-text-muted uppercase tracking-widest font-semibold">
              Weekly Total
            </span>
          </div>
          <div
            className="font-display font-bold leading-none"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "-0.03em",
              color: weeklyTotal > 0 ? "#22d67a" : "#4a4a6a",
            }}
          >
            {formatDecimalHours(weeklyTotal)}
          </div>
          <div className="text-koda-text-muted text-sm mt-1">
            {formatMinutes(weeklyTotal)} total
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-koda-border self-stretch" />

        {/* Stats */}
        <div className="sm:col-span-1 flex flex-col justify-center gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-koda-text-muted" />
              <span className="text-sm text-koda-text-muted">Active Days</span>
            </div>
            <span className="font-mono font-semibold text-koda-text">
              {activeDays} / {entries.filter((e) => e.enabled).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-koda-text-muted" />
              <span className="text-sm text-koda-text-muted">Avg / Day</span>
            </div>
            <span className="font-mono font-semibold text-koda-accent-light">
              {formatMinutes(avgPerDay)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-koda-border self-stretch" />

        {/* Week label + mini bars */}
        <div className="sm:col-span-1 flex flex-col justify-center">
          <div className="text-xs text-koda-text-muted mb-3 font-medium">{weekLabel}</div>
          <div className="flex items-end gap-1 h-10">
            {entries.map((e) => {
              const maxMinutes = 600; // 10h reference max
              const height = e.enabled && e.dailyTotal > 0
                ? Math.max(4, Math.round((e.dailyTotal / maxMinutes) * 40))
                : 4;
              return (
                <div key={e.id} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-sm transition-all duration-300"
                    style={{
                      height: `${height}px`,
                      background: e.enabled && e.dailyTotal > 0
                        ? "rgba(124,106,247,0.7)"
                        : "rgba(74,74,106,0.3)",
                    }}
                  />
                  <span className="text-[9px] text-koda-muted leading-none">
                    {e.dayShort[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
