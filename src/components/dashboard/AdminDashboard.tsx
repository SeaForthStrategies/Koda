"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hoursBetweenTimestamps } from "@/lib/time";

type TimecardRow = {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  total_hours: number;
  status: string;
  email?: string;
  full_name?: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatHoursHHMM(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function AdminDashboard() {
  const [timecards, setTimecards] = useState<TimecardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    setLoading(true);
    setError(null);
    fetch(`/api/admin/timecards?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 503 ? "Admin not configured" : "Failed to load");
        return res.json();
      })
      .then((data) => setTimecards(data.timecards ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [from, to]);

  const byUser = timecards.reduce<Record<string, TimecardRow[]>>((acc, t) => {
    const key = t.user_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const userList = Object.entries(byUser).sort((a, b) => {
    const aName = a[1][0]?.email ?? a[0];
    const bName = b[1][0]?.email ?? b[0];
    return String(aName).localeCompare(String(bName));
  });

  return (
    <Card className="glass border-border/60 shadow-md">
      <CardHeader>
        <CardTitle>Timecards</CardTitle>
        <div className="flex flex-wrap items-end gap-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="from" className="text-xs">
              From
            </Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="to" className="text-xs">
              To
            </Label>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-40"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-sm text-destructive mb-4" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : userList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No timecards in this range.</p>
        ) : (
          <div className="space-y-6">
            {userList.map(([userId, cards]) => {
              const displayName = cards[0]?.full_name || cards[0]?.email || userId.slice(0, 8);
              const total = cards.reduce((sum, c) => sum + Number(c.total_hours), 0);
              return (
                <div key={userId} className="rounded-lg border border-border p-4">
                  <h3 className="font-medium text-foreground mb-1">
                    {displayName}
                    {cards[0]?.email && (
                      <span className="text-muted-foreground font-normal text-sm ml-2">
                        {cards[0].email}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Total: {formatHoursHHMM(total)} ({cards.length} entries)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                          <th className="py-2 pr-4">Check in</th>
                          <th className="py-2 pr-4">Check out</th>
                          <th className="py-2 pr-4">Hours</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cards.map((t) => {
                          const { formatted } = hoursBetweenTimestamps(
                            new Date(t.check_in),
                            new Date(t.check_out)
                          );
                          return (
                            <tr key={t.id} className="border-b border-border/80">
                              <td className="py-2 pr-4">{formatDate(t.check_in)}</td>
                              <td className="py-2 pr-4">{formatDate(t.check_out)}</td>
                              <td className="py-2 pr-4">{formatted}</td>
                              <td className="py-2">{t.status}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
