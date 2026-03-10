/**
 * Calculates duration in hours between clock in and clock out times.
 * Returns 0 if either time is invalid or clockOut is before clockIn.
 */
export function calculateDuration(
  clockIn: string,
  clockOut: string
): number {
  if (!clockIn || !clockOut) return 0;
  const [inH, inM] = clockIn.split(":").map(Number);
  const [outH, outM] = clockOut.split(":").map(Number);
  if (
    Number.isNaN(inH) ||
    Number.isNaN(inM) ||
    Number.isNaN(outH) ||
    Number.isNaN(outM)
  )
    return 0;
  const inMinutes = inH * 60 + inM;
  const outMinutes = outH * 60 + outM;
  if (outMinutes <= inMinutes) return 0;
  return (outMinutes - inMinutes) / 60;
}

/** Format hours for display (e.g. 8.5 -> "8h 30m") */
export function formatHours(hours: number): string {
  if (hours <= 0) return "0h 0m";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h 0m`;
}

/**
 * Calculate total hours between two timestamps and format as 'HH:mm'.
 * Returns { hours: number, formatted: string } (e.g. 8.5 -> "08:30").
 */
export function hoursBetweenTimestamps(
  start: Date,
  end: Date
): { hours: number; formatted: string } {
  const ms = end.getTime() - start.getTime();
  const hours = Math.max(0, ms / (1000 * 60 * 60));
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return { hours, formatted };
}

/** Monday of the week for the given date (local time). */
export function getMondayOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
