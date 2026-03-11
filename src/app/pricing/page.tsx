import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pricing – Koda",
  description: "Plans and pricing for Koda",
};

export default function PricingPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="glass-subtle border-b border-border/60">
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

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Start free. Upgrade for team features and priority support.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8">
          <div className="glass rounded-2xl border border-border/60 p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:p-8 animate-fade-in-up">
            <h2 className="text-lg font-semibold">Free</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight">$0</p>
            <p className="mt-1 text-sm text-muted-foreground">per month</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Unlimited time cards
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Email delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Security verification
              </li>
            </ul>
            <Button asChild className="mt-8 h-11 w-full" variant="outline" size="lg">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>

          <div className="glass rounded-2xl border-2 border-primary p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:p-8 animate-fade-in-up animate-delay-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Pro</p>
            <h2 className="mt-1 text-lg font-semibold">Pro</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight">$9</p>
            <p className="mt-1 text-sm text-muted-foreground">per month</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Everything in Free
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Team members (coming soon)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Priority support
              </li>
            </ul>
            <form action="/api/stripe/checkout" method="POST" className="mt-8">
              <input type="hidden" name="priceId" value="pro" />
              <Button type="submit" className="h-11 w-full" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground sm:mt-12">
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
