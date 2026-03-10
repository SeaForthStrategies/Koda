import { DayEntry } from "@/types";

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
 * Build initial week entries for the current week.
 */
export function buildWeekEntries(): DayEntry[] {
  const days = [
    { day: "Monday", dayShort: "Mon" },
    { day: "Tuesday", dayShort: "Tue" },
    { day: "Wednesday", dayShort: "Wed" },
    { day: "Thursday", dayShort: "Thu" },
    { day: "Friday", dayShort: "Fri" },
    { day: "Saturday", dayShort: "Sat" },
    { day: "Sunday", dayShort: "Sun" },
  ];

  const weekStart = getWeekStart();

  return days.map((d, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return {
      id: `day-${i}`,
      day: d.day,
      dayShort: d.dayShort,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      enabled: i < 5, // Mon–Fri active by default
      clockIn: i < 5 ? "09:00" : "",
      clockOut: i < 5 ? "17:00" : "",
      description: "",
      dailyTotal: i < 5 ? calculateDuration("09:00", "17:00") : 0,
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
