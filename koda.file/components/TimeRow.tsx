"use client";

import { DayEntry } from "@/types";
import { formatMinutes } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface TimeRowProps {
  entry: DayEntry;
  onChange: (id: string, field: keyof DayEntry, value: string | boolean) => void;
}

export function TimeRow({ entry, onChange }: TimeRowProps) {
  const hasTimeError =
    entry.enabled &&
    entry.clockIn &&
    entry.clockOut &&
    entry.clockOut <= entry.clockIn;

  const missingDescription = entry.enabled && !entry.description.trim();

  return (
    <div
      className={`rounded-xl transition-all duration-200 ${
        entry.enabled ? "row-active" : "opacity-50"
      }`}
      style={{
        background: entry.enabled
          ? "rgba(22,22,31,0.9)"
          : "rgba(17,17,26,0.5)",
        border: entry.enabled
          ? "1px solid rgba(124,106,247,0.2)"
          : "1px solid rgba(30,30,46,0.6)",
      }}
    >
      {/* Mobile layout */}
      <div className="p-4 lg:hidden">
        {/* Top row: toggle + day + total */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="day-toggle"
              checked={entry.enabled}
              onChange={(e) => onChange(entry.id, "enabled", e.target.checked)}
            />
            <div>
              <div className="font-display font-semibold text-koda-text text-sm">
                {entry.day}
              </div>
              <div className="text-koda-text-muted text-xs font-mono">
                {entry.date}
              </div>
            </div>
          </div>
          <div
            className="font-mono font-bold text-sm px-3 py-1 rounded-lg"
            style={{
              background: entry.dailyTotal > 0 ? "rgba(34,214,122,0.1)" : "rgba(74,74,106,0.15)",
              color: entry.dailyTotal > 0 ? "#22d67a" : "#4a4a6a",
            }}
          >
            {formatMinutes(entry.dailyTotal)}
          </div>
        </div>

        {entry.enabled && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-koda-text-muted mb-1 block">Clock In</label>
                <input
                  type="time"
                  value={entry.clockIn}
                  onChange={(e) => onChange(entry.id, "clockIn", e.target.value)}
                  className="w-full bg-koda-surface border border-koda-border rounded-lg px-3 py-2 text-koda-text font-mono text-sm focus:outline-none focus:border-koda-accent"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-koda-text-muted mb-1 block">Clock Out</label>
                <input
                  type="time"
                  value={entry.clockOut}
                  onChange={(e) => onChange(entry.id, "clockOut", e.target.value)}
                  className={`w-full bg-koda-surface border rounded-lg px-3 py-2 text-koda-text font-mono text-sm focus:outline-none ${
                    hasTimeError
                      ? "border-koda-red focus:border-koda-red"
                      : "border-koda-border focus:border-koda-accent"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-koda-text-muted mb-1 flex items-center gap-1">
                Description
                {missingDescription && (
                  <span className="text-koda-red text-xs">*required</span>
                )}
              </label>
              <input
                type="text"
                placeholder="What did you work on today?"
                value={entry.description}
                onChange={(e) => onChange(entry.id, "description", e.target.value)}
                className={`w-full bg-koda-surface border rounded-lg px-3 py-2 text-koda-text text-sm focus:outline-none placeholder:text-koda-muted ${
                  missingDescription
                    ? "border-amber-500/40 focus:border-amber-500"
                    : "border-koda-border focus:border-koda-accent"
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[auto_1fr_1fr_2fr_auto] items-center gap-4 px-5 py-4">
        {/* Toggle + Day */}
        <div className="flex items-center gap-4 min-w-[160px]">
          <input
            type="checkbox"
            className="day-toggle"
            checked={entry.enabled}
            onChange={(e) => onChange(entry.id, "enabled", e.target.checked)}
          />
          <div>
            <div className="font-display font-semibold text-koda-text">
              {entry.day}
            </div>
            <div className="text-koda-text-muted text-xs font-mono">
              {entry.date}
            </div>
          </div>
        </div>

        {/* Clock In */}
        <div className="relative">
          <input
            type="time"
            value={entry.clockIn}
            disabled={!entry.enabled}
            onChange={(e) => onChange(entry.id, "clockIn", e.target.value)}
            className="w-full bg-koda-surface border border-koda-border rounded-lg px-4 py-2.5 text-koda-text font-mono text-sm focus:outline-none focus:border-koda-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          />
          <div className="absolute -top-2.5 left-3 px-1 text-xs text-koda-text-muted bg-koda-card">
            Clock In
          </div>
        </div>

        {/* Clock Out */}
        <div className="relative">
          <input
            type="time"
            value={entry.clockOut}
            disabled={!entry.enabled}
            onChange={(e) => onChange(entry.id, "clockOut", e.target.value)}
            className={`w-full bg-koda-surface border rounded-lg px-4 py-2.5 text-koda-text font-mono text-sm focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
              hasTimeError
                ? "border-koda-red focus:border-koda-red"
                : "border-koda-border focus:border-koda-accent"
            }`}
          />
          <div className="absolute -top-2.5 left-3 px-1 text-xs text-koda-text-muted bg-koda-card">
            Clock Out
          </div>
          {hasTimeError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle size={14} className="text-koda-red" />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="relative">
          <input
            type="text"
            placeholder="What did you work on today?"
            value={entry.description}
            disabled={!entry.enabled}
            onChange={(e) => onChange(entry.id, "description", e.target.value)}
            className={`w-full bg-koda-surface border rounded-lg px-4 py-2.5 text-koda-text text-sm focus:outline-none placeholder:text-koda-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
              missingDescription
                ? "border-amber-500/40 focus:border-amber-500"
                : "border-koda-border focus:border-koda-accent"
            }`}
          />
          <div className="absolute -top-2.5 left-3 px-1 text-xs text-koda-text-muted bg-koda-card flex items-center gap-1">
            Description
            {missingDescription && (
              <span className="text-amber-500">*</span>
            )}
          </div>
        </div>

        {/* Daily Total */}
        <div
          className="font-mono font-bold text-sm px-4 py-2.5 rounded-lg text-center min-w-[80px] whitespace-nowrap"
          style={{
            background:
              entry.dailyTotal > 0
                ? "rgba(34,214,122,0.1)"
                : "rgba(74,74,106,0.15)",
            color: entry.dailyTotal > 0 ? "#22d67a" : "#4a4a6a",
          }}
        >
          {formatMinutes(entry.dailyTotal)}
        </div>
      </div>
    </div>
  );
}
