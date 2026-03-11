"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data: LoginInput = {
      email,
      password,
      website: (form.elements.namedItem("website") as HTMLInputElement)?.value,
    };

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    if (parsed.data.website && parsed.data.website.length > 0) {
      setError("Invalid request");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (authError) {
        setError(authError.message ?? "Login failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass border-border/60 shadow-md">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
          </div>
          <div className="absolute -left-[9999px] opacity-0" aria-hidden>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" className="h-11 w-full" disabled={loading} size="lg">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
