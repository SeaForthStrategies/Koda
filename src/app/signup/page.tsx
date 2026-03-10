import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SignupForm } from "@/components/forms/SignupForm";

export const metadata = {
  title: "Sign up – Koda",
  description: "Choose what type of Koda account to create",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "employer" ? "/admin" : "/dashboard");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="border-b border-border/80 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="text-base font-semibold text-foreground sm:text-lg">
            Koda
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-[380px] space-y-8 sm:max-w-md">
          <div className="text-center space-y-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">What type of account do you need?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose whether you&apos;re an employee or an employer.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/employee/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Sign up as employee
              </Link>
              <Link
                href="/employer/signup"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-accent"
              >
                Sign up as employer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
