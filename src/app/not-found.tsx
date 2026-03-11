import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page not found – Koda",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="glass-subtle border-b border-border/60">
        <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center px-4 sm:h-16 sm:px-6">
          <Link href="/" className="text-base font-semibold text-foreground sm:text-lg">
            Koda
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="glass w-full max-w-md rounded-2xl border border-border/60 p-8 text-center shadow-md animate-scale-in">
          <p className="text-5xl font-bold tracking-tight text-muted-foreground/60 sm:text-6xl">404</p>
          <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or was moved.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
