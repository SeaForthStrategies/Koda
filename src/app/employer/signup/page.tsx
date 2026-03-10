"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function EmployerSignupPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmedCompany = companyName.trim();
    const name = fullName.trim();
    const trimmedEmail = email.trim();
    if (!trimmedCompany) {
      setError("Company name is required.");
      return;
    }
    if (!name) {
      setError("Full name is required.");
      return;
    }
    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });

      if (signUpError) {
        setError(signUpError.message ?? "Sign up failed");
        return;
      }

      if (!data.user) {
        setError("Sign up failed");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          email: trimmedEmail,
          role: "employer",
        })
        .eq("id", data.user.id);

      if (profileError) {
        setError(profileError.message ?? "Could not update profile.");
        return;
      }

      const createRes = await fetch("/api/employer/create-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: trimmedCompany }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) {
        setError(createJson.error ?? "Could not create company.");
        return;
      }

      router.push("/employer-dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="border-b border-border/80 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="text-base font-semibold text-foreground sm:text-lg">
            Koda
          </Link>
          <Link
            href="/employer/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Employer sign in
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-[380px] space-y-8 sm:max-w-md">
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight">Create Employer Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Set up your company and manage employee timecards.
            </p>
          </div>
          <Card className="border-border/80 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium">
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Acme Inc."
                    autoComplete="organization"
                    required
                    disabled={loading}
                    className="h-11"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                    disabled={loading}
                    className="h-11"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    disabled={loading}
                    className="h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">At least 8 characters</p>
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
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground">
            Need an employee account instead?{" "}
            <Link
              href="/employee/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up as employee
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
