"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { KodaLogo } from "@/components/KodaLogo";
import { createSession, DEMO_CREDENTIALS } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot trap
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate with Zod
    const result = loginSchema.safeParse({ email, password, honeypot });

    if (!result.success) {
      const firstError = result.error.errors[0];
      // If honeypot triggered, silently fail (don't reveal bot detection)
      if (firstError.path[0] === "honeypot") {
        await new Promise((r) => setTimeout(r, 1500));
        setError("An error occurred. Please try again.");
        return;
      }
      setError(firstError.message);
      return;
    }

    setIsLoading(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 800));

    // Demo auth check
    if (
      email === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      createSession(email, DEMO_CREDENTIALS.name);
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      {/* Background effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(124,106,247,0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,106,247,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <KodaLogo size="lg" />
        </div>

        {/* Card */}
        <div
          className="glass rounded-2xl p-8"
          style={{
            boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <div className="mb-7">
            <h1
              className="font-display font-bold text-2xl text-koda-text mb-1.5"
              style={{ letterSpacing: "-0.03em" }}
            >
              Welcome back
            </h1>
            <p className="text-koda-text-muted text-sm">
              Sign in to access your time dashboard
            </p>
          </div>

          {/* Demo hint */}
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3 mb-6 text-xs"
            style={{
              background: "rgba(124,106,247,0.08)",
              border: "1px solid rgba(124,106,247,0.2)",
            }}
          >
            <Shield size={13} className="text-koda-accent mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-koda-accent-light mb-0.5">
                Demo Credentials
              </div>
              <div className="text-koda-text-muted font-mono">
                {DEMO_CREDENTIALS.email}
              </div>
              <div className="text-koda-text-muted font-mono">
                Password: koda2025
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Honeypot field — hidden from real users */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                top: "-9999px",
                opacity: 0,
                pointerEvents: "none",
                tabIndex: -1,
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

            {/* Email */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-koda-accent text-koda-muted">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-koda-surface border border-koda-border rounded-xl pl-11 pr-4 py-3.5 text-koda-text text-sm focus:outline-none focus:border-koda-accent placeholder:text-koda-muted transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-koda-accent text-koda-muted">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-koda-surface border border-koda-border rounded-xl pl-11 pr-12 py-3.5 text-koda-text text-sm focus:outline-none focus:border-koda-accent placeholder:text-koda-muted transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-koda-muted hover:text-koda-text-muted transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm animate-fade-in"
                style={{
                  background: "rgba(247,79,106,0.08)",
                  border: "1px solid rgba(247,79,106,0.2)",
                  color: "#f74f6a",
                }}
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 mt-2"
              style={{
                background: "linear-gradient(135deg, #7c6af7, #6b5ce7)",
                boxShadow: isLoading ? "none" : "0 4px 20px rgba(124,106,247,0.4)",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in to Koda"
              )}
            </button>
          </form>
        </div>

        {/* Bot protection notice */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-koda-muted">
          <Shield size={11} />
          <span>Protected against automated access</span>
        </div>
      </div>
    </div>
  );
}
