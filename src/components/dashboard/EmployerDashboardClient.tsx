"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProfileRow = {
  full_name: string | null;
  email: string | null;
};

type TimeEntryRow = {
  id: string;
  check_in: string;
  check_out: string;
  total_hours: number;
  status: string | null;
  profiles: ProfileRow | ProfileRow[] | null;
};

type EmployerDashboardClientProps = {
  teamCode?: string;
  initialEntries: TimeEntryRow[];
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getProfile(entry: TimeEntryRow): ProfileRow | null {
  const p = entry.profiles;
  if (!p) return null;
  return Array.isArray(p) ? p[0] ?? null : p;
}

export default function EmployerDashboardClient({
  teamCode,
  initialEntries,
}: EmployerDashboardClientProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<TimeEntryRow[]>(initialEntries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(entryId: string, status: "approved" | "rejected") {
    setError(null);
    setUpdatingId(entryId);
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase
        .from("time_entries")
        .update({ status })
        .eq("id", entryId);

      if (updateError) {
        setError(updateError.message ?? "Update failed");
        return;
      }
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, status } : e))
      );
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold tracking-tight">
          Company time entries
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review and approve or reject employee time entries.
        </p>
        {teamCode && (
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Team code for employees: </span>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono font-semibold">
              {teamCode}
            </code>
          </p>
        )}
      </section>

      <Card className="glass border-border/60 shadow-md">
        <CardHeader>
          <CardTitle>Time entries</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div
              className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No time entries for your company yet.
            </p>
          ) : (
            <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee name</TableHead>
                  <TableHead>Employee email</TableHead>
                  <TableHead>Check in</TableHead>
                  <TableHead>Check out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const profile = getProfile(entry);
                  const isUpdating = updatingId === entry.id;
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {profile?.full_name ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {profile?.email ?? "—"}
                      </TableCell>
                      <TableCell>{formatDateTime(entry.check_in)}</TableCell>
                      <TableCell>{formatDateTime(entry.check_out)}</TableCell>
                      <TableCell>
                        {typeof entry.total_hours === "number"
                          ? entry.total_hours.toFixed(2)
                          : "—"}
                      </TableCell>
                      <TableCell>{entry.status ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStatus(entry.id, "approved")}
                            disabled={isUpdating || entry.status === "approved"}
                          >
                            {isUpdating ? "…" : "Approve"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setStatus(entry.id, "rejected")}
                            disabled={isUpdating || entry.status === "rejected"}
                          >
                            {isUpdating ? "…" : "Reject"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
