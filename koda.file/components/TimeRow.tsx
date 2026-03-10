"use client";

import { DayEntry } from "@/types";
import { formatMinutes } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface TimeRowProps {
  entry: DayEntry;
  onChange: (id: string, field: keyof DayEntry, value: string | boolean) => void;
}

const inputBase =
  "w-full border border-koda-border rounded-lg px-3 py-2 text-sm text-koda-text placeholder:text-koda-muted focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent bg-white disabled:bg-slate-50 disabled:text-koda-muted disabled:cursor-not-allowed";

export function TimeRow({ entry, onChange }: TimeRowProps) {
  const hasTimeError =
    entry.enabled &&
    entry.clockIn &&
    entry.clockOut &&
    entry.clockOut <= entry.clockIn;
  const missingDescription = entry.enabled && !entry.description.trim();

  return (
    <div className="border-b border-koda-border last:border-b-0">
      {/* Mobile */}
      <div className="lg:hidden px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="day-toggle"
              checked={entry.enabled}
              onChange={(e) => onChange(entry.id, "enabled", e.target.checked)}
            />
            <div>
              <div className="font-medium text-koda-text text-sm">{entry.day}</div>
              <div className="text-xs text-koda-text-muted font-mono">{entry.date}</div>
            </div>
          </div>
          <span
            className={`text-sm font-mono font-medium px-2.5 py-1 rounded ${
              entry.dailyTotal > 0 ? "bg-emerald-50 text-koda-green" : "bg-slate-100 text-koda-muted"
            }`}
          >
            {formatMinutes(entry.dailyTotal)}
          </span>
        </div>
        {entry.enabled && (
          <div className="space-y-3 pl-[52px]">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-koda-text-muted mb-1">Clock in</label>
                <input
                  type="time"
                  value={entry.clockIn}
                  onChange={(e) => onChange(entry.id, "clockIn", e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-xs text-koda-text-muted mb-1">Clock out</label>
                <input
                  type="time"
                  value={entry.clockOut}
                  onChange={(e) => onChange(entry.id, "clockOut", e.target.value)}
                  className={`${inputBase} ${hasTimeError ? "border-koda-red focus:ring-red-500" : ""}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-koda-text-muted mb-1">
                Description {missingDescription && <span className="text-amber-600">*</span>}
              </label>
              <input
                type="text"
                placeholder="What did you work on?"
                value={entry.description}
                onChange={(e) => onChange(entry.id, "description", e.target.value)}
                className={`${inputBase} ${missingDescription ? "border-amber-400 focus:ring-amber-500" : ""}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div
        className={`hidden lg:grid lg:grid-cols-[140px_100px_100px_1fr_80px] lg:gap-4 lg:px-5 lg:py-3 lg:items-center ${
          !entry.enabled ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-center gap-3 min-w-[140px]">
          <input
            type="checkbox"
            className="day-toggle"
            checked={entry.enabled}
            onChange={(e) => onChange(entry.id, "enabled", e.target.checked)}
          />
          <div>
            <div className="font-medium text-koda-text text-sm">{entry.day}</div>
            <div className="text-xs text-koda-text-muted font-mono">{entry.date}</div>
          </div>
        </div>

        <input
          type="time"
          value={entry.clockIn}
          disabled={!entry.enabled}
          onChange={(e) => onChange(entry.id, "clockIn", e.target.value)}
          className={inputBase}
        />

        <div className="relative">
          <input
            type="time"
            value={entry.clockOut}
            disabled={!entry.enabled}
            onChange={(e) => onChange(entry.id, "clockOut", e.target.value)}
            className={`${inputBase} ${hasTimeError ? "border-koda-red focus:ring-red-500" : ""}`}
          />
          {hasTimeError && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-koda-red">
              <AlertCircle size={14} />
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="Work description"
          value={entry.description}
          disabled={!entry.enabled}
          onChange={(e) => onChange(entry.id, "description", e.target.value)}
          className={`${inputBase} ${missingDescription ? "border-amber-400 focus:ring-amber-500" : ""}`}
        />

        <div
          className={`text-center text-sm font-mono font-medium py-2 rounded ${
            entry.dailyTotal > 0 ? "bg-emerald-50 text-koda-green" : "bg-slate-100 text-koda-muted"
          }`}
        >
          {formatMinutes(entry.dailyTotal)}
        </div>
      </div>
    </div>
  );
}
