"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { KodaLogo } from "@/components/KodaLogo";
import { createSession, getDemoUser, DEMO_EMPLOYEE, DEMO_EMPLOYER } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email, password, honeypot });

    if (!result.success) {
      const firstError = result.error.errors[0];
      if (firstError.path[0] === "honeypot") {
        await new Promise((r) => setTimeout(r, 1500));
        setError("An error occurred. Please try again.");
        return;
      }
      setError(firstError.message);
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const user = getDemoUser(email, password);
    if (user) {
      createSession(user.email, user.name, user.role);
      if (user.role === "employer") {
        router.push("/employer");
      } else {
        router.push("/dashboard");
      }
    } else {
      setIsLoading(false);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-koda-bg px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-block rounded-lg p-2 hover:bg-slate-100 transition-colors" aria-label="Koda home">
            <KodaLogo size="lg" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-koda-border shadow-lg p-8">
          <h1 className="text-xl font-semibold text-koda-text mb-1">
            Sign in
          </h1>
          <p className="text-sm text-koda-text-muted mb-6">
            Enter your credentials to access your account.
          </p>

          {/* Demo credentials */}
          <div className="mb-5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 space-y-1.5">
            <p className="text-xs font-medium text-koda-text-muted">Demo</p>
            <p className="text-xs text-koda-text font-mono">
              Employee: {DEMO_EMPLOYEE.email} / koda2025
            </p>
            <p className="text-xs text-koda-text font-mono">
              Employer: {DEMO_EMPLOYER.email} / koda2025
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Honeypot */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                pointerEvents: "none",
                overflow: "hidden",
              }}
            >
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-koda-text mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-koda-muted" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full border border-koda-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-koda-text placeholder:text-koda-muted focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-koda-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-koda-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full border border-koda-border rounded-lg pl-10 pr-11 py-2.5 text-sm text-koda-text placeholder:text-koda-muted focus:outline-none focus:ring-2 focus:ring-koda-accent focus:border-transparent bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-koda-muted hover:text-koda-text-muted"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-koda-red">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg font-medium text-sm text-white bg-koda-accent hover:bg-koda-accent/90 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-koda-muted mt-6">
          Secure time tracking for your team
        </p>
      </div>
    </div>
  );
}
