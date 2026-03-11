"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TimeEntry = {
  id: string;
  user_id: string;
  company_id: string | null;
  check_in: string;
  check_out: string;
  total_hours: number;
  status: string | null;
  created_at: string;
};

type EmployeeDashboardClientProps = {
  user: { id: string; email?: string | null };
  profile: { company_id?: string | null } | null;
  initialEntries: TimeEntry[];
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function EmployeeDashboardClient({
  user,
  profile,
  initialEntries,
}: EmployeeDashboardClientProps) {
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut) {
      setError("Please provide both check-in and check-out times.");
      return;
    }

    if (!profile?.company_id) {
      setError("Missing company information for this user.");
      return;
    }

    setSubmitting(true);
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const checkInIso = checkInDate.toISOString();
      const checkOutIso = checkOutDate.toISOString();
      const hours =
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);

      const supabase = getSupabaseClient();
      const { data, error: insertError } = await supabase
        .from("time_entries")
        .insert({
          user_id: user.id,
          company_id: profile.company_id,
          check_in: checkInIso,
          check_out: checkOutIso,
          total_hours: hours,
          status: "pending",
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message ?? "Failed to submit time entry.");
        return;
      }

      if (data) {
        setEntries((prev) => [data as TimeEntry, ...prev]);
        setCheckIn("");
        setCheckOut("");
      }
    } catch {
      setError("Network error while submitting time entry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold tracking-tight">Your time entries</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View your recent time entries and add new ones.
        </p>
      </section>

      <Card className="glass border-border/60 shadow-md">
        <CardHeader>
          <CardTitle>Add a new time entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in</Label>
                <Input
                  id="checkIn"
                  type="datetime-local"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out</Label>
                <Input
                  id="checkOut"
                  type="datetime-local"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>
            {error && (
              <div
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            )}
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit time entry"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass border-border/60 shadow-md">
        <CardHeader>
          <CardTitle>Recent entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any time entries yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4">Check in</th>
                    <th className="py-2 pr-4">Check out</th>
                    <th className="py-2 pr-4">Total hours</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/80">
                      <td className="py-2 pr-4">{formatDateTime(entry.check_in)}</td>
                      <td className="py-2 pr-4">{formatDateTime(entry.check_out)}</td>
                      <td className="py-2 pr-4">
                        {typeof entry.total_hours === "number"
                          ? entry.total_hours.toFixed(2)
                          : ""}
                      </td>
                      <td className="py-2 pr-4">{entry.status ?? "—"}</td>
                      <td className="py-2">{formatDateTime(entry.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
