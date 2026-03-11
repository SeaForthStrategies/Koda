"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleBilling() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <header className="glass-subtle sticky top-0 z-10 border-b border-border/60">
      <div className="mx-auto flex h-14 min-h-[44px] max-w-2xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex min-h-[44px] items-center text-sm font-semibold text-foreground"
        >
          Koda
        </Link>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBilling}
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground sm:min-w-0"
          >
            Billing
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground sm:min-w-0"
          >
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
