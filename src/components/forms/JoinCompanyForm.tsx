"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JoinCompanyForm() {
  const router = useRouter();
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const code = teamCode.trim();
    if (!code) {
      setError("Please enter a team code.");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (sessionError || !user) {
        setError("You must be signed in to join a company.");
        return;
      }

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("team_code", code)
        .maybeSingle();

      if (companyError || !company) {
        setError("Invalid team code. Please check and try again.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ company_id: company.id })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message ?? "Failed to join company.");
        return;
      }

      router.push("/employee-dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle>Join a company</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="teamCode">Team code</Label>
            <Input
              id="teamCode"
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Enter your team code"
              autoComplete="off"
              disabled={loading}
              className="h-11"
            />
          </div>
          {error && (
            <div
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}
          <Button type="submit" className="h-11 w-full" disabled={loading} size="lg">
            {loading ? "Joining…" : "Join company"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
