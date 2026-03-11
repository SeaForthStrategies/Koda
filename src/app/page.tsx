import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Koda – Weekly Time Tracking",
  description: "Simple weekly time cards, email delivery, and optional billing.",
};

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "employer" ? "/admin" : "/dashboard");

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="glass-subtle sticky top-0 z-20 border-b border-border/60">
        <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="text-base font-semibold text-foreground sm:text-lg">
            Koda
          </Link>
          <nav className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground sm:min-h-0 sm:min-w-0 sm:py-2"
            >
              Sign in
            </Link>
            <Button asChild size="sm" className="min-h-[44px] min-w-[44px] shrink-0 sm:min-h-9 sm:min-w-0">
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 md:py-28">
        <section className="text-center animate-fade-in-up">
          <p className="text-sm font-medium text-primary sm:text-base">Weekly time tracking</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-tight">
            Simple time cards.
            <br className="hidden sm:block" />
            <span className="text-muted-foreground"> No clutter.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
            Submit by week, get them by email. Hours and details—that’s it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <Button asChild size="lg" className="min-h-[44px] w-full sm:w-auto">
              <Link href="/signup">Start free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[44px] w-full sm:w-auto">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="mt-20 grid gap-5 sm:mt-28 sm:grid-cols-3 sm:gap-6">
          <div className="glass group rounded-2xl border border-border/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] sm:p-6 animate-fade-in-up animate-delay-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold">Weekly time cards</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Check days, enter hours and details. One form per week.
            </p>
          </div>
          <div className="glass group rounded-2xl border border-border/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] sm:p-6 animate-fade-in-up animate-delay-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold">Email delivery</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Time cards sent to your inbox and optional recipients.
            </p>
          </div>
          <div className="glass group rounded-2xl border border-border/60 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] sm:p-6 animate-fade-in-up animate-delay-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold">Secure & private</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your data is yours. Real auth, optional billing.
            </p>
          </div>
        </section>

        <section className="glass mt-20 rounded-2xl border border-border/60 px-6 py-10 text-center sm:mt-28 sm:px-10 sm:py-12 animate-fade-in-up animate-delay-4">
          <h2 className="text-xl font-semibold sm:text-2xl">Pricing</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Free to start. Upgrade when you need more.
          </p>
          <div className="mt-6 sm:mt-8">
            <Button asChild size="lg" className="min-h-[44px]">
              <Link href="/pricing">View plans</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="glass-subtle border-t border-border/60 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Koda. Time tracking made simple.
        </div>
      </footer>
    </div>
  );
}
