"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn’t complete your request. Please try again.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={reset} size="lg">
              Try again
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
