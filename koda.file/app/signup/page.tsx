"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, Mail, User, CheckCircle } from "lucide-react";
import { KodaLogo } from "@/components/KodaLogo";

const PLANS = [
  { id: "starter", name: "Starter", price: "$24/seat" },
  { id: "team", name: "Team", price: "$49/seat" },
  { id: "enterprise", name: "Enterprise", price: "Custom" },
] as const;

export default function SignupPage() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "team";
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState(PLANS.find((p) => p.id === planParam)?.id ?? "team");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: in production, POST to API or CRM
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-koda-bg">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center border border-slate-200/80 bg-white/95 shadow-xl">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-50 border border-emerald-200"
          >
            <CheckCircle size={24} className="text-koda-green" />
          </div>
          <h1 className="font-display font-bold text-xl text-koda-text mb-2">
            Request received
          </h1>
          <p className="text-koda-text-muted text-sm mb-6">
            We’ll be in touch shortly. You can also log in if you already have
            an account.
          </p>
          <Link
            href="/login"
            className="inline-block px-5 py-2.5 rounded-xl font-medium text-sm text-koda-accent-light hover:underline"
          >
            Go to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-koda-bg">
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(29,78,216,0.08) 0%, transparent 50%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex mb-8 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          aria-label="Back to Koda home"
        >
          <KodaLogo size="md" />
        </Link>
        <div className="rounded-2xl p-8 border border-slate-200/80 bg-white shadow-xl">
          <h1
            className="font-display font-bold text-2xl text-koda-text mb-1.5"
            style={{ letterSpacing: "-0.03em" }}
          >
            Sign up for Koda
          </h1>
          <p className="text-koda-text-muted text-sm mb-6">
            B2B time tracking. Start a free trial — we’ll contact you to get
            set up.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-koda-muted">
                <Building2 size={16} />
              </div>
              <input
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full bg-koda-surface border border-koda-border rounded-xl pl-11 pr-4 py-3.5 text-koda-text text-sm focus:outline-none focus:border-koda-accent placeholder:text-koda-muted transition-colors"
              />
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-koda-muted">
                <User size={16} />
              </div>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-koda-surface border border-koda-border rounded-xl pl-11 pr-4 py-3.5 text-koda-text text-sm focus:outline-none focus:border-koda-accent placeholder:text-koda-muted transition-colors"
              />
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-koda-muted">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-koda-surface border border-koda-border rounded-xl pl-11 pr-4 py-3.5 text-koda-text text-sm focus:outline-none focus:border-koda-accent placeholder:text-koda-muted transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-koda-text-muted mb-2">
                Plan
              </label>
              <div className="flex gap-2" role="group" aria-label="Plan">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlan(p.id)}
                    aria-pressed={plan === p.id}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2 ${
                      plan === p.id
                        ? "bg-koda-accent/20 text-koda-accent-light border border-koda-accent/40"
                        : "bg-koda-surface border border-koda-border text-koda-text-muted hover:border-slate-300"
                    }`}
                  >
                    <span className="block">{p.name}</span>
                    <span className="block text-xs opacity-80">{p.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-koda-accent hover:bg-koda-accent/90 shadow-md shadow-blue-900/20 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
            >
              Request access
            </button>
          </form>

          <p className="text-center text-koda-text-muted text-xs mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-koda-accent-light hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
