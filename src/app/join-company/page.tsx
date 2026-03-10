import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { JoinCompanyForm } from "@/components/forms/JoinCompanyForm";

export const metadata = {
  title: "Join company – Koda",
  description: "Enter your team code to join your company",
};

export default async function JoinCompanyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/employee/login");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="border-b border-border/80 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="text-base font-semibold text-foreground sm:text-lg">
            Koda
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-[380px] space-y-8 sm:max-w-md">
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight">Join your company</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the team code your employer gave you to get started.
            </p>
          </div>
          <JoinCompanyForm />
        </div>
      </div>
    </div>
  );
}
