"use client";

import { TaskRow, DAY_KEYS, type DayKey } from "@/types";
import {
  getRowTotalHours,
  getDayTotals,
  getGrandTotalHours,
  parseHour,
} from "@/lib/utils";

const DAY_LABELS: Record<DayKey, string> = {
  sat: "Sat",
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
};

const inputCell =
  "w-full min-w-0 max-w-[4rem] border border-slate-200 rounded px-2 py-1.5 text-center text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent";

interface TimecardGridProps {
  taskRows: TaskRow[];
  onChange: (rowId: string, field: keyof TaskRow, value: string) => void;
}

export function TimecardGrid({ taskRows, onChange }: TimecardGridProps) {
  const dayTotals = getDayTotals(taskRows);
  const grandTotal = getGrandTotalHours(taskRows);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {DAY_KEYS.map((key) => (
              <th
                key={key}
                className="px-2 py-2 text-center font-medium text-slate-600 uppercase tracking-wider whitespace-nowrap"
              >
                {DAY_LABELS[key]}
              </th>
            ))}
            <th className="px-2 py-2 text-center font-medium text-slate-600 uppercase tracking-wider w-16">
              Total
            </th>
            <th className="px-3 py-2 text-left font-medium text-slate-600 uppercase tracking-wider min-w-[140px]">
              Charge number or task description
            </th>
          </tr>
        </thead>
        <tbody>
          {taskRows.map((row, rowIndex) => {
            const rowTotal = getRowTotalHours(row);
            return (
              <tr key={row.id} className="border-b border-slate-100">
                {DAY_KEYS.map((key) => (
                  <td key={key} className="p-1.5">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      value={row[key]}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(row.id, key, v);
                      }}
                      className={inputCell}
                      aria-label={`Row ${rowIndex + 1} ${DAY_LABELS[key]}`}
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 text-center font-medium text-slate-700 tabular-nums">
                  {rowTotal > 0 ? rowTotal.toFixed(1) : "—"}
                </td>
                <td className="p-1.5">
                  <input
                    type="text"
                    placeholder="Task or charge"
                    value={row.description}
                    onChange={(e) => onChange(row.id, "description", e.target.value)}
                    className="w-full min-w-[120px] border border-slate-200 rounded px-2 py-1.5 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent"
                    aria-label={`Row ${rowIndex + 1} description`}
                  />
                </td>
              </tr>
            );
          })}
          <tr className="border-t-2 border-slate-200 bg-slate-50/80 font-medium">
            <td className="px-2 py-2 text-center text-slate-600 font-semibold">
              T
            </td>
            {dayTotals.map((n, i) => (
              <td key={i} className="px-2 py-2 text-center text-slate-800 tabular-nums">
                {n > 0 ? n.toFixed(1) : "—"}
              </td>
            ))}
            <td className="px-2 py-2 text-center text-koda-accent font-semibold tabular-nums">
              {grandTotal > 0 ? grandTotal.toFixed(1) : "—"}
            </td>
            <td className="px-2 py-2" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
