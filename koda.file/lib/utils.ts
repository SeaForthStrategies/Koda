import { DayEntry, TaskRow, DAY_KEYS, type DayKey } from "@/types";

/**
 * Parse a "HH:MM" time string into total minutes from midnight.
 */
export function parseTimeToMinutes(time: string): number {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Calculate duration between clockIn and clockOut in minutes.
 * Returns 0 if times are invalid or clockOut <= clockIn.
 */
export function calculateDuration(clockIn: string, clockOut: string): number {
  if (!clockIn || !clockOut) return 0;
  const inMinutes = parseTimeToMinutes(clockIn);
  const outMinutes = parseTimeToMinutes(clockOut);
  if (outMinutes <= inMinutes) return 0;
  return outMinutes - inMinutes;
}

/**
 * Format minutes into "Xh Ym" display string.
 */
export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) return "—";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Format minutes as decimal hours for totals (e.g. 7.5h).
 */
export function formatDecimalHours(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0.00h";
  const hours = (totalMinutes / 60).toFixed(2);
  return `${hours}h`;
}

/**
 * Get the start of the current work week (Monday).
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Build a week label like "Jun 2 – Jun 8, 2025"
 */
export function getWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(weekStart)} – ${fmt(weekEnd)}, ${weekEnd.getFullYear()}`;
}

/**
 * Get week start (Monday) for an offset: 0 = this week, -1 = last week, etc.
 */
export function getWeekStartByOffset(offset: number): Date {
  const base = getWeekStart();
  const d = new Date(base);
  d.setDate(base.getDate() + offset * 7);
  return d;
}

/**
 * Get the Friday (week-ending) date for the week that contains the given date.
 * Week is Sat–Fri; so Saturday uses the previous Friday, Sunday the previous Friday, Mon–Fri use the coming Friday.
 */
export function getWeekEndingFriday(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const daysToFriday =
    day === 6 ? -1 : day === 0 ? -2 : 5 - day; // Sat→-1, Sun→-2, Mon→4, Tue→3, Wed→2, Thu→1, Fri→0
  d.setDate(d.getDate() + daysToFriday);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get week-ending Friday for an offset: 0 = this week, -1 = last week, etc.
 */
export function getWeekEndingFridayByOffset(offset: number): Date {
  const base = getWeekEndingFriday();
  const d = new Date(base);
  d.setDate(base.getDate() + offset * 7);
  return d;
}

/**
 * Format week as "Week ending Friday, Mar 14, 2025".
 */
export function getWeekEndingLabel(friday: Date): string {
  return friday.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Parse hour string to number (e.g. "8" -> 8, "" -> 0). Max 24.
 */
export function parseHour(s: string): number {
  const n = parseFloat(String(s).trim());
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(24, n);
}

/**
 * Build 5 empty task rows for the grid. Seed id from week so resetting week gets new ids.
 */
export function buildTaskRows(seedId: string = "default"): TaskRow[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `task-${seedId}-${i}`,
    sat: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    description: "",
  }));
}

/**
 * Compute row total (hours) for a task row.
 */
export function getRowTotalHours(row: TaskRow): number {
  return DAY_KEYS.reduce((sum, key) => sum + parseHour(row[key]), 0);
}

/**
 * Compute per-day totals (hours) across all task rows. Returns [sat, sun, ..., fri].
 */
export function getDayTotals(rows: TaskRow[]): number[] {
  return DAY_KEYS.map((key) =>
    rows.reduce((sum, row) => sum + parseHour(row[key]), 0)
  );
}

/**
 * Grand total hours for the week from task rows.
 */
export function getGrandTotalHours(rows: TaskRow[]): number {
  return rows.reduce((sum, row) => sum + getRowTotalHours(row), 0);
}

/**
 * Format a Date as YYYY-MM-DD for input[type="date"].
 */
export function formatDateForInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parse YYYY-MM-DD to Date (noon UTC to avoid timezone shifts).
 */
export function parseDateFromInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Build initial week entries. All toggles default to off. Optional weekStart for a specific week.
 */
export function buildWeekEntries(weekStart?: Date): DayEntry[] {
  const days = [
    { day: "Monday", dayShort: "Mon" },
    { day: "Tuesday", dayShort: "Tue" },
    { day: "Wednesday", dayShort: "Wed" },
    { day: "Thursday", dayShort: "Thu" },
    { day: "Friday", dayShort: "Fri" },
    { day: "Saturday", dayShort: "Sat" },
    { day: "Sunday", dayShort: "Sun" },
  ];

  const start = weekStart ? getWeekStart(weekStart) : getWeekStart();

  return days.map((d, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      id: `day-${start.getTime()}-${i}`,
      day: d.day,
      dayShort: d.dayShort,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      enabled: false,
      clockIn: "",
      clockOut: "",
      description: "",
      dailyTotal: 0,
    };
  });
}

/**
 * Generate email HTML for the weekly summary.
 */
export function generateEmailHTML(
  entries: DayEntry[],
  weeklyTotal: number,
  submitterName: string,
  weekLabel: string
): string {
  const activeEntries = entries.filter((e) => e.enabled);

  const rows = activeEntries
    .map(
      (e) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #1e1e2e; font-weight: 600; color: #a89df9; white-space: nowrap;">${e.day}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #1e1e2e; color: #7a7a9a; font-family: monospace; white-space: nowrap;">${e.date}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #1e1e2e; color: #e8e8f0; font-family: monospace; white-space: nowrap;">${e.clockIn || "—"}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #1e1e2e; color: #e8e8f0; font-family: monospace; white-space: nowrap;">${e.clockOut || "—"}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #1e1e2e; color: #22d67a; font-weight: 600; white-space: nowrap;">${formatMinutes(e.dailyTotal)}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #1e1e2e; color: #e8e8f0; max-width: 300px;">${e.description || "<em style='color:#4a4a6a'>No description</em>"}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Koda Time Report — ${weekLabel}</title>
</head>
<body style="margin: 0; padding: 0; background: #0a0a0f; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;">
  <div style="max-width: 700px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-flex; align-items: center; gap: 12px; background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3); border-radius: 16px; padding: 12px 24px; margin-bottom: 24px;">
        <span style="font-size: 24px;">⏱</span>
        <span style="font-size: 22px; font-weight: 800; color: #e8e8f0; letter-spacing: -0.5px;">KODA</span>
      </div>
      <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: #e8e8f0; letter-spacing: -0.5px;">Weekly Time Report</h1>
      <p style="margin: 0; color: #7a7a9a; font-size: 15px;">${weekLabel}</p>
      <p style="margin: 8px 0 0; color: #a89df9; font-size: 14px; font-weight: 500;">Submitted by ${submitterName}</p>
    </div>

    <!-- Summary Card -->
    <div style="background: #16161f; border: 1px solid #1e1e2e; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 4px; color: #7a7a9a; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Weekly Grand Total</p>
      <p style="margin: 0; color: #22d67a; font-size: 48px; font-weight: 800; letter-spacing: -2px;">${formatDecimalHours(weeklyTotal)}</p>
      <p style="margin: 8px 0 0; color: #4a4a6a; font-size: 13px;">${activeEntries.length} active day${activeEntries.length !== 1 ? "s" : ""}</p>
    </div>

    <!-- Time Table -->
    <div style="background: #16161f; border: 1px solid #1e1e2e; border-radius: 16px; overflow: hidden; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(124,106,247,0.08);">
            <th style="padding: 14px 16px; text-align: left; color: #7a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Day</th>
            <th style="padding: 14px 16px; text-align: left; color: #7a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Date</th>
            <th style="padding: 14px 16px; text-align: left; color: #7a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">In</th>
            <th style="padding: 14px 16px; text-align: left; color: #7a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Out</th>
            <th style="padding: 14px 16px; text-align: left; color: #7a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Total</th>
            <th style="padding: 14px 16px; text-align: left; color: #7a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Description</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>

    <!-- Legal Note -->
    <div style="background: rgba(247, 79, 106, 0.08); border: 1px solid rgba(247, 79, 106, 0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 32px;">
      <p style="margin: 0; color: #f74f6a; font-size: 12px; line-height: 1.6;">
        <strong>⚖️ Legal / Accuracy Notice:</strong> By submitting this timecard, the employee certifies that the hours and descriptions reported are accurate and complete to the best of their knowledge. Falsification of time records may result in disciplinary action up to and including termination, and may be subject to applicable legal penalties.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; border-top: 1px solid #1e1e2e; padding-top: 24px;">
      <p style="margin: 0; color: #4a4a6a; font-size: 12px;">Sent via <strong style="color: #7a7a9a;">Koda Time Tracking</strong> · This is an automated message</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate email HTML for grid timecard (hours per day, task rows).
 */
export function generateEmailHTMLForGrid(
  taskRows: TaskRow[],
  weeklyTotalHours: number,
  submitterName: string,
  weekLabel: string,
  remarks: string
): string {
  const dayLabels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const dayTotals = getDayTotals(taskRows);

  const taskRowsHtml = taskRows
    .map((row) => {
      const rowTotal = getRowTotalHours(row);
      const cells = DAY_KEYS.map((k) => {
        const v = row[k]?.trim();
        return `<td style="padding: 10px 12px; border-bottom: 1px solid #1e1e2e; color: #e8e8f0; text-align: center;">${v || "—"}</td>`;
      }).join("");
      return `
    <tr>
      ${cells}
      <td style="padding: 10px 12px; border-bottom: 1px solid #1e1e2e; color: #22d67a; font-weight: 600; text-align: center;">${rowTotal > 0 ? rowTotal.toFixed(1) : "—"}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #1e1e2e; color: #e8e8f0;">${row.description || "<em style='color:#4a4a6a'>—</em>"}</td>
    </tr>`;
    })
    .join("");

  const totalRowCells = dayTotals
    .map((n) => `<td style="padding: 10px 12px; border-bottom: 1px solid #1e1e2e; color: #22d67a; font-weight: 700; text-align: center;">${n > 0 ? n.toFixed(1) : "—"}</td>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Koda Timecard — ${weekLabel}</title>
</head>
<body style="margin: 0; padding: 0; background: #0a0a0f; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;">
  <div style="max-width: 720px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #e8e8f0;">Weekly Timecard</h1>
      <p style="margin: 0; color: #7a7a9a; font-size: 14px;">${weekLabel}</p>
      <p style="margin: 8px 0 0; color: #a89df9; font-size: 13px;">Submitted by ${submitterName}</p>
    </div>
    <div style="background: #16161f; border: 1px solid #1e1e2e; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 4px; color: #7a7a9a; font-size: 12px; text-transform: uppercase;">Total Hours</p>
      <p style="margin: 0; color: #22d67a; font-size: 36px; font-weight: 800;">${weeklyTotalHours.toFixed(1)}h</p>
    </div>
    <div style="background: #16161f; border: 1px solid #1e1e2e; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(124,106,247,0.08);">
            ${dayLabels.map((l) => `<th style="padding: 10px 12px; text-align: center; color: #7a7a9a; font-size: 11px; text-transform: uppercase;">${l}</th>`).join("")}
            <th style="padding: 10px 12px; text-align: center; color: #7a7a9a; font-size: 11px;">Total</th>
            <th style="padding: 10px 12px; text-align: left; color: #7a7a9a; font-size: 11px;">Charge / Task</th>
          </tr>
        </thead>
        <tbody>
          ${taskRowsHtml}
          <tr style="background: rgba(34,214,122,0.08);">
            ${totalRowCells}
            <td style="padding: 10px 12px; font-weight: 700; text-align: center; color: #22d67a;">${weeklyTotalHours.toFixed(1)}</td>
            <td style="padding: 10px 12px;"></td>
          </tr>
        </tbody>
      </table>
    </div>
    ${remarks.trim() ? `<div style="background: #16161f; border: 1px solid #1e1e2e; border-radius: 12px; padding: 16px; margin-bottom: 24px;"><p style="margin: 0 0 6px; color: #7a7a9a; font-size: 11px;">Remarks</p><p style="margin: 0; color: #e8e8f0; font-size: 14px; white-space: pre-wrap;">${remarks.trim()}</p></div>` : ""}
    <div style="text-align: center; border-top: 1px solid #1e1e2e; padding-top: 24px;">
      <p style="margin: 0; color: #4a4a6a; font-size: 12px;">Koda Time Tracking</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Simple honeypot validation — returns true if the honeypot field is empty (human).
 */
export function isHuman(honeypotValue: string): boolean {
  return honeypotValue === "";
}

/**
 * Validate an array of email strings.
 */
export function parseEmailList(raw: string): string[] {
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}
