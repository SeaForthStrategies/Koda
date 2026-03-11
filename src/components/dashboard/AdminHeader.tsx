"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="glass-subtle sticky top-0 z-10 border-b border-border/60">
      <div className="mx-auto flex h-14 min-h-[44px] max-w-5xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/admin" className="flex min-h-[44px] items-center font-medium text-foreground">
          Koda Admin
        </Link>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-sm text-muted-foreground hover:text-foreground sm:min-w-0 sm:px-2"
          >
            Home
          </Link>
          <Button variant="ghost" size="sm" className="min-h-[44px] min-w-[44px] sm:min-w-0" onClick={handleLogout}>
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
