import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = {
  title: "Employee sign in – Koda",
  description: "Sign in to your Koda employee account",
};

export default async function EmployeeLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "employer" ? "/admin" : "/dashboard");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="glass-subtle border-b border-border/60">
        <div className="mx-auto flex h-14 min-h-[44px] max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="text-base font-semibold text-foreground sm:text-lg">
            Koda
          </Link>
          <Link
            href="/employee/signup"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Employee sign up
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-[380px] space-y-8 sm:max-w-md animate-fade-in-up">
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight">Sign in as an employee</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your timecard and hours dashboard.
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Need an employer account?{" "}
            <Link
              href="/employer/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in as employer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

