"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const website = (form.elements.namedItem("website") as HTMLInputElement)?.value;
    const joinCode = (form.elements.namedItem("joinCode") as HTMLInputElement)?.value?.trim() ?? "";

    if (website?.length) {
      setError("Invalid request");
      return;
    }
    if (!firstName || !lastName) {
      setError("First and last name required");
      return;
    }
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, joinCode: joinCode || undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Sign up failed");
        return;
      }
      setSuccess(json.message ?? "Account created. You can sign in now.");
      if (json.message?.toLowerCase().includes("confirm")) {
        router.push("/confirm-email");
        router.refresh();
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jane"
                autoComplete="given-name"
                required
                disabled={loading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                autoComplete="family-name"
                required
                disabled={loading}
                className="h-11"
              />
            </div>
          </div>
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
              required
              disabled={loading}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joinCode" className="text-sm font-medium">
              Team code <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="joinCode"
              name="joinCode"
              type="text"
              placeholder="e.g. ABC123"
              autoComplete="off"
              maxLength={10}
              disabled={loading}
              className="h-11 font-mono tracking-wider"
            />
            <p className="text-xs text-muted-foreground">
              Get this from your employer to join their team. Your timecards will appear in their dashboard.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">At least 8 characters</p>
          </div>
          <div className="absolute -left-[9999px] opacity-0" aria-hidden>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground" role="status">
              {success}{" "}
              <Link href="/confirm-email" className="font-medium underline underline-offset-2">
                Confirm your email
              </Link>
              {" · "}
              <Link href="/login" className="font-medium underline underline-offset-2">
                Sign in
              </Link>
            </div>
          )}
          <Button type="submit" className="h-11 w-full" disabled={loading} size="lg">
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
