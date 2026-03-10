import Link from "next/link";
import {
  Clock,
  Building2,
  UserCircle,
  Check,
  BarChart3,
  Shield,
  FileCheck,
  Users,
  Zap,
} from "lucide-react";
import { KodaLogo } from "@/components/KodaLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-koda-bg">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(29,78,216,0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 85% 60%, rgba(29,78,216,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Nav */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 rounded-lg -m-2 p-2 hover:bg-slate-100/80 transition-colors" aria-label="Koda home">
            <KodaLogo size="sm" />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/login?role=employee"
              className="px-3 py-2 rounded-lg text-sm font-medium text-koda-text-muted hover:text-koda-text hover:bg-slate-100/80 transition-colors"
            >
              Employee login
            </Link>
            <Link
              href="/login?role=employer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-koda-text-muted hover:text-koda-text hover:bg-slate-100/80 transition-colors"
            >
              Employer login
            </Link>
            <Link
              href="/signup"
              className="ml-1 sm:ml-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-koda-accent hover:bg-koda-accent/90 shadow-sm shadow-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-koda-accent"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-24 text-center">
          <h1
            className="hero-title font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-6 max-w-3xl mx-auto leading-[1.12] tracking-tight animate-hero-title"
            style={{ letterSpacing: "-0.03em" }}
          >
            Time tracking that works for your business
          </h1>
          <p className="text-lg sm:text-xl text-koda-text-muted max-w-2xl mx-auto mb-12 animate-hero-subtitle">
            Simple time tracking for teams. Log hours, get approvals, and stay
            compliant—without the busywork.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 animate-hero-cta">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-koda-accent hover:bg-koda-accent/90 shadow-md shadow-blue-900/25 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-koda-accent"
            >
              <Zap size={18} />
              Get started
            </Link>
            <Link
              href="/login?role=employer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-koda-text border border-slate-300 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
            >
              <Building2 size={18} />
              Employer login
            </Link>
            <Link
              href="/login?role=employee"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-koda-text border border-slate-300 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
            >
              <UserCircle size={18} />
              Employee login
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h2
            className="font-display font-bold text-2xl sm:text-3xl text-koda-text text-center mb-3 tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Built for business
          </h2>
          <p className="text-koda-text-muted text-center max-w-xl mx-auto mb-16">
            Everything you need to track time, stay compliant, and run payroll
            with confidence.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Weekly time cards",
                desc: "Toggle days, clock in/out, add notes. Real-time daily and weekly totals.",
              },
              {
                icon: BarChart3,
                title: "Reporting & analytics",
                desc: "Visual summaries and exports for payroll and project tracking.",
              },
              {
                icon: Shield,
                title: "Compliance & certification",
                desc: "Accuracy certification and audit-ready records on every submission.",
              },
              {
                icon: FileCheck,
                title: "Approvals & audit trail",
                desc: "Submit to managers or payroll. Clear chain of approval.",
              },
              {
                icon: Users,
                title: "Team & employer views",
                desc: "Role-based access: employees log time, employers oversee and report.",
              },
              {
                icon: Zap,
                title: "Simple deployment",
                desc: "No heavy setup. Secure sessions, bot protection, and optional SSO.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="glass rounded-2xl p-6 border border-slate-200/70 bg-white/90 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-blue-50 border border-blue-100">
                  <Icon size={20} className="text-koda-accent" />
                </div>
                <h3 className="font-display font-semibold text-koda-text mb-2">
                  {title}
                </h3>
                <p className="text-sm text-koda-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2
            className="font-display font-bold text-2xl sm:text-3xl text-koda-text text-center mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            Pricing
          </h2>
          <p className="text-koda-text-muted text-center max-w-xl mx-auto mb-14">
            Simple, per-seat pricing. No hidden fees. Volume discounts for
            larger teams.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$24",
                period: "per seat / month",
                desc: "For small teams getting started",
                features: [
                  "Up to 10 seats",
                  "Weekly time cards",
                  "Email submissions",
                  "Basic reporting",
                ],
                cta: "Start free trial",
                href: "/signup?plan=starter",
                highlighted: false,
              },
              {
                name: "Team",
                price: "$49",
                period: "per seat / month",
                desc: "For growing teams",
                features: [
                  "Up to 50 seats",
                  "Approvals & audit trail",
                  "Export & integrations",
                  "Priority support",
                ],
                cta: "Start free trial",
                href: "/signup?plan=team",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "volume pricing",
                desc: "For large organizations",
                features: [
                  "Unlimited seats",
                  "SSO & SCIM",
                  "Dedicated success manager",
                  "SLA & compliance",
                ],
                cta: "Contact sales",
                href: "/signup?plan=enterprise",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border transition-all duration-200 ${
                  plan.highlighted
                    ? "glass border-koda-accent/40 ring-2 ring-koda-accent/20 shadow-lg"
                    : "glass border-slate-200/60 hover:border-slate-300/80 hover:shadow-md"
                }`}
              >
                <h3 className="font-display font-semibold text-koda-text text-lg mb-1">
                  {plan.name}
                </h3>
                <p className="text-koda-text-muted text-sm mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="font-display font-bold text-3xl text-koda-text">
                    {plan.price}
                  </span>
                  <span className="text-sm text-koda-text-muted">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-koda-text-muted"
                    >
                      <Check size={16} className="text-koda-green flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all ${
                    plan.highlighted
                      ? "text-white bg-koda-accent hover:bg-koda-accent/90 shadow-md shadow-blue-900/20"
                      : "text-koda-text border border-koda-border bg-koda-surface hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <div className="glass rounded-3xl p-8 sm:p-10 text-center border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/40">
            <h2
              className="font-display font-bold text-2xl sm:text-3xl text-koda-text mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              Ready to simplify time tracking?
            </h2>
            <p className="text-koda-text-muted mb-8 max-w-md mx-auto">
              Sign up for a free trial. No credit card required. Or log in if
              you already have an account.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-koda-accent hover:bg-koda-accent/90 shadow-md shadow-blue-900/25 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-koda-accent"
              >
                Sign up free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-koda-text border border-slate-300 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/80 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="rounded-lg -m-2 p-2 hover:bg-slate-100/80 transition-colors" aria-label="Koda home">
            <KodaLogo size="sm" />
          </Link>
          <div className="flex items-center gap-6 text-sm text-koda-text-muted">
            <Link href="/login?role=employee" className="hover:text-koda-text transition-colors">
              Employee login
            </Link>
            <Link href="/login?role=employer" className="hover:text-koda-text transition-colors">
              Employer login
            </Link>
            <Link href="/signup" className="hover:text-koda-text transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
