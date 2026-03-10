"use client";

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
  const maxMinutes = 600;

  return (
    <div className="bg-white rounded-2xl border border-koda-border shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-koda-text-muted uppercase tracking-wider mb-1">
            {weekLabel}
          </p>
          <p className="text-2xl font-semibold text-koda-text">
            <span className="text-koda-green">{formatDecimalHours(weeklyTotal)}</span>
            <span className="text-koda-text-muted font-normal text-base ml-2">
              ({formatMinutes(weeklyTotal)})
            </span>
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="text-koda-text-muted">
            <strong className="text-koda-text font-medium">{activeDays}</strong> active days
          </span>
          <span className="text-koda-text-muted">
            Avg <strong className="text-koda-text font-medium">{formatMinutes(avgPerDay)}</strong>/day
          </span>
        </div>
      </div>
      {/* Mini bar chart */}
      <div className="flex items-end gap-1 mt-4 h-8">
        {entries.map((e) => {
          const height =
            e.enabled && e.dailyTotal > 0
              ? Math.max(4, Math.round((e.dailyTotal / maxMinutes) * 32))
              : 4;
          const active = e.enabled && e.dailyTotal > 0;
          return (
            <div
              key={e.id}
              className={`flex-1 rounded-sm transition-colors ${active ? "bg-koda-accent" : "bg-slate-200"}`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>
    </div>
  );
}
