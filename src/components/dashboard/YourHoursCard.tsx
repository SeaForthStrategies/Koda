"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hoursBetweenTimestamps } from "@/lib/time";

type TimecardEntry = {
  id: string;
  check_in: string;
  check_out: string;
  total_hours: number;
  status: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatHoursHHMM(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function YourHoursCard() {
  const [timecards, setTimecards] = useState<TimecardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me/timecards")
      .then((res) => (res.ok ? res.json() : { timecards: [] }))
      .then((data) => setTimecards(data.timecards ?? []))
      .finally(() => setLoading(false));
  }, []);

  const totalHours = timecards.reduce((sum, t) => sum + Number(t.total_hours), 0);
  const recent = timecards.slice(0, 14);

  return (
    <Card className="glass border-border/60 shadow-md">
      <CardHeader>
        <CardTitle className="text-base">Your hours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : timecards.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No timecards yet. Submit a week above to see your hours here.
          </p>
        ) : (
          <>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {formatHoursHHMM(totalHours)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                total ({timecards.length} entries)
              </span>
            </p>
            <div className="rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pl-3 pr-2">Date</th>
                    <th className="py-2 pr-3 text-right">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => {
                    const { formatted } = hoursBetweenTimestamps(
                      new Date(t.check_in),
                      new Date(t.check_out)
                    );
                    return (
                      <tr key={t.id} className="border-b border-border/80 last:border-0">
                        <td className="py-2 pl-3 pr-2">{formatDate(t.check_in)}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{formatted}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {timecards.length > 14 && (
              <p className="text-xs text-muted-foreground">
                Showing latest 14. Total entries: {timecards.length}.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
