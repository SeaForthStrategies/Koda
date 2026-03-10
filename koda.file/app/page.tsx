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
    <div className="min-h-screen bg-koda-bg relative overflow-hidden">
      {/* Background — gradient mesh + noise */}
      <div
        className="fixed inset-0 pointer-events-none bg-noise"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(15,118,110,0.14) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 90% 40%, rgba(254,252,232,0.5) 0%, transparent 45%), radial-gradient(ellipse 60% 40% at 10% 80%, rgba(15,118,110,0.06) 0%, transparent 45%)",
        }}
      />

      {/* Nav */}
      <header className="relative z-10 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 rounded-xl -m-2 p-2 hover:bg-slate-100/80 transition-colors" aria-label="Koda home">
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
              className="ml-1 sm:ml-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-koda-accent hover:bg-koda-accent/90 btn-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-koda-accent"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-28 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-koda-accent mb-4 animate-hero-title">
            Time tracking for teams
          </p>
          <h1
            className="hero-title font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 max-w-4xl mx-auto leading-[1.08] tracking-tight animate-hero-title"
            style={{ letterSpacing: "-0.04em" }}
          >
            Works for your business
          </h1>
          <p className="text-lg sm:text-xl text-koda-text-muted max-w-2xl mx-auto mb-14 animate-hero-subtitle">
            Log hours, get approvals, stay compliant—without the busywork.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-hero-cta">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-white bg-koda-accent hover:bg-koda-accent/90 btn-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-koda-accent"
            >
              <Zap size={20} />
              Get started
            </Link>
            <Link
              href="/login?role=employer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-koda-text border-2 border-slate-200 bg-white hover:border-koda-accent/30 hover:bg-teal-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
            >
              <Building2 size={18} />
              Employer login
            </Link>
            <Link
              href="/login?role=employee"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-koda-text border-2 border-slate-200 bg-white hover:border-koda-accent/30 hover:bg-teal-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
            >
              <UserCircle size={18} />
              Employee login
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <h2
            className="font-display font-extrabold text-2xl sm:text-3xl text-koda-text text-center mb-3 tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Built for business
          </h2>
          <p className="text-koda-text-muted text-center max-w-xl mx-auto mb-20">
            Everything you need to track time, stay compliant, and run payroll
            with confidence.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Weekly time cards", desc: "Toggle days, clock in/out, add notes. Real-time daily and weekly totals." },
              { icon: BarChart3, title: "Reporting & analytics", desc: "Visual summaries and exports for payroll and project tracking." },
              { icon: Shield, title: "Compliance & certification", desc: "Accuracy certification and audit-ready records on every submission." },
              { icon: FileCheck, title: "Approvals & audit trail", desc: "Submit to managers or payroll. Clear chain of approval." },
              { icon: Users, title: "Team & employer views", desc: "Role-based access: employees log time, employers oversee and report." },
              { icon: Zap, title: "Simple deployment", desc: "No heavy setup. Secure sessions, bot protection, and optional SSO." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group glass rounded-2xl p-6 border border-slate-200/70 bg-white/95 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-teal-50 border border-teal-100 group-hover:bg-teal-100/80 group-hover:border-teal-200 transition-colors">
                  <Icon size={22} className="text-koda-accent" />
                </div>
                <h3 className="font-display font-bold text-koda-text mb-2">
                  {title}
                </h3>
                <p className="text-sm text-koda-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h2
            className="font-display font-extrabold text-2xl sm:text-3xl text-koda-text text-center mb-3 tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Pricing
          </h2>
          <p className="text-koda-text-muted text-center max-w-xl mx-auto mb-16">
            Simple, per-seat pricing. No hidden fees. Volume discounts for larger teams.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Starter", price: "$24", period: "per seat / month", desc: "For small teams getting started", features: ["Up to 10 seats", "Weekly time cards", "Email submissions", "Basic reporting"], cta: "Start free trial", href: "/signup?plan=starter", highlighted: false },
              { name: "Team", price: "$49", period: "per seat / month", desc: "For growing teams", features: ["Up to 50 seats", "Approvals & audit trail", "Export & integrations", "Priority support"], cta: "Start free trial", href: "/signup?plan=team", highlighted: true },
              { name: "Enterprise", price: "Custom", period: "volume pricing", desc: "For large organizations", features: ["Unlimited seats", "SSO & SCIM", "Dedicated success manager", "SLA & compliance"], cta: "Contact sales", href: "/signup?plan=enterprise", highlighted: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  plan.highlighted
                    ? "glass border-teal-300 ring-2 ring-teal-200/60 shadow-xl shadow-teal-500/10 scale-[1.02] hover:scale-[1.03] hover:shadow-2xl hover:shadow-teal-500/15"
                    : "glass border-slate-200/70 hover:border-teal-200 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <h3 className="font-display font-bold text-koda-text text-lg mb-1">
                  {plan.name}
                </h3>
                <p className="text-koda-text-muted text-sm mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="font-display font-extrabold text-3xl text-koda-text">
                    {plan.price}
                  </span>
                  <span className="text-sm text-koda-text-muted">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-koda-text-muted">
                      <Check size={16} className="text-koda-green flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full py-3.5 rounded-xl font-semibold text-sm text-center transition-all ${
                    plan.highlighted
                      ? "text-white bg-koda-accent hover:bg-koda-accent/90 btn-glow"
                      : "text-koda-text border-2 border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-28">
          <div className="relative glass rounded-3xl p-10 sm:p-12 text-center border-2 border-teal-100/80 bg-gradient-to-br from-white via-teal-50/30 to-white shadow-2xl shadow-teal-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" aria-hidden />
            <h2
              className="font-display font-extrabold text-2xl sm:text-3xl text-koda-text mb-3 relative"
              style={{ letterSpacing: "-0.03em" }}
            >
              Ready to simplify time tracking?
            </h2>
            <p className="text-koda-text-muted mb-10 max-w-md mx-auto relative">
              Sign up for a free trial. No credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 relative">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-white bg-koda-accent hover:bg-koda-accent/90 btn-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-koda-accent"
              >
                Sign up free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-koda-text border-2 border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-koda-accent focus:ring-offset-2"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/60 py-8 bg-white/50">
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
